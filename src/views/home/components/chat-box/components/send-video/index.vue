<template>
  <div class="flex-center mr-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-upload :show-file-list="false" :accept="AcceptVideoFileType.join(',')" class="select-media flex-center"
          @change="uploadFileChange">
          <icon-material-symbols:video-library-outline />
        </n-upload>
      </template>
      {{ $t('chat.sendVideo') }}
    </n-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { UploadFileInfo } from 'naive-ui'
import { v4 as uuidV4 } from 'uuid'

import { AcceptVideoFileType } from '@/constants/acceptFileType'
import { MsgTypeEnum } from '@/constants/msg'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { getFileExt } from '@/utils/common/file'

const { ipcRenderer } = require('electron')

const chatStore = useChatStore()

/**
 * 处理视频文件上传变更事件
 * @param file 上传的文件信息对象
 */
function uploadFileChange({ file }: { file: UploadFileInfo }) {
  const videoUrl = URL.createObjectURL(file.file!)
  const videoObj = document.createElement('video')
  videoObj.onloadedmetadata = async () => {
    URL.revokeObjectURL(videoUrl)
    console.log(videoObj.videoWidth + videoObj.videoHeight)
    const messageMsgId = uuidV4()
    await chatStore.pushLocalMsg({
      message_msg_id: messageMsgId,
      message_client_time: Math.floor(new Date().getTime() / 1000),
      message_sender: chatStore.userID,
      message_sender_profile: chatStore.myInfo,
      message_elem_array: [
        {
          elem_type: MsgTypeEnum.VIDEO,
          video_elem_video_url: videoObj.src,
          video_elem_image_width: videoObj.videoWidth,
          video_elem_image_height: videoObj.videoHeight
        }
      ]
    })
    // 发送视频上传消息到主进程
    ipcRenderer.send('uploadVideoMsg', {
      userId: chatStore.userID,
      convId: chatStore.currentConvUserID, // 当前会话ID
      filePath: file.file!.path // 视频文件路径
    })

    // 监听主进程返回的视频信息
    ipcRenderer.once('videoMsgInfoRes', async (event, data) => {
      console.log(data, MsgTypeEnum.VIDEO)
      // 确保返回的视频信息属于当前会话
      if (data.convId === chatStore.currentConvUserID) {
        // 发送视频消息
        await chatStore.sendMsg(
          chatStore.currentConv.conv_id,
          chatStore.currentConv.conv_type,
          {
            message_elem_array: [
              {
                elem_type: MsgTypeEnum.VIDEO, // 消息类型为视频
                video_elem_video_type: getFileExt(file.file!.path), // 视频文件扩展名
                video_elem_video_path: file.file!.path, // 视频文件路径
                video_elem_video_duration: data.videoInfo.format.duration, // 视频时长
                video_elem_video_size: data.videoInfo.format.size, // 视频文件大小
                video_elem_image_type: data.imageInfo.type, // 视频封面图类型
                video_elem_image_size: data.imageInfo.size, // 封面图大小
                video_elem_image_path: data.imageInfo.path, // 封面图路径
                video_elem_image_width: data.imageInfo.width, // 视频宽度
                video_elem_image_height: data.imageInfo.height // 视频高度
              }
            ]
          },
          messageMsgId
        )

        videoObj.remove()
      }
    })
  }
  videoObj.src = videoUrl
  videoObj.load()
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