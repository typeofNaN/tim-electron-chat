<template>
  <div @contextmenu="handleContextMenu($event)">
    <div v-html="transformEmojiText(props.msg.message_elem_array[0].text_elem_content)"
      class="flex gap-4px items-center flex-wrap py-4px px-10px b-rd-4px break-all text-gray-900 whitespace-pre-wrap"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']" />
    <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start" :x="dropdownX"
      :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
  </div>
</template>

<script lang="ts" setup>
import { useMsgDropdown } from '@/hooks'
import { transformEmojiText } from '@/utils/common/emoji'

interface Props {
  msg: any
}

const props = defineProps<Props>()

interface Emits {
  (e: 'forwardMsg', msg: any): void
  (e: 'editMsg', msg: any): void
  (e: 'quoteMsg', msg: any): void
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
} = useMsgDropdown(props.msg, { forwardMsg, editMsg, quoteMsg })

function forwardMsg() {
  emit('forwardMsg', props.msg)
}

function editMsg() {
  emit('editMsg', props.msg)
}

function quoteMsg() {
  const { msg } = props
  emit('quoteMsg', {
    messageId: msg.message_msg_id,
    abstract: msg.message_elem_array[0].text_elem_content,
    sender: msg.message_sender,
    type: 'text',
    timestamp: msg.message_server_time || msg.message_client_time,
    sequence: msg.message_seq,
    nickname: msg.message_sender_profile.user_profile_friend_remark || msg.message_sender_profile.user_profile_nick_name
  })
}
</script>
