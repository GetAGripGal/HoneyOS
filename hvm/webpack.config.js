const path = require("path");
const { argv } = require("process");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
    const outfile = argv.mode == 'production' ? "hvm.min.js" : "hvm.js";

    return {
        mode: argv.mode,
        entry: "./src/index.js",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: outfile,
            library: "HVM"
        },
        optimization: {
            minimize: argv.mode == 'production',
            minimizer: [new TerserPlugin({ parallel: true })]
        },
        module: {
            // Load js files as raw string when its appended with `?raw`
            rules: [
                {
                    test: /\.js$/,
                    resourceQuery: /raw/,
                    type: 'asset/source',
                }
            ]
        }
    }
} 