const contacts: AuthRoute.Route = {
  name: 'contacts',
  path: '/contacts',
  component: 'self',
  meta: {
    title: '联系人',
    i18nTitle: 'routes.contacts._value',
    icon: 'carbon:contacts',
    singleLayout: 'chat',
    order: 1,
    requiresAuth: true,
    keepAlive: false
  }
}

export default contacts
