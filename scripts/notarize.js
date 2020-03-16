require('dotenv').config() // eslint-disable-line
const { notarize } = require('electron-notarize') // eslint-disable-line
const { exec } = require('child_process')

const execPromise = (cmd) => new Promise((resolve, reject) => {
	exec(cmd, (err, stdout, stderr) => {
		if (err) return reject(new Error(stderr))
		resolve(stdout)
	})
})

exports.default = async function notarizing(context) {
	const { electronPlatformName, appOutDir } = context

	if (process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false') return
	if (electronPlatformName !== 'darwin') return

	const appName = context.packager.appInfo.productFilename
	console.log('--> appName', appName)
	const appleId = await execPromise('security -q find-generic-password -a `whoami` -s NOMAD_APPLEID_EMAIL -w')
	const appleIdPassword = await execPromise('security -q find-generic-password -a `whoami` -s NOMAD_APPLEID_PASS -w')

	// eslint-disable-next-line
	return await notarize({
		appBundleId: 'co.nomadinteractive.screenshot-tracker',
		appPath: `${appOutDir}/${appName}.app`,
		appleId,
		appleIdPassword,
	})
}
