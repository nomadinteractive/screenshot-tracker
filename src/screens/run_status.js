import React, { Component } from 'react'
import {
	Button,
} from 'antd'
import Layout from '../layout'

const electron = window.require('electron')
const storage = electron.remote.require('./storage')
// const ipc = electron.ipcRenderer

class RunStatus extends Component {
	constructor(props) {
		super(props)

		// Get run
		const { runId } = props.match.params // eslint-disable-line
		const run = storage.getRun(runId)

		this.state = {
			run
		}
	}

	// componentDidMount() {
	// 	ipc.on('run-status-update', (event, arg) => {
	// 		arg.runId
	// 	})
	// }

	render() {
		const { run } = this.state

		return (
			<Layout style={{ padding: 20 }}>
				<pre>{JSON.stringify(run, null, 4)}</pre>
				<Button
					// style={{}}
					// type={resolutions.mobile ? 'primary' : 'default'}
					onClick={() => { }}
				>
					Test
				</Button>
			</Layout>
		)
	}
}

export default RunStatus
