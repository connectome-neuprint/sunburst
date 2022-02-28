const path = require("path");

module.exports = {
  entry: "./tests/test.js",
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    static: path.join(__dirname, 'tests'),
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "tests")
  }
};
