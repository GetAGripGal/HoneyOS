/**
 * @typedef {{width: number, height: number, buffer: string[]}} CharBuffer
 * @typedef {{x: number, y: number}} Cursor
 */

/**
 * The terminal for the hvm
 * @class
 * @property {CharBuffer} buffer
 * @property {Cursor} cursor
 */
export class Terminal {
    constructor() {
        this.buffer = {
            width: 0,
            height: 0,
            buffer: []
        };
        this.cursor = {
            x: 0,
            y: 0
        }
    }

    /**
     * Resize the terminal buffer to the browser size
     */
    fitToScreen() { }
}