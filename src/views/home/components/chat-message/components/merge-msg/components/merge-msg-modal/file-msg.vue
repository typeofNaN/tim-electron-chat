<template>
  <div class="flex items-center px-16px py-10px w-260px h-80px b-rd-4px cursor-pointer bg-gray-100 dark:bg-gray-800"
    @click="handleClick">
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { getFileExt, getFileSize } from '@/utils/common/file'

const { ipcRenderer } = require('electron')

interface Props {
  msg: any
}

const props = defineProps<Props>()

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
</script>
