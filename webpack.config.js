const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const CopyWebpackPlugin = require('copy-webpack-plugin');
 
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/public',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  plugins: [
        new HtmlWebpackPlugin({
          template: 'src/index.html',
          inject: false,
        }),
        /*new CopyWebpackPlugin({
            patterns: [
                { from: 'public' }
            ]
        })*/
    ]
};