import {
	LIST_RUNS_SUCCESS,
} from './constants'

const electron = window.require('electron')
const storage = electron.remote.require('./storage')

export const listRuns = (dispatch) => () => {
	const runs = storage.listRuns()
	const runsRaw = runs ? JSON.parse(JSON.stringify(runs)) : []
	dispatch({
		type: LIST_RUNS_SUCCESS,
		runs: runsRaw
	})
}

export const saveRun = (dispatch) => (runObj) => {
	const savedRun = storage.saveRun(runObj)
	listRuns(dispatch)()
	return savedRun.id
}

export default {}
