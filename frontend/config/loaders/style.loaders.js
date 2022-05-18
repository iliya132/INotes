const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    sass: {
        test: /\.s?[ca]ss$/,
        exclude: /node_modules/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
        ]
    },
    css: {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
    }
}
