const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')
// const pie = require('puppeteer-in-electron')
// const puppeteer = require('puppeteer-core')

// for testing
// const storage = require('./storage') // eslint-disable-line
// storage.clearRuns() // for testing

// app.commandLine.appendSwitch('remote-debugging-port', '9222')

// let puppetBrowser
// pie.connect(app, puppeteer)
// 	.then((browser) => { puppetBrowser = browser })
// 	.catch((e) => { console.log('----> pupetteer didnt connect propert', e) })

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

	// setTimeout(() => {
	// 	runPupeteerTest()
	// }, 2000)
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

// const runPupeteerTest = async () => {
// 	const window = new BrowserWindow()
// 	const testUrl = 'https://example.com/'
// 	await window.loadURL(testUrl)

// 	try {
// 		const page = await pie.getPage(puppetBrowser, window)
// 		await page.screenshot({ path: './page-screenshot.jpg', type: 'jpeg' })
// 		console.log('----> screenshot saved?')
// 		console.log(page.url())
// 	}
// 	catch (e) {
// 		console.log('----> Puppeteer attempt exception!', e)
// 	}

// 	window.destroy()
// }
