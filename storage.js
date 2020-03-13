const Store = require('electron-store')

const store = new Store()

const KEYS = {
	RUNS: 'runs',
	RUNS_NEXT_ID: 'runs_next_id',
	LAST_RUN_OBJ: 'last_run_obj',
}

const getNextRunId = () => (parseInt(store.get(KEYS.RUNS_NEXT_ID), 10) || 1)

const saveRun = (runData) => {
	const runs = store.get(KEYS.RUNS) || []
	const newRunId = getNextRunId()
	const newRunObj = {
		id: newRunId,
		progress: 0,
		...runData
	}
	runs.push(newRunObj)
	store.set(KEYS.RUNS, runs)
	store.set(KEYS.RUNS_NEXT_ID, newRunId + 1)
	return newRunObj
}

const listRuns = () => store.get(KEYS.RUNS)

const getRun = (runId) => {
	const runs = listRuns()
	let foundRun = null
	runs.forEach((run) => {
		if (parseInt(run.id, 10) === parseInt(runId, 10)) {
			foundRun = run
		}
	})
	return foundRun
}

const updateRun = (runId, updatedData) => {
	const runs = listRuns()
	const updatedRuns = []
	runs.forEach((run) => {
		updatedRuns.push({
			...run,
			...(parseInt(run.id, 10) === parseInt(runId, 10) ? updatedData : {})
		})
	})
	store.set(KEYS.RUNS, updatedRuns)
	return true
}

const deleteRun = (runId) => {
	const runs = listRuns()
	const updatedRuns = []
	runs.forEach((run) => {
		if (parseInt(run.id, 10) !== parseInt(runId, 10)) {
			updatedRuns.push(run)
		}
	})
	store.set(KEYS.RUNS, updatedRuns)
	return true
}

const clearRuns = () => {
	store.set(KEYS.RUNS, null)
	store.set(KEYS.RUNS_NEXT_ID, null)
}

const getLastRunObj = () => store.get(KEYS.LAST_RUN_OBJ)
const saveLastRunObj = (runData) => store.set(KEYS.LAST_RUN_OBJ, runData)

module.exports = {
	getNextRunId,
	saveRun,
	listRuns,
	getRun,
	updateRun,
	deleteRun,
	clearRuns,
	getLastRunObj,
	saveLastRunObj
}
