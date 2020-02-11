// Libs
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
// Styles
// Components
import Header from '../components/shared/header'
import Footer from '../components/shared/footer'
import styles from './App.scss'

/**
* App
*
* @class App
* @extends {Component}
*/
class App extends Component {
	render() {
		const { children } = this.props
		return (
			<Layout>
				<Header />
				<Layout className={styles.app}>
					<Layout.Content>{children}</Layout.Content>
				</Layout>
				<Footer />
			</Layout>
		)
	}
}

App.propTypes = {
	children: PropTypes.node.isRequired
}

export default App
