/**
 * @typedef {("js" | "c")} TargetType
 */

/**
 * @typedef TargetDefinition
 * @property {string} label The label for the target.
 * @property {TargetType} type The type of the target.
 * @property {Array<string>} dependsOn The targets this target depends on and will be compiled first.
 * @property {string} path The path to the source code.
 * @property {string | null} outDir The subdirectory the resulting distribution files will be located at.
 * @property {string} outName The name of the output binary.
 * @property {Array<string>} assets The assets to copy over to the dist directory. 
 */

import fs from "fs";

/**
 * The directory with the target definitions.
 * @type {string}
 */
const TARGET_DIRECTORY = process.env.WORKSPACE_DIR + "/targets/";

/**
 * Load the target definitions from the targets directory.
 * @returns {Map<string, TargetDefinition>} A dictionary containing the loaded target definitions. 
 */
function loadTargetDefinitions() {
	const definitions = new Map();

	fs.readdirSync(TARGET_DIRECTORY)
		.forEach(file => {
			if (!file.endsWith(".json")) return;

			const result = loadTargetFromFile(file);
			if (result === undefined) return;
		
			const [name, target] = result;
			if (name in result) {
				throw new Error("Duplicate target entry: " + name);
			}

			definitions.set(name, target);
		});	

	return definitions;
}

/**
 * Load a target definition from a file.
 * @param {string} file The path to the target defintion file.
 * @returns {[string, TargetDefinition] | undefined} A tuple containing the target path and target definition
 */
function loadTargetFromFile(file) {
	const contents = fs.readFileSync(TARGET_DIRECTORY + file, { encoding: "utf8"});
	const parsed = JSON.parse(contents);
	const name = parsed["label"];
	return [name, parsed];
}

export { loadTargetDefinitions }

