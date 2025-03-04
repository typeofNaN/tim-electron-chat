const setting: AuthRoute.Route = {
  name: 'setting',
  path: '/setting',
  component: 'self',
  meta: {
    title: '设置',
    i18nTitle: 'routes.setting._value',
    icon: 'carbon:setting',
    singleLayout: 'chat',
    order: 1,
    requiresAuth: true,
    keepAlive: false
  }
}

export default setting
