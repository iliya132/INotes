const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    sass: {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    modules: {
                        localIdentName: isDev ? '[local]_[hash:base64:3]' : '[hash:base64:7]',
                    },
                },
            },
            'sass-loader',
        ],
    },
    css: {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
    },
};
