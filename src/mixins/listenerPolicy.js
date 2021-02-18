/**
 * （组件内的事件监听策略）
 * 给其他组件提供addListener方法，使用addListener方法监听的事件，在组件的生命周期
 * 到达beforeDestroy和deactivated（即组件销毁前和被缓存的组件不活动）时将取消该组
 * 件上的所有事件监听，当组件生命周期到达activated（即组件激活）时，在给所有元素
 * 自动加上之前的事件监听。
 */
import {
  throttle,
  addResizeObserverListener,
  removeResizeObserverListener
} from '../utils/common';
function addEventListener(el, eventName, fn) {
  if (eventName !== 'resizeObserver') {
    el.addEventListener(eventName, fn);
  } else {
    addResizeObserverListener(el, fn);
  }
}
function removeEventListener(el, eventName, fn) {
  if (eventName !== 'resizeObserver') {
    el.removeEventListener(eventName, fn);
  } else {
    removeResizeObserverListener(el, fn);
  }
}
export const listenerPolicy = {
  data() {
    return {
      listenerList: [],
      listenerList_cache: [],
      // 时间间隔设置高了会有明显的卡顿等感觉，肉眼在50-60帧数下就几乎无法感知到这种感觉了，所以20ms刷新一次，即1秒刷新50次是一个比较合理的默认值
      time_range: 20
    };
  },
  activated() {
    // console.log('activated');
    if (this.listenerList_cache.length) {
      this.listenerList = [...this.listenerList_cache];
      this.listenerList_cache = [];
      this.listenerList.forEach((obj) => {
        const { el, eventName, realFn } = obj;
        addEventListener(el, eventName, realFn);
        // el.addEventListener(eventName, realFn);
      });
    }
  },
  deactivated() {
    // console.log('deactivated');
    if (!this.listenerList_cache.length) {
      this.listenerList_cache = [...this.listenerList];
      this.escapeAllListener();
    }
  },
  beforeDestroy() {
    this.escapeAllListener();
  },
  methods: {
    setTimeRange(num) {
      this.time_range = num;
    },
    addListener(el, eventName, fn, timeRange) {
      // 若存在已监听事件，不再注册
      if (!el || !eventName || !fn) {
        return;
      }
      if (
        this.listenerList.some(
          (obj) => obj.el === el && obj.eventName === eventName && obj.fn === fn
        )
      ) {
        return;
      }
      let _resize = throttle(timeRange || this.time_range, fn);
      addEventListener(el, eventName, _resize);
      // el.addEventListener(eventName, _resize);
      this.listenerList.push({
        el,
        eventName,
        fn,
        realFn: _resize
      });
    },
    removeListener(_el, _eventName, _fn) {
      if (!_el && !_eventName) return;
      let removeListenerList = [];
      this.listenerList.forEach((listener) => {
        const { el, eventName, fn, realFn } = listener;
        if (
          _el === el &&
          _eventName === eventName &&
          (_fn === undefined || _fn === fn)
        ) {
          removeEventListener(_el, _eventName, realFn);
          // _el.removeEventListener(_eventName, realFn);
          removeListenerList.push(listener);
          // console.log(_el, _eventName, '监听取消');
        }
      });
      this.listenerList = this.listenerList.filter(
        (listener) => !removeListenerList.includes(listener)
      );
    },
    escapeAllListener() {
      this.listenerList.forEach((obj) => {
        const { el, eventName, realFn } = obj;
        // console.log('listener', obj);
        removeEventListener(el, eventName, realFn);
        // el.removeEventListener(eventName, realFn);
      });
      // console.log('所有监听取消');
      this.listenerList = [];
    }
  }
};
