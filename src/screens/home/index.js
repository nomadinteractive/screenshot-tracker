// Libs
import React, { Component } from 'react'
// Styles
// Layouts
import Layout from '../../layouts/app'
// Components
import Path from '../../components/home/path'
import HelloWorld from '../../components/home/hello_world'
import styles from './home.scss'

/**
 * Home
 *
 * @class Home
 * @extends {Component}
 */
class Home extends Component {
	render() {
		return (
			<Layout>
				<div className={styles.home}>
					<Path />
					<HelloWorld />
				</div>
			</Layout>
		)
	}
}

export default Home
