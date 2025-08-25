import { dist } from "./dist/index.js"
import { serve } from "./serve/index.js"
import { loadTargetDefinitions } from "./dist/targets.js";

/**
 * The help message to print on incorrect input.
 * @type {string}
 */
const helpMessage = `\
Usage 
	Unix: ./tools/hosdist.sh <command>
Commands:
	help			Display this message.
	list-targets		List the available distribution targets.	
	dist <target>		Compile and distribute a target.
		- target: The target file to use. Located in the \`targets\` dir.
	serve <port>	Distribute the website and serve it (for development purposes, not for use in production).
		- port: The port to serve the website at. (default: 5100)\
`;

/**	
 * A list of valid commands.
 * @type {Array<string>}
 */
const validCommands = ["help", "list-targets", "dist", "serve"];

/**
 * Handle wrong user input by printing the help message and exiting.
 * @param {string} errorMessage The error message to print. 
 */
function handleInputError(errorMessage) {
	console.error(errorMessage);
	console.log(helpMessage);
	process.exit();
}

/**
 * The handler the help command.
 */
async function handleHelpCommand(_) {
	console.log(helpMessage);
}

/**
 * The handler for the list targets command.
 */
async function handleListTargetsCommand(_) {
	const definitions = loadTargetDefinitions();
	let output = "";
	definitions.forEach(definition => {
		output += definition["label"] + " ";
	});
	console.log(output);
}

/**
 * The handler for the dist command.
 * @param {Array<string>} argv The process arguments. 
 */
async function handleDistCommand(argv) {
	const targetIndex = 3;
	if (argv.length < targetIndex + 1) {
		handleInputError("No target provided.");
		return;
	}
	
	const target = argv[targetIndex];
	dist(target);
}

/**
 * The handler for the serve command.
 * @param {Array<string>} argv The process arguments.
 */
async function handleServeCommand(argv) {
	const portIndex = 3;
	let port = undefined;
	if (argv.length > portIndex) {
		port = argv[portIndex];
	}
	await dist("www");
	serve(port);
}

/**
 * The handlers for the commands.
 * @type {Object.<string, function(Array<string>): Promise<void>>}
 */
const commandHandlers = {
	"help": handleHelpCommand,
	"dist": handleDistCommand,
	"list-targets": handleListTargetsCommand,
	"serve": handleServeCommand,
}

/**
 * Parse the command from the arguments.
 * @param {Array<string>} argv The arguments to parse.
 * @returns {string | undefined} The passed command.
 */
function getCommand(argv) {
	const commandIndex = 2;
	if (argv.length < commandIndex + 1) {
		handleInputError("No command passed.")
		return undefined;
	}
	const command = argv[commandIndex];
	if (!validCommands.includes(command)) {
		handleInputError(command + " is an invalid command.");
		return undefined;
	}
	return command;
}

/**
 * Handle the passed command.
 * @param {string} command The command to handle.
 * @param {Array<string>} argv The process arguments.
 */
async function handleCommand(command, argv) {
	if (!(command in commandHandlers)) {
		throw new Error("Command handler for command `" + command + "` has not yet been implemented.");
	}
	await commandHandlers[command](argv)
}

export { 
	handleCommand,
	getCommand 
};

