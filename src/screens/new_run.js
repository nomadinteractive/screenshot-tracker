import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
	Button,
	Form,
	Icon,
	Input,
	// Checkbox,
	PageHeader,
	notification
} from 'antd'

import { saveRun } from '../actions'

import Layout from '../layout'

const electron = window.require('electron')
const storage = electron.remote.require('./storage')

const resolutionButtonStyle = {
	// width: '20%',
	height: 120,
	paddingLeft: 40,
	paddingRight: 40,
}

const resolutionButtonIconStyle = {
	fontSize: 20,
	marginBottom: 10
}

// eslint-disable-next-line
const urlExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
const urlRegex = new RegExp(urlExpression)

class NewRun extends Component {
	constructor(props) {
		super(props)

		this.state = {
			runIsSaved: false,
			newRunId: null,
			name: '',
			urls: '',
			resolutions: {
				desktop: true,
				tabletPortrait: false,
				tabletLandscape: false,
				mobile: true,
			},
			options: {
				// meta: false,
				// og: false,
				// resource: false
			}
		}
	}

	componentDidMount() {
		const { resolutions } = this.state
		const newRunId = storage.getNextRunId()
		const lastRunObj = storage.getLastRunObj()
		const updatedResolutions = { ...resolutions }
		const urlsArr = []
		if (lastRunObj && lastRunObj.pages) {
			for (let i = 0; i < lastRunObj.pages.length; i += 1) {
				urlsArr.push(lastRunObj.pages[i].url)
				updatedResolutions.desktop = Boolean(lastRunObj.pages[i].screenshots.desktop)
				updatedResolutions.tabletPortrait = Boolean(lastRunObj.pages[i].screenshots.tabletPortrait)
				updatedResolutions.tabletLandscape = Boolean(lastRunObj.pages[i].screenshots.tabletLandscape)
				updatedResolutions.mobile = Boolean(lastRunObj.pages[i].screenshots.mobile)
			}
		}
		const newRunStateKeys = {
			newRunId,
			name: `Run #${newRunId} - ${moment().format('M/D H:m a')}`,
			urls: urlsArr.join('\n') || 'https://apple.com\nhttps://medium.com',
			resolutions: updatedResolutions
		}
		this.setState(newRunStateKeys)
	}

	handleResolutionOptionChange(res) {
		const { resolutions } = this.state
		this.setState({
			resolutions: {
				...resolutions,
				[res]: !resolutions[res]
			}
		})
	}

	handleOptionsChange(opt) {
		const { options } = this.state
		this.setState({
			options: {
				...options,
				[opt]: !options[opt]
			}
		})
	}

	handleSubmit() {
		const { saveRunAction } = this.props
		const { name, urls, resolutions } = this.state

		if (urls.length < 2) {
			return notification.error({
				message: 'Enter at least one url',
			})
		}

		const invalidUrls = []
		const urlsArr = urls.split('\n')
		urlsArr.forEach((url) => {
			if (!url.match(urlRegex)) {
				invalidUrls.push(url)
			}
		})

		if (invalidUrls.length > 0) {
			return notification.error({
				message: 'Following urls are not valid',
				description: (
					<ul style={{ paddingLeft: 20, fontSize: '0.8em' }}>
						{invalidUrls.map((url) => (<li>{url.length > 45 ? url.substr(0, 45) + '...' : url}</li>))}
					</ul>
				),
			})
		}

		if (!(resolutions.desktop
			|| resolutions.tabletLandscape
			|| resolutions.tabletPortrait
			|| resolutions.mobile)) {
			return notification.error({
				message: 'Select at least one screen size',
			})
		}

		const screenshots = {}
		Object.keys(resolutions).forEach((resolution) => {
			if (resolutions[resolution]) {
				screenshots[resolution] = {
					status: 'pending',
					file: null
				}
			}
		})

		const pagesArr = []
		urlsArr.forEach((url) => {
			pagesArr.push({
				url,
				screenshots
			})
		})

		const runObjToSave = {
			name,
			pages: pagesArr,
			resolutions
		}
		saveRunAction(runObjToSave)
		// console.log('--> runObjToSave', runObjToSave)
		storage.saveLastRunObj(runObjToSave)
		this.setState({ runIsSaved: true })
	}

