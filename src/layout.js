import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Icon } from 'antd'

const { Sider, Content } = Layout

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: true,
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
			<Layout style={{ minHeight: '100vh' }}>
				<Sider
					trigger={(
						<span>
							<Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
							<span>{collapsed ? '' : ' Hide'}</span>
						</span>
					)}
					collapsible
					collapsed={collapsed}
					onCollapse={this.toggle}
					theme="light"
					collapsedWidth={50}
					style={{
						paddingTop: 20,
						boxShadow: '0 2px 8px rgba(0,0,0,0.11)',
						zIndex: 3
					}}
				>
					<Menu
						style={{
							border: 0
						}}
						mode="inline"
						selectable={false}
					>
						<Menu.Item key="new-run">
							<Icon type="play-circle" />
							<span>New Run</span>
						</Menu.Item>
						<Menu.SubMenu
							key="runs"
							title={(
								<span>
									<Icon type="clock-circle" />
									<span>Test Runs</span>
								</span>
							)}
							style={{
								background: '#fcfcfc'
							}}
						>
							<Menu.Item key="r3">Run #3 - 2/11 11:21a</Menu.Item>
							<Menu.Item key="r2">Run #2 - 2/11 9:39a</Menu.Item>
							<Menu.Item key="r1">Run #1 - 2/10 4:21p</Menu.Item>
						</Menu.SubMenu>
					</Menu>
				</Sider>
				<Layout>
					<Content
						style={{
							background: '#fff',
							overflow: 'scroll',
							height: '100vh'
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
