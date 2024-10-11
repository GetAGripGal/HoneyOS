import { Display } from "./display";
import { Kernel } from "./kernel";

/**
 * @typedef {{kernel_url: string | undefined}} VMProps
 */

/**
 * The Honey Virtual Machine
 * @class
 * @property {Display} display The vm display
 * @property {Kernel | undefined} kernel The loaded kernel module
 * @property {number | undefined} execution_timeout The timeout for the execution loop
 */
export class VM {
    static display = new Display();
    static kernel = undefined;
    static execution_timeout = undefined;

    /**
     * Initialize the vm
     * @param {VMProps} props 
     */
    static async init(props) {
        this.display.init();
        this.kernel = await Kernel.load(props.kernel_url);

        // Start the execution
        this.execution_timeout = setInterval(executionLoop);
    }

    /**
     * Terminate the virtual machine
     */
    static terminate() {
        this.kernel.terminate();
        clearTimeout(this.execution_timeout);
    }
}

/**
 * The execution loop for the vm.
 */
const executionLoop = () => {
    const text_push_addr = 0x00000009;
    const text_addr_begin = 0x0000000A;
    const text_addr_end = 0x00000012;

    const kernel_memory = new Uint8Array(VM.kernel.memory.buffer);
    const push_register = kernel_memory[text_push_addr];

    if (push_register > 0) {
        const text_buffer = new Uint8Array(kernel_memory.slice(text_addr_begin, text_addr_end));
        const decoder = new TextDecoder("utf-8");
        VM.display.textmode_buffer.pushChars(decoder.decode(text_buffer));
        kernel_memory[text_push_addr] = 0;
    }
};