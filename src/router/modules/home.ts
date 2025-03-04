const home: AuthRoute.Route = {
  name: 'home',
  path: '/home',
  component: 'self',
  meta: {
    title: '首页',
    i18nTitle: 'routes.home._value',
    icon: 'carbon:home',
    singleLayout: 'chat',
    order: 1,
    requiresAuth: true,
    keepAlive: false
  }
}

export default home
