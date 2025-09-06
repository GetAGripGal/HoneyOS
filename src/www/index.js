/**
 * @typedef State The global state for the honeyos website.  
 * @type {object}
 * @property {HTMLCanvasElement | undefined} canvas The canvas used to display the honeyos framebuffer.
 */

import { greet } from "./greet.js";

/** @type {State} */
const state = {
	canvas: undefined
}

/**
 * Fetch the display canvas.
 */
function fetchCanvas() {
	state.canvas = document.getElementById("display");
}

/**
 * Resize the canvas to the window size.
 */
function resizeCanvas() {
	if (state.canvas === undefined) {
		return;
	}
	state.canvas.width = window.innerWidth;
	state.canvas.height = window.innerHeight;	
}

/**
 * @typedef CallbackObject Contains the different callbacks for the window events.
 * @type {Object}
 */

/** @type {CallbackObject} */
const callbacks = {
	load: (_) => {
		greet();
		fetchCanvas();
		resizeCanvas();
	},
	resize: (_) => {
		resizeCanvas();	
	}
}

/**
 * Register the event listeners in the callbacks object.
 * @property {CallbackObject} callbacks An object containing the callback functions to call. The keys must equal to a valid window event.
 */
function registerEventListeners(callbacks) {
	Object.entries(callbacks).forEach(([key, value]) => {
		window.addEventListener(key, value);
	}); 
}

// Register the event listeners.
registerEventListeners(callbacks);
