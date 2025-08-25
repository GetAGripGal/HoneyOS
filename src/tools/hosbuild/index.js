import { getCommand, handleCommand } from "./commands.js";

async function main() {
	const argv = process.argv;
	const command = getCommand(argv);
	await handleCommand(command, argv);
}

main();
