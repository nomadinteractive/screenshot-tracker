const path = require('path')
const fs = require('fs')
const url = require('url')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')
const puppeteer = require('puppeteer-core')
const chromeLauncher = require('chrome-launcher')
const lighthouse = require('lighthouse')
const slugify = require('slugify')
const request = require('request')
const util = require('util')
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
// storage.clearRuns() // for testing

const appDocumentsDirectory = path.join(app.getPath('documents'), '/screenshot-tracker')
console.log('--> appDocumentsDirectory', appDocumentsDirectory)
if (!fs.existsSync(appDocumentsDirectory)) {
	fs.mkdirSync(appDocumentsDirectory)
	console.log('==> appDocumentsDirectory was not exists created!')
}


// Configure a headleass chrome and pupeteer instance

const chromeLauncherOpts = {
	chromeFlags: ['--headless'],
	logLevel: 'info',
	output: 'html'
}

let chrome
let browser

(async () => {
	chrome = await chromeLauncher.launch(chromeLauncherOpts)
	chromeLauncherOpts.port = chrome.port

	const resp = await util.promisify(request)(`http://localhost:${chromeLauncherOpts.port}/json/version`)
	const { webSocketDebuggerUrl } = JSON.parse(resp.body)
	browser = await puppeteer.connect({
		browserWSEndpoint: webSocketDebuggerUrl,
		defaultViewport: null
	})
})()


// Configure application main window

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

app.on('before-quit', async () => {
	console.log('--> App quit clean-up. Closing browser and chrome instances')
	await browser.disconnect()
	await chrome.kill()
})

const startRun = async (runId) => {
	const run = storage.getRun(runId)
	const runDirectory = appDocumentsDirectory + '/' + run.id + '-'
		+ slugify(run.name.replace('/', '-').replace(':', '.'))
	// console.log('--> runDirectory', runDirectory)
	if (!fs.existsSync(runDirectory)) { fs.mkdirSync(runDirectory) }
	if (run && run.pages) {
		console.log('--> run Object:', run)
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
				if (resolution === 'desktopLarge') viewportWidth = 1920
				if (resolution === 'tabletLandscape') viewportWidth = 1024
				if (resolution === 'tabletPortrait') viewportWidth = 768
				if (resolution === 'mobile') viewportWidth = 350
				// eslint-disable-next-line
				const screenshotResult = await takeScreenshotOfWebpage(page.url, viewportWidth, screenshotFilePath, run.delay)
				// console.log('--> screenshotResult', screenshotResult)
				if (screenshotResult) run.pages[i].screenshots[resolution].status = 'success'
				else run.pages[i].screenshots[resolution].status = 'failed'
				// console.log('--> updatedRun', run)
				storage.updateRun(runId, run)
				mainWindow.webContents.send('run-updated', run)
			}

			// Run lighthouse report
			if (run.options && run.options.lighthouse) {
				const { lhr, report } = await runLighthouseReport(page.url) // eslint-disable-line
				const categories = Object.values(lhr.categories)
				// console.log(`--> [LHR] ${categories.map((c) => c.id + ': ' + c.score).join(', ')} for ${page.url}`)
				// console.log('--> lhr report', report) // html
				// console.log('--> lhr.categories', lhr.categories) // scores
				const scores = {}
				categories.map((c) => {
					scores[c.id] = c.score
					return c
				})
				run.pages[i].lhrScores = scores

				// Save report html in screenshots directory
				const lhReportFilePath = runDirectory + '/'
					+ slugify(page.url).replace(/https?/g, '').replace(/[./:]/g, '') + '-lighthouse-report.html'
				fs.writeFileSync(lhReportFilePath, report)

				run.pages[i].lhrHtmlPath = lhReportFilePath

				storage.updateRun(runId, run)
				mainWindow.webContents.send('run-updated', run)
			}
		}
		// Mark run status as finished
	}
}

const runLighthouseReport = async (pageUrl) => {
	const lhrResult = await lighthouse(pageUrl, chromeLauncherOpts, null)
	return lhrResult
}

const takeScreenshotOfWebpage = async (testUrl, viewportWidth, filePath, delay) => {
	let returnVal = false

	const page = await browser.newPage()
	await page.setViewport({ width: viewportWidth, height: 500 })

	await page.goto(testUrl)
	// lazy load issue :(

	try {
		// lazy load issue
		// await page.evaluate(() => { window.scrollBy(0, window.innerHeight) })

		if (delay > 0) {
			await new Promise((r) => setTimeout(r, delay * 1000))
			// await page.waitFor(delay * 1000)
		}

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

	await page.close()

	return returnVal
}
