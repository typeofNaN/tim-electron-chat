import { cloneDeep } from 'lodash-es'

import { MediaType } from '@/store'

/**
 * @description 预览媒体资源
 * @param { MediaType[] } mediaList 媒体资源列表
 * @param { MediaType } currentMedia 当前媒体资源
 */
export function previewMediaAssets(mediaList: MediaType[], currentMedia: MediaType): void {
  const { ipcRenderer } = require('electron')
  ipcRenderer.send('createMediaPreviewWindow', {
    mediaList: cloneDeep(mediaList),
    currentMedia
  })
}
