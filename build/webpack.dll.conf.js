const path = require('path')
const webpack = require('webpack')
const env = require('../config/env.js')
module.exports = {
    entry: {
        vendor: [
            'vue/dist/vue.common.js',
            'vue-router',
            'babel-polyfill',
            'axios'
        ]
    },
    output: {
        path: path.join(__dirname, '../static/js'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '.', '[name]-manifest.json'),
            name: '[name]_library'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': env
        })
    ]
}
