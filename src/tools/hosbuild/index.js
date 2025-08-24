import { dist } from "./dist/index.js"
import { loadTargetDefinitions } from "./dist/targets.js";

const helpMessage = `Usage 
	Unix: ./tools/hosdist.sh <command>
Commands:
	help			Display this message.
	list-targets		List the available distribution targets.	
	dist <target>		Compile and distribute a target.
		- target: The target file to use. Located in the \`targets\` dir. `;

/**	
 * A list of valid commands.
 * @type {Array<string>}
 */
const validCommands = ["help", "list-targets", "dist"];

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
 * List all the available targets.
 */
function listTargets() {
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
function handleDistCommand(argv) {
	const targetIndex = 3;
	if (argv.length < targetIndex + 1) {
		handleInputError("No target provided.");
		return;
	}
	
	const target = argv[targetIndex];
	dist(target);;
}

/**
 * The handlers for the commands.
 * @type {Object.<string, function(Array<string>): void>}
 */
const commandHandlers = {
	"help": (_) => console.log(helpMessage),
	"dist": handleDistCommand,
	"list-targets": (_) => listTargets(),
}

async function main() {
	const argv = process.argv;
	const command = getCommand(argv);
	commandHandlers[command](argv)
}

main();
