import { checkType, getObjectType } from './judge';
import { isObject } from './object';

/**
 * 将Blob转换为字符串（异步）
 * @param blob Blob对象
 * @returns {Promise<any>}
 */
export function blobToString(blob) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = function () {
      resolve(this.result);
    };
    reader.onerror = function () {
      reject(this.error);
    };
  });
}

/**
 * 数字金额转换中文大写
 * */
export function changeMoney(n) {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法';
  let unit = '京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分';
  let str = '';
  n += '00';
  let p = n.indexOf('.');
  if (p >= 0) {
    n = n.substring(0, p) + n.substr(p + 1, 2);
  }
  unit = unit.substr(unit.length - n.length);
  for (let i = 0; i < n.length; i++)
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  return str
    .replace(/零(仟|佰|拾|角)/g, '零')
    .replace(/(零)+/g, '零')
    .replace(/零(兆|万|亿|元)/g, '$1')
    .replace(/(兆|亿)万/g, '$1')
    .replace(/(京|兆)亿/g, '$1')
    .replace(/(京)兆/g, '$1')
    .replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, '$1$2零$3仟')
    .replace(/^元零?|零分/g, '')
    .replace(/(元|角)$/g, '$1整');
}

/**
 * 下载文件方法
 * @param content 下载链接
 */
export function fileDownload(content, filename) {
  let url = content;
  if (checkType(content, 'Blob')) {
    url = URL.createObjectURL(content);
  }
  // 创建隐藏的可下载链接
  let eleLink = document.createElement('a');
  filename && (eleLink.download = filename);
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  // let blob = new Blob([content]);
  // eleLink.href = URL.createObjectURL(blob);
  eleLink.href = url;
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
  if (checkType(content, 'Blob')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * 将base64转换为文件
 * @param base64 base64数据字符串
 * @param filename 设定生成的文件的文件名
 * @returns {File}
 */
export function base64ToFile(base64, filename) {
  let arr = base64.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * 将文件转换为base64（异步）
 * @param file 文件对象
 * @returns {Promise<any>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
      //读取完成后，数据保存在对象的result属性中
      resolve(this.result);
    };
    fileReader.onerror = function () {
      reject(this.error);
    };
  });
}

/**
 * 图片压缩（异步）
 * @param data 文件数据
 * @param type 文件数据类型 'file'文件对象，'base64'base64字符串
 * @param opt 压缩配置项
 * @returns {PromiseLike<T> | Promise<T> | *}
 */
export function imgCompress(data, type = 'file', opt = {}) {
  if (!data && !['file', 'base64'].includes(type)) return;
  let fileName = 'compressed.jpg';
  if (type === 'file' && data.name) {
    let fileNameList = data.name.split('.');
    fileNameList[fileNameList.length - 1] = 'jpg';
    fileName = fileNameList.join('.');
  }
  const defaultOption = {
    rate: 0.92, //压缩率
    maxWidth: 1024, //最大宽度
    maxHeight: 1024, //最大高度
    fileName
  };
  let option = Object.assign({}, defaultOption, opt);

  /**
   * 获得图片对象
   **/
  function getImg(data, type) {
    return new Promise((resolve) => {
      let img = new Image();
      if (type === 'file') {
        fileToBase64(data).then((base64) => {
          img.src = base64;
          resolve(img);
        });
      } else if (type === 'base64') {
        img.src = data;
        resolve(img);
      }
    });
  }

  /**
   * 压缩方法
   **/
  function compress(img, opt) {
    let { rate, maxWidth, maxHeight } = opt;
    // let oldFileSize = img.src.length;
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    // 图片原始尺寸
    let originWidth = img.width;
    let originHeight = img.height;
    // 目标尺寸
    let targetWidth = originWidth;
    let targetHeight = originHeight;
    // 图片尺寸超过长宽的限制
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        // 更宽，按照宽度限定尺寸
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    // canvas对图片进行缩放
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    // 清除画布
    context.clearRect(0, 0, targetWidth, targetHeight);
    // 图片压缩
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
    /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/

    //压缩后的图片转base64 url
    /**canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
     * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92
     **/
    let newUrl = canvas.toDataURL('image/jpeg', rate); //base64 格式
    return newUrl;
    // if (newUrl.length > oldFileSize) {
    //   return base64ToFile(img.src, fileName);
    // } else {
    //   return base64ToFile(newUrl, fileName);
    // }
    //也可以把压缩后的图片转blob格式用于上传
    // canvas.toBlob((blob)=>{
    //     console.log(blob)
    //     //把blob作为参数传给后端
    // }, 'image/jpeg', 0.92)
  }

  return getImg(data, type).then((img) => {
    let { fileName } = option;
    let newUrl = compress(img, option);
    if (newUrl.length > img.src.length) {
      console.warn('该图片在当前压缩配置下无法压缩');
      if (type === 'file') {
        return data;
      } else {
        return base64ToFile(img.src, fileName);
      }
    } else {
      return base64ToFile(newUrl, fileName);
    }
  });
}

