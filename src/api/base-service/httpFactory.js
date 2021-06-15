import axios from 'axios';
import configCheck from './configCheck';
import { transError, defaultExecOn } from './defaultConfig';
import {
  getObjectType,
  checkType,
  blobToString,
  coerceBoolean
} from '@/utils/common';

/**
 * 执行传入的配置项中的on前缀的方法
 * @param config
 * @param functionName
 * @param res
 */
function execOnFunction(config = {}, functionName, res) {
  defaultExecOn(functionName, res);
  let func = config[functionName];
  if (getObjectType(func) === '[object Function]') {
    func(res);
  }
}

/**
 * 循环传参对象，删除空字段
 * 移除值为‘’或 null 的数据
 * @param handleParam 新对象
 * @param param 原对象
 */
function loopParam(param) {
  const type = getObjectType(param);
  if (!['[object Array]', '[object Object]'].includes(type)) {
    return param;
  }
  let handleParam = type === '[object Array]' ? [] : {};
  if (!coerceBoolean(param)) {
    return handleParam;
  }
  let keys = Object.keys(param);
  if (keys.length === 0) {
    return;
  }
  for (let i of keys) {
    if (getObjectType(param[i]) === '[object Object]') {
      handleParam[i] = loopParam(param[i]);
    } else if (getObjectType(param[i]) === '[object Array]') {
      handleParam[i] = loopParam(param[i]);
    } else if (![null].includes(param[i])) {
      handleParam[i] = param[i];
    }
  }
  return handleParam;
}

/**
 * 统一处理返回的response
 * @param res
 * @param resolve
 * @param reject
 */
function dealResponse(res, resolve, reject, _config) {
  // 当接口返回的数据中没有success字段时，返回data整体，为了兼容文件下载
  let promise = Promise.resolve(res);
  if (checkType(res.data, 'Blob') && /application\/json/.test(res.data.type)) {
    promise = blobToString(res.data).then((json) => {
      res.data = JSON.parse(json);
      return res;
    });
  }
  promise.then((res) => {
    if (checkType(res.data, 'Blob')) {
      resolve(res.data);
    } else {
      if (_config.isDealRespones) {
        if (res.data.code === 1000000) {
          resolve(res.data.data);
        } else {
          execOnFunction(_config, 'onFailure', res.data);
          reject(res.data);
        }
      } else {
        resolve(res);
      }
    }
  });
}

/**
 * 默认配置，不包括处理函数
 * @type {{isDealRespones: boolean}}
 */
const defaultConfig = {
  isDealRespones: true
};

/**
 * 请求处理逻辑
 * @param baseApi
 * @param method
 * @param _config
 * @returns {function(*, *, *=, *=, *)}
 */
function createHttpFn(baseApi, method, _config) {
  let config = Object.assign({}, defaultConfig, _config);
  return (url, param, source) => {
    console.log(source);
    return new Promise((resolve, reject) => {
      let option = {
        ...config,
        url,
        method
      };
      let key = ['get', 'delete', 'head'].includes(method) ? 'params' : 'data';
      option[key] = loopParam(param);
      baseApi(option)
        .then((res) => {
          execOnFunction(config, 'onResponse', res, option);
          dealResponse(res, resolve, reject, config);
        })
        .catch((e) => {
          if (e.response || e.code === 'ECONNABORTED') {
            // then解析出错时，会被catch捕获
            let err = transError(e);
            execOnFunction(config, 'onError', err, option);
            reject(e);
          }
        });
    });
  };
}

/**
 * http请求对象
 * @param config
 */
function HttpFactory(config = {}) {
  configCheck(config);
  const baseApi = axios.create(config);
  return {
    post: createHttpFn(baseApi, 'post', config),
    get: createHttpFn(baseApi, 'get', config),
    put: createHttpFn(baseApi, 'put', config),
    delete: createHttpFn(baseApi, 'delete', config),
    head: createHttpFn(baseApi, 'head', config),
    patch: createHttpFn(baseApi, 'patch', config),
    download_post: createHttpFn(baseApi, 'post', {
      ...config,
      responseType: 'blob'
    }),
    download_get: createHttpFn(baseApi, 'get', {
      ...config,
      responseType: 'blob'
    })
    // post_upload: createHttpFn(baseApi, 'post_upload', config),
  };
}

export default HttpFactory;
