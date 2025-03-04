<template>
  <div class="flex items-center w-400px h-240px b-rd-4px cursor-pointer overflow-hidden">
    <div ref="domRef" class="h-full w-full"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useScriptTag } from '@vueuse/core'

import { TENCENT_MAP_SDK_URL } from '@/config/mapSdk'

interface Props {
  msg: any
}

const props = defineProps<Props>()

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
</script>