/**
 * 判断是否是文件对象
 * @param val
 * @returns {boolean}
 */
export function isFile(val) {
  return getObjectType(val) === '[object File]';
}

/**
 * 判断是否是文件数组
 * @param val
 * @returns {boolean}
 */
export function isFileList(val) {
  return getObjectType(val) === '[object FileList]';
}

/**
 * 将参数转成FormData，
 * @param param
 * @returns {FormData}
 */
export function handleUploadParam(param) {
  let form = new FormData();
  if (isObject(param)) {
    Object.keys(param).forEach((key) => {
      if (isFileList(param[key]) || Array.isArray(param[key])) {
        let index = 1;
        Array.prototype.forEach.call(param[key], (file) => {
          if (file) {
            if (isFile(file)) {
              form.append('file' + index, file);
              index++;
            } else if (isFile(file.raw)) {
              form.append('file' + index, file.raw);
              index++;
            }
          }
        });
      } else {
        form.append(
          key,
          param[key] && isFile(param[key].raw) ? param[key].raw : param[key]
        );
      }
    });
  }
  return form;
}

/**
 * 获取当前环境（浏览器，系统）
 * @returns {{engine: {ie: number, gecko: number, webkit: number, khtml: number, opera: number, ver: null}, browser: {ie: number, firefox: number, safari: number, konq: number, opera: number, chrome: number, ver: null}, system: {win: boolean, mac: boolean, x11: boolean, iphone: boolean, ipod: boolean, ipad: boolean, ios: boolean, android: boolean, nokiaN: boolean, winMobile: boolean, wii: boolean, ps: boolean}}}
 */
