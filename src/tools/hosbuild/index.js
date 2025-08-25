import { getCommand, handleCommand } from "./commands.js";
import { registerLogger } from "./log.js";

async function main() {
	const argv = process.argv;
	registerLogger();

	const command = getCommand(argv);
	await handleCommand(command, argv);
}

main();
