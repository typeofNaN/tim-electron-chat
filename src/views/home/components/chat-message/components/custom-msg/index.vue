<template>
  <div class="b-rd-4px overflow-hidden">
    <div @contextmenu="handleContextMenu($event)">
      <PersonalCard v-if="msgData.subtype === 'personal_card'" :msg="msgData" :isMyMsg="isMyMsg" />
      <Call v-else-if="msgData.subtype === 'call'" :msg="msgData" :isMyMsg="isMyMsg" />
      <FriendApply v-else-if="msgData.subtype === 'friend_application'" :msg="msgData" :isMyMsg="isMyMsg" />
      <PhotoGroup v-else-if="msgData.subtype === 'grouped_photos'" :msg="msgData" :isMyMsg="isMyMsg" />
      <FriendOnline v-else-if="msgData.subtype === 'new_friend_online'" :msg="msgData" :isMyMsg="isMyMsg" />
      <div v-else class="display-inline-block py-4px px-10px b-rd-4px break-all text-gray-900"
        :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']">
        {{ $t('msgNotification.customMessage') }}
      </div>
      <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start"
        :x="dropdownX" :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
    </div>
    <div
      v-if="msg.message_cloud_custom_str && msg.message_cloud_custom_str.editContent && !(msgData.subtype === 'grouped_photos' && msgData.content.text)"
      class="flex gap-4px items-center flex-wrap py-4px px-10px mt-.5px text-gray-900"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']"
      v-html="transformEmojiText(msg.message_cloud_custom_str.editContent.text)" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useMsgDropdown } from '@/hooks'
import { $t } from '@/locales'
import { transformEmojiText } from '@/utils/common/emoji'
import {
  PersonalCard,
  Call,
  FriendApply,
  PhotoGroup,
  FriendOnline
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
  const publicData = {
    messageId: msg.message_msg_id,
    sender: msg.message_sender,
    timestamp: msg.message_server_time || msg.message_client_time,
    sequence: msg.message_seq,
    nickname: msg.message_sender_profile.user_profile_friend_remark || msg.message_sender_profile.user_profile_nick_name
  }

  // 图组只有一个元素时，将其看为单图片或单视频
  if (msgData.value.subtype === 'grouped_photos' && msgData.value.content.medias.length === 1) {
    const media = msgData.value.content.medias[0]
    const isImage = media.type === 'IMAGE'
    emit('quoteMsg', {
      ...publicData,
      type: isImage ? 'image' : 'video',
      imageUrl: isImage ? media.imageUrl : media.coverUrl,
      imageWidth: isImage ? media.imageWidth : media.coverWidth,
      imageHeight: isImage ? media.imageHeight : media.coverHeight
    })
  } else {
    emit('quoteMsg', {
      ...publicData,
      type: msgData.value.subtype
    })
  }
}
</script>
