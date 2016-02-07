var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.es', '.json']
  },
  output: {
    path: path.join(__dirname, 'dist/static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.(jsx|es)$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src')
    }]
  }
};
