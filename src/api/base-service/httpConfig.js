import { Message } from 'element-ui';
export default {
  baseURL: '',
  onResponse(res) {
    //后端返回数据时执行
    if (res.data && res.data.success) {
      res.data.msg &&
        Message.success({
          message: res.data.msg,
          showClose: true,
          offset: 80
        });
    }
    return res;
  },
  onError(msg) {
    //请求没有连接上后端时执行
    Message({ message: msg, type: 'error', showClose: true });
  },
  onFailure(res) {
    //success为false时执行
    res.msg && Message({ message: res.msg, type: 'error', showClose: true });
  }
};
