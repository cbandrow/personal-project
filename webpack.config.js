const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: '#source-map',
  context: __dirname,
  entry: {
     index: [
       './app',
       './app/index.js',
       'webpack-hot-middleware/client',
       'webpack/hot/dev-server'
     ],
    //  components: [
    //    './app/components/ImageHolder/ImageHolder.js',
    //    './app/components/ImageImport/ImageImport.js',
    //    './app/components/App.js',
    //    'webpack-hot-middleware/client',
    //    'webpack/hot/dev-server'
    //  ],
    //  helpers: [
    //    './app/components/helpers/HelperCleaner.js',
    //    'webpack-hot-middleware/client',
    //    'webpack/hot/dev-server'
    //  ]
   },
  devtool: 'source-map',
  target: 'web',

  output: {
     path: path.join(__dirname, 'app'),
     filename: 'bundle.js',
     publicPath: 'http://localhost:3000/app/',
   },

  plugins: [
     new webpack.HotModuleReplacementPlugin()
   ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.css']
   },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot-loader', 'babel-loader?presets[]=react,presets[]=es2015'],
      },
    ]
  }
};
