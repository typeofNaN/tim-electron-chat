<template>
  <n-avatar v-bind="$attrs" :src="avatarUrl" :fallback-src="defaultAvatar" class="select-none"
    :class="[isSystemNotification && 'bg-#f5852d']" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import defaultAvatar from '@/assets/images/logo.png'
import systemNotificationAvatar from '@/assets/images/system-notification.png'

defineOptions({ name: 'CustomAvatar' })

interface Props {
  src?: string
  isSystemNotification?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isSystemNotification: false
})

const avatarUrl = computed(() => {
  if (props.isSystemNotification) {
    return systemNotificationAvatar
  }

  if (!props.src) {
    return defaultAvatar
  }

  if (props.src.startsWith('http')) {
    return props.src
  }

  return import.meta.env.VITE_BASE_FILE_URL + props.src
})
</script>
