/* eslint-disable no-undef */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const styleLoaders = require('./loaders/style.loaders.js');
const assetsLoaders = require('./loaders/assets.loaders.js');
const tsLoaders = require('./loaders/typescript.loaders.js');
const path = require('path');
const { DefinePlugin } = require('webpack');

const isDev = process.env.NODE_ENV === 'development';
const api = isDev ? "http://localhost:8080/" : "https://www.i-note.online/"

module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: {
        main: ['./src/index.tsx'],
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx', 'json'],
    },
    devServer: {
        port: 3000,
        historyApiFallback: true,
    },
    devtool: isDev ? 'source-map' : false,
    plugins: [
        new DefinePlugin({"process.env.API_URL": JSON.stringify(api)}),
        new HtmlWebpackPlugin({
            template: './static/index.html',
            minify: {
                collapseWhitespace: !isDev,
                removeComments: !isDev,
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../static/assets'),
                    to: path.resolve(__dirname, '../dist'),
                },
                {
                    from: path.resolve(__dirname, '../manifest.json'),
                    to: path.resolve(__dirname, '../dist'),
                },
                {
                    from: path.resolve(__dirname, '../src/server/server.js'),
                    to: path.resolve(__dirname, '../dist/server.js')
                }
            ],
        }),
    ],
    module: {
        rules: [tsLoaders, styleLoaders.sass, styleLoaders.css, assetsLoaders.resource],
    },
};
