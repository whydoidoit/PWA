const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        index: './components/index'
    },
    resolve: {
        extensions: ['.js', '.html']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js',
        chunkFilename: "chunk.[id].js",
        publicPath: "http://localhost:8081/"
    },
    externals: {
        "parse5": "parse5",
        "import-export": "imp"
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
    plugins: [
        new webpack.DefinePlugin({
            BROWSER: JSON.stringify(true)
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     children: true,
        //     minChunks: 3
        // }),
        // new UglifyJSPlugin({
        //     sourceMap: true,
        //     uglifyOptions: {ecma: 5, compress: {
        //         unsafe_math: true,
        //         unsafe_proto: true,
        //         unsafe_Func: true,
        //         dead_code: true,
        //         properties: true,
        //         evaluate: true,
        //         conditionals: true,
        //         unused: true,
        //         if_returm: true,
        //         join_vars: true,
        //         cascade: true,
        //         reduce_vars: true,
        //         collapse_vars: true
        //
        //     }}
        // })
    ],
    module: {
        loaders: [{
            test: /\.(html|js)$/,
            exclude: [
                /node_modules\/babel-/m,
                /node_modules\/core-js\//m,
                /node_modules\/regenerator-runtime\//m
            ],
            // exclude: [/node_modules/, "/node_modules"],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ["env", {
                            "useBuiltIns": "usage",
                            "targets": {
                                "browsers": ["last 2 versions"]
                            }
                        }]
                    ],
                    plugins:
                        ['transform-runtime', require('babel-plugin-syntax-dynamic-import')]

                }
            }
        }, {
            test: /\.html$/,
            exclude: /node_modules/,
            use: {
                loader: 'svelte-loader',
                options: {
                    format: 'es',
                    hydratable: true,
                    css: false
                }
            }
        }, {
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

