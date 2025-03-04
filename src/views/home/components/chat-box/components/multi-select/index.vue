<template>
  <div class="absolute inset-0 flex-center gap-100px h-full z-9 bg-#fff dark:bg-#000">
    <div class="flex-center absolute top-10px right-10px w-30px h-30px cursor-pointer">
      <icon-material-symbols:close-rounded class="text-20px cursor-pointer" @click="closeMultiSelect" />
    </div>
    <n-button type="primary" strong secondary @click="mergeForward">
      {{ $t('page.chat.multiSelect.mergeAndForward') }}
    </n-button>
    <n-button type="primary" strong secondary @click="forwardByItem">
      {{ $t('page.chat.multiSelect.forwardByItem') }}
    </n-button>
  </div>
</template>

<script lang="ts" setup>
import { ConvTypeEnum } from '@/constants/conv'
import { MsgTypeEnum } from '@/constants/msg'
import { $t } from '@/locales'
import { useChatStore } from '@/store'

interface Emits {
  (e: 'sendMergeData', mergeData: any): void
  (e: 'forwardByItem', mergeMsgList: any): void
}
const emit = defineEmits<Emits>()

const chatStore = useChatStore()

function closeMultiSelect() {
  chatStore.setIsMultiSelect(false)
}

async function mergeForward() {
  const mergeMsgList = chatStore.multiSelectMsgList.sort((a, b) => a.message_server_time - b.message_server_time)
  if (mergeMsgList.length === 0) {
    return
  }

  const userInfoRes = await chatStore.getUserInfo(chatStore.currentConvID)
  console.log('userInfoRes', userInfoRes)
  if (userInfoRes) {
    const mergeData = {
      message_elem_array: [
        {
          merge_elem_title: chatStore.currentConv.conv_type === ConvTypeEnum.C2C
            ? `${chatStore.myInfo.user_profile_nick_name || chatStore.myInfo.user_profile_identifier}和${userInfoRes.user_profile_nick_name || userInfoRes.user_profile_identifier}的聊天记录`
            : '合并群消息',
          merge_elem_abstract_array: mergeMsgList.map(item => {
            const sender = item.message_sender_profile.user_profile_nick_name || item.message_sender_profile.user_profile_identifier
            let msgContent = ''
            switch (item.message_elem_array[0].elem_type) {
              case MsgTypeEnum.TEXT:
                msgContent = item.message_elem_array[0].text_elem_content
                break
              case MsgTypeEnum.IMAGE:
                msgContent = $t('msgPlaceholders.image')
                break
              case MsgTypeEnum.SOUND:
                msgContent = $t('msgPlaceholders.sound')
                break
              case MsgTypeEnum.CUSTOM:
                msgContent = $t('msgPlaceholders.customMessage')
                break
              case MsgTypeEnum.FILE:
                msgContent = $t('msgPlaceholders.file')
                break
              case MsgTypeEnum.LOCATION:
                msgContent = $t('msgPlaceholders.location')
                break
              case MsgTypeEnum.VIDEO:
                msgContent = $t('msgPlaceholders.video')
                break
              case MsgTypeEnum.MERGE:
                msgContent = item.message_elem_array[0].merge_elem_title
                break
            }
            return `${sender}: ${msgContent}`
          }),
          merge_elem_message_array: mergeMsgList,
          elem_type: MsgTypeEnum.MERGE
        }
      ]
    }
    console.log('mergeData', mergeData)
    emit('sendMergeData', mergeData)
  }
}

function forwardByItem() {
  const mergeMsgList = chatStore.multiSelectMsgList.sort((a, b) => a.message_server_time - b.message_server_time)
  if (mergeMsgList.length === 0) {
    return
  }
  emit('forwardByItem', mergeMsgList)
}
</script>
