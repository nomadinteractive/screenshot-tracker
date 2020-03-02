const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')
const pie = require('puppeteer-in-electron')
const puppeteer = require('puppeteer-core')
const {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} = require('electron')

// Clean storage for testing
// const storage = require('./storage') // eslint-disable-line
// storage.clearRuns() // for testing

let puppetBrowser
pie.connect(app, puppeteer)
	.then((browser) => { puppetBrowser = browser })
	.catch((e) => {
		console.log('----> pupetteer didnt connect propert', e)
		// TODO: update a key in storage, and check this flag to display a
		// pop-up in the app ui, and let user to select their Chrome path in
		// their computer for using that for pupeteer instead of electron chromium
	})

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

	ipcMain.on('take-screenshots-of-a-run', (event, arg) => {
		startRun(arg.id)
	})
}

app.on('ready', () => {
	createWindow()
})

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

const startRun = (runId) => {
	console.log(runId)
	// loop and take screenshots,
	// update run Obj in every screenshot and
	// send to renderer process:
	// mainWindow.webContents.send('run-updated', updatedRun)
}

const takeScreenshotOfWebpage = async (testUrl, viewportWidth, filePath) => {
	let returnVal = false
	const puppetWindow = new BrowserWindow({
		x: -10000,
		y: 3000,
		width: viewportWidth,
		height: 500, // doesn't matter
		show: false,
	})

	await puppetWindow.loadURL(testUrl)
	// Or wait until domready + networkidle?

	try {
		const page = await pie.getPage(puppetBrowser, puppetWindow)
		await page.screenshot({
			path: filePath,
			type: 'jpeg',
			fullPage: true
		})
		returnVal = true
	}
	catch (e) {
		console.log('----> Puppeteer save screenshot attempt failed!', e)
	}

	puppetWindow.destroy()

	return returnVal
}
