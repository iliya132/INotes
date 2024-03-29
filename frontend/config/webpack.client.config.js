/* eslint-disable no-undef */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const styleLoaders = require('./loaders/style.loaders.js');
const assetsLoaders = require('./loaders/assets.loaders.js');
const tsLoaders = require('./loaders/typescript.loaders.js');
const path = require('path');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const assetsSize = 1.5 * 1024 * 1024;

module.exports = {
    mode: isDev ? 'development' : 'production',
    performance: {
        maxEntrypointSize: assetsSize,
        maxAssetSize: assetsSize
    },
    entry: {
        main: {
            import: './src/index.tsx',
            dependOn: 'shared'
        },
        shared: ['react', './src/Misc/colors.scss', './src/Misc/fonts.scss', './src/Misc/root.scss', './static/assets/lock.svg']
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
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        runtimeChunk: 'single'
    },
    plugins: [
        new DefinePlugin({ PRODUCTION: JSON.stringify(isDev ? false : true) }),
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
                    filter: async (filePath) => {
                        if(filePath.includes(".ttf")){
                            return false;
                        }
                        return true;
                    }
                },
                {
                    from: path.resolve(__dirname, '../manifest.json'),
                    to: path.resolve(__dirname, '../dist'),
                },
                {
                    from: path.resolve(__dirname, '../src/server/server.js'),
                    to: path.resolve(__dirname, '../dist/server.js')
                },
                {
                    from: path.resolve(__dirname, '../static/yandex_ce9c0611e641b63b.html'),
                    to: path.resolve(__dirname, '../dist/yandex_ce9c0611e641b63b.html')
                },
                {
                    from: path.resolve(__dirname, '../static/500.html'),
                    to: path.resolve(__dirname, '../dist/500.html')
                },
                {
                    from: path.resolve(__dirname, '../static/502.html'),
                    to: path.resolve(__dirname, '../dist/502.html')
                },
                {
                    from: path.resolve(__dirname, '../static/404.html'),
                    to: path.resolve(__dirname, '../dist/404.html')
                },
                {
                    from: path.resolve(__dirname, '../static/sitemap.xml'),
                    to: path.resolve(__dirname, '../dist/sitemap.xml')
                },
                {
                    from: path.resolve(__dirname, '../static/robots.txt'),
                    to: path.resolve(__dirname, '../dist/robots.txt')
                },
            ],
        }),
    ],
    module: {
        rules: [tsLoaders, styleLoaders.sass, styleLoaders.css, assetsLoaders.resource],
    },
};
