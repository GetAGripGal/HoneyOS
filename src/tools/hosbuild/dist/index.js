import { loadTargetDefinitions } from "./targets.js"
import { distributeJs } from "./js.js";

/** @import { TargetDefinition, TargetType } from "./targets.js" */

import fs from "fs";

/**
 * The location of the source directoty.
 * @type {string}
 */
const SRC_DIR = process.env.WORKSPACE_DIR + "/src";

/**
 * The directory for the resulting distrobution files.
 * @type {string}
 */
const DIST_DIR = process.env.WORKSPACE_DIR + "/dist";

/**
 * The handlers for each target type.
 * @type {Object.<TargetType, function(TargetDefinition): Promise<boolean>>}
 */
const targetHandlers = {
	"js": (target) => distributeJs(target, SRC_DIR, DIST_DIR),
	"c": (_) => {console.error("")}, 
};

/**
 * Create the dir for the resulting distrobution files.
 * @param {TargetDefinition} target The definition create the dir for.
 */
function createDistDir(target) {
	if (!fs.existsSync(DIST_DIR)) {
		fs.mkdirSync(DIST_DIR); // Create the dist directory.
	}

	if (target.outDir === null) return;

	const targetDir = DIST_DIR + "/" + target.outDir;
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}
}

/**
 * Copy each assets for the target to the dist directory.
 * @param {TargetDefinition} target The distribution target definition.
 */
function copyAssets(target) {
	/**
	 * Extract the file name from its path.
	 * @param {string} path The path to the file.
	 * @returns {string} The resulting file name.
	 */
	function getFileNameFromPath(path) {
		return path.replace(/^.*[\\/]/, '')
	}

	target.assets.forEach(assetPath => {
		const sourcePath = SRC_DIR + "/" + assetPath;
		const destPath = DIST_DIR + "/" + target.outDir + "/" + getFileNameFromPath(assetPath);
		fs.copyFileSync(sourcePath, destPath);
		console.log("Copied asset `" + sourcePath + "` to `" + destPath + "`");
	});
}

/**
 * Bundle, compile and distribute a part of the repo.
 * @param {string} target The target distribute.
 */
async function dist(target) {
	const definitions = loadTargetDefinitions();
	const targetDefinition = definitions.get(target);
	
	if (targetDefinition === undefined) {
		throw new Error("Invalid target definition: " + target);
	}

	createDistDir(targetDefinition);
	copyAssets(targetDefinition);
	
	// Handle the appropiate target type
	const targetType = targetDefinition.type;
	if (!(targetType in targetHandlers)) {
		throw new Error("No target handler implemented for target type: " + targetType);
	}

	const handler = targetHandlers[targetType];
	await handler(targetDefinition);
}

export { dist, }
