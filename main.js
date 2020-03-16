const path = require('path')
const fs = require('fs')
const url = require('url')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')
const pie = require('puppeteer-in-electron')
const puppeteer = require('puppeteer-core')
const slugify = require('slugify')
const {
	app,
	BrowserWindow,
	Menu,
	ipcMain,
	crashReporter
} = require('electron') // eslint-disable-line

const storage = require('./storage')

require('./sentry')

crashReporter.start({
	companyName: 'Nomad Interactive',
	productName: 'Screenshot Tracker',
	ignoreSystemCrashHandler: true,
	submitURL: 'https://sentry.io/api/4867322/minidump/?sentry_key=09f1b01e6e5d40d5a6e5a8135cc5cd55'
})

// Clean storage for testing
storage.clearRuns() // for testing

const appDocumentsDirectory = path.join(app.getPath('documents'), '/screenshot-tracker')
console.log('--> appDocumentsDirectory', appDocumentsDirectory)
if (!fs.existsSync(appDocumentsDirectory)) {
	fs.mkdirSync(appDocumentsDirectory)
	console.log('==> appDocumentsDirectory was not exists created!')
}

let puppetBrowser
pie.connect(app, puppeteer)
	.then((browser) => { puppetBrowser = browser })
	.catch((e) => {
		console.log('----> pupetteer didnt connect to electron properly', e)
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
			webSecurity: false,
			nodeIntegration: true,
			preload: path.join(__dirname, 'sentry.js')
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

const startRun = async (runId) => {
	const run = storage.getRun(runId)
	const runDirectory = appDocumentsDirectory + '/' + run.id + '-'
		+ slugify(run.name.replace('/', '-').replace(':', '.'))
	// console.log('--> runDirectory', runDirectory)
	if (!fs.existsSync(runDirectory)) { fs.mkdirSync(runDirectory) }
	if (run && run.pages) {
		for (let i = 0; i < run.pages.length; i += 1) {
			const page = run.pages[i]
			const resolutions = Object.keys(page.screenshots)
			for (let j = 0; j < resolutions.length; j += 1) {
				const resolution = resolutions[j]
				const screenshotFilePath = runDirectory + '/'
					+ slugify(page.url).replace(/https?/g, '').replace(/[./:]/g, '') + '-' + resolution + '.jpg'
				// console.log('--> screenshotFilePath', screenshotFilePath)
				run.pages[i].screenshots[resolution].file = screenshotFilePath
				let viewportWidth = 1440
				if (resolution === 'tabletLandscape') viewportWidth = 1024
				if (resolution === 'tabletPortrait') viewportWidth = 768
				if (resolution === 'mobile') viewportWidth = 350
				// eslint-disable-next-line
				const screenshotResult = await takeScreenshotOfWebpage(page.url, viewportWidth, screenshotFilePath)
				// console.log('--> screenshotResult', screenshotResult)
				if (screenshotResult) run.pages[i].screenshots[resolution].status = 'success'
				else run.pages[i].screenshots[resolution].status = 'failed'
				// console.log('--> updatedRun', run)
				storage.updateRun(runId, run)
				mainWindow.webContents.send('run-updated', run)
			}
		}
		// Mark run status as finished
	}
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

	// if (viewportWidth < 1000) {
	// 	puppetWindow.webContents.enableDeviceEmulation({
	// 		screenPosition: 'mobile',
	// 		screenSize: {
	// 			width: viewportWidth,
	// 			height: 500
	// 		},
	// 		deviceScaleFactor: 2
	// 	})
	// }

	await puppetWindow.loadURL(testUrl, { waitUntil: 'networkidle0' })
	// lazy load issue :(

	try {
		const page = await pie.getPage(puppetBrowser, puppetWindow)
		// lazy load issue
		// await page.evaluate(() => { window.scrollBy(0, window.innerHeight) })
		// await new Promise((r) => setTimeout(r, 2000))
		await page.screenshot({
			path: filePath,
			type: 'jpeg',
			fullPage: true,
		})
		returnVal = true
	}
	catch (e) {
		console.log('----> Puppeteer save screenshot attempt failed!', e)
	}

	puppetWindow.destroy()

	return returnVal
}
