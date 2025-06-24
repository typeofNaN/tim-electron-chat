<template>
  <hover-container class="w-40px h-full"
    :tooltip-content="isFullscreen ? $t('common.exitFullScreen') : $t('common.fullScreen')"
    :inverted="theme.header.inverted" @click="toggle">
    <icon-gridicons-fullscreen-exit v-if="isFullscreen" class="text-18px" />
    <icon-gridicons-fullscreen v-else class="text-18px" />
  </hover-container>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

import { $t } from '@/locales'
import { useThemeStore } from '@/store'

defineOptions({ name: 'FullScreen' })

const { isFullscreen, toggle } = useFullscreen()
const theme = useThemeStore()
</script>
