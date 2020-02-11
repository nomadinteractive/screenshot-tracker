import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import Home from './screens/home'

const Routes = () => (
	<HashRouter>
		<Switch>
			<Route exact path="/" component={Home} />
		</Switch>
	</HashRouter>
)

export default hot(Routes)
