module.exports = {
    test: /\.(png|jp(e*)g|svg|gif)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: 'images/name.[ext]'
            }
        }
    ]
};
