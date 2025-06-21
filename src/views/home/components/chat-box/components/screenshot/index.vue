<template>
  <div class="flex-center mr-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer"
    :class="[props.disabled && 'opacity-50 cursor-not-allowed']">
    <n-tooltip trigger="hover">
      <template #trigger>
        <icon-tdesign:screenshot @click="captureScreen" />
      </template>
      {{ $t('chat.screenshot', { command }) }}
    </n-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { $t } from '@/locales'

interface Props {
  disabled: boolean
}
const props = defineProps<Props>()

const command = computed(() => {
  if (process.platform === 'win32') {
    return '(win + shift + s)'
  }

  return ''
})

async function captureScreen() {
  if (props.disabled) {
    return
  }

  const { ipcRenderer } = require('electron')
  ipcRenderer.send('captureScreen')
}
</script>
