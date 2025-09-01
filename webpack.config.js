const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
  return {
    entry: "./src/index.ts",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "build"),
      clean: true
    },
    mode: "development",
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ },
        { test: /\.js$/, loader: "source-map-loader" },
        { test: /\.css$/i, use: ["style-loader", "css-loader"]}
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'My journey with Softgames starts here',
        filename: 'index.html'
      }),
      new CopyPlugin({
        patterns: [
          { from: "src/img/", to: "img/" }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env.MODE': `"${env.MODE}"`,
      }),
      new Dotenv(),
    ],
    target: 'web',
    devServer: {
      devMiddleware: {
        writeToDisk: true,
      }
    }
  }
};