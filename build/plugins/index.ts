import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from '@unocss/vite'
import vueDevtools from 'vite-plugin-vue-devtools'
import electron from 'vite-plugin-electron'
import resolve from 'vite-plugin-resolve'
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
    mock(viteEnv),
    resolve({
      'trtc-electron-sdk': `
        const TRTCCloud = require("trtc-electron-sdk");
        const TRTCParams = TRTCCloud.TRTCParams;
        const TRTCAppScene = TRTCCloud.TRTCAppScene;
        const TRTCVideoStreamType = TRTCCloud.TRTCVideoStreamType;
        const TRTCScreenCaptureSourceType = TRTCCloud.TRTCScreenCaptureSourceType;
        const TRTCVideoEncParam = TRTCCloud.TRTCVideoEncParam;
        const Rect = TRTCCloud.Rect;
        const TRTCAudioQuality = TRTCCloud.TRTCAudioQuality;
        const TRTCScreenCaptureSourceInfo = TRTCCloud.TRTCScreenCaptureSourceInfo;
        const TRTCDeviceInfo = TRTCCloud.TRTCDeviceInfo;
        const TRTCVideoQosPreference = TRTCCloud.TRTCVideoQosPreference;
        const TRTCQualityInfo = TRTCCloud.TRTCQualityInfo;
        const TRTCQuality = TRTCCloud.TRTCQuality;
        const TRTCStatistics = TRTCCloud.TRTCStatistics;
        const TRTCVolumeInfo = TRTCCloud.TRTCVolumeInfo;
        const TRTCDeviceType = TRTCCloud.TRTCDeviceType;
        const TRTCDeviceState = TRTCCloud.TRTCDeviceState;
        const TRTCBeautyStyle = TRTCCloud.TRTCBeautyStyle;
        const TRTCVideoResolution = TRTCCloud.TRTCVideoResolution;
        const TRTCVideoResolutionMode = TRTCCloud.TRTCVideoResolutionMode;
        const TRTCVideoMirrorType = TRTCCloud.TRTCVideoMirrorType;
        const TRTCVideoRotation = TRTCCloud.TRTCVideoRotation;
        const TRTCVideoFillMode = TRTCCloud.TRTCVideoFillMode;
        const TRTCRoleType = TRTCCloud.TRTCRoleType;
        const TRTCScreenCaptureProperty = TRTCCloud.TRTCScreenCaptureProperty;
        export {
          TRTCParams,
          TRTCAppScene,
          TRTCVideoStreamType,
          TRTCScreenCaptureSourceType,
          TRTCVideoEncParam,
          Rect,
          TRTCAudioQuality,
          TRTCScreenCaptureSourceInfo,
          TRTCDeviceInfo,
          TRTCVideoQosPreference,
          TRTCQualityInfo,
          TRTCStatistics,
          TRTCVolumeInfo,
          TRTCDeviceType,
          TRTCDeviceState,
          TRTCBeautyStyle,
          TRTCVideoResolution,
          TRTCVideoResolutionMode,
          TRTCVideoMirrorType,
          TRTCVideoRotation,
          TRTCVideoFillMode,
          TRTCRoleType,
          TRTCQuality,
          TRTCScreenCaptureProperty,
        };
        export default TRTCCloud.default;
      `
    })
  ]

  if (viteEnv.VITE_APP_ROUTE_PLUGIN === 'Y') {
    plugins.push(pageRoute())
  }

  return plugins
}
