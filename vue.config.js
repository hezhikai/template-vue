let path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    proxy: {
      '/xxx': {
        target: 'xxx'
      }
    },
    port: 8080
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'));
  },
  lintOnSave: false
};
