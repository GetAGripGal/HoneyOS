import { VM } from "./hvm";
import kernel_worker_source from "./workers/kernel-worker.js?raw";
import com_worker_source from "./workers/com-worker.js?raw";

/**
 * Keeps track of the memory addresses reserved for registers for communication between the hvm and the kernel
 * @typedef {Object} Registers
 * @property {number} textmode_transfer_buffer_address The address for the textmode character transfer buffer
 * @property {number} textmode_transfer_buffer_size The size of the textmode character transfer buffer
 * @property {number} textmode_transfer_push_register_address The address of the push register for the textmode transfer buffer
 * @property {number} textmode_transfer_swap_register_address The address of the swap register for the textmode transfer buffer
 * @property {number} textmode_transfer_clear_register_address The address of the clear register for the textmode transfer buffer
*/

/**
 * A wasm hvm kernel.
 * @class
 * @property {WebAssembly.Memory | undefined} memory The kernel memory
 * @property {Worker | undefined} kernel_worker The worker the kernel is run on
 * @property {Worker | undefined} com_worker The worker that handles communication between the worker and the kernel
 * @property {Registers | undefined} registers The register configuration for the kernel
 */
export class Kernel {
    constructor() {
        this.memory = undefined;
        this.kernel_worker = undefined;
        this.com_worker = undefined;
        this.registers = undefined;
    }

    /**
    * Create a hvm kernel module from a wasm binary 
    * @param {string} url The url to the wasm binary
    */
    static async load(url) {
        this.memory = new WebAssembly.Memory({ initial: 2, maximum: 2, shared: true });

        const binary = await fetch(url)
            .then(response => response.arrayBuffer())
            .catch(reason => {
                VM.display.textmode_buffer.pushChars(`Failed to fetch kernel: ${reason}\n`);
            });

        this.kernel_worker = await setupKernelWorker(binary, this.memory);
    }

    /**
     * Terminate the kernel
     */
    terminate() {
        this.kernel_worker.terminate();
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

/**
 * Setup the kernel worker
 * @property {ArrayBuffer} binary The kernel binary
 * @property {WebAssembly.Memory} memory The kernel memory
 * @returns {Promise<Worker>} The kernel worker
 */
const setupKernelWorker = async (binary, memory) => {
    const worker = new Worker(workerSourceToUrl(kernel_worker_source));
    worker.onmessage = async message => {
        if (message.data.type === "error") {
            VM.display.textmode_buffer.pushChars(message.data.error + "\n");
            return;
        }

        // Finish initializing
        if (message.data.type === "init") {
            VM.kernel.registers = message.data.registers;
            // Setup the communications worker
            VM.kernel.com_worker = await setupComWorker(message.data.memory, message.data.registers);
            return;
        }
    };

    worker.postMessage([binary, memory]);
    return worker;
}

/**
 * Setup the communication worker
 * @property {WebAssembly.Memory} memory The kernel memory
 * @property {Registers} registers The register configuration
 * @returns {Promise<Worker>} The communications worker
 */
const setupComWorker = async (memory, registers) => {
    const worker = new Worker(workerSourceToUrl(com_worker_source));
    worker.onmessage = message => {
        VM.system_manager.interpretMessage(message.data);
    };
    worker.onerror = error => {
        console.error(error);
    }
    worker.postMessage([memory, registers]);
    return worker;
};