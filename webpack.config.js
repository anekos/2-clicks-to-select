const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')


module.exports = (env, options) => {
  return {
    entry: {
      main: './src/main.tsx',
      background: './src/background.js',
      options: './src/options.tsx',
    },
    output: {
      path: __dirname + '/dist',
      clean: true
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false, // LICENCE.txtを生成しない
        }),
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: options.mode === 'development' ? './manifest.dev.json' : './manifest.json',
            to: 'manifest.json'
          },
          {
            from: './icon/*.*',
            to: './',
          },
          {
            from: './src/options.html',
            to: 'options.html',
          },
        ],
      }),
    ],
  }
}