	render() {
		const {
			runIsSaved,
			newRunId,
			name,
			urls,
			resolutions
		} = this.state
		// options

		if (runIsSaved) {
			return <Redirect to={`/result/${newRunId}`} />
		}

		return (
			<Layout style={{ padding: 20 }}>
				<PageHeader
					title="New Run"
					style={{
						padding: 0,
						marginBottom: 20
					}}
					// extra={(
					// 	<Button type="default" onClick={this.copySettingsFromLastRun.bind(this)}>
					// 		Copy From Last Run
					// 	</Button>
					// )}
				/>
				<Form layout="vertical">
					<Form.Item label="Run Name">
						<Input
							onChange={(e) => { this.setState({ name: e.target.value }) }}
							value={name}
						/>
					</Form.Item>
					<Form.Item label="URLs">
						<Input.TextArea
							placeholder="One url each line"
							rows={6}
							onChange={(e) => { this.setState({ urls: e.target.value }) }}
							value={urls}
						/>
					</Form.Item>
					<Form.Item label="Screen Sizes">
						<Button.Group style={{ width: '100%', justifyItems: 'space-between' }}>
							<Button
								style={resolutionButtonStyle}
								type={resolutions.desktop ? 'primary' : 'default'}
								onClick={() => { this.handleResolutionOptionChange('desktop') }}
							>
								<Icon type="laptop" style={resolutionButtonIconStyle} />
								<br />
								<b>Desktop</b>
								<br />
								1440px
							</Button>
							<Button
								style={resolutionButtonStyle}
								type={resolutions.tabletLandscape ? 'primary' : 'default'}
								onClick={() => { this.handleResolutionOptionChange('tabletLandscape') }}
							>
								<Icon
									type="tablet"
									style={{ ...resolutionButtonIconStyle, transform: 'rotate(90deg)' }}
								/>
								<br />
								<b>Tablet Landscape</b>
								<br />
								1024px
							</Button>
							<Button
								style={resolutionButtonStyle}
								type={resolutions.tabletPortrait ? 'primary' : 'default'}
								onClick={() => { this.handleResolutionOptionChange('tabletPortrait') }}
							>
								<Icon type="tablet" style={resolutionButtonIconStyle} />
								<br />
								<b>Tablet Portrait</b>
								<br />
								768px
							</Button>
							<Button
								style={resolutionButtonStyle}
								type={resolutions.mobile ? 'primary' : 'default'}
								onClick={() => { this.handleResolutionOptionChange('mobile') }}
							>
								<Icon type="mobile" style={resolutionButtonIconStyle} />
								<br />
								<b>Mobile</b>
								<br />
								350px
							</Button>
						</Button.Group>
					</Form.Item>
					{/* <Form.Item label="Other Options">
						<Checkbox onChange={() => { this.handleOptionsChange('meta') }} checked={options.meta}>
							<b>Page Meta Tags</b>
							<i>(Page Title, Meta Description, Keywords)</i>
						</Checkbox>
						<br />
						<Checkbox onChange={() => { this.handleOptionsChange('og') }} checked={options.og}>
							<b>OG Tags</b>
							<i>(Share Title, Message, Image)</i>
						</Checkbox>
						<br />
						<Checkbox onChange={() => { this.handleOptionsChange('resource') }} checked={options.resource}>
							<b>Resources Analysis</b>
							<i>(Resources Count and Size Breakdown)</i>
						</Checkbox>
					</Form.Item> */}
					<Form.Item>
						<Button
							type="primary"
							size="large"
							icon="caret-right"
							onClick={this.handleSubmit.bind(this)}
						>
							Start Run
						</Button>
					</Form.Item>
					{/* <pre>{JSON.stringify(this.state, null, 4)}</pre> */}
				</Form>
			</Layout>
		)
	}
}

NewRun.propTypes = {
	saveRunAction: PropTypes.func.isRequired,
}

const mapStateToProps = () => ({ })

const mapDispatchToProps = (dispatch) => ({
	saveRunAction: saveRun(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(NewRun)
