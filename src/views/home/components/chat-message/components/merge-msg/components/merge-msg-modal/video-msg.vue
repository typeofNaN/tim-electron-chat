<template>
  <div class="relative b-rd-4px overflow-hidden" :class="[videoLayoutRow ? 'w-400px' : 'w-200px']"
    :style="{ height: `${videoHeight}px` }">
    <video ref="videoRef" :src="videoPath" controls controlslist="noremoteplayback noplaybackrate"
      :disablePictureInPicture="true" class="w-full h-full object-contain" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

interface Props {
  msg: any
}

const props = defineProps<Props>()

const videoRef = ref<HTMLVideoElement>()

const videoLayoutRow = computed(() => props.msg.message_elem_array[0].video_elem_image_width > props.msg.message_elem_array[0].video_elem_image_height)

const videoHeight = computed(() => {
  const rate = props.msg.message_elem_array[0].video_elem_image_width / props.msg.message_elem_array[0].video_elem_image_height
  const height = (videoLayoutRow.value ? 400 : 200) / rate
  return height
})

const videoPath = computed(() => {
  return props.msg.message_elem_array[0].video_elem_video_path || props.msg.message_elem_array[0].video_elem_video_url
})
</script>
