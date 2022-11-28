const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const rootPath = path.resolve(__dirname, "..");

const getConfig = () => ({
  context: rootPath,
  entry: { main: path.resolve(rootPath, "src/index.js") },
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(rootPath, "dist"),
    publicPath: "/",
  },
  optimization: {
    moduleIds: "deterministic",
    removeEmptyChunks: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks(chunk) {
            return chunk.name === "main";
          },
        },
      },
    },
    runtimeChunk: { name: "manifest" },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: ["babel-loader"],
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        rules: [
          {
            use: ["style-loader", "css-loader", "sass-loader"],
          },
        ],
      },
      {
        test: /\.(jpg|png|ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        rules: [{ use: ["file-loader"] }],
      },
      {
        test: /\.md$/,
        use: [{ loader: "html-loader" }, { loader: "markdown-loader" }],
      },
    ],
  },
  resolve: {
    alias: {
      components: path.resolve("src/components/"),
      services: path.resolve("src/services/"),
      stores: path.resolve("src/stores/"),
      src: path.resolve("src/"),
    },
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      filename: path.resolve(rootPath, "dist/index.html"),
      template: path.resolve(rootPath, "index.html"),
    }),
    new CompressionPlugin({ test: /\.js(\?.*)?$/i }),
    new CopyPlugin({
      patterns: ["assets"],
    }),
  ],
  performance: {
    hints: "warning",
    // Calculates sizes of gziped bundles.
    assetFilter(assetFilename) {
      return assetFilename.endsWith(".js.gz");
    },
  },
});

module.exports = getConfig;
