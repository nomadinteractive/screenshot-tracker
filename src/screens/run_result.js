import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
	Table,
	Input,
	Button,
	Menu,
	Dropdown,
	Icon,
	Modal,
	Tooltip,
} from 'antd'
import Lightbox from 'react-image-lightbox'

import { listRuns } from '../actions'
import Layout from '../layout'

// const path = window.require('path')
const { remote } = window.require('electron')
const { shell } = remote
const storage = remote.require('./storage')

const fs = remote.require('fs')

const getImageBase64Data = (filepath) => {
	if (typeof filepath !== 'string') return
	if (!fs.existsSync(filepath)) return
	const imgBase64 = fs.readFileSync(filepath).toString('base64')
	return 'data:image/png;base64,' + imgBase64
}

class RunResult extends Component {
	constructor(props) {
		super(props)

		this.state = {
			redirect: false,
			redirectTo: null,
			run: null,
			columns: [],
			lightboxImages: [],
			lightboxImageIndex: 0,
			lightboxIsVisible: false,
			renamedRunName: '',
			isInRenameRunMode: false,
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

		// Get base64 of the images read from the FS
		const lightboxImages = []
		if (runObj && runObj.pages) {
			runObj.pages = runObj.pages.map((page) => {
				const updatedPage = { ...page }
				Object.keys(page.screenshots).forEach((resolution) => {
					updatedPage.screenshots[resolution].imageb64 = getImageBase64Data(page.screenshots[resolution].file)
					lightboxImages.push(updatedPage.screenshots[resolution].imageb64)
				})
				return updatedPage
			})
		}

		this.setState({
			run: runObj,
			lightboxImages
		})
		this.setTableColumns(runObj)
	}

	// eslint-disable-next-line
	getResolutionColumnMeta(screenshotResName) {
		return {
			title: screenshotResName.substr(0, 1).toUpperCase() + screenshotResName.substr(1),
			dataIndex: 'screenshots.' + screenshotResName,
			key: 'screenshots.' + screenshotResName,
			render: (text, record) => (
				<div>
					{record.screenshots[screenshotResName].status === 'success' && (
						<div>
							{record.screenshots[screenshotResName].imageb64 ? (
								<div className="screenshotContainer">
									{/* eslint-disable-next-line */}
									<img
										src={record.screenshots[screenshotResName].imageb64}
										alt={screenshotResName}
										className="screenshot"
										onClick={() => {
											// eslint-disable-next-line
											this.openLightboxWithScreenshot(record.screenshots[screenshotResName].imageb64)
										}}
									/>
								</div>
							) : (
								<div>
									{/* eslint-disable-next-line */}
									<Tooltip title="An error occured while locating and loading the image. It may be deleted.">
										<Icon type="warning" style={{ fontSize: 24 }} />
									</Tooltip>
								</div>
							)}
						</div>
					)}
					{record.screenshots[screenshotResName].status === 'pending' && (
						<Icon type="loading" />
					)}
					{record.screenshots[screenshotResName].status === 'failed' && (
						<Icon type="warning" />
					)}
				</div>
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

	openLightboxWithScreenshot(b64) {
		const { lightboxImages } = this.state
		const lightboxImageIndex = lightboxImages.indexOf(b64)
		this.setState({
			lightboxIsVisible: true,
			lightboxImageIndex
		})
	}

	deleteRun() {
		const { run } = this.state
		const { listRunsAction } = this.props

		Modal.confirm({
			content: 'Are you sure you want to delete this run?',
			okText: 'Delete',
			okType: 'danger',
			onOk: () => {
				storage.deleteRun(run.id)
				listRunsAction()
				this.setState({
					redirect: true,
					redirectTo: '/',
				})
			}
		})
	}

	renameRun() {
		const { listRunsAction } = this.props
		const { run, renamedRunName } = this.state
		const updatedRun = { ...run }
		updatedRun.name = renamedRunName
		storage.updateRun(run.id, updatedRun)
		this.setState({
			run: updatedRun,
			isInRenameRunMode: false
		})
		listRunsAction()
	}

	openRunFolder() {
		const { run } = this.state
		if (run.pages && run.pages[0] && run.pages[0].screenshots) {
			const aScreenshotFile = Object.values(run.pages[0].screenshots)[0].file
			// const runFolderPath = path.dirname(aScreenshotFile)
			shell.showItemInFolder(aScreenshotFile)
		}
	}

	render() {
		const {
			redirect,
			redirectTo,
			run,
			columns,
			lightboxImages,
			lightboxImageIndex,
			lightboxIsVisible,
			isInRenameRunMode
		} = this.state

		if (redirect) {
			return (
				<Redirect to={redirectTo} />
			)
		}

		return (
			<div>
				<Layout>
					{run && (
						<div
							style={{
								display: 'flex',
								height: 50,
								flexDirection: 'row',
								backgroundColor: '#efefef',
							}}
						>
							<div
								style={{
									display: 'flex',
									flex: 2,
									alignItems: 'center',
									paddingLeft: 20,
									// backgroundColor: 'yellow',
								}}
							>
								{!isInRenameRunMode && (
									<h3 style={{ margin: 0 }}>
										{run.name}
										<Button
											type="link"
											size="small"
											onClick={() => {
												this.setState({ isInRenameRunMode: true })
											}}
										>
											<Icon type="edit" />
										</Button>
									</h3>
								)}
								{isInRenameRunMode && (
									<div style={{ width: '100%' }}>
										<Input.Group compact>
											<Input
												defaultValue={run.name}
												onChange={(e) => { this.setState({ renamedRunName: e.target.value }) }}
												style={{ width: '50%' }}
											/>
											<Button onClick={this.renameRun.bind(this)}>Rename</Button>
											<Button
												onClick={() => {
													this.setState({ isInRenameRunMode: false })
												}}
											>
												<Icon type="close" />
											</Button>
										</Input.Group>
									</div>
								)}
							</div>
							<div
								style={{
									display: 'flex',
									flex: 1,
									justifyContent: 'flex-end',
									alignItems: 'center',
									paddingRight: 15,
									// backgroundColor: 'blue',
								}}
							>
								<Button
									size="small"
									style={{ marginRight: 10 }}
									onClick={this.openRunFolder.bind(this)}
								>
									Open Screenshots Folder
								</Button>
								{/* <Button size="small" style={{ marginRight: 10 }}>
									<Icon type="reload" />
								</Button> */}
								<Dropdown
									trigger={['click']}
									overlay={(
										<Menu>
											{/* <Menu.Item>Export</Menu.Item> */}
											<Menu.Item
												onClick={this.deleteRun.bind(this)}
											>
												Delete
											</Menu.Item>
										</Menu>
									)}
								>
									<Button size="small">
										<Icon type="more" rotate={90} />
									</Button>
								</Dropdown>
							</div>
						</div>
					)}
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
				{lightboxIsVisible && (
					<Lightbox
						mainSrc={lightboxImages[lightboxImageIndex]}
						nextSrc={lightboxImages[(lightboxImageIndex + 1) % lightboxImages.length]}
						// eslint-disable-next-line
						prevSrc={lightboxImages[(lightboxImageIndex + lightboxImages.length - 1) % lightboxImages.length]}
						onCloseRequest={() => this.setState({ lightboxIsVisible: false })}
						onMovePrevRequest={() => {
							this.setState({
								// eslint-disable-next-line
								lightboxImageIndex: (lightboxImageIndex + lightboxImages.length - 1) % lightboxImages.length,
							})
						}}
						onMoveNextRequest={() => {
							this.setState({
								lightboxImageIndex: (lightboxImageIndex + 1) % lightboxImages.length,
							})
						}}
					/>
				)}
			</div>
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
