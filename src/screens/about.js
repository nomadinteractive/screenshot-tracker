/* eslint-disable max-len */

import React, { Component } from 'react'
import {
	Row,
	Col,
	Typography,
	Tag,
} from 'antd'

import Layout from '../layout'

const { Title } = Typography

const { shell } = window.require('electron')

class About extends Component {
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
			<Layout className="aboutPage pageWithGradientBg">
				<div className="appicon">
					<img
						src="./appicon_256.png"
						width={128}
						height={128}
						alt="App Icon"
						className="screenshot-tarcker-icon"
					/>
				</div>
				<Title level={2}>
					Screenshot Tracker
					<Tag style={{ marginLeft: 10 }}>v1.0</Tag>
				</Title>
				<Title level={4}>
					by
					{' '}
					<a className="ext" href="https://nomadinteractive.co">Nomad Interactive</a>
					, 2020
				</Title>

				<Row className="credits">
					<Col span={12} offset={6} className="wrapper-col">
						<h4>Credits</h4>
						<p>
							We used many open source tools in this tools build. The honorable mentions below. See
							{' '}
							<a className="ext" href="https://github.com/nomadinteractive/screenshot-tracker/blob/master/package.json">
								package.json in Github
							</a>
							{' '}
							for full list of open source packages used.
						</p>
						<Row>
							<Col span={8}>
								<ul>
									<li><a className="ext" href="https://npmjs.com/package/babel">babel</a></li>
									<li><a className="ext" href="https://npmjs.com/package/eslint">eslint</a></li>
									<li><a className="ext" href="https://npmjs.com/package/webpack">webpack</a></li>
									<li><a className="ext" href="https://npmjs.com/package/react">react</a></li>
									<li><a className="ext" href="https://npmjs.com/package/redux">redux</a></li>
									<li><a className="ext" href="https://npmjs.com/package/electron">electron</a></li>
									<li><a className="ext" href="https://npmjs.com/package/electron-builder">electron-builder</a></li>
								</ul>
							</Col>
							<Col span={8}>
								<ul>
									<li><a className="ext" href="https://npmjs.com/package/pupeteer">pupeteer</a></li>
									<li><a className="ext" href="https://npmjs.com/package/commitlint">commitlint</a></li>
									<li><a className="ext" href="https://npmjs.com/package/antd">antd</a></li>
									<li><a className="ext" href="https://npmjs.com/package/react-image-lightbox">react-image-lightbox</a></li>
									<li><a className="ext" href="https://npmjs.com/package/darkmode-js">darkmode-js</a></li>
									<li><a className="ext" href="https://npmjs.com/package/moment">moment</a></li>
								</ul>
							</Col>
						</Row>
					</Col>
				</Row>
			</Layout>
		)
	}
}

export default About
