const path = require('path');

module.exports = {
  entry: {
    index: './src/index.ts',
    'renderers/native': './src/renderers/native.ts',
    'renderers/twemoji': './src/renderers/twemoji.ts',
    'i18n/en': './src/i18n/lang-en.js',
    themes: './src/themes.ts'
  },
  output: {
    library: {
      type: 'umd'
    }
  },
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ejs$/,
        use: 'raw-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: 'EmojiButton__[local]_[hash:base64:5]'
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      path: false,
      fs: false
    },
    alias: {
      templates: path.resolve(__dirname, 'src/templates')
    }
  },
  externals: {
    '@fortawesome/fontawesome-svg-core': '@fortawesome/fontawesome-svg-core',
    '@fortawesome/free-solid-svg-icons': '@fortawesome/free-solid-svg-icons',
    '@popperjs/core': '@popperjs/core',
    ejs: 'ejs',
    'escape-html': 'escape-html',
    'focus-trap': 'focus-trap',
    fuzzysort: 'fuzzysort',
    'tiny-emitter': 'tiny-emitter',
    twemoji: 'twemoji'
  }
};
