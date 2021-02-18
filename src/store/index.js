import { CustomStore } from './utils';
import user from './modules/user';

export default new CustomStore({
  modules: {
    user
  }
});
