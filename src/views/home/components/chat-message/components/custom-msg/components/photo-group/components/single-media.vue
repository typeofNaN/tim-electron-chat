<template>
  <div class="b-1 b-#ccc b-solid" :style="{ width: `${mediaBaseWidth}px`, height: `${mediaHeight}px` }">
    <n-image v-if="props.media.type === 'IMAGE'" :src="props.media.imageUrl" :width="mediaBaseWidth - 2"
      :height="mediaHeight - 2" object-fit="cover" class="mb-0 cursor-pointer"
      :style="{ height: `${mediaHeight - 2}px` }" :preview-disabled="true" @click="previewMedia(props.media.imageUrl)">
      <template #error>
        <n-image :src="loadErrorImage" :width="mediaBaseWidth - 2" />
      </template>
    </n-image>
    <div v-else class="relative w-full h-full cursor-pointer"
      :style="{ width: `${mediaBaseWidth - 2}px`, height: `${mediaHeight - 2}px` }"
      @click="previewMedia(props.media.videoUrl)">
      <video :src="props.media.videoUrl" class="w-full h-full object-cover" />
      <div class="absolute inset-0 flex-center text-36px text-#fff bg-[rgba(0,0,0,.2)]">
        <icon-material-symbols:play-circle-outline />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useChatStore } from '@/store'
import { previewMediaAssets } from '@/utils/common/previewMedia'
import loadErrorImage from '@/assets/images/image-load-error.png'

interface Props {
  media: any
}
const props = defineProps<Props>()

const chatStore = useChatStore()

const mediaBaseWidth = 240

const isLoadError = ref(false)

const mediaHeight = computed(() => {
  if (props.media.type === 'IMAGE') {
    if (isLoadError.value) {
      return mediaBaseWidth
    }

    const rate = props.media.imageWidth / props.media.imageHeight
    const height = mediaBaseWidth / rate
    return height
  } else {
    const rate = props.media.videoWidth / props.media.videoHeight
    const height = mediaBaseWidth / rate
    return height
  }
})

function previewMedia(url: string) {
  previewMediaAssets(chatStore.currentMsgListMedia, {
    url,
    type: props.media.type
  })
}
</script>