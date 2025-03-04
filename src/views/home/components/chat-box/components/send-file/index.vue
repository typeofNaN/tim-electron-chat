<template>
  <div class="flex-center mr-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-upload :show-file-list="false" accept="*" class="select-media flex-center" @change="uploadFileChange">
          <icon-material-symbols:drive-file-move-outline />
        </n-upload>
      </template>
      {{ $t('chat.sendFile') }}
    </n-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { UploadFileInfo } from 'naive-ui'
import { v4 as uuidV4 } from 'uuid'

import { MsgTypeEnum } from '@/constants/msg'
import { $t } from '@/locales'
import { useChatStore } from '@/store'

const chatStore = useChatStore()

async function uploadFileChange({ file }: { file: UploadFileInfo }) {
  const customData = {
    mimeType: file.file!.type,
    fileSize: file.file!.size
  }
  const messageMsgId = uuidV4()
  await chatStore.pushLocalMsg({
    message_msg_id: messageMsgId,
    message_client_time: Math.floor(new Date().getTime() / 1000),
    message_sender: chatStore.userID,
    message_sender_profile: chatStore.myInfo,
    message_elem_array: [
      {
        elem_type: MsgTypeEnum.FILE,
        file_elem_file_name: file.file!.name,
        file_elem_file_size: file.file!.size
      }
    ]
  })
  await chatStore.sendMsg(
    chatStore.currentConv.conv_id,
    chatStore.currentConv.conv_type,
    {
      message_cloud_custom_str: JSON.stringify(customData),
      message_elem_array: [
        {
          elem_type: MsgTypeEnum.FILE,
          file_elem_file_name: file.file!.name,
          file_elem_file_size: file.file!.size,
          file_elem_file_path: file.file!.path
        }
      ]
    },
    messageMsgId
  )
}
</script>

<style lang="scss" scoped>
.select-media {
  :deep(.n-upload-trigger) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>