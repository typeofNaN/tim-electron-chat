<template>
  <div class="b-rd-4px box-border overflow-hidden" :style="{ width: `${imageBaseWidth}px` }">
    <div @contextmenu="handleContextMenu($event)" :style="{ height: `${imageHeight}px` }">
      <n-image :src="imagePath" :width="imageBaseWidth" @error="loadImageError" class="b-rd-4px b-1 b-color-gray-200">
        <template #error>
          <n-image :src="loadErrorImage" :width="imageBaseWidth" />
        </template>
      </n-image>
      <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start"
        :x="dropdownX" :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
    </div>
    <div v-if="msg.message_cloud_custom_str && msg.message_cloud_custom_str.editContent"
      class="py-4px px-10px text-gray-900"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']">
      {{ msg.message_cloud_custom_str.editContent.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useMsgDropdown } from '@/hooks'
import loadErrorImage from '@/assets/images/image-load-error.png'

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

const imageBaseWidth = 260

const isLoadError = ref(false)

const imageHeight = computed(() => {
  if (isLoadError.value) {
    return imageBaseWidth
  }

  const rate = props.msg.message_elem_array[0].image_elem_orig_pic_width / props.msg.message_elem_array[0].image_elem_orig_pic_height
  const height = imageBaseWidth / rate
  return height
})

const imagePath = computed(() => {
  return props.msg.message_elem_array[0].image_elem_orig_path || props.msg.message_elem_array[0].image_elem_orig_url
})

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
    imageUrl: msg.message_elem_array[0].image_elem_orig_url,
    imageWidth: msg.message_elem_array[0].image_elem_orig_pic_width,
    imageHeight: msg.message_elem_array[0].image_elem_orig_pic_height,
    sender: msg.message_sender,
    type: 'image',
    timestamp: msg.message_server_time || msg.message_client_time,
    sequence: msg.message_seq,
    nickname: msg.message_sender_profile.user_profile_friend_remark || msg.message_sender_profile.user_profile_nick_name
  })
}

function loadImageError() {
  isLoadError.value = true
}
</script>
