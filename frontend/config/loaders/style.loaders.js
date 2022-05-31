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
            localIdentName: '[local]_[hash:base64:3]',
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
