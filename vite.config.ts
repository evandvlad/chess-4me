import path from "path";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
	plugins: [reactRefresh()],
	clearScreen: false,
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		fs: {
			strict: false,
		},
	},
});
