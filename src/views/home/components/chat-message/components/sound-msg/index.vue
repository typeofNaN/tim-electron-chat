<template>
  <div class="flex items-center px-10px w-400px h-70px b-rd-4px cursor-pointer"
    :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:bg-gray-800']" @contextmenu="handleContextMenu($event)">
    <audio :src="audioPath" controls controlslist="nodownload noplaybackrate" class="w-full" />
    <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start" :x="dropdownX"
      :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

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
  isMyMsg,
  handleContextMenu,
  handleDropdown,
  hideDropdown
} = useMsgDropdown(props.msg, { forwardMsg })

const audioPath = computed(() => {
  return props.msg.message_elem_array[0].sound_elem_file_path || props.msg.message_elem_array[0].sound_elem_url
})

function forwardMsg() {
  emit('forwardMsg', props.msg)
}
</script>
