<template>
  <div class="b-1 b-#ccc b-solid" :style="{ width: `${props.wh}px`, height: `${props.wh}px` }">
    <n-image v-if="props.media.type === 'IMAGE'" :src="props.media.imageUrl" :width="props.wh - 2"
      :height="props.wh - 2" object-fit="cover" class="mb-0 cursor-pointer" :style="{ height: `${props.wh - 2}px` }"
      :preview-disabled="true" @click="previewMedia(props.media.imageUrl)">
      <template #error>
        <n-image :src="loadErrorImage" :width="props.wh - 2" />
      </template>
    </n-image>
    <div v-else class="relative w-full h-full cursor-pointer"
      :style="{ width: `${props.wh - 2}px`, height: `${props.wh - 2}px` }" @click="previewMedia(props.media.videoUrl)">
      <video :src="props.media.videoUrl" class="w-full h-full object-cover" />
      <div class="absolute inset-0 flex-center text-36px text-#fff bg-[rgba(0,0,0,.2)]">
        <icon-material-symbols:play-circle-outline />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'

import { useChatStore } from '@/store'
import loadErrorImage from '@/assets/images/image-load-error.png'

interface Props {
  wh: number
  media: any
}
const props = defineProps<Props>()

const chatStore = useChatStore()

function previewMedia(url: string) {
  const { ipcRenderer } = require('electron')
  ipcRenderer.send('createMediaPreviewWindow', {
    mediaList: cloneDeep(chatStore.currentMsgListMedia),
    currentMedia: {
      url,
      type: props.media.type
    }
  })
}
</script>