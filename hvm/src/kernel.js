import { VM } from "./hvm";

/**
 * A wasm hvm kernel module.
 * @class
 * @property {WebAssembly.Instance} instance The wasm instance 
 * @property {WebAssembly.Memory} memory The kernel memory
 */
export class KernelModule {
    /**
    * Create a hvm kernel module from a wasm binary 
    * @param {string} url The url to the wasm binary
    * @returns {Promise<KernelModule>} The loaded kernel module
    */
    static async load(url) {
        this.memory = new WebAssembly.Memory({ initial: 10, maximum: 1024, shared: true });
        this.instance = await WebAssembly.instantiateStreaming(await fetch(url), {
            js: this.memory
        }).catch(reason => {
            VM.display.textmode_buffer.pushChars("Failed to load kernel: " + reason);
        })
    }
}

