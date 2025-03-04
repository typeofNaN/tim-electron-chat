import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from '@unocss/vite'
import vueDevtools from 'vite-plugin-vue-devtools'
import electron from 'vite-plugin-electron'
import pageRoute from '@soybeanjs/vite-plugin-vue-page-route'

import mock from './mock'
import unplugin from './unplugin'

/**
 * @description vite插件
 * @param { ImportMetaEnv } viteEnv - 环境变量配置
 */
export function setupVitePlugins(viteEnv: ImportMetaEnv): (PluginOption | PluginOption[])[] {
  const plugins = [
    vue({
      script: {
        defineModel: true
      }
    }),
    electron({
      entry: 'electron/index.ts'
    }),
    vueJsx(),
    vueDevtools(),
    ...unplugin(viteEnv),
    unocss(),
    mock(viteEnv)
  ]

  if (viteEnv.VITE_APP_ROUTE_PLUGIN === 'Y') {
    plugins.push(pageRoute())
  }

  return plugins
}
