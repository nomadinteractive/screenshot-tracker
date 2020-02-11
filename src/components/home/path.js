// Libs
import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
// Styles
import styles from './Path.scss'

/**
 * Path
 *
 * @class Path
 * @extends {Component}
 */
class Path extends Component {
	render() {
		return (
			<Breadcrumb className={styles.path}>
				<Breadcrumb.Item>Home</Breadcrumb.Item>
				<Breadcrumb.Item>List</Breadcrumb.Item>
				<Breadcrumb.Item>App</Breadcrumb.Item>
			</Breadcrumb>
		)
	}
}

export default Path
