import React, { Component } from 'react'
import Layout from '../../layout'
import Path from '../../components/home/path'
import HelloWorld from '../../components/home/hello_world'

class Home extends Component {
	render() {
		return (
			<Layout>
				<div>
					<Path />
					<HelloWorld />
				</div>
			</Layout>
		)
	}
}

export default Home
