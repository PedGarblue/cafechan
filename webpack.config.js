const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const config = require('./src/config/envConfig');

const isDev = config.env === 'development';
module.exports = {
  mode: config.env,
  entry: {
    panel: './app/panel.js',
    chan: './app/chan.js',
  },
  output: {
    path: path.resolve(__dirname, 'public/bundles/'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: ['node_modules'],
    alias: {
      vue$: isDev ? 'vue/dist/vue.js' : 'vue/dist/vue.min.js',
      '@': path.resolve(__dirname, 'app'),
    },
  },
  plugins: [new VueLoaderPlugin()],
};