export function client() {
  //呈现引擎
  let engine = {
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,

    //完整的版本号
    ver: null
  };
  //浏览器
  let browser = {
    //主要浏览器
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,

    //具体的版本号
    ver: null
  };
  //平台、设备和操作系统
  let system = {
    win: false,
    mac: false,
    x11: false,

    //移动设备
    iphone: false,
    ipod: false,
    ipad: false,
    ios: false,
    android: false,
    nokiaN: false,
    winMobile: false,

    //游戏系统
    wii: false,
    ps: false
  };

  //检测呈现引擎和浏览器
  let ua = navigator.userAgent;
  if (window.opera) {
    engine.ver = browser.ver = window.opera.version();
    engine.opera = browser.opera = parseFloat(engine.ver);
  } else if (/AppleWebKit\/(\S+)/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.webkit = parseFloat(engine.ver);

    //确定是 Chrome 还是 Safari
    if (/Chrome\/(\S+)/.test(ua)) {
      browser.ver = RegExp['$1'];
      browser.chrome = parseFloat(browser.ver);
    } else if (/Version\/(\S+)/.test(ua)) {
      browser.ver = RegExp['$1'];
      browser.safari = parseFloat(browser.ver);
    } else {
      //近似地确定版本号
      let safariVersion = 1;
      if (engine.webkit < 100) {
        safariVersion = 1;
      } else if (engine.webkit < 312) {
        safariVersion = 1.2;
      } else if (engine.webkit < 412) {
        safariVersion = 1.3;
      } else {
        safariVersion = 2;
      }

      browser.safari = browser.ver = safariVersion;
    }
  } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp['$1'];
    engine.khtml = browser.konq = parseFloat(engine.ver);
  } else if (/rv:([^)]+)\) Gecko\/\d{8}/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.gecko = parseFloat(engine.ver);

    //确定是不是 Firefox
    if (/Firefox\/(\S+)/.test(ua)) {
      browser.ver = RegExp['$1'];
      browser.firefox = parseFloat(browser.ver);
    }
  } else if (/MSIE ([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp['$1'];
    engine.ie = browser.ie = parseFloat(engine.ver);
  }
  //检测浏览器
  browser.ie = engine.ie;
  browser.opera = engine.opera;
  //检测平台
  let p = navigator.platform;
  system.win = p.indexOf('Win') === 0;
  system.mac = p.indexOf('Mac') === 0;
  system.x11 = p === 'X11' || p.indexOf('Linux') === 0;
  //检测 Windows 操作系统
  if (system.win) {
    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
      if (RegExp['$1'] === 'NT') {
        switch (RegExp['$2']) {
          case '5.0':
            system.win = '2000';
            break;
          case '5.1':
            system.win = 'XP';
            break;
          case '6.0':
            system.win = 'Vista';
            break;
          case '6.1':
            system.win = '7';
            break;
          default:
            system.win = 'NT';
            break;
        }
      } else if (RegExp['$1'] === '9x') {
        system.win = 'ME';
      } else {
        system.win = RegExp['$1'];
      }
    }
  }
  //移动设备
  system.iphone = ua.indexOf('iPhone') > -1;
  system.ipod = ua.indexOf('iPod') > -1;
  system.ipad = ua.indexOf('iPad') > -1;
  system.nokiaN = ua.indexOf('NokiaN') > -1;
  //windows mobile
  if (system.win === 'CE') {
    system.winMobile = system.win;
  } else if (system.win === 'Ph') {
    if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
      system.win = 'Phone';
      system.winMobile = parseFloat(RegExp['$1']);
    }
  }

  //检测 iOS 版本
  if (system.mac && ua.indexOf('Mobile') > -1) {
    if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
      system.ios = parseFloat(RegExp.$1.replace('_', '.'));
    } else {
      system.ios = 2; //不能真正检测出来，所以只能猜测
    }
  }
  //检测 Android 版本
  if (/Android (\d+\.\d+)/.test(ua)) {
    system.android = parseFloat(RegExp.$1);
  }
  //游戏系统
  system.wii = ua.indexOf('Wii') > -1;
  system.ps = /playstation/i.test(ua);
  //返回这些对象
  return {
    engine: engine,
    browser: browser,
    system: system
  };
}

/**
 * 简单加密、解密
 * @param str 需要加密的内容
 * @param boolean false加密，true解密
 * @param num 加密层数，数字越大，生成的内容越多
 * @param handleErrorFn 报错回调函数
 * @returns {*}
 */
export function md(str = '', boolean = false, num = 1, handleErrorFn) {
  try {
    const key = 'dS5v1BdE';
    let rew = str;
    if (boolean) {
      let reg = new RegExp(`${key}$`);
      for (let i = 0; i < num; i++) {
        rew = window.atob(rew);
        rew = rew.replace(reg, '');
      }
    } else {
      for (let i = 0; i < num; i++) {
        rew += key;
        rew = window.btoa(rew);
      }
    }
    return rew;
  } catch (e) {
    handleErrorFn();
  }
}
