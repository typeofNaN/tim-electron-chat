<template>
  <div @contextmenu="handleContextMenu($event)" :style="{ height: `${imageHeight}px` }">
    <n-image :src="imagePath" :width="imageBaseWidth" @error="loadImageError" class="b-rd-4px b-1 b-color-gray-200">
      <template #error>
        <n-image :src="loadErrorImage" :width="imageBaseWidth" />
      </template>
    </n-image>
    <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start" :x="dropdownX"
      :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useMsgDropdown } from '@/hooks'
import loadErrorImage from '@/assets/images/image-load-error.png'

interface Props {
  msg: any
}

const props = defineProps<Props>()

interface Emits {
  (e: 'forwardMsg', msg: any): void
}
const emit = defineEmits<Emits>()

const imageBaseWidth = 260

const isLoadError = ref(false)

const imageHeight = computed(() => {
  if (isLoadError.value) {
    return imageBaseWidth
  }

  const rate = props.msg.message_elem_array[0].image_elem_orig_pic_width / props.msg.message_elem_array[0].image_elem_orig_pic_height
  const height = imageBaseWidth / rate
  return height
})

const imagePath = computed(() => {
  return props.msg.message_elem_array[0].image_elem_orig_path || props.msg.message_elem_array[0].image_elem_orig_url
})

const {
  dropdownVisible,
  dropdownX,
  dropdownY,
  dropdownOptions,
  handleContextMenu,
  handleDropdown,
  hideDropdown
} = useMsgDropdown(props.msg, { forwardMsg })

function forwardMsg() {
  emit('forwardMsg', props.msg)
}

function loadImageError() {
  isLoadError.value = true
}
</script>
