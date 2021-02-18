import {
  coerceBoolean,
  getObjectType,
  timeFormat as _timeFormat
} from '../methods';
import { Subject } from './subject';
const DEFAULT_KEY_MAP = {
  type: 'type',
  data: 'data'
};
/**
 * 心跳类
 * @param websock websocket实例
 * @constructor
 */
function Heart(websock) {
  this.timeout = 30000;
  this.timer = null;
  this.reset = function () {
    console.log('心跳重置');
    clearTimeout(this.timer);
    return this;
  };
  this.start = function () {
    var self = this;
    this.timer = setInterval(function () {
      if (websock.readyState === websock.OPEN) {
        console.log('连接状态，发送消息保持连接');
        websock.send('ping');
        self.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
      }
    }, this.timeout);
  };
}

export function Websocket(option) {
  /**
   * websocket实例
   * @type {websock}
   */
  let websock;

  /**
   * socket名称
   * @type {socketName}
   */
  let socketName;

  /**
   * socket地址
   * @type {socketName}
   */
  let wsurl;

  /**
   * socket状态
   * @type {socketName}
   */
  let state = 'alive';

  /**
   * 订阅实例
   * @type {subject}
   */
  let subject = new Subject();

  /**
   * 心跳实例
   * @type {subject}
   */
  let heart = null;

  /**
   * 消息关键字映射
   * @type {subject}
   */
  let keyMap = DEFAULT_KEY_MAP;

  /**
   * 创建时间
   * @type {createTime}
   */
  let createTime = new Date().getTime();

  /**
   * 增加事件监听
   * @param eventName 事件名
   * @param fn 方法
   */
  const on = (eventName, fn) => {
    subject.listen(eventName, fn);
  };

  /**
   * 移除监听事件
   * @param eventName 事件名
   * @param fn 方法
   */
  const removeListeners = (eventName, fn) => {
    subject.remove(eventName, fn);
  };

  /**
   * 移除监听事件
   * @param eventName 事件名
   */
  const removeAllListeners = (eventName) => {
    subject.remove(eventName);
  };

  /**
   * 关闭socket
   */
  const close = () => {
    state = 'dead';
    const _close = () => {
      switch (websock.readyState) {
        case websock.OPEN:
          websock.close();
          break;
        case websock.CONNECTING:
          setTimeout(() => {
            _close();
          }, 1000);
          break;
        default:
          break;
      }
    };
    _close();
  };

  /**
   * 获取监听列表
   */
  const getList = () => {
    return subject.getList();
  };

  /**
   * 初始化websocket
   * @param option 配置
   */
  const initWebSocket = (option) => {
    //初始化websocket
    if (
      coerceBoolean(option) &&
      coerceBoolean(option.wsurl) &&
      coerceBoolean(option.name)
    ) {
      keyMap = Object.assign({}, keyMap, option.keyMap || {});
      wsurl = option.wsurl;
      socketName = option.name;
      websock = new WebSocket(wsurl);
      websock.onopen = onOpen;
      websock.onmessage = onMessage;
      websock.onclose = onClose;
      websock.onerror = onError;
    }
  };

  /**
   * 重连
   */
  function reconnect() {
    if (websock.readyState === websock.CLOSED) {
      //没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function () {
        console.info(
          `websocket(${socketName})尝试重连... ` +
            _timeFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
        );
        initWebSocket({ wsurl, name: socketName });
      }, 5000);
    }
  }

  /**
   * 发送消息接口
   * @param agentData
   */
  const send = (agentData = '') => {
    //数据发送
    if (getObjectType(agentData) !== '[object String]') {
      agentData = JSON.stringify(agentData);
    }
    websock.send(agentData);
  };

  /**
   * 接收信息回调函数
   * @param e
   */
  const onMessage = (e) => {
    heart.reset().start();
    try {
      const dataSource = JSON.parse(e.data);
      // subject.trigger('onmessage', e);
      subject.trigger(dataSource[keyMap.type], dataSource[keyMap.data]);
    } catch (e) {
      console.error('后端消息返回格式不符合规则！');
    }
  };

  /**
   * 连接成功回调函数
   * @param e
   */
  const onOpen = (e) => {
    console.log('--- ws开启 ---', e);
    heart = new Heart(websock);
    heart.start();
  };

  /**
   * 连接关闭回调函数
   * @param e
   */
  const onClose = (e) => {
    //关闭
    console.log('connection closed (' + e.code + ')');
    heart && heart.reset();
    state === 'alive' && reconnect();
  };

  /**
   * 连接出错回调函数
   * @param e
   */
  const onError = (e) => {
    console.error('--- ws错误 ---' + e);
  };

  initWebSocket(option);

  return {
    websock,
    socketName,
    createTime,
    state,
    on,
    removeAllListeners,
    removeListeners,
    close,
    send,
    getList
  };
}
