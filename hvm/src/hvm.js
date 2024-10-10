import { Display } from "./display";
import { KernelModule } from "./kernel";

/**
 * @typedef {{kernel_url: string | undefined}} VMProps
 */

/**
 * The Honey Virtual Machine
 * @class
 * @property {Display} display The vm display
 * @property {KernelModule | undefined} kernel The loaded kernel module
 */
export class VM {
    static display = new Display();
    static kernel = undefined;

    /**
     * Initialize the vm
     * @param {VMProps} props 
     */
    static async init(props) {
        this.display.init();
        this.kernel = await KernelModule.load(props.kernel_url);
    }
}