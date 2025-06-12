<template>
  <div class="b-1 b-#ccc b-solid" :style="{ width: `${props.wh}px`, height: `${props.wh}px` }">
    <n-image v-if="props.media.type === 'IMAGE'" :src="props.media.imageUrl" :width="props.wh - 2"
      :height="props.wh - 2" object-fit="cover" class="mb-0 cursor-pointer" :style="{ height: `${props.wh - 2}px` }"
      :preview-disabled="true" @click="previewImage">
      <template #error>
        <n-image :src="loadErrorImage" :width="props.wh - 2" />
      </template>
    </n-image>
    <video v-else :src="props.media.videoUrl" controls controlslist="noremoteplayback noplaybackrate"
      :disablePictureInPicture="true" class="w-full h-full object-contain"
      :style="{ width: `${props.wh - 2}px`, height: `${props.wh - 2}px` }" />
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

function previewImage() {
  const { ipcRenderer } = require('electron')
  ipcRenderer.send('createImagePreviewWindow', {
    imageList: cloneDeep(chatStore.currentMsgListImage),
    currentImage: props.media.imageUrl
  })
}
</script>