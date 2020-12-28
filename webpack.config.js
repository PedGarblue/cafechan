const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { DefinePlugin } = require('webpack');
const { pick } = require('lodash');
const config = require('./src/config/envConfig');

const isDev = config.env === 'development';
const envClient = pick(config, ['site_url', 'site_name']);

module.exports = {
  mode: config.env,
  entry: {
    panel: {
      import: './app/panel.js',
      dependOn: 'shared',
    },
    chan: {
      import: './app/chan.js',
      dependOn: 'shared',
    },
    shared: 'moment',
  },
  output: {
    path: path.resolve(__dirname, 'public/bundles/'),
    filename: `[name].bundle${isDev ? '.dev' : ''}.js`,
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
      '@': path.resolve(__dirname, './'),
    },
  },
  plugins: [new VueLoaderPlugin(), new DefinePlugin({ 'process.env': JSON.stringify(envClient) })],
};
