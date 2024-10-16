import { Display } from "./display";
import { Kernel } from "./kernel";
import { SystemManager } from "./systems";

/**
 * @typedef {Object} VMProps
 * @property {string} kernel_url The url where the kernel is located
 * @property {number} execution_timeout The amount of milliseconds between each execution loop (0 means no timeout)
 */

/**
 * The Honey Virtual Machine
 * @class
 * @property {Display} display The vm display
 * @property {Kernel} kernel The loaded kernel module
 * @property {SystemManager} system_manager The systems manager 
 */
export class VM {
    static display = new Display();
    static kernel = new Kernel();
    static system_manager = new SystemManager();

    /**
     * Initialize the vm
     * @param {VMProps} props 
     */
    static async init(props) {
        this.display.init();
        await Kernel.load(props.kernel_url);

        this.system_manager.registerSystem(this.display, "display")
    }

    /**
     * Terminate the virtual machine
     */
    static terminate() {
        this.kernel.terminate();
    }
}