import { ASCII_COLOR_ICON, IBM_VGA_8X8_BASE64 } from "./assets";
import { System } from "./systems";

/**
 * The display mode for the hvm in-browser display
 * @readonly
 * @enum {number}
 * @property {number} Text Renders a buffer of ascii text compatible with unix ascii escape sequences to the display
 * @property {number} FrameBuffer Renders a framebuffer to the screen
 */
export const DisplayMode = {
    Text: 0,
    FrameBuffer: 1,
};

/**
 * The text-mode display buffer
 * @class
 * @property {string[]} buffers The text buffers (double buffered)
 * @property {number} buffer_index The current buffer index
 * @property {boolean} needs_refresh The flag that indicates display needs to be refreshed
 */
export class TextModeBuffer {
    constructor() {
        this.buffers = ["", ""];
        this.buffer_index = 0;
        this.needs_refresh = false;
    }

    /**
     * Add a string of ascii chars to the buffer and convert them to html
     * @param {string} chars
     */
    pushChars(chars) {
        this.buffers[this.buffer_index] += chars;
    }

    /**
     * Swap the buffers
     */
    swap() {
        this.buffer_index = this.buffer_index ^ 1;
        this.needs_refresh = true;
    }

    /**
    * Clear the text buffers
    */
    clear() {
        this.buffers[this.buffer_index] = "";
    }
};

/**
 * The in-browser display for the HVM
 * @class
 * @property {DisplayMode} mode The current display mode
 * @property {HTMLDivElement | undefined} root_element The root div element
 * @property {TextModeBuffer} textmode_buffer The textmode html buffer
 */
export class Display extends System {
    constructor() {
        super();
        this.mode = DisplayMode.Text;
        this.root_element = undefined;
        this.textmode_buffer = new TextModeBuffer();
    }

    /**
     * Initialize the display
     */
    init() {
        setupStyle();
        this.root_element = document.createElement("div");
        this.root_element.id = "hvm-display";
        document.body.appendChild(this.root_element);

        this.setMode(DisplayMode.Text); // The default display mode is text-mode

        requestAnimationFrame(() => updateDisplay(this));
    }

    /**
     * Initialize the display on a custom html element.
     * This does not impact the style of the element
     * @param {HTMLElement} root_element The display element
     */
    initOnElement(root_element) {
        this.root_element = root_element;
        this.setMode(DisplayMode.Text); // The default display mode is text-mode
        requestAnimationFrame(() => updateDisplay(this));
    }

    /**
     * Set the display mode
     * @param {DisplayMode} mode The mode to set it to 
     */
    setMode(mode) {
        switch (mode) {
            case DisplayMode.Text:
                this.root_element.innerHTML = this.textmode_buffer.buffers[this.textmode_buffer.buffer_index];
                break;
            case DisplayMode.FrameBuffer:
                this.root_element.innerHTML = "Framebuffer mode not implemented";
                break;
        }
    }

    processMessage(message) {
        switch (message.operation) {
            case "textmode-clear":
                this.textmode_buffer.clear();
                break;
            case "textmode-push-chars":
                this.textmode_buffer.pushChars(String.fromCharCode(...message.data));
                break;
            case "textmode-swap":
                this.textmode_buffer.swap();
                break;
        }
    }
}

let last_update = performance.now();

/**
 * The callback for `requestAnimationFrame` that updates the display
 * @param {Display} display The display to update
 */
const updateDisplay = (display) => {
    let now = performance.now();
    let delta = now - last_update;

    let fps = 1000 / delta;
    console.log("FPS: " + fps.toFixed(2));

    // Update the last_update timestamp for the next frame
    last_update = now;
    switch (display.mode) {
        case DisplayMode.Text:
            if (display.textmode_buffer.needs_refresh) {
                // Check if the user is currently scrolled to the bottom
                const is_scrolled_to_bottom = display.root_element.scrollHeight - display.root_element.clientHeight <= display.root_element.scrollTop + 1;

                display.root_element.innerHTML = asciiToHtml(display.textmode_buffer.buffers[display.textmode_buffer.buffer_index ^ 1]);
                display.textmode_buffer.needs_refresh = false;

                // Automatically scroll to the bottom if the user has scrolled all the way down
                if (is_scrolled_to_bottom) {
                    display.root_element.scrollTop = display.root_element.scrollHeight;
                }
            }
            break;
        case DisplayMode.FrameBuffer:
            break;
    }

    requestAnimationFrame(() => updateDisplay(display));
};

