import { checkType } from './judge';

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 判断对象是否有某个原型属性
 * @param obj
 * @param key
 * @returns {boolean}
 */
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

export function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
}

/**
 * 功能与Object.assign类似
 * */
export function toObject(arr) {
  let res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}

/**
 * 判断是否时对象
 * @param obj 需要判断的变量
 * @returns {boolean}
 */
export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 * 去对象中对应属性的值
 * @param object 目标对象
 * @param prop 属性路径字符串
 * @returns {*}
 */
export function getValueByPath(object, prop) {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
}

/**
 * 深拷贝
 * @param obj 拷贝对象
 * @param ignoreKeyList 不拷贝的属性列表
 */
export function deepClone(obj = {}, ignoreKeyList = []) {
  let _obj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (!(obj.constructor === Object && ignoreKeyList.includes(key))) {
      if (checkType(obj[key], ['Array', 'Object'])) {
        _obj[key] = deepClone(obj[key], ignoreKeyList);
      } else {
        _obj[key] = obj[key];
      }
    }
  }
  return _obj;
}

/**
 * 生成对象的标识字符串
 * @param obj 目标对象
 * @param keyList 通过对象的哪些属性的值来生成标识字符串
 * @returns {string}
 */
export function getObjKeyValue(obj = {}, keyList) {
  let onlyKey = keyList;
  let str = '';
  if (!onlyKey) {
    return str;
  }
  if (Object.prototype.toString.call(keyList) === '[object String]') {
    onlyKey = [keyList];
  }
  onlyKey.forEach((key) => {
    str += `${key}:${obj[key]}--`;
  });
  return str;
}
