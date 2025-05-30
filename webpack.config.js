const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');


module.exports = {
  target: 'web',

  entry: './src/main.jsx', // Entry is your main.jsx file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Cleans old build files before a new build
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Match both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/, // Support CSS imports
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Allow imports without specifying extensions
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 9090,
    open: true,
    hot: true,
    historyApiFallback: true // added this to fix reloading issue
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>GPBadger</title>
          <link rel="icon" type="image/x-icon" href="/favicon.ico?">
        </head>
        <body>
          <div id="root"></div>
        </body>
        </html>
      `,
      filename: 'index.html',
    }),
  ],
};
