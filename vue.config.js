//const path = require("path");
//const HtmlWebpackPlugin = require('html-webpack-plugin');
process.env.VUE_APP_VERSION = require('./package.json').version


module.exports = {
  publicPath: "/prototypes/zdogscope",
  configureWebpack:{
    // plugins: [
    //   new HtmlWebpackPlugin({
    //     meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}
    //  })
    //]
  },
  // lintOnSave: false,

  // css: {
  //   requireModuleExtension: false
  // },

  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'scss',
  //     patterns: []
  //   }
  // }
}
