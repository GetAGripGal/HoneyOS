/**
 * @typedef Framebuffer A framebuffer of rgb8 Pixels.
 * @property {number} width The width of the framebuffer.
 * @property {number} height The height of the framebuffer.
 * @property {Uint8Array} pixels The pixels in the framebuffer.
 */

/**
 * The size of a pixel.
 * @type {number}
 */
const PIXEL_SIZE = 3;

/**
 * Calculate the size of a pixel buffer.
 * @param {number} width The width of the pixel buffer.
 * @param {number} height The height of the pixel buffer.
 * @returns {number} The size of the pixel buffer.
 */
function calculateBufferSize(width, height) {
	return PIXEL_SIZE * width * height;
}

/**
 * Create an empty framebuffer.
 * @param {number} width The width of the new framebuffer.
 * @param {number} height The height of the new framebuffer.
 * @returns {Framebuffer} The new framebuffer.
 */
export function createFramebuffer(width, height) {
	const bufferSize = calculateBufferSize(width, height);
	const pixels = new Uint8Array(bufferSize);
	return {
		width,
		height,
		pixels
	}
}
