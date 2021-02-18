import HttpFactory from './httpFactory';
import httpConfig from './httpConfig';

const apiService = new HttpFactory(httpConfig);

function baseApi(service, value = {}, method = 'post') {
  return apiService[method](service, value);
}

export default function baseService(moduleUrl) {
  return (url, param, method) => {
    let service = httpConfig.baseURL + '/' + moduleUrl + url;
    return baseApi(service, param, method);
  };
}
