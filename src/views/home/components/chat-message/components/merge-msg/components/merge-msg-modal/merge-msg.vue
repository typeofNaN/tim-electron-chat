<template>
  <div class="py-4px px-10px b-rd-4px w-300px cursor-pointer bg-gray-100" @click="handleClick">
    <n-ellipsis class="mt-4px mb-10px text-15px">{{ props.msg.message_elem_array[0].merge_elem_title }}</n-ellipsis>
    <div v-for="(item, index) in props.msg.message_elem_array[0].merge_elem_abstract_array.slice(0, 3)" :key="index"
      class="flex gap-4px items-center overflow-hidden whitespace-nowrap text-ellipsis text-gray-700 text-13px"
      v-html="transformEmojiText(item)"></div>
    <div class="my-6px h-1px bg-gray-300"></div>
    <div class="text-13px text-gray-700">
      {{ $t('page.chat.chatHistory') }}
    </div>
    <MergeMsgModal ref="mergeMsgModalRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { transformEmojiText } from '@/utils/common/emoji'
import MergeMsgModal from './index.vue'

interface Props {
  msg: any
}

const props = defineProps<Props>()

const mergeMsgModalRef = ref()

function handleClick() {
  mergeMsgModalRef.value.handleDownload(props.msg)
}
</script>
