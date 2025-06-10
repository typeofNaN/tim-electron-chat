<template>
  <div class="b-1 b-#ccc b-solid" :style="{ width: `${props.wh}px`, height: `${props.wh}px` }">
    <n-image v-if="props.media.type === 'IMAGE'" :src="props.media.imageUrl" :width="props.wh - 2"
      :height="props.wh - 2" object-fit="cover" class="mb-0" :style="{ height: `${props.wh - 2}px` }">
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
import loadErrorImage from '@/assets/images/image-load-error.png'

interface Props {
  wh: number
  media: any
}
const props = defineProps<Props>()
</script>