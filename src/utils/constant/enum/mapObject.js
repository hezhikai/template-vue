/**
 * 枚举方法
 */
export default function MapObject(obj) {
  Object.keys(obj).forEach((key) => {
    this[key] = obj[key];
  });
  // 生成以 value 值为下标的新数组
  this._swap = this.changeKey('value');
  // 生成数组结构
  this._arr = this.changeList();
}
MapObject.prototype.ignoreKey = ['_swap', '_arr'];
MapObject.prototype.getReverseMap = function () {
  let _obj = {};
  Object.keys(this).forEach((key) => {
    if (!this.ignoreKey.includes(key)) {
      _obj[this[key]] = key;
    }
  });
  return _obj;
};
MapObject.prototype.changeKey = function (param) {
  let _obj = {};
  Object.keys(this).forEach((key) => {
    if (
      !this.ignoreKey.includes(key) &&
      Object.prototype.toString.call(this[key]) === '[object Object]' &&
      (this[key][param] || this[key][param] === 0)
    ) {
      let temp = JSON.parse(JSON.stringify(this[key]));
      temp[param] = key;
      _obj[this[key][param]] = temp;
    }
  });
  return _obj;
};
MapObject.prototype.getItem = function (param, value) {
  let arr = [];
  Object.keys(this).forEach((key) => {
    if (
      !this.ignoreKey.includes(key) &&
      Object.prototype.toString.call(this[key]) === '[object Object]' &&
      this[key][param] === value
    ) {
      arr.push(this[key]);
    }
  });
  return arr;
};
MapObject.prototype.changeList = function () {
  let arr = [];
  Object.keys(this).forEach((key) => {
    if (
      !this.ignoreKey.includes(key) &&
      Object.prototype.toString.call(this[key]) === '[object Object]'
    ) {
      arr.push(this[key]);
    }
  });
  return arr;
};
