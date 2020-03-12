import { spawn } from 'child_process'
import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import AntdScssThemePlugin from 'antd-scss-theme-plugin'
import BabiliPlugin from 'babili-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import BrotliPlugin from 'brotli-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

const host = '0.0.0.0'
const port = 3100
const src = path.resolve(__dirname, 'src')

const isDev = process.env.NODE_ENV === 'development'

const cssModuleLoader = {
	loader: 'css-loader',
	options: {
		importLoaders: 2,
		modules: true,
		camelCase: true,
		sourceMap: isDev,
		localIdentName: isDev
			? '[folder]__[name]__[local]__[hash:base64:5]'
			: '[hash:base64:5]'
	}
}

const cssLoader = {
	loader: 'css-loader',
	options: {
		importLoaders: 2,
		modules: false,
		sourceMap: isDev
	}
}

const postCssLoader = {
	loader: 'postcss-loader',
	options: {
		ident: 'postcss',
		sourceMap: isDev,
		plugins: () => [postcssPresetEnv()]
	}
}

const sassLoader = {
	loader: 'sass-loader',
	options: {
		sourceMap: isDev
	}
}

const lessLoader = AntdScssThemePlugin.themify({
	loader: 'less-loader',
	options: {
		sourceMap: isDev,
		javascriptEnabled: true
	}
})

const sassHotLoader = {
	loader: 'css-hot-loader'
}

const sassHotModuleLoader = {
	loader: 'css-hot-loader',
	options: {
		cssModule: true
	}
}

const assetsLoader = {
	loader: 'file-loader?name=[name]__[hash:base64:5].[ext]'
}

const babelLoader = [
	{
		loader: 'thread-loader'
	},
	{
		loader: 'babel-loader',
		options: {
			cacheDirectory: true
		}
	}
]

const babelDevLoader = babelLoader.concat([
	'react-hot-loader/webpack',
	'eslint-loader'
])

const config = {
	target: 'electron-renderer',
	base: {
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					use: isDev ? babelDevLoader : babelLoader,
					exclude: /node_modules/
				},
				{
					test: /\.(jpe?g|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
					use: [assetsLoader]
				},
				{
					test: /\.global|vars\.scss$/,
					use: [
						sassHotLoader,
						MiniCssExtractPlugin.loader,
						cssLoader,
						postCssLoader,
						sassLoader
					]
				},
				{
					test: /\.scss$/,
					exclude: /\.global|vars\.scss$/,
					use: [
						sassHotModuleLoader,
						MiniCssExtractPlugin.loader,
						cssModuleLoader,
						postCssLoader,
						sassLoader
					]
				},
				{
					test: /\.(less|css)$/,
					use: [
						sassHotLoader,
						MiniCssExtractPlugin.loader,
						cssLoader,
						lessLoader
					]
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				NODE_ENV: process.env.NODE_ENV
			}),
			new AntdScssThemePlugin(
				path.join(__dirname, 'src', 'styles/ant.vars.scss')
			),
			new MiniCssExtractPlugin({
				filename: isDev ? '[name].css' : '[name].[chunkhash].css',
				chunkFilename: isDev ? '[id].css' : '[name].[chunkhash].css',
				reload: false
			}),
			new HtmlWebpackPlugin({
				template: 'public/index.html',
				minify: {
					collapseWhitespace: !isDev
				}
			})
		]
	},
	development: {
		mode: 'development',
		plugins: [new webpack.HotModuleReplacementPlugin()],
		entry: [
			'react-hot-loader/patch',
			'webpack/hot/only-dev-server',
			src
		],
		devtool: 'cheap-module-source-map',
		cache: true,
		devServer: {
			host,
			port,
			hot: true,
			contentBase: 'public',
			compress: true,
			inline: true,
			lazy: false,
			// stats: 'errors-only',
			historyApiFallback: {
				verbose: true,
				disableDotRule: false
			},
			headers: { 'Access-Control-Allow-Origin': '*' },
			stats: {
				colors: true,
				chunks: false,
				children: false
			},
			before() {
				spawn('electron', ['.'], {
					shell: true,
					env: process.env,
					stdio: 'inherit'
				})
					.on('close', () => process.exit(0))
					.on('error', (spawnError) => console.error(spawnError))
			}
		},
		optimization: {
			namedModules: true
		},
		resolve: {
			extensions: ['.js', '.jsx', '.json'],
			modules: [].concat(src, ['node_modules']),
			alias: {
				'react-dom': '@hot-loader/react-dom'
			}
		}
	},
	production: {
		mode: 'production',
		entry: {
			app: src
		},
		plugins: [
			new BrotliPlugin({
				asset: '[path].br[query]',
				test: /\.(js|css|html|svg)$/,
				threshold: 10240,
				minRatio: 0.8
			})
		],
		output: {
			path: path.join(__dirname, '/dist'),
			filename: '[name].[chunkhash].js'
		},
		optimization: {
			minimizer: [
				new UglifyJsPlugin(),
				new TerserPlugin(),
				new BabiliPlugin(),
				new OptimizeCSSAssetsPlugin()
			],
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all'
					}
				}
			}
		}
	}
}

export default merge(config.base, config[process.env.NODE_ENV])
