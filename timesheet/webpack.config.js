const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: './main.jsx',
    output: {
        path: __dirname + '/static/js',
        filename: 'bundle.js', //this is the default name, so you can skip it
        //at this directory our bundle file will be available
        publicPath: 'http://localhost/static/js'
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
}

