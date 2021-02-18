import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
//创建一个getter方法
function createGetter(rootKey, subKey) {
  return (state) => state[rootKey][subKey];
}

//获得默认getters方法
function getDefaultGetters(modules = {}) {
  return Object.keys(modules).reduce((sum, rootKey) => {
    if (
      Object.prototype.toString.call(modules[rootKey].state) ===
      '[object Object]'
    ) {
      Object.keys(modules[rootKey].state).forEach((subKey) => {
        sum[subKey] = createGetter(rootKey, subKey);
      });
    }
    return sum;
  }, {});
}

// 获得最终getters
function getGetters(config) {
  let { modules = {}, getters = {} } = config;
  return Object.assign(getDefaultGetters(modules), getters);
}

/**
 * 自动生成getters映射
 */
export const CustomStore = function (config = {}) {
  return new Vuex.Store(Object.assign(config, { getters: getGetters(config) }));
};
