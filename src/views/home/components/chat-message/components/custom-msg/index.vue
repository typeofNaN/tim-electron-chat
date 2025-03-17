<template>
  <div @contextmenu="handleContextMenu($event)">
    <PersonalCard v-if="msgData.subtype === 'personal_card'" :msg="msgData" :isMyMsg="isMyMsg" />
    <Call v-else-if="msgData.subtype === 'call'" :msg="msgData" :isMyMsg="isMyMsg" />
    <Post v-else-if="msgData.subtype === 'post'" :msg="msgData" />
    <Note v-else-if="msgData.subtype === 'note'" :msg="msgData" />
    <FriendApply v-else-if="msgData.subtype === 'friend_application'" :msg="msgData" :isMyMsg="isMyMsg" />
    <div v-else class="display-inline-block py-4px px-10px b-rd-4px break-all text-gray-900"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']">
      {{ $t('msgNotification.customMessage') }}
    </div>
    <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start" :x="dropdownX"
      :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useMsgDropdown } from '@/hooks'
import { $t } from '@/locales'
import {
  PersonalCard,
  Call,
  Post,
  Note,
  FriendApply
} from './components'

interface Props {
  msg: any
}
const props = defineProps<Props>()

interface Emits {
  (e: 'forwardMsg', msg: any): void
  (e: 'quoteMsg', msg: any): void
}
const emit = defineEmits<Emits>()

const msgData = computed(() => props.msg.message_elem_array[0].custom_elem_data)

const {
  dropdownVisible,
  dropdownX,
  dropdownY,
  dropdownOptions,
  isMyMsg,
  handleContextMenu,
  handleDropdown,
  hideDropdown
} = useMsgDropdown(props.msg, { forwardMsg, quoteMsg })

function forwardMsg() {
  emit('forwardMsg', props.msg)
}

function quoteMsg() {
  const { msg } = props
  emit('quoteMsg', {
    messageId: msg.message_msg_id,
    sender: msg.message_sender,
    type: msgData.value.subtype,
    timestamp: msg.message_server_time || msg.message_client_time,
    sequence: msg.message_seq,
    nickname: msg.message_sender_profile.user_profile_friend_remark || msg.message_sender_profile.user_profile_nick_name
  })
}
</script>
