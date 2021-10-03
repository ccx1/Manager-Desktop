const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = merge.smart(baseWebpackConfig, {
    mode: 'production',
    output: {
        publicPath: './',
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 4000 // Minimum number of characters
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].css',
            chunkFilename: 'assets/css/[id].css'
        }),
        new CSSSplitWebpackPlugin({
            size: 4000,
            filename: 'assets/css/[name]-[part].[ext]'
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: 10,
                    enforce: true,
                },
                react: {
                    name: 'lib',
                    test: module => /react|redux/.test(module.context),
                    chunks: 'initial',
                    priority: 11,
                    enforce: true,
                },
                antd: {
                    name: 'ui',
                    test: (module) => {
                        return /ant/.test(module.context);
                    },
                    chunks: 'initial',
                    priority: 11,
                    enforce: true,
                },
                moment: {
                    name: 'moment',
                    test: (module) => {
                        return /moment/.test(module.context);
                    },
                    chunks: 'initial',
                    priority: 13,
                    enforce: true,
                },
            },
            // chunks: 'all',
            // name: 'vendor'
        },
        runtimeChunk: {
            name: 'runtime'
        }
    }
});
