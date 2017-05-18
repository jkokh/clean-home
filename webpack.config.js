const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const isProd = process.env.NODE_ENV  === 'production';

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;
const cssDev = ['style-loader', 'css-loader?sourceMap', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: ['css-loader', 'sass-loader'],
    publicPath: "./dist"
});
const cssConfig = isProd ? cssProd : cssDev;

module.exports = {
    entry: {
        app: './src/js/app.js',
        bootstrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        //publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.sass|\.css|\.scss/,
                use: cssConfig
            },
            { test: /\.(woff2?|svg)$/, loader: require.resolve('url-loader') + '?limit=10000&name=fonts/[name].[ext]&publicPath=../' },
            { test: /\.(ttf|eot)$/, loader: require.resolve('file-loader') + '?name=fonts/[name].[ext]&publicPath=../' }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        port: 3000,
        stats: 'errors-only',
        open: true,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Project',
            minify: {
                //collapseWhitespace: true
            },
            hash: true,
            template: './src/index.html'
        }),
        new ExtractTextPlugin({
            filename: "./css/[name].css",
            disable: !isProd,
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};
