<template>
  <div class="flex flex-col b-rd-4px overflow-hidden cursor-pointer" :style="{ height: `${imageHeight + 40}px` }"
    @click="handleClick">
    <n-image :src="msg.content.imageUrl" :width="imageBaseWidth" preview-disabled @error="loadImageError"
      class="b-rd-4px b-1 b-color-gray-200 mb-0">
      <template #error>
        <n-image :src="loadErrorImage" :width="imageBaseWidth" />
      </template>
    </n-image>
    <div class="flex items-center px-10px h-40px bg-#fff text-12px  bg-gray-100 dark:text-gray-100 dark:bg-gray-800"
      :style="{ width: `${imageBaseWidth}px` }">
      <custom-avatar :src="msg.content.authorAvatarUrl" round :size="16" class="mr-6px" />
      <span class="ellipsis-text w-[calc(100%-22px)]">{{ msg.content.authorNickname }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { $t } from '@/locales'
import loadErrorImage from '@/assets/images/image-load-error.png'

interface Props {
  msg: any
}
const props = defineProps<Props>()

const imageBaseWidth = 180

const isLoadError = ref(false)

const imageHeight = computed(() => {
  if (isLoadError.value) {
    return imageBaseWidth
  }

  const rate = props.msg.content.imageWidth / props.msg.content.imageHeight
  const height = imageBaseWidth / rate
  return height
})

function loadImageError() {
  isLoadError.value = true
}

function handleClick() {
  window.$message?.info($t('tip.toAppLook'))
}
</script>
