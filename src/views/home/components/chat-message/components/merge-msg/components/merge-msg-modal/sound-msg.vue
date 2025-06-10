<template>
  <div class="flex items-center px-10px w-360px h-40px b-rd-4px cursor-pointer bg-gray-100 dark:bg-gray-800">
    <audio :src="audioPath" controls controlslist="noplaybackrate" class="w-full h-32px" />
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