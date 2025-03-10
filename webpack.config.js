const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });

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
    host: process.env.HOST,
    port: 9090,
    open: true,
    hot: true,
    historyApiFallback: true, // Ensures React Router works properly
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rate My Badger</title>
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
