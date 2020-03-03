import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { updateRun } from './actions'

const electron = window.require('electron')
const ipc = electron.ipcRenderer

const ElectronListeners = (props) => {
	const { updateRunAction } = props
	ipc.on('run-updated', (event, arg) => {
		updateRunAction(arg.id, arg)
	})
	return (<span />)
}

ElectronListeners.propTypes = {
	updateRunAction: PropTypes.func.isRequired,
}

const mapStateToProps = () => ({ })

const mapDispatchToProps = (dispatch) => ({
	updateRunAction: updateRun(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ElectronListeners)
