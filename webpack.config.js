const path = require("path");

module.exports = {
  entry: "./tests/test.js",
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'tests'),
  },
  watch: true,
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "tests")
  }
};
