const mediaPreview: AuthRoute.Route = {
  name: 'media-preview',
  path: '/media-preview',
  component: 'self',
  meta: {
    title: '媒体预览',
    i18nTitle: 'routes.mediaPreview._value',
    icon: 'carbon:video',
    singleLayout: 'blank',
    hide: true,
    requiresAuth: true,
    keepAlive: false
  }
}

export default mediaPreview
