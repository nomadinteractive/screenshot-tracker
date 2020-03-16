import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Darkmode from 'darkmode-js'

import reduxStore from './store'
import Routes from './routes'
import ElectronListeners from './electron_listeners'

import 'react-image-lightbox/style.css'
import './styles/app.global.scss'

new Darkmode({
	label: '🌓'
}).showWidget()

const App = () => (
	<Provider store={reduxStore}>
		<Routes />
		<ElectronListeners />
	</Provider>
)

render(<App />, document.getElementById('app'))

if (module.hot) {
	module.hot.accept('./routes', () => {
		require('./routes') // eslint-disable-line	
		render(<App />, document.getElementById('app'))
	})
}
