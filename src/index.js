import React from 'react'
import { render } from 'react-dom'
import Root from './routes'
import './themes/App.global.scss'

const App = Root
render(<App />, document.getElementById('app'))

if (module.hot) {
	module.hot.accept('./routes', () => {
		require('./routes') // eslint-disable-line
		render(<App />, document.getElementById('app'))
	})
}