/**
 * Setup the style for the display
 */
const setupStyle = () => {
    const styleElement = document.createElement("style");

    styleElement.textContent = `
        @font-face {
            font-family: ibm-vga-8x8;
            src: url(data:font/ttf;base64,${IBM_VGA_8X8_BASE64}) format('truetype');
        }   

        #hvm-display {
            display: block;
            font-family: 'ibm-vga-8x8', sans-serif;
    
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: break-all;

            padding: 0;
            margin: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            color: #fff;
            font-size: 16px;

            overflow-y: auto;
        }
    `;

    document.head.appendChild(styleElement);
}

/**
 * Interpret the ascii escape sequences for font display
 * @param {string} str 
 * @returns The resulting html
 */
const asciiToHtml = (str) => {
    // Sanitize the input
    const sanitized = html_escape(str);

    const ansiToHtmlMap = {
        // Reset
        "\x1b[0m": '</span>',
        // Bold
        "\x1b[1m": '<span style="font-weight:bold">',
        // Underline
        "\x1b[4m": '<span style="text-decoration:underline">',
        // Normal colors (foreground)
        "\x1b[30m": '<span style="color:rgb(0,0,0)">',
        "\x1b[31m": '<span style="color:rgb(170,0,0)">',
        "\x1b[32m": '<span style="color:rgb(0,170,0)">',
        "\x1b[33m": '<span style="color:rgb(170,85,0)">',
        "\x1b[34m": '<span style="color:rgb(0,0,170)">',
        "\x1b[35m": '<span style="color:rgb(170,0,170)">',
        "\x1b[36m": '<span style="color:rgb(0,170,170)">',
        "\x1b[37m": '<span style="color:rgb(170,170,170)">',
        // Bright colors (foreground)
        "\x1b[90m": '<span style="color:rgb(85,85,85)">',
        "\x1b[91m": '<span style="color:rgb(255,85,85)">',
        "\x1b[92m": '<span style="color:rgb(85,255,85)">',
        "\x1b[93m": '<span style="color:rgb(255,255,85)">',
        "\x1b[94m": '<span style="color:rgb(85,85,255)">',
        "\x1b[95m": '<span style="color:rgb(255,85,255)">',
        "\x1b[96m": '<span style="color:rgb(85,255,255)">',
        "\x1b[97m": '<span style="color:rgb(255,255,255)">',
        // Normal colors (background)
        "\x1b[40m": '<span style="background-color:rgb(0,0,0)">',
        "\x1b[41m": '<span style="background-color:rgb(170,0,0)">',
        "\x1b[42m": '<span style="background-color:rgb(0,170,0)">',
        "\x1b[43m": '<span style="background-color:rgb(170,85,0)">',
        "\x1b[44m": '<span style="background-color:rgb(0,0,170)">',
        "\x1b[45m": '<span style="background-color:rgb(170,0,170)">',
        "\x1b[46m": '<span style="background-color:rgb(0,170,170)">',
        "\x1b[47m": '<span style="background-color:rgb(170,170,170)">',
        // Bright colors (background)
        "\x1b[100m": '<span style="background-color:rgb(85,85,85)">',
        "\x1b[101m": '<span style="background-color:rgb(255,85,85)">',
        "\x1b[102m": '<span style="background-color:rgb(85,255,85)">',
        "\x1b[103m": '<span style="background-color:rgb(255,255,85)">',
        "\x1b[104m": '<span style="background-color:rgb(85,85,255)">',
        "\x1b[105m": '<span style="background-color:rgb(255,85,255)">',
        "\x1b[106m": '<span style="background-color:rgb(85,255,255)">',
        "\x1b[107m": '<span style="background-color:rgb(255,255,255)">',
    };

    return sanitized.replace(/\x1b\[[0-9;]*m/g, match => ansiToHtmlMap[match] || '');
}

/**
 * Sanitize a string to avoid xxs attacks
 * @param {string} input The string to sanitize html out of 
 */
const html_escape = (input) => {
    return input
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
        .replace("'", "&#39;")
}