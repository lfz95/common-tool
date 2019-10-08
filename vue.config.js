var webpack = require("webpack");
var WebpackMd5Hash = require('webpack-md5-hash');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    configureWebpack: () => {
        if (process.env.NODE_ENV === 'production') {
            return {
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    filename: "[name].[chunkhash:8].js"
                },
                optimization: {
                    runtimeChunk: {
                        name: "manifest"
                    },
                    splitChunks: {
                        cacheGroups: {
                            commons: {
                                test: /[\\/]node_modules[\\/]/,
                                name: "vendor",
                                chunks: "all"
                            }
                        }
                    }
                },
                plugins: [
                    new ExtractTextPlugin("[name].[contenthash:8].css"),
                    new webpack.HashedModuleIdsPlugin(),
                    new WebpackMd5Hash()
                ]
            };
        }
    },
    devServer: {
        proxy: {
            '/vz-island': {
                target: 'http://localhost:3001',
                pathRewrite: { '^/vz-island': '/vz-island' },
                changeOrigin: true
            }
        }
    }
}
