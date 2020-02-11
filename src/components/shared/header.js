// Libs
import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
// Styles
import styles from './Header.scss'

/**
 * Header
 *
 * @class Header
 * @extends {Component}
 */
class Header extends Component {
	render() {
		return (
			<Layout.Header className={styles.header}>
				<div className={styles.logo} />
				<Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={['2']}
					className={styles.menu}
				>
					<Menu.Item key="1">nav 1</Menu.Item>
					<Menu.Item key="2">nav 2</Menu.Item>
					<Menu.Item key="3">nav 3</Menu.Item>
				</Menu>
			</Layout.Header>
		)
	}
}

export default Header
