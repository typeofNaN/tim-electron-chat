<template>
  <div class="flex items-center w-300px h-180px b-rd-4px cursor-pointer overflow-hidden"
    @contextmenu="handleContextMenu($event)">
    <div ref="domRef" class="h-full w-full" />
    <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start" :x="dropdownX"
      :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useScriptTag } from '@vueuse/core'

import { TENCENT_MAP_SDK_URL } from '@/config/mapSdk'
import { useMsgDropdown } from '@/hooks'

interface Props {
  msg: any
}
const props = defineProps<Props>()

interface Emits {
  (e: 'forwardMsg', msg: any): void
  (e: 'quoteMsg', msg: any): void
}
const emit = defineEmits<Emits>()

const { load } = useScriptTag(TENCENT_MAP_SDK_URL)

const domRef = ref<HTMLDivElement>()

async function renderMap() {
  await load(true)
  if (!domRef.value) return
  // @ts-ignore
  new TMap.Map(domRef.value, {
    // @ts-ignore
    center: new TMap.LatLng(
      props.msg.message_elem_array[0].location_elem_latitude,
      props.msg.message_elem_array[0].location_elem_longitude
    ),
    scrollwheel: false,
    zoom: 12,
    viewMode: '3D'
  });
}

onMounted(() => {
  renderMap()
})

const {
  dropdownVisible,
  dropdownX,
  dropdownY,
  dropdownOptions,
  handleContextMenu,
  handleDropdown,
  hideDropdown
} = useMsgDropdown(props.msg, { forwardMsg, quoteMsg })

function forwardMsg() {
  emit('forwardMsg', props.msg)
}

function quoteMsg() {
  const { msg } = props
  emit('quoteMsg', {
    messageId: msg.message_msg_id,
    sender: msg.message_sender,
    type: 'location',
    timestamp: msg.message_server_time || msg.message_client_time,
    sequence: msg.message_seq,
    nickname: msg.message_sender_profile.user_profile_friend_remark || msg.message_sender_profile.user_profile_nick_name
  })
}
</script>
