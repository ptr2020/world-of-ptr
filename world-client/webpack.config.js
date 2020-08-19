const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

let mode = "development";

module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      {from: './src/public/index.html', to: 'index.html'},
      {from: './src/public/main.css', to: 'main.css'},
      {from: './src/public/favicon.png', to: 'favicon.png'},
      {from: './src/public/resources', to: 'resources'},
    ]),
    // Pass env variables into javascript
    new webpack.DefinePlugin({
      "WOP_HOST": JSON.stringify(process.env.WOP_HOST),
    }),
  ],
  mode: mode,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    //host: "0.0.0.0",
    port: 8080,
    hot: false,
    inline: false,
    liveReload: false
  }
};
