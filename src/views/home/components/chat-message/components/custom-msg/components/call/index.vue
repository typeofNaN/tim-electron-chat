<template>
  <div class="flex items-center gap-6px py-4px px-10px b-rd-4px text-gray-900 cursor-pointer"
    :class="[props.isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']" @click="createCall">
    <svg-icon :icon="props.msg.content.isVideoCall === 'Y' ? 'ic:round-videocam' : 'ic:round-call'" />
    <template v-if="props.msg.content.result === CallResultEnum.ACCEPT">
      {{ duration }}
    </template>
    <template v-else>
      {{ $t(CallResultMap[props.msg.content.result as CallResultEnum]) }}
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { CallResultEnum, CallResultMap } from '@/constants/callResult'
import { $t } from '@/locales'
import { useChatStore, useRtcStore } from '@/store'

interface Props {
  msg: any
  isMyMsg: boolean
}
const props = defineProps<Props>()

const chatStore = useChatStore()
const rtcStore = useRtcStore()

const duration = computed(() => {
  let seconds = props.msg.content.duration

  if (typeof seconds === 'string') {
    seconds = ~~Number(seconds)
  }
  seconds = ~~seconds
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
})

async function createCall() {
  const roomId = `C2C_${chatStore.currentConvID}_${new Date().getTime()}`
  rtcStore.setStrRoomId(roomId)

  rtcStore.setMyUserId(chatStore.userID)
  rtcStore.setCallType(props.msg.content.isVideoCall === 'Y' ? 'video' : 'voice')
  rtcStore.setApplyUser('me')
  const inviteId = await chatStore.inviteChat({
    type: 'signal',
    subtype: 'call',
    excludeFromHistoryMessage: true,
    content: {
      callerId: chatStore.userID,
      roomId: roomId,
      isVideoCall: props.msg.content.isVideoCall
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