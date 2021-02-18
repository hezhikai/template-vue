import Vue from '../vuePackage';
import VueRouter from 'vue-router';
import userRouter from './modules/user';

Vue.use(VueRouter);
const whiteListRouter = [
  {
    path: '*',
    redirect: '/user'
  }
];
const routes = [...whiteListRouter, ...userRouter];
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
