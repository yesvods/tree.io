'use strict';

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'ES678-boilderplate',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  },
  devtool: 'source-map',
};