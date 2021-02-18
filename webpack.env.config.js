/* ps：有些webpack 配置 在vue cli3.0中，被映射成不一样的字段，例如下面两个：
你应该修改 vue.config.js 中的 outputDir 选项而不是修改 output.path；
你应该修改 vue.config.js 中的 publicPath 选项而不是修改 output.publicPath。
这些配置项，在configureWebpack中直接修改build会报错，只能通过vue cli3.0的 api 配置项进行修改 */

const EXTERNALS = {
  // vue: 'Vue',
  // 'element-ui': 'ELEMENT',
  // 'vue-router': 'VueRouter',
  // vuex: 'Vuex',
  // axios: 'axios'
};

function dealConfig(config) {
  // config.entry.app = ['./src/main.js'];
  // 如果需要浏览器vue的调试插件，就全部注释externals
  // 不需要就全部开启
  config.externals = EXTERNALS;
}

const exportObject = {
  production: {
    productionSourceMap: true,
    configureWebpack: (config) => {
      dealConfig(config);
    }
  },
  development: {
    configureWebpack: (config) => {
      dealConfig(config);
      config.devtool = 'source-map';
    }
  }
};

module.exports = exportObject[process.env.NODE_ENV];
