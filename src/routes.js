import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'

import Home from './screens/home'
import NewRun from './screens/new_run'
import RunResult from './screens/run_result'
import About from './screens/about'

const Routes = () => (
	<HashRouter>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/new" component={NewRun} />
			<Route exact path="/result/:runId" component={RunResult} />
			<Route exact path="/about" component={About} />
		</Switch>
	</HashRouter>
)

export default hot(Routes)
