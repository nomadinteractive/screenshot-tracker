import React, { Component } from 'react'
import { Breadcrumb } from 'antd'

class Path extends Component {
	render() {
		return (
			<Breadcrumb>
				<Breadcrumb.Item>Home</Breadcrumb.Item>
				<Breadcrumb.Item>List</Breadcrumb.Item>
				<Breadcrumb.Item>App</Breadcrumb.Item>
			</Breadcrumb>
		)
	}
}

export default Path
