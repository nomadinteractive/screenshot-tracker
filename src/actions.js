import {
	LIST_RUNS_SUCCESS,
} from './constants'

const electron = window.require('electron')
const storage = electron.remote.require('./storage')
const ipc = electron.ipcRenderer

export const listRuns = (dispatch) => () => {
	const runs = storage.listRuns()
	const runsRaw = runs ? JSON.parse(JSON.stringify(runs)) : []
	dispatch({
		type: LIST_RUNS_SUCCESS,
		runs: runsRaw
	})
	return runsRaw
}

export const saveRun = (dispatch) => (runObj) => {
	const savedRun = storage.saveRun(runObj)
	listRuns(dispatch)()
	ipc.send('take-screenshots-of-a-run', { id: savedRun.id })
	return savedRun.id
}

export const updateRun = (dispatch) => (updatedRunObj) => {
	storage.updateRun(updatedRunObj)
	listRuns(dispatch)()
}

export default {}
