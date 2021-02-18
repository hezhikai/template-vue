export default [
  {
    path: '/user',
    meta: {
      title: '个人信息'
    },
    component: () => import('@/views/user')
  }
];
