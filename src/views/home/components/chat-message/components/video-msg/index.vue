<template>
  <div class="relative b-rd-4px overflow-hidden" :class="[videoLayoutRow ? 'w-400px' : 'w-200px']"
    :style="{ height: `${videoHeight}px` }" @contextmenu="handleContextMenu($event)">
    <video ref="videoRef" :src="videoPath" controls controlslist="nodownload noremoteplayback noplaybackrate"
      :disablePictureInPicture="true" class="w-full h-full object-contain" />
    <n-dropdown :show="dropdownVisible" :options="dropdownOptions" placement="bottom-start" :x="dropdownX"
      :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useMsgDropdown } from '@/hooks'

interface Props {
  msg: any
}

const props = defineProps<Props>()

interface Emits {
  (e: 'forwardMsg', msg: any): void
}

const emit = defineEmits<Emits>()

const {
  dropdownVisible,
  dropdownX,
  dropdownY,
  dropdownOptions,
  handleContextMenu,
  handleDropdown,
  hideDropdown
} = useMsgDropdown(props.msg, { videoMutedPlay, forwardMsg })

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

function videoMutedPlay() {
  videoRef.value!.muted = true
  videoRef.value!.play()
}

function forwardMsg() {
  emit('forwardMsg', props.msg)
}
</script>
