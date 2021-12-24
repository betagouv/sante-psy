// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const webpack = require('webpack');
const parseArgs = require('minimist');
const printBuildError = require('react-dev-utils/printBuildError');

const args = parseArgs(process.argv.slice(2));
let config;
let apiUrl = args.env?.API_URL;
if (args.env?.PROD) {
  config = require('../config/webpack.production.js');
  apiUrl = apiUrl || '';
} else if (args.env?.PRODANALYSER) {
  config = require('../config/webpack.production.with.bundle.js');
  apiUrl = apiUrl || '';
} else {
  config = require('../config/webpack.dev.js');
  apiUrl = apiUrl || 'http://localhost:8080';
}

console.log('Create build...');
const compiler = webpack(config(`'${apiUrl}'`));
compiler.run((err, stats) => {
  if (err) {
    console.log('Failed to compile.');
    printBuildError(err);
    process.exit(1);
  }
  console.log('Compiled successfully.');
  console.log(stats.toString({ colors: true }));
  if (!args.env || !args.env.PRODANALYSER) {
    process.exit();
  }
});
