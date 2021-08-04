'use strict'

const fs = require('fs')
const path = require('path')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())

function resolveApp(relativePath) {
	return path.resolve(appDirectory, relativePath)
}

module.exports = {
	entry: {
		main: [
			'idempotent-babel-polyfill',
			'url-polyfill',
			'whatwg-fetch',
			'mutation-observer',
			'intersection-observer',
			resolveApp('src/js/polyfills/customEvent().js'),
			resolveApp('src/js/polyfills/replaceWith().js'),
			resolveApp('src/js/polyfills/prepend().js'),
			resolveApp('src/js/polyfills/remove().js'),
			resolveApp('src/js/polyfills/forEach().js'),
			'./src/js/index.js',
		],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
							plugins: () => [autoprefixer()],
						},
					},
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'main.css',
		}),
	],
}
