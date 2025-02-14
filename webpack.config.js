const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');  // Import the plugin

module.exports = {
  entry: './src/main.js',  // Path to your main JavaScript file
  output: {
    filename: 'bundle.js',  // Output file for the bundled code
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  mode: 'development',  // Set to 'production' when you're ready to deploy
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // If you're using ES6+ code
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'), // Use `static` instead of `contentBase` for Webpack 5

    compress: true,                             
    port: 9090,                                // Port to run the dev server on
    open: true,                                // Automatically open the browser
    hot: true,                                 // Enable hot module replacement
    historyApiFallback: true,                  
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // path to HTML template
    }),
  ],
};
