/**
 * @typedef {("trace" | "info" | "warn" | "error")} LogLevel
 */

/**
 * The prefixes for the messages of each log level.
 * @type {Object.<LogLevel, string>}
 */
const prefixes = {
	"trace": "[\u001b[36mtrace\u001b[37m]",
	"info": "[\u001b[32minfo\u001b[37m]",
	"warn": "[\u001b[33mwarn\u001b[37m]",
	"error": "[\u001b[31merror\u001b[37m]",
};

/**
 * Log a message to the console.
 * @param {LogLevel} level The log level to log at.
 * @param {...any} what The contents of the message.
 */
function log(level, ...what) {
	let message = "";
	what.forEach(content => {
		message += content.toString();
	});

	const date = new Date()
	console.log(date.toLocaleTimeString() + " " + prefixes[level] + ": " + message);
}

/**
 * Register the custom logging commands.
 */
export function registerLogger() {
	console.trace = (what) => log("trace", what);
	console.info = (what) => log("info", what);
	console.warn = (what) => log("warn", what);
	console.error = (what) => log("error", what);
}
