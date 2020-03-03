import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
	Table,
	// Tag,
	// Button,
	Icon,
} from 'antd'

import { listRuns } from '../actions'
import Layout from '../layout'

const { remote } = window.require('electron')

const fs = remote.require('fs')

const getImageBase64Data = (filepath) => {
	const imgBase64 = fs.readFileSync(filepath).toString('base64')
	return 'data:image/png;base64,' + imgBase64
}

class RunResult extends Component {
	constructor(props) {
		super(props)

		this.state = {
			run: null,
			columns: [],
		}
	}

	componentDidMount() {
		const { listRunsAction } = this.props
		listRunsAction()
		this.getRun()
	}

	componentDidUpdate(previousProps) {
		const { runs } = this.props
		if (runs !== previousProps.runs) {
			this.getRun()
		}
	}

	getRun() {
		const { runs } = this.props
		const { runId } = this.props.match.params // eslint-disable-line

		// const runs = listRunsAction()
		let runObj = null
		runs.forEach((run) => {
			if (parseInt(run.id, 10) === parseInt(runId, 10)) {
				runObj = run
			}
		})
		this.setState({ run: runObj })
		this.setTableColumns(runObj)
	}

	// eslint-disable-next-line
	getResolutionColumnMeta(screenshotResName) {
		return {
			title: screenshotResName.substr(0, 1).toUpperCase() + screenshotResName.substr(1),
			dataIndex: 'screenshots.' + screenshotResName,
			key: 'screenshots.' + screenshotResName,
			render: (text, record) => (
				<span>
					{record.screenshots[screenshotResName].status === 'success' && (
						<img
							src={getImageBase64Data(record.screenshots[screenshotResName].file)}
							alt={screenshotResName}
							height={150}
							className="screenshot"
						/>
					)}
					{record.screenshots[screenshotResName].status === 'pending' && (
						<Icon type="loading" />
					)}
					{record.screenshots[screenshotResName].status === 'failed' && (
						<Icon type="warning" />
					)}
				</span>
			)
		}
	}

	setTableColumns(run) {
		const columns = [
			{
				title: 'URL',
				dataIndex: 'url',
				key: 'url',
				render: (text) => (
					<h4>
						{text}
						{/* open the link in OS browser from electron: http://bit.ly/38gOO9g */}
					</h4>
				),
			},
		]

		if (run && run.pages[0] && run.pages[0].screenshots) {
			if (run.pages[0].screenshots.desktop) columns.push(this.getResolutionColumnMeta('desktop'))
			if (run.pages[0].screenshots.tabletLandscape) columns.push(this.getResolutionColumnMeta('tabletLandscape'))
			if (run.pages[0].screenshots.tabletPortrait) columns.push(this.getResolutionColumnMeta('tabletPortrait'))
			if (run.pages[0].screenshots.mobile) columns.push(this.getResolutionColumnMeta('mobile'))
		}

		// columns.push({
		// 	key: 'actions',
		// 	render: () => (
		// 		<span>
		// 			<Button size="small">
		// 				<Icon type="delete" />
		// 			</Button>
		// 		</span>
		// 	)
		// })

		// console.log('--> columns', columns)

		this.setState({ columns })
	}

	render() {
		const { run, columns } = this.state

		return (
			<Layout>
				{run && run.pages ? (
					<Table
						columns={columns}
						dataSource={run.pages}
						rowKey="url"
						pagination={false}
						// scroll={{ y: '100vh' }}
						scroll={{ y: 'max-content' }}
					/>
				) : (
					<span>Loading...</span>
				)}
			</Layout>
		)
	}
}

RunResult.propTypes = {
	listRunsAction: PropTypes.func.isRequired,
	runs: PropTypes.array.isRequired // eslint-disable-line
}

const mapStateToProps = (state) => ({
	runs: state.runs
})

const mapDispatchToProps = (dispatch) => ({
	listRunsAction: listRuns(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RunResult)
