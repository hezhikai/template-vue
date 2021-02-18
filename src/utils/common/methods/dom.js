import ResizeObserver from 'resize-observer-polyfill';

import Vue from 'vue';

const isServer = Vue.prototype.$isServer; //当前 Vue 实例是否运行于服务器
const SPECIAL_CHARS_REGEXP = /([:-_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);

/* istanbul ignore next */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
/* istanbul ignore next */
const camelCase = function (name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/* istanbul ignore next */
/**
 * 注册监听事件
 */
const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
/**
 * 取消监听事件
 */
const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
/**
 * 注册一个只触发一次的监听事件
 * @param el DOM元素
 * @param event 事件名
 * @param fn 执行方法
 */
const once = function (el, event, fn) {
  let listener = function () {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

/* istanbul ignore next */
/**
 * 判断dom元素是否含有某个类名
 * @param el dom元素
 * @param cls 类名
 * @returns {boolean}
 */
function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1)
    throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

/* istanbul ignore next */
/**
 * 给元素添加类名
 * @param el dom元素
 * @param cls 类名
 */
function addClass(el, cls) {
  if (!el) return;
  let curClass = el.className;
  let classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

/* istanbul ignore next */
/**
 * 移除某dom元素的类名
 * @param el dom元素
 * @param cls 类名
 */
function removeClass(el, cls) {
  if (!el || !cls) return;
  let classes = cls.split(' ');
  let curClass = ' ' + el.className + ' ';

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/* istanbul ignore next */
/**
 * 获取dom元素样式
 * @param element dom元素
 * @param styleName 样式名
 * @type {Function}
 */
const getStyle =
  ieVersion < 9
    ? function (element, styleName) {
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'styleFloat';
        }
        try {
          switch (styleName) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100;
              } catch (e) {
                return 1.0;
              }
            default:
              return element.style[styleName] || element.currentStyle
                ? element.currentStyle[styleName]
                : null;
          }
        } catch (e) {
          return element.style[styleName];
        }
      }
    : function (element, styleName) {
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'cssFloat';
        }
        try {
          let computed = document.defaultView.getComputedStyle(element, '');
          return element.style[styleName] || computed
            ? computed[styleName]
            : null;
        } catch (e) {
          return element.style[styleName];
        }
      };

/* istanbul ignore next */
/**
 * 给元素设置样式
 * @param element dom元素
 * @param styleName 样式名
 * @param value 样式值
 */
function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    for (let prop in styleName) {
      if (Object.prototype.hasOwnProperty.call(styleName, prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value)
        ? ''
        : 'alpha(opacity=' + value * 100 + ')';
    } else {
      element.style[styleName] = value;
    }
  }
}

/**
 * 取消冒泡
 * @param e 事件
 */
function stopPropagation(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
}

/**
 * 阻止默认事件
 * @param e 事件
 */
function preventDefault(e) {
  if (e && e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false;
  }
}

/**
 * ResizeObserver的处理方式
 * @param entries
 */
const resizeHandler = function (entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach((fn) => {
        fn();
      });
    }
  }
};

/**
 * 注册ResizeObserver监听
 * ResizeObserver: 响应式监听
 * @param element
 * @param fn
 */
const addResizeObserverListener = function (element, fn) {
  if (isServer) return;
  if (!element.__resizeListeners__ || !element.__resizeListeners__.length) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};

/**
 * 移除ResizeObserver监听
 * @param element
 * @param fn
 */
const removeResizeObserverListener = function (element, fn) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(
    element.__resizeListeners__.indexOf(fn),
    1
  );
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
};

export {
  on, //注册监听事件
  off, //取消监听事件
  once, //注册一个只触发一次的监听事件
  hasClass, //判断dom元素是否含有某个类名
  addClass, //给元素添加类名
  removeClass, //移除某dom元素的类名
  getStyle, //获取dom元素样式
  setStyle, //给元素设置样式
  stopPropagation, //取消冒泡
  preventDefault, //阻止默认事件
  addResizeObserverListener, //注册ResizeObserver监听
  removeResizeObserverListener //移除ResizeObserver监听
};
