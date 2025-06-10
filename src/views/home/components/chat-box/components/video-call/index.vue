<template>
  <div class="flex-center ml-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer"
    @click="createVideoCall">
    <n-tooltip trigger="hover">
      <template #trigger>
        <icon-material-symbols:camera-video-outline-rounded />
      </template>
      {{ $t('chat.videoChat') }}
    </n-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/locales'
import { useChatStore, useRtcStore } from '@/store'

const chatStore = useChatStore()
const rtcStore = useRtcStore()

async function createVideoCall() {
  const roomId = `C2C_${chatStore.currentConvID}_${new Date().getTime()}`
  rtcStore.setStrRoomId(roomId)

  rtcStore.setMyUserId(chatStore.userID)
  rtcStore.setCallType('video')
  rtcStore.setApplyUser('me')
  const inviteId = await chatStore.inviteChat({
    type: 'signal',
    subtype: 'call',
    excludeFromHistoryMessage: false,
    content: {
      callerId: chatStore.userID,
      roomId: roomId,
      isVideoCall: 'Y'
    }
  })
  rtcStore.setCallUser({
    id: chatStore.currentConvID,
    name: chatStore.currentConv.conv_show_name || chatStore.currentConv.conv_id,
    avatar: chatStore.currentConv.conv_face_url,
    inviteId
  })
  const { ipcRenderer } = require('electron')

  ipcRenderer.send('createCallWindow')
}
</script>