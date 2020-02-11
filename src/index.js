// Libs
import React from 'react'
import { render } from 'react-dom'
// Root
import Root from './routes/root'
// Styles
import './themes/App.global.scss'

const App = Root
render(<App />, document.getElementById('app'))

if (module.hot) {
	module.hot.accept('./routes/Root', () => {
		require('./routes/root') // eslint-disable-line
		render(<App />, document.getElementById('app'))
	})
}
