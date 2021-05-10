const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const defaultConfig = require('./webpack.production.js');

module.exports = (apiUrl) => {
  const config = defaultConfig(apiUrl);
  return Object.assign({}, config, {
    plugins: config.plugins.concat([
      new BundleAnalyzerPlugin()
    ])
  });
};
