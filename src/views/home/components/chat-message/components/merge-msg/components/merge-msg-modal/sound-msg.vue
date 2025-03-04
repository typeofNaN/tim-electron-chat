<template>
  <div class="flex items-center px-10px w-400px h-70px b-rd-4px cursor-pointer bg-gray-100 dark:bg-gray-800">
    <audio :src="audioPath" controls controlslist="nodownload noplaybackrate" class="w-full" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  msg: any
}

const props = defineProps<Props>()

const audioPath = computed(() => {
  return props.msg.message_elem_array[0].sound_elem_file_path || props.msg.message_elem_array[0].sound_elem_url
})
</script>