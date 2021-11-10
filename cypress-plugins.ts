import { startDevServer } from "@cypress/vite-dev-server";
import path from "path";

export default (on: Cypress.PluginEvents) => {
	on("dev-server:start", (options) => {
		const viteConfig = {
			configFile: path.resolve(__dirname, "vite.config.ts"),
		};

		return startDevServer({ options, viteConfig });
	});
};
