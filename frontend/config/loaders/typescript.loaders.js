module.exports = {
    test: /\.tsx?$/,
    exclude: [/node_modules/, /.*.test.tsx?/],
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        },
    },
};
