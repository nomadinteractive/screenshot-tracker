// Libs
import React, { Component } from 'react'
import { Layout } from 'antd'
// Styles
import { IMAGES } from '../../config'
import styles from './Footer.scss'
// Config

/**
 * Footer
 *
 * @class Footer
 * @extends {Component}
 */
class Footer extends Component {
	render() {
		return (
			<Layout.Footer className={styles.footer}>
				<img alt="" className={styles.logo} src={IMAGES.LOGO} />
				electron-react-ant-boilerplate ©2019
			</Layout.Footer>
		)
	}
}

export default Footer
