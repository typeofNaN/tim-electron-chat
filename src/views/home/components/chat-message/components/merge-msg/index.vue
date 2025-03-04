<template>
  <div class="py-4px px-10px b-rd-4px w-300px text-gray-900 cursor-pointer"
    :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']" @click="handleClick"
    @contextmenu="handleContextMenu($event)">
    <n-ellipsis class="mt-4px mb-10px text-15px">{{ props.msg.message_elem_array[0].merge_elem_title }}</n-ellipsis>
    <div v-for="(item, index) in props.msg.message_elem_array[0].merge_elem_abstract_array.slice(0, 3)" :key="index"
      class="flex gap-4px items-center overflow-hidden whitespace-nowrap text-ellipsis text-gray-700 text-13px"
      :class="[!isMyMsg && 'dark:text-gray-300']" v-html="transformEmojiText(item)"></div>
    <div class="my-6px h-1px bg-gray-300"></div>
    <div class="text-13px text-gray-700" :class="[!isMyMsg && 'dark:text-gray-300']">
      {{ $t('page.chat.chatHistory') }}
    </div>
    <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start" :x="dropdownX"
      :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
    <MergeMsgModal ref="mergeMsgModalRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { useMsgDropdown } from '@/hooks'
import { $t } from '@/locales'
import { transformEmojiText } from '@/utils/common/emoji'
import MergeMsgModal from './components/merge-msg-modal/index.vue'

interface Props {
  msg: any
}
const props = defineProps<Props>()

interface Emits {
  (e: 'forwardMsg', msg: any): void
}
const emit = defineEmits<Emits>()

const mergeMsgModalRef = ref()

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

function handleClick() {
  mergeMsgModalRef.value.handleDownload(props.msg)
}

function forwardMsg() {
  emit('forwardMsg', props.msg)
}
</script>
