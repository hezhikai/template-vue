export default [
  {
    path: '/user',
    title: '个人信息',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user')
  }
  // {
  //   title: '设备信息',
  //   path: '/deviceInfo',
  //   icon: 'el-icon-monitor',
  //   redirect: '/deviceInfo/beaconManage',
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "simpleRouterView" */ '@/components/layout/simpleRouterView'
  //     ),
  //   children: [
  //     {
  //       title: '信标管理',
  //       path: 'beaconManage',
  //       icon: 'el-icon-cpu',
  //       component: () =>
  //         import(
  //           /* webpackChunkName: "beaconManage" */ '@/views/DeviceInfo/BeaconManage'
  //         )
  //     }
  //   ]
  // }
];
