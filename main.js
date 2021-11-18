const { app, BrowserWindow } = require("electron");
const path = require("path");

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		width: 660,
		height: 523,
		minWidth: 660,
		minHeight: 523,
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
