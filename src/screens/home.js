import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
	Result,
	Button,
	Typography,
	Tag,
	// Icon
} from 'antd'
import Layout from '../layout'

const { Title } = Typography

const { shell } = window.require('electron')

class Home extends Component {
	componentDidMount() {
		document.addEventListener('click', (e) => {
			if (
				e.target.tagName === 'A'
				&& e.target.className.startsWith('ext')
				&& e.target.href.startsWith('http')
			) {
				e.preventDefault()
				shell.openExternal(e.target.href)
			}
		})
	}

	render() {
		return (
			<Layout className="pageWithGradientBg">
				<Result
					icon={(
						<img
							src="./appicon_256.png"
							width={128}
							height={128}
							alt="App Icon"
							className="screenshot-tarcker-icon"
						/>
					)}
					title={(
						<Title level={3}>
							Screenshot Tracker
							<Tag style={{ marginLeft: 10 }}>v1.0</Tag>
						</Title>
					)}
					subTitle={(
						<div style={{ marginTop: 30 }}>
							<h3>Let&apos;s get started with a new run.</h3>
							A &ldquo;run&rdquo; is a session of screenshots taken from a list of
							web page urls you provide.
							<br />
							You can create multiple runs and repeat them as many times as you want.
						</div>
					)}
					extra={(
						<Link to="/new">
							<Button
								type="primary"
								size="large"
								icon="caret-right"
							>
								New Run
							</Button>
						</Link>
					)}
				/>
				<div className="support-bar">
					Feel free to send any questions or your feedback with
					{' '}
					{/* eslint-disable-next-line */}
					<a className="ext" href="https://github.com/nomadinteractive/screenshot-tracker/issues/new">
						opening an issue
					</a>
					{' '}
					in
					{' '}
					{/* eslint-disable-next-line */}
					<a className="ext" href="https://github.com/nomadinteractive/screenshot-tracker/issues">
						Github Issues Page
					</a>
				</div>
			</Layout>
		)
	}
}

export default Home
