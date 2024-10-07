import { ASCII_COLOR_ICON, IBM_VGA_8X8_BASE64 } from "./assets";

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
 * @property {string} inner The inner html string that will be rendered in text-mode+
 * @property {boolean} needs_refresh The flag that keeps track if the display needs a refresh
 */
export class TextModeBuffer {
    constructor() {
        this.inner = "";
        this.needs_refresh = false;
    }

    /**
     * Clear the text buffer
     */
    clear() {
        this.inner = "";
    }

    /**
     * Add a string of ascii chars to the buffer and convert them to html
     * @param {string} chars
     */
    push_chars(chars) {
        this.inner += asciiToHtml(chars);
        this.needs_refresh = true;
    }
};

/**
 * The in-browser display for the HVM
 * @class
 * @property {DisplayMode} mode The current display mode
 * @property {HTMLDivElement | undefined} root_element The root div element
 * @property {TextModeBuffer} textmode_buffer The textmode html buffer
 */
export class Display {
    constructor() {
        this.mode = DisplayMode.Text;
        this.root_element = undefined;
        this.textmode_buffer = new TextModeBuffer();
    }

    /**
     * Initialize the display
     */
    init() {
        console.log("initializing display");

        setupStyle();
        this.root_element = document.createElement("div");
        this.root_element.id = "hvm-display";
        document.body.appendChild(this.root_element);

        this.setMode(DisplayMode.Text); // The default display mode is text-mode

        /**
        * The callback for `requestAnimationFrame` that updates the display
        */
        const updateDisplay = () => {
            switch (this.mode) {
                case DisplayMode.Text:
                    if (this.textmode_buffer.needs_refresh) {
                        // Check if the user is currently scrolled to the bottom
                        const is_scrolled_to_bottom = this.root_element.scrollHeight - this.root_element.clientHeight <= this.root_element.scrollTop + 1;

                        this.root_element.innerHTML = this.textmode_buffer.inner;
                        this.textmode_buffer.needs_refresh = false;

                        // Automatically scroll to the bottom if the user has scrolled all the way down
                        if (is_scrolled_to_bottom) {
                            this.root_element.scrollTop = this.root_element.scrollHeight;
                        }
                    }
                    break;
                case DisplayMode.FrameBuffer:
                    break;
            }
            requestAnimationFrame(updateDisplay);
        };
        requestAnimationFrame(updateDisplay);
    }

    /**
     * Set the display mode
     * @param {DisplayMode} mode The mode to set it to 
     */
    setMode(mode) {
        switch (mode) {
            case DisplayMode.Text:
                this.root_element.innerHTML = this.textmode_buffer.inner;
                break;
            case DisplayMode.FrameBuffer:
                this.root_element.innerHTML = "Framebuffer mode not implemented";
                break;
        }
    }
}

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
 * Apply ascii escape sequences to a string
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