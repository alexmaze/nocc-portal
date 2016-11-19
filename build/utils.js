var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  return path.posix.join(config.build.assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    if (options.extract) {
      // TODO
      return ExtractTextPlugin.extract(sourceLoader)
    } else {
      return ['style-loader', sourceLoader].join('!')
    }
  }
  // params are used for css module, ref:https://github.com/css-modules/css-modules
  var cssLoader = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]';

  return {
    scoped: {
      css: generateLoaders([cssLoader, 'autoprefixer']),
      less: generateLoaders([cssLoader, 'autoprefixer', 'less'])
    },
    global: {
      css: generateLoaders(['css', 'autoprefixer']),
      less: generateLoaders(['css', 'autoprefixer', 'less'])
    }
  }
}

exports.styleLoaders = function (options) {
  var output = []
  var cssLoaders = exports.cssLoaders(options)

  // global styles
  var globalCssLoader = cssLoaders.global;
  for (var extension in globalCssLoader) {
    var loader = globalCssLoader[extension]
    output.push({
      test: new RegExp('^((?!\\.scoped)\.)*' + extension + '$'),
      loader: loader
    })
  }

  // scoped styles
  var scopedCssLoader = cssLoaders.scoped;
  for (var extension in scopedCssLoader) {
    var loader = scopedCssLoader[extension]
    output.push({
      test: new RegExp('\\.scoped\\.' + extension + '$'),
      loader: loader
    })
  }

  // console.log(output)
  return output
}
