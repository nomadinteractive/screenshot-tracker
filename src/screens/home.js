import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
	Result,
	Button,
	Icon
} from 'antd'
import Layout from '../layout'

class Home extends Component {
	render() {
		return (
			<Layout>
				<Result
					icon={<Icon type="laptop" />}
					title="Let's get started with a new run."
					subTitle={(
						<div>
							A &ldquo;run&rdquo; is a session of screenshots for list of web page urls provide.
							<br />
							You can create multiple runs and repeat them as many times as you want.
						</div>
					)}
					extra={(
						<Link to="/new">
							<Button type="primary" size="large">New Run</Button>
						</Link>
					)}
				/>
			</Layout>
		)
	}
}

export default Home
