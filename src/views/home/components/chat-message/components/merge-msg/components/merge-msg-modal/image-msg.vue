<template>
  <div :style="{ height: `${imageHeight}px` }">
    <n-image :src="imagePath" :width="imageBaseWidth" @error="loadImageError" class="b-rd-4px b-1 b-color-gray-200"
      :preview-disabled="true">
      <template #error>
        <n-image :src="loadErrorImage" :width="imageBaseWidth" />
      </template>
    </n-image>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import loadErrorImage from '@/assets/images/image-load-error.png'

interface Props {
  msg: any
}

const props = defineProps<Props>()

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

function loadImageError() {
  isLoadError.value = true
}
</script>
