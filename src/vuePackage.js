import Vue from 'vue';
import ELEMENT from 'element-ui';
import directives from './directives';
import filters from './filters';
import { listenerPolicy } from './mixins';
import enumMap from './utils/constant/enum';
import methods from './utils/func';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.less';

Vue.use(ELEMENT);
Vue.use(directives);
Vue.use(filters);

Vue.mixin(listenerPolicy);

Vue.prototype.$enum = enumMap;
Vue.prototype.$methods = methods;

export default Vue;
