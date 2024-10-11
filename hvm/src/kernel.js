import { VM } from "./hvm";
import kernel_worker_source from "./workers/kernel-worker.js?raw";

/**
 * A wasm hvm kernel.
 * @class
 * @property {WebAssembly.Memory | undefined} memory The kernel memory
 * @property {Worker | undefined} worker The worker the kernel is run on
 */
export class Kernel {
    constructor() {
        this.memory = undefined;
        this.worker = undefined;
    }

    /**
    * Create a hvm kernel module from a wasm binary 
    * @param {string} url The url to the wasm binary
    * @returns {Promise<Kernel>} The loaded kernel
    */
    static async load(url) {
        const result = new Kernel();

        result.memory = new WebAssembly.Memory({ initial: 2, maximum: 2, shared: true });

        const binary = await fetch(url)
            .then(response => response.arrayBuffer())
            .catch(reason => {
                VM.display.textmode_buffer.pushChars(`Failed to fetch kernel: ${reason}\n`);
            });

        result.worker = new Worker(workerSourceToUrl(kernel_worker_source));
        result.worker.onmessage = message => {
            VM.display.textmode_buffer.pushChars(message.data.error + "\n");
        };

        result.worker.postMessage([binary, result.memory]);

        return result;
    }

    /**
     * Terminate the kernel
     */
    terminate() {
        this.worker.terminate();
    }
}

/**
 * Convert the worker source to a url.
 * This allows us to embed the worker scripts into the bundle
 * @param {string} source The web worker script source
 */
const workerSourceToUrl = (source) => {
    const blob = new Blob([source]);
    const url = URL.createObjectURL(blob);
    return url;
}