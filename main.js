const { app, BrowserWindow } = require("electron");
const path = require("path");

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		width: 680,
		height: 530,
		minWidth: 680,
		minHeight: 530,
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
