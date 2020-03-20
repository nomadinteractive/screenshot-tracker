require('dotenv').config() // eslint-disable-line
const { notarize } = require('electron-notarize') // eslint-disable-line

exports.default = async function notarizing(context) {
	console.log('Notirizing the signed app...')

	const { electronPlatformName, appOutDir } = context

	if (process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false') return
	if (electronPlatformName !== 'darwin') return

	const appName = context.packager.appInfo.productFilename

	const appleId = process.env.NOMAD_APPLEID_EMAIL
	const appleIdPassword = process.env.NOMAD_APPLEID_PASS
	const ascProvider = process.env.NOMAD_TEAM_SHORTNAME

	const opts = {
		appBundleId: 'co.nomadinteractive.screenshot-tracker',
		appPath: `${appOutDir}/${appName}.app`,
		appleId,
		appleIdPassword,
		ascProvider,
	}
	// console.log('--> Notarize opts', opts)
	// eslint-disable-next-line
	return await notarize(opts)
}
