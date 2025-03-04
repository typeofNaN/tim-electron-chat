<template>
  <n-avatar v-bind="$attrs" :src="avatarUrl" class="select-none" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import defaultAvatar from '@/assets/images/logo.png'

defineOptions({ name: 'CustomAvatar' })

interface Props {
  src?: string
}
const props = defineProps<Props>()

const avatarUrl = computed(() => {
  if (!props.src) {
    return defaultAvatar
  }

  if (props.src.startsWith('http')) {
    return props.src
  }

  return import.meta.env.VITE_BASE_FILE_URL + props.src
})
</script>
