const { resolve } = require("path");

module.exports = {
  entry: ["babel-polyfill", "./app/index.js"],
  mode: "development",
  output: {
    path: resolve(__dirname, "public"),
    filename: "bundle.js"
  },
  devtool: "source-maps",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
