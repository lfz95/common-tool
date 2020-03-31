var webpack = require("webpack");
var WebpackMd5Hash = require('webpack-md5-hash');
var path = require('path');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    outputDir: path.resolve(__dirname, 'auth-web-h5'),
    publicPath: './',
    // 增量打包
    configureWebpack: () => {
        if (process.env.NODE_ENV === 'production') {
            return {
                output: {
                    // path: path.resolve(__dirname, 'auth-web-h5'),
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
                    },
                    minimizer: [
                        new UglifyJsPlugin({
                            uglifyOptions: {
                                compress: {
                                    // warnings: false,
                                    drop_console: false, //console
                                    drop_debugger: false,
                                    pure_funcs: ['console.log'] //移除console
                                }
                            }
                        })
                    ]
                },
                plugins: [
                    // new ExtractTextPlugin("[name].[contenthash:8].css"),
                    new MiniCssExtractPlugin({
                        filename: 'css/[name].[contenthash:8].css',
                        // chunkFilename: 'css/[contenthash:8].css' // use contenthash *
                    }),
                    new webpack.HashedModuleIdsPlugin(),
                    new WebpackMd5Hash()
                ]
            };
        }
    },
    // 本地代理
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/d-H5': {
                target: 'https://www.vzoom.com',
                // target: 'http://192.168.87.65:9090',

                changeOrigin: true,
                ws: true,
                secure: false,
                pathRewrite: {
                    // '/d-H5': ''
                    '/auth-web': ''
                }
            },
            '/auth-web': {
                // target: 'https://www.vzoom.com',
                target: 'http://192.168.87.65:9090',
                changeOrigin: true,
                ws: true,
                secure: false,
                pathRewrite: {
                    // '/d-H5': ''
                    // '/auth-web': ''
                }
            },
            '/api': {
                target: 'https://www.vzoom.com',
                // target: 'http://192.168.87.65:9090',
                // target: 'http://192.168.87.91:9090',
                changeOrigin: true,
                ws: true,
                secure: false,
                pathRewrite: {
                    '/api': '/d-H5'
                        // '/api': '/auth-web'
                }
            }
        }
    }
}
