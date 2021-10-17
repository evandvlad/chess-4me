const { app, BrowserWindow } = require("electron");
const path = require("path");

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		width: 550,
		height: 600,
		minWidth: 380,
		minHeight: 420,
		autoHideMenuBar: true,
		show: false,
	});

	mainWindow.loadFile(path.join(__dirname, "dist/index.html"));

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});
});

app.on("window-all-closed", () => {
	app.quit();
});
