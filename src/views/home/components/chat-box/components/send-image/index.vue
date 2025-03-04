<template>
  <div class="flex-center mr-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-upload :show-file-list="false" :accept="AcceptImageFileType.join(',')" class="select-media flex-center"
          @change="uploadFileChange">
          <icon-material-symbols:imagesmode-outline />
        </n-upload>
      </template>
      {{ $t('chat.sendImage') }}
    </n-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { UploadFileInfo } from 'naive-ui'
import { v4 as uuidV4 } from 'uuid'
import { AcceptImageFileType } from '@/constants/acceptFileType'
import { MsgTypeEnum } from '@/constants/msg'
import { $t } from '@/locales'
import { useChatStore } from '@/store'

const chatStore = useChatStore()

function uploadFileChange({ file }: { file: UploadFileInfo }) {
  const img = new Image()
  img.onload = async () => {
    const messageMsgId = uuidV4()
    const blob = new Blob([await file.file!.arrayBuffer()], { type: file.file!.type })
    await chatStore.pushLocalMsg({
      message_msg_id: messageMsgId,
      message_client_time: Math.floor(new Date().getTime() / 1000),
      message_sender: chatStore.userID,
      message_sender_profile: chatStore.myInfo,
      message_elem_array: [
        {
          elem_type: MsgTypeEnum.IMAGE,
          image_elem_orig_url: URL.createObjectURL(blob),
          image_elem_orig_pic_width: img.width,
          image_elem_orig_pic_height: img.height
        }
      ]
    })
    await chatStore.sendMsg(
      chatStore.currentConv.conv_id,
      chatStore.currentConv.conv_type,
      {
        message_elem_array: [
          {
            elem_type: MsgTypeEnum.IMAGE,
            image_elem_orig_path: file.file!.path
          }
        ]
      },
      messageMsgId
    )
  }
  img.src = URL.createObjectURL(file.file!)
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