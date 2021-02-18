/**
 * element组件封装、重写等
 */

import { MessageBox, Message } from 'element-ui';
/**
 * 带副标题的确认框
 * @param {string} content 主标题
 * @param {object} options 配置项：subContent 副标题
 */
export function confirmBox(content, options) {
  options = options || {};
  let ultimateType = options.type || 'warning';
  let ultimateOptions = {
    title: '提示',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    customClass: 'custom-messagebox'
    // ...options,
    // type: undefined
  };
  Object.assign(ultimateOptions, options, { type: undefined });
  ultimateOptions.message = `
  <div class="el-message-box__status el-icon-${ultimateType}"></div>
  <div class="flex_1 text">
    <p class="content">${content}</p>
    ${
      options.subContent
        ? `<p class="subContent">${options.subContent}</p>`
        : ''
    }
  </div>
  `;
  return new Promise((resolve, reject) => {
    MessageBox(ultimateOptions)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}
//消息提示框，统一默认配置
export function message(options) {
  const defaultConfig = {
    showClose: true, //是否显示关闭按钮
    message: '', //消息内容
    type: 'success', //消息类型
    duration: 2000, //显示时间
    offset: 51 //距离窗口顶部的偏移量
  };
  let config = Object.assign({}, defaultConfig, options);
  Message(config);
}
