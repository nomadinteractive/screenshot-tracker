import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Layout, Menu, Icon } from 'antd'

import { listRuns } from './actions'

const { Sider, Content } = Layout

class AppLayout extends Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: true,
		}
	}

	componentDidMount() {
		const { listRunsAction } = this.props
		listRunsAction()
	}

	toggle = () => {
		const { collapsed } = this.state
		this.setState({
			collapsed: !collapsed,
		})
	}

	render() {
		const { children, style, runs } = this.props
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
							<Link to="/new">
								<Icon type="play-circle" />
								<span>New Run</span>
							</Link>
						</Menu.Item>
						<Menu.SubMenu
							key="runs"
							title={(
								<span>
									<Icon type="clock-circle" />
									<span>Test Runs</span>
								</span>
							)}
						>
							{runs && runs.map((run) => (
								<Menu.Item key={run.id}>
									<Link to={`/result/${run.id}`}>
										{run.name}
									</Link>
								</Menu.Item>
							))}
						</Menu.SubMenu>
					</Menu>
				</Sider>
				<Layout>
					<Content
						style={{
							background: '#fff',
							overflow: 'scroll',
							height: '100vh',
							...style
						}}
					>
						{children}
					</Content>
				</Layout>
			</Layout>
		)
	}
}

AppLayout.defaultProps = {
	style: {}
}

AppLayout.propTypes = {
	runs: PropTypes.array.isRequired, // eslint-disable-line
	listRunsAction: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	style: PropTypes.object // eslint-disable-line react/forbid-prop-types
}

const mapStateToProps = (state) => ({
	runs: state.runs
})

const mapDispatchToProps = (dispatch) => ({
	listRunsAction: listRuns(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout)
