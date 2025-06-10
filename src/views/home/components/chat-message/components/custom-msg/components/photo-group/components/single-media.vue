<template>
  <div class="b-1 b-#ccc b-solid" :style="{ width: `${mediaBaseWidth}px`, height: `${mediaHeight}px` }">
    <n-image v-if="props.media.type === 'IMAGE'" :src="props.media.imageUrl" :width="mediaBaseWidth - 2"
      :height="mediaHeight - 2" object-fit="cover" class="mb-0" :style="{ height: `${mediaHeight - 2}px` }">
      <template #error>
        <n-image :src="loadErrorImage" :width="mediaBaseWidth - 2" />
      </template>
    </n-image>
    <video v-else :src="props.media.videoUrl" controls controlslist="noremoteplayback noplaybackrate"
      :disablePictureInPicture="true" class="w-full h-full object-contain"
      :style="{ width: `${mediaBaseWidth - 2}px`, height: `${mediaHeight - 2}px` }" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import loadErrorImage from '@/assets/images/image-load-error.png'

interface Props {
  media: any
}
const props = defineProps<Props>()

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
</script>