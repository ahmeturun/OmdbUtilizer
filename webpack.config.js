var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
module.exports = {
	entry: {
		index: './src/scripts/index.js',
		search: './src/scripts/search.js'
	},
	output: {
		filename: 'scripts/[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module:{
		rules:[
			{
				test:/\.(scss)$/,
				use:[
					{
						loader: 'style-loader', options:{
							sourceMap: true
						}
					},
					{
						loader: 'css-loader', options:{
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
						plugins: function () {
							return [
							require('autoprefixer')
							];
						}
						}
					},
					{
						loader: 'sass-loader', options:{
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
				use: [{
				  loader: 'file-loader',
				  options: {
					  outputPath:'fonts/'
				  }
				}]
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			title: 'OMDB API Utilizer',
			template:'./src/views/index.html',
			filename:'./views/index.html',
			chunks: ['index']
		}),
		new HtmlWebpackPlugin({
			hash:true,
			title: 'Search Results',
			template: './src/views/search.html',
			filename: './views/search.html',
			chunks: ['search']
		}),
		new webpack.ProvidePlugin({
			'$': 'jquery',
		})
	],
	optimization: {
		minimize: true
	},
	watch: false
};