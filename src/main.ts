import { createApp } from 'vue'

import { setupDirectives } from './directives'
import { setupRouter } from './router'
import { setupAssets } from './plugins'
import { setupStore } from './store'
import { setupI18n } from './locales'
import App from './App.vue'
import AppLoading from './components/common/app-loading.vue'

async function setupApp() {
  // import assets: js、css
  setupAssets()

  // app loading
  const appLoading = createApp(AppLoading)

  appLoading.mount('#appLoading')

  const app = createApp(App)

  // store plugin: pinia
  setupStore(app)

  // vue custom directives
  setupDirectives(app)

  // vue router
  await setupRouter(app)

  setupI18n(app)

  appLoading.unmount()

  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
  // mount app
  app.mount('#app')
}

setupApp()
