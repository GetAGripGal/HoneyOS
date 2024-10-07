import { Display } from "./display";
import { Terminal } from "./terminal";

/**
 * The Honey Virtual Machine
 * @class
 * @property {Terminal} terminal
 */
export class HVM {
    static display = new Display();
    static terminal = new Terminal();
}