import React from 'react'
import { render } from 'react-dom'
import Routes from './routes'
import './themes/App.global.scss'

const App = Routes
render(<App />, document.getElementById('app'))

if (module.hot) {
	module.hot.accept('./routes', () => {
		require('./routes') // eslint-disable-line	
		render(<App />, document.getElementById('app'))
	})
}
