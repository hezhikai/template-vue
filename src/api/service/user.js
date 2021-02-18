import { baseService } from '../base-service';
const request = baseService('user');

const userService = {
  getUserInfo(params) {
    return request('/getUserInfo.do', params);
  }
};
export default userService;
