const imagePreview: AuthRoute.Route = {
  name: 'image-preview',
  path: '/image-preview',
  component: 'self',
  meta: {
    title: '图片预览',
    i18nTitle: 'routes.imagePreview._value',
    icon: 'carbon:video',
    singleLayout: 'blank',
    hide: true,
    requiresAuth: true,
    keepAlive: false
  }
}

export default imagePreview
