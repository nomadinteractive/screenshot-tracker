module.exports = {
	"plugins": ["react"],
	"parser": "babel-eslint",
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"env": {
		"es6": true,
		"browser": true,
		"node": true,
		"mocha": true
	},
	"extends": [
		"@nomadinteractive",
		// "eslint:recommended",
		// "plugin:react/recommended"
	],
	//   "rules": {
	//     "no-console": "off",
	//     "no-undef": "warn",
	//     "no-undefined": "warn",
	//     "no-unused-vars": "warn",
	//     "no-extra-parens": ["error", "all", { "ignoreJSX": "all" }],
	//     "no-constant-condition": "warn",
	//     "react/prop-types": "warn"
	//   },
	"settings": {
		"react": {
			"version": "16"
		}
	}
}
