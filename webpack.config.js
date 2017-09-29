const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        index: './components/index'
    },
    resolve: {
        extensions: [ '.js', '.html' ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js',
        chunkFilename: "[name].[id].js"
    },
    devtool: '#inline-source-map',
    devServer: {
        contentBase: './public',
        hot: true,
        overlay: true,
        inline: true,
        open: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    module: {
        loaders: [{
            test: /\.(html|js)$/,
            exclude: [/node_modules/, "/node_modules"],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'es2017'],
                    plugins:
                        [require('babel-plugin-syntax-dynamic-import'), 'transform-runtime']

                }
            }
        }, {
            test: /\.html$/,
            exclude: /node_modules/,
            use: {
                loader: 'svelte-loader',
                options: {
                    format: 'es'
                }
            }
        },{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader", options: {
                    sourceMap: true
                }
            }, {
                loader: "sass-loader", options: {
                    sourceMap: true
                }
            }]
        }, {
            test: /\.glsl$/,
            use: [{loader: 'raw-loader'}]
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=100000000&mimetype=application/font-woff"
        },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }]
    }
};

