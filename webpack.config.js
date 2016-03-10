const path = require('path');
const webpack = require('webpack');

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
    }, {
      test: /\.css$/,
      loaders: [
          'style?sourceMap',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
      ]
    }]
  },
  postcss: function(webpack) {
    return [
      // process css-next http://cssnext.io
      require("postcss-cssnext")(),
      // add prefixes for older browsers https://github.com/postcss/autoprefixer
      require('autoprefixer')({browsers: ['last 2 versions']}),
      // write any issues to the terminal
      require("postcss-reporter")(),
      // write any issues to the browser 
      require("postcss-browser-reporter")()
    ]
  }
};
