const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')

// for testing
// const storage = require('./storage') // eslint-disable-line
// storage.clearRuns() // for testing

let mainWindow

if (process.platform === 'win32') {
	app.commandLine.appendSwitch('high-dpi-support', 'true')
	app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

const createWindow = () => {
	const mainWindowState = windowStateKeeper({
		path: app.getPath('userData'),
		defaultWidth: 1024,
		defaultHeight: 768
	})

	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		show: false,
		webPreferences: {
			nodeIntegration: true
		}
	})

	mainWindowState.manage(mainWindow)

	let indexPath

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:3100',
			pathname: 'index.html',
			slashes: true
		})
	}
	else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true
		})
	}

	mainWindow.loadURL(indexPath)

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()

		if (isDev) {
			mainWindow.webContents.openDevTools()

			mainWindow.webContents.on('context-menu', (e, props) => {
				const { x, y } = props

				Menu.buildFromTemplate([
					{
						label: 'Inspect element',
						click: () => {
							mainWindow.inspectElement(x, y)
						}
					}
				]).popup(mainWindow)
			})
		}
	})

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
