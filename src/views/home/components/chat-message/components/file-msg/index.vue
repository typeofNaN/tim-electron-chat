<template>
  <div class="w-260px b-rd-4px overflow-hidden">
    <div class="flex items-center px-16px py-10px w-260px h-80px b-rd-4px text-gray-900 cursor-pointer"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']" @click="handleClick"
      @contextmenu="handleContextMenu($event)">
      <div class="w-[calc(100%-40px)] pr-10px">
        <n-ellipsis class="text-14px w-full">
          <template v-if="fileIcon === 'file-music'">
            <audio v-show="false" ref="audioRef" />
            <icon-icon-park-outline:volume-notice v-if="isPlaying" />
          </template>
          {{ props.msg.message_elem_array[0].file_elem_file_name }}
        </n-ellipsis>
        <div class="text-12px">
          {{ fileSize }}
        </div>
      </div>
      <div class="flex-center w-40px h-40px">
        <svg-icon :local-icon="fileIcon" class="text-30px" />
      </div>
      <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start"
        :x="dropdownX" :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
    </div>
    <div v-if="msg.message_cloud_custom_str && msg.message_cloud_custom_str.editContent"
      class="py-4px px-10px mt-.5px text-gray-900"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']">
      {{ msg.message_cloud_custom_str.editContent.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useMsgDropdown } from '@/hooks'
import { getFileExt, getFileSize } from '@/utils/common/file'

const { ipcRenderer } = require('electron')

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

const fileIconMap = {
  txt: 'txt',
  mp3: 'music',
  mp4: 'video',
  rmvb: 'video',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'gif',
  pdf: 'pdf',
  csv: 'csv',
  doc: 'docx',
  docx: 'docx',
  xls: 'xlsx',
  xlsx: 'xlsx',
  ppt: 'pptx',
  pptx: 'pptx',
  zip: 'zip',
  apk: 'apk',
  exe: 'exe'
}

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

const audioRef = ref<HTMLAudioElement>()
const isPlaying = ref(false)

const fileExt = computed(() => getFileExt(props.msg.message_elem_array[0].file_elem_file_name))
const fileSize = computed(() => getFileSize(props.msg.message_elem_array[0].file_elem_file_size))

const fileIcon = computed(() => `file-${fileIconMap[fileExt.value as keyof typeof fileIconMap] || 'default'}`)

function handleClick() {
  switch (fileIcon.value) {
    case 'file-music': {
      if (audioRef.value?.src === props.msg.message_elem_array[0].file_elem_url) {
        audioRef.value!.pause()
        audioRef.value!.src = ''
        isPlaying.value = false
      } else {
        audioRef.value!.src = ''
        audioRef.value!.src = props.msg.message_elem_array[0].file_elem_url
        audioRef.value!.play()
        isPlaying.value = true
      }
      break
    }
    default: {
      ipcRenderer.send('downloadFile', {
        fileName: props.msg.message_elem_array[0].file_elem_file_name,
        downloadPath: props.msg.message_elem_array[0].file_elem_url,
        customSavePath: false,
        openFile: true
      })
      break
    }
  }
}

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
    type: 'file',
    timestamp: msg.message_server_time || msg.message_client_time,
    sequence: msg.message_seq,
    nickname: msg.message_sender_profile.user_profile_friend_remark || msg.message_sender_profile.user_profile_nick_name,
    mimeType: fileIconMap[fileExt.value as keyof typeof fileIconMap] || ''
  })
}
</script>
