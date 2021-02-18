/**
 * form表单校验自定义规则
 */
import { coerceBoolean, getObjectType } from 'djcpsweb-utils';
import regexp from '@/utils/constant/regexp';
/**
 * 通用的校验模板
 * @param {regexp} curRegexp 正则表达式
 * @param {string} msg 提示信息
 */
export function commonRules(curRegexp, msg) {
  return {
    validator: (rule, value, callback) => {
      let exist = coerceBoolean(value);
      if (exist && !curRegexp.test(value)) {
        callback(new Error(msg));
      } else {
        callback();
      }
    },
    trigger: 'change'
  };
}
const formRules = {
  required: (msg = '请输入必填项') => {
    return {
      required: true,
      validator: (rule, value, callback) => {
        let isEmptyArray = Array.isArray(value) && value.length === 0;
        let isEmptyObject =
          getObjectType(value) === '[object Object]' &&
          JSON.stringify(value) === '{}';
        let isEmptyString =
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.replace(/[\r\n\s]+/, '') === '');
        if (isEmptyArray || isEmptyObject || isEmptyString) {
          callback(new Error(msg));
        } else {
          callback();
        }
      },
      trigger: 'change'
    };
  },
  // 正整数校验
  posInt: (msg = '请输入正整数！') => {
    return commonRules(regexp.posInt, msg);
  },
  //固定电话校验
  phone: (msg = '固定电话格式不正确！') => {
    return commonRules(regexp.phone, msg);
  },
  //手机号校验
  telephone: (msg = '手机号格式不正确！') => {
    return commonRules(regexp.telephone, msg);
  },
  //短号校验
  shortPhone: (msg = '联系短号需填写6位数字！') => {
    return commonRules(regexp.shortPhone, msg);
  },
  //身份证号校验
  idCard: (msg = '身份证号格式不正确！') => {
    return commonRules(regexp.idCard, msg);
  },
  //邮箱校验
  email: (msg = '邮箱格式不正确！') => {
    return commonRules(regexp.email, msg);
  },
  //库位容积校验
  volume: (msg = '库位容积格式不正确！') => {
    return commonRules(regexp.volume, msg);
  },
  //库位承重校验
  weight: (msg = '库位承重格式不正确！') => {
    return commonRules(regexp.weight, msg);
  },
  //库位长宽高校验
  length: (msg = '库位数值格式不正确！') => {
    return commonRules(regexp.length, msg);
  },
  //非法字符校验
  illegal: (msg = '禁止输入空格！') => {
    return commonRules(regexp.illegal, msg);
  },
  // 最大值
  maximum: (formData, field, comparedData) => {
    return {
      validator: (rule, value, callback) => {
        if (comparedData && value > comparedData) {
          formData[field] = comparedData;
        }
        callback();
      },
      trigger: 'change'
    };
  },
  // 最小值
  minimum: (formData, field, comparedData) => {
    return {
      validator: (rule, value, callback) => {
        if (comparedData && value < comparedData) {
          formData[field] = comparedData;
        }
        callback();
      },
      trigger: 'change'
    };
  }
};
export default formRules;
