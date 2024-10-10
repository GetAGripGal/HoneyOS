import { VM } from "./hvm";
import kernel_worker_source from "./workers/kernel-worker.js?raw";

/**
 * A wasm hvm kernel module.
 * @class
 * @property {WebAssembly.Memory} memory The kernel memory
 * @property {Worker} worker The worker the kernel is run on
 */
export class KernelModule {
    /**
    * Create a hvm kernel module from a wasm binary 
    * @param {string} url The url to the wasm binary
    * @returns {Promise<KernelModule>} The loaded kernel module
    */
    static async load(url) {
        this.memory = new WebAssembly.Memory({ initial: 10, maximum: 1024, shared: true });

        const binary = await fetch(url)
            .then(response => response.arrayBuffer())
            .catch(reason => {
                VM.display.textmode_buffer.pushChars(`Failed to fetch kernel: ${reason}`);
            });

        this.worker = new Worker(workerSourceToUrl(kernel_worker_source));
        this.worker.onmessage = message => {
            VM.display.textmode_buffer.pushChars(message.data.error);
        };

        this.worker.postMessage([binary, this.memory]);
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