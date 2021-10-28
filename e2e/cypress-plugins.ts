import webpackPreprocessor from "@cypress/webpack-preprocessor";
import path from "path";

export default (on: Cypress.PluginEvents): void => {
	on(
		"file:preprocessor",
		webpackPreprocessor({
			webpackOptions: {
				module: {
					rules: [
						{
							test: /\.ts$/,
							use: "ts-loader",
							exclude: /node_modules/,
						},
					],
				},
				resolve: {
					extensions: [".ts", ".js"],
				},
				output: {
					filename: "bundle.js",
					path: path.resolve(__dirname, "dist"),
				},
			},
		}),
	);
};
