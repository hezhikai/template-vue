const directives = {};

directives.install = function (Vue) {
  Object.keys(directives).forEach((key) => {
    Vue.directives(key, directives[key]);
  });
};

export default directives;
