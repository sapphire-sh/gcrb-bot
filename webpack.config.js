const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const config = require(process.env.TRAVIS === 'true' ? './config.sample' : './config');

module.exports = {
	'entry': './src/index.ts',
	'output': {
		'path': path.resolve(__dirname, './dist'),
		'filename': 'main.js',
	},
	'module': {
		'rules': [
			{
				'test': /\.ts$/,
				'use': 'ts-loader',
			},
			{
				'test': /\.txt$/,
				'loader': 'list-loader',
			},
		],
	},
	'plugins': [
		new webpack.DefinePlugin({
			'__config': JSON.stringify(config),
		}),
	],
	'target': 'node',
	'externals': [
		nodeExternals(),
	],
	'resolve': {
		'extensions': [
			'.ts',
			'.tsx',
			'.js',
			'.json',
		],
	},
	'mode': process.env.NODE_ENV === 'dev' ? 'development' : 'production',
};
