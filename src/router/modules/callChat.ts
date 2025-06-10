const callChat: AuthRoute.Route = {
  name: 'call-chat',
  path: '/call-chat',
  component: 'self',
  meta: {
    title: '音视频通话',
    i18nTitle: 'routes.callChat._value',
    icon: 'carbon:video',
    singleLayout: 'call',
    hide: true,
    requiresAuth: true,
    keepAlive: false
  }
}

export default callChat
