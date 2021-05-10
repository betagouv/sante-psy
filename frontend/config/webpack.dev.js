const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const defaultConfig = require('./webpack.base.js');
const baseConfig = defaultConfig();

module.exports = (apiUrl) => Object.assign({}, baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.cssmodule\.scss$/,
          use: [
            'style-loader', 
            {
              loader: 'css-loader',
              options: {
                modules: {
                    localIdentName: '[path][name]__[local]'
                },		
                importLoaders: 1
              }
            },
            'sass-loader'
          ]
        },
      ].concat(baseConfig.module.rules)
    },
    plugins: baseConfig.plugins.concat([
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({
        __API__: apiUrl ? apiUrl : '"http://localhost:8080/api"'
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
      }),
    ]),
    performance: {
      hints: false
    }
});
