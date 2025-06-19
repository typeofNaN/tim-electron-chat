<template>
  <n-config-provider :theme="theme.naiveTheme" :theme-overrides="theme.naiveThemeOverrides" :locale="naiveLocale"
    :date-locale="naiveDateLocale" class="h-full">
    <naive-provider>
      <router-view v-if="isInitIM" />
      <n-modal :show="needUpdate">
        <n-card :title="$t('system.updateApplication')" :bordered="false" size="small" role="dialog" aria-modal="true"
          class="w-300px h-300px">
          <div class="flex-center w-full h-full">
            <n-progress type="circle" :percentage="updatePercent" />
          </div>
        </n-card>
      </n-modal>
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGlobalEvents } from '@/composables'
import { naiveLocales, naiveDateLocales } from '@/locales/naive'
import {
  subscribeStore,
  useAppStore,
  useChatStore,
  useThemeStore
} from '@/store'
import { localStg } from '@/utils'
import { MsgTypeEnum } from './constants/msg'

const { ipcRenderer } = require('electron')

const router = useRouter()

const appStore = useAppStore()

const theme = useThemeStore()

const chatStore = useChatStore()

const naiveLocale = computed(() => {
  return naiveLocales[appStore.currentLocale]
})

const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.currentLocale]
})

const isInitIM = ref(false)

const needUpdate = ref(false)
const updatePercent = ref(0)

onMounted(async () => {
  checkUpdate()
  ipcListener()
  chatStore.initIM()
  const userId = localStg.get('userID')
  const userSig = localStg.get('userSig')
  if (userId && userSig) {
    const res = await chatStore.loginIM(userId, userSig)
    if (!res) {
      localStg.remove('userID')
      localStg.remove('userSig')
      router.replace({ name: 'login' })
    }
  }
  isInitIM.value = true
})

subscribeStore()
useGlobalEvents()

function checkUpdate() {
  ipcRenderer.on('downloadProgress', (e, data) => {
    needUpdate.value = true
    updatePercent.value = parseInt(data.percent)
  })
}

function ipcListener() {
  ipcRenderer.on('exitCallRoom', (e, data) => {
    if (data.applyUser === 'me') {
      const msgData = {
        message_elem_array: [
          {
            elem_type: MsgTypeEnum.CUSTOM,
            custom_elem_data: JSON.stringify({
              type: 'chat',
              subtype: 'call',
              content: data.msgData
            })
          }
        ]
      }
      chatStore.sendMsg(data.convId, data.convType, msgData)
      if (data.msgData.result === 'cancelled') {
        chatStore.cancelInvite(data.inviteId, {
          type: 'signal',
          subtype: 'call',
          excludeFromHistoryMessage: false,
          content: {
            callerId: chatStore.myUserID,
            roomId: data.roomId,
            isVideoCall: data.msgData.isVideoCall,
          }
        })
      }
    } else if (data.applyUser === 'other') {
      if (data.msgData.result !== 'cancelled') {
        const now = Math.floor(new Date().getTime() / 1000)
        const conv = chatStore.convList.find(i => i.conv_id === data.convId)
        if (conv) {
          const msgData = {
            message_elem_array: [
              {
                elem_type: MsgTypeEnum.CUSTOM,
                custom_elem_data: JSON.stringify({
                  type: 'chat',
                  subtype: 'call',
                  content: data.msgData
                })
              }
            ],
            message_conv_id: data.convId,
            message_conv_type: data.convType,
            message_sender: data.convId,
            message_priority: 0,
            message_client_time: now,
            message_server_time: now,
            message_is_from_self: false,
            message_is_read: true,
            message_status: 0,
            message_sender_profile: {
              user_profile_face_url: conv.conv_face_url,
              user_profile_friend_remark: conv.conv_show_name,
              user_profile_identifier: data.convId
            },
          }
          chatStore.saveMsg(data.convId, data.convType, msgData)
        }
      }
    }
  })
}
</script>
