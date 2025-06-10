<template>
  <div :class="[videoLayoutRow ? 'w-400px' : 'w-200px']" class="b-rd-4px box-border overflow-hidden">
    <div class="relative b-rd-4px overflow-hidden" :style="{ height: `${videoHeight}px` }"
      @contextmenu="handleContextMenu($event)">
      <video ref="videoRef" :src="videoPath" controls controlslist="noremoteplayback noplaybackrate"
        :disablePictureInPicture="true" class="w-full h-full object-contain" />
      <n-dropdown :show="dropdownVisible" :options="dropdownOptions" placement="bottom-start" :x="dropdownX"
        :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
    </div>
    <div v-if="msg.message_cloud_custom_str && msg.message_cloud_custom_str.editContent"
      class="flex gap-4px items-center flex-wrap py-4px px-10px text-gray-900"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']"
      v-html="transformEmojiText(props.msg.message_cloud_custom_str.editContent.text)" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useMsgDropdown } from '@/hooks'
import { transformEmojiText } from '@/utils/common/emoji'

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

const {
  dropdownVisible,
  dropdownX,
  dropdownY,
  dropdownOptions,
  isMyMsg,
  handleContextMenu,
  handleDropdown,
  hideDropdown
} = useMsgDropdown(props.msg, { videoMutedPlay, forwardMsg, editMsg, quoteMsg })

const videoRef = ref<HTMLVideoElement>()

const videoLayoutRow = computed(() => props.msg.message_elem_array[0].video_elem_image_width > props.msg.message_elem_array[0].video_elem_image_height)

const videoHeight = computed(() => {
  const rate = props.msg.message_elem_array[0].video_elem_image_width / props.msg.message_elem_array[0].video_elem_image_height
  const height = (videoLayoutRow.value ? 400 : 200) / rate
  return height
})

const videoPath = computed(() => {
  return props.msg.message_elem_array[0].video_elem_video_path || props.msg.message_elem_array[0].video_elem_video_url
})

function videoMutedPlay() {
  videoRef.value!.muted = true
  videoRef.value!.play()
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
    imageUrl: msg.message_elem_array[0].video_elem_image_url,
    imageWidth: msg.message_elem_array[0].video_elem_image_width,
    imageHeight: msg.message_elem_array[0].video_elem_image_height,
    sender: msg.message_sender,
    type: 'video',
    timestamp: msg.message_server_time || msg.message_client_time,
    sequence: msg.message_seq,
    nickname: msg.message_sender_profile.user_profile_friend_remark || msg.message_sender_profile.user_profile_nick_name
  })
}
</script>
