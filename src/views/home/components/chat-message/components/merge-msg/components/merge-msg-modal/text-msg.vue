<template>
  <div v-html="transformEmojiText(props.msg.message_elem_array[0].text_elem_content)"
    class="flex gap-4px items-center flex-wrap py-4px px-10px b-rd-4px break-all bg-gray-100 dark:bg-gray-800 whitespace-pre-wrap">
  </div>
</template>

<script lang="ts" setup>
import { transformEmojiText } from '@/utils/common/emoji'

interface Props {
  msg: any
}

const props = defineProps<Props>()
</script>
