import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Trang Chủ Admin',
    icon: 'home-outline',
    link: '/home/dashboard',
    home: true,
  },
  {
    title: 'Trang Chủ Public',
    icon: 'home-outline',
    link: '/home-public',
    home: true,
  },
  {
    title: 'Tài Khoản',
    group: true,
  },
  {
    title: 'Quản lý người đăng tuyển',
    icon: 'person-outline',
    link: '/home/user/list',
  },
  {
    title: 'Công Việc',
    group: true,
  },
  {
    title: 'Quản lý công việc',
    icon: 'browser-outline',
    link: '/home/list-job',
  },
  {
    title: 'Ứng Tuyển',
    group: true,
  },
  {
    title: 'Quản lý ứng tuyển',
    icon: 'compass-outline',
    link: '/home/list-job-register',
  },
  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
  //   ],
  // },
];
