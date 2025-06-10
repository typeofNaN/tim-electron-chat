<template>
  <div class="b-rd-4px overflow-hidden w-360px">
    <div class="flex items-center px-4px w-360px h-40px cursor-pointer"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:bg-gray-800']" @contextmenu="handleContextMenu($event)">
      <audio :src="audioPath" controls controlslist="noplaybackrate" class="w-full h-32px" />
      <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start"
        :x="dropdownX" :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
    </div>
    <div v-if="msg.message_cloud_custom_str && msg.message_cloud_custom_str.editContent"
      class="flex gap-4px items-center flex-wrap py-4px px-10px mt-1px text-gray-900"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']"
      v-html="transformEmojiText(props.msg.message_cloud_custom_str.editContent.text)" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

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

const audioPath = computed(() => {
  return props.msg.message_elem_array[0].sound_elem_file_path || props.msg.message_elem_array[0].sound_elem_url
})

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
    sender: msg.message_sender,
    type: 'audio',
    timestamp: msg.message_server_time || msg.message_client_time,
    sequence: msg.message_seq,
    nickname: msg.message_sender_profile.user_profile_friend_remark || msg.message_sender_profile.user_profile_nick_name
  })
}
</script>
