import React from 'react'
import { render } from 'react-dom'

const Hello = () => (<h2>Hello World from React!</h2>)

const App = () => (
	<div>
		<Hello />
	</div>
)

console.log('Did react render?')

render(<App />, document.getElementById('app'))
