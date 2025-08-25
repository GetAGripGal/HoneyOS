/** @import { TargetDefinition } from "./targets" */
/** @import { RollupOptions, InputOption, InputOptions, OutputOptions } from "rollup" */

import { rollup } from "rollup";
import fs from "fs";

/**
 * Generate the filename of the output file from it's destination target.
 * @param {TargetDefinition} target The destibution target definition.
 * @returns {string} The name of the output file.
 */
function formatOutputFileName(target) {
	const extension = ".js";
	return target.outName + extension;
}

/**
 * Create a rollup input config from a target definition.
 * @param {TargetDefinition} target The distribution target definition.
 * @param {string} src The source directory.
 * @returns {InputOptions} The resulting rollup options.
 */
function createRollupInputConfig(target, src) {
	return {
		input: src + "/" + target.path + "/index.js",
	};
}

/**
 * Create a rollup output config from the target definition.
 * @param {TargetDefinition} target The distribution target definition.
 * @param {string} dest The destination directory. 
 * @returns {OutputOptions} The resulting rollup options. 
 */
function createRollupOutputConfig(target, dest) {
	return {
		file: dest + "/" + target.outDir + "/" + target.label + ".js"
	}
}

/**
 * Write the output file.
 * @param {string} code The source code of the file.
 */
function writeOutputFile(code, dest) {
	fs.writeFileSync(dest, code);
}

/**
 * Distribute a js target.
 * @param {TargetDefinition} target The distribution target definition.
 * @param {string} src The source directory.
 * @param {string} dest The destination directory.
 * @returns {boolean} Whether or not the process succeeded.
 */
async function distributeJs(target, src, dest) {
	const inputConfig = createRollupInputConfig(target, src)
	const outputConfig = createRollupOutputConfig(target, dest);

	try {
		console.trace("Invoking rollup.");
		const bundle = await rollup(inputConfig);
		console.trace("Generating output.");
		const { output } = await bundle.generate(outputConfig);
		console.trace("Writing bundled code to output file.")
		const outputFile = 
			dest + "/" + target.outDir + "/" + formatOutputFileName(target);
		const code = output[0].code;
		writeOutputFile(code, outputFile);
		console.info("Bundled target `" + target.label + "` -> `" + outputFile + "`");
	} catch (error) {
		console.error(error);
		return false;
	}
}

export { distributeJs, }
