import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
	Table,
	Modal,
	Icon,
	Button
} from 'antd'

import { listRuns } from '../actions'
import Layout from '../layout'

// const path = window.require('path')
const { remote } = window.require('electron')
const storage = remote.require('./storage')

const loading = <Icon type="loading" />

class RunList extends Component {
	componentDidMount() {
		const { listRunsAction } = this.props
		listRunsAction()
	}

	deleteRun(runId) {
		const { listRunsAction } = this.props

		Modal.confirm({
			content: 'Are you sure you want to delete this run?',
			okText: 'Delete',
			okType: 'danger',
			onOk: () => {
				storage.deleteRun(runId)
				listRunsAction()
			}
		})
	}

	render() {
		const { runs } = this.props
		// console.log('--> runs', runs)

		return (
			<div>
				<Layout>
					{runs ? (
						<Table
							columns={[
								{
									title: 'Run Id',
									dataIndex: 'id',
									key: 'id',
									render: (text, record) => (
										<Link to={`/result/${record.id}`}>
											{text}
										</Link>
									)
								},
								{
									title: 'Run',
									dataIndex: 'name',
									key: 'name',
									render: (text, record) => (
										<Link to={`/result/${record.id}`}>
											{text}
										</Link>
									)
								},
								{
									title: 'Pages',
									dataIndex: 'pages',
									key: 'pages',
									render: (text, record) => record.pages.length
								},
								{
									title: 'Actions',
									key: 'actions',
									render: (text, record) => (
										<div>
											<Button
												size="small"
												onClick={() => {
													this.deleteRun(record.id)
												}}
											>
												<Icon type="delete" />
											</Button>
										</div>
									)
								},
							]}
							dataSource={runs}
							rowKey="id"
							pagination={false}
							// scroll={{ y: '100vh' }}
							scroll={{ y: 'max-content' }}
						/>
					) : (
						<div style={{ padding: 30 }}>{loading}</div>
					)}
				</Layout>
			</div>
		)
	}
}

RunList.propTypes = {
	listRunsAction: PropTypes.func.isRequired,
	runs: PropTypes.array.isRequired // eslint-disable-line
}

const mapStateToProps = (state) => ({
	runs: state.runs
})

const mapDispatchToProps = (dispatch) => ({
	listRunsAction: listRuns(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RunList)
