import {
	LIST_RUNS_SUCCESS,
} from './constants'

const initialState = {
	runs: [],
}

export default function (state = initialState, action) {
	// console.log('---> Reducer Update ', action)
	switch (action.type) {
	case LIST_RUNS_SUCCESS:
		return {
			...state,
			runs: action.runs
		}
	default:
		return state
	}
}
