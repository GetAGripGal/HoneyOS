import express from "express";
/** @import { Express, Request, Response } from "express" */

/**
 * The default port to serve the website at.
 * @type {number}
 */
const DEFAULT_PORT = 5100;

/**
 * The directory to serve.
 * @param {string}
 */
const SERVE_DIR = process.env.WORKSPACE_DIR + "/dist/www";

/**
 * The response page for the root route.
 * @param {string}
 */
const ROOT_PAGE = "index.html";

/**
 * The id for the file request route param.
 * @param {string}
 */
const FILE_REQUEST_PARAM_ID = "file";

/**
 * Handle the "/" route by responding with `index.html`.
 * @param {Request} request The request info.
 * @param {Response} response The response handler.
 */
function handleRootRoute(request, response) {
	response.sendFile(SERVE_DIR + "/" + ROOT_PAGE);	
}

/**
 * Handle a request for a file.
 * @param {Request} request The request info.
 * @param {Response} response The response handler. 
 */
function handleFileRequest(request, response) {
	response.sendFile(SERVE_DIR + "/" + request.params[FILE_REQUEST_PARAM_ID])
}

/**
 * Create an express app.
 * @returns {Express} The constructed express app.
 */
function createExpressApp() {
	const app = express()

	app.use(express.static("public"));
	app.use(express.urlencoded({}));
	app.get("/", handleRootRoute);
	app.get("/:" + FILE_REQUEST_PARAM_ID, handleFileRequest);

	return app;
}

/**
 * Serve the website at the specified port.
 * @param {number | undefined} [port] The port to serve the website at. Will use `5100` if not specified.
 */
function serve(port = undefined) {
	const servePort = port ?? DEFAULT_PORT;
	const app = createExpressApp();

	app.listen(servePort, () => {
		console.log("Serving at http://localhost:" + servePort);
	});
}

export { serve, }
