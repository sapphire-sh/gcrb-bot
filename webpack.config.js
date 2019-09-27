const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const rootPath = path.resolve(__dirname);
const srcPath = path.resolve(rootPath, 'src');
const distPath = path.resolve(rootPath, 'dist');

const config = require(process.env.TRAVIS === 'true' ? './config.sample' : './config');

module.exports = {
	'entry': path.resolve(srcPath, 'index.ts'),
	'output': {
		'path': distPath,
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
			'__test': process.env.NODE_ENV === 'test',
			'__config': JSON.stringify(config),
		}),
	],
	'target': 'node',
	'devtool': false,
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
		'alias': {
			'~': srcPath,
		},
	},
	'mode': process.env.NODE_ENV === 'dev' ? 'development' : 'production',
};
