import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Icon } from 'antd'

const { Header, Sider, Content } = Layout

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: false,
		}
	}

	toggle = () => {
		const { collapsed } = this.state
		this.setState({
			collapsed: !collapsed,
		})
	}

	render() {
		const { children } = this.props
		const { collapsed } = this.state
		return (
			<Layout style={{ height: '100%' }}>
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					style={{
						paddingTop: 20
					}}
				>
					<div className="logo" />
					<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
						<Menu.Item key="1">
							<Icon type="user" />
							<span>nav 1</span>
						</Menu.Item>
						<Menu.Item key="2">
							<Icon type="video-camera" />
							<span>nav 2</span>
						</Menu.Item>
						<Menu.Item key="3">
							<Icon type="upload" />
							<span>nav 3</span>
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout>
					<Header style={{ background: '#fff', padding: 0 }}>
						<Icon
							type={collapsed ? 'menu-unfold' : 'menu-fold'}
							onClick={this.toggle}
							style={{
								paddingLeft: 20,
								paddingRight: 20,
							}}
						/>
					</Header>
					<Content
						style={{
							margin: '24px 16px',
							padding: 24,
							background: '#fff',
							minHeight: 280,
						}}
					>
						{children}
					</Content>
				</Layout>
			</Layout>
		)
	}
}

App.propTypes = {
	children: PropTypes.node.isRequired
}

export default App
