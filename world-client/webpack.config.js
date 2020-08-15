const path = require('path');
//const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

let mode = "development";

module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'build')
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
      {from: './src/public/img', to: 'img'},
    ]),
    // Pass env variables into javascript
    //new webpack.DefinePlugin({
    //  "someVar": JSON.stringify(process.env.someVar)
    //}),
  ],
  mode: mode,
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    //host: "0.0.0.0",
    port: 8080,
    hot: false,
    inline: false,
    liveReload: false
    //inline: false,
    /*
    proxy: [{
      path: `/api/*`,
      target: 'http://localhost:8082'
    }, {
      path: `/ext/*`,
      target: 'http://localhost:8082'
    }],
    */
  }
};
