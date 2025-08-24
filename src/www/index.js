/**
 * @typedef State The global state for the honeyos website.  
 * @type {object}
 * @property {HTMLCanvasElement | undefined} canvas The canvas used to display the honeyos framebuffer.
 */

/** @type {State} */
const state = {
	canvas: undefined
}

/**
 * Fetch the display canvas.
 */
function fetch_canvas() {
	state.canvas = document.getElementById("display");
}

/**
 * Resize the canvas to the window size.
 */
function resize_canvas() {
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
		fetch_canvas();
		resize_canvas();
	},
	resize: (_) => {
		resize_canvas();	
	}
}

/**
 * Register the event listeners in the callbacks object.
 * @property {CallbackObject} callbacks An object containing the callback functions to call. The keys must equal to a valid window event.
 */
function register_event_listeners(callbacks) {
	Object.entries(callbacks).forEach(([key, value]) => {
		window.addEventListener(key, value);
	}); 
}

// Register the event listeners.
register_event_listeners(callbacks);
