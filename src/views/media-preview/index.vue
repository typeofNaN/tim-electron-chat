<template>
  <div class="w-full h-full bg-#fff">
    <div class="w-full h-30px flex-y-center gap-4px px-4px text-#333">
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" :class="[currentIndex === 0 && 'text-#bbb']" @click="prev">
            <icon-ooui:previous-ltr />
          </div>
        </template>
        {{ $t('mediaPreview.prev') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" :class="[currentIndex === (mediaList.length - 1) && 'text-#bbb']" @click="next">
            <icon-ooui:previous-rtl />
          </div>
        </template>
        {{ $t('mediaPreview.next') }}
      </n-tooltip>
      <n-tooltip v-if="currentMedia.type === 'IMAGE'" trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="rotate(-90)">
            <icon-fa6-solid:arrow-rotate-left />
          </div>
        </template>
        {{ $t('mediaPreview.rotateLeft') }}
      </n-tooltip>
      <n-tooltip v-if="currentMedia.type === 'IMAGE'" trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="rotate(90)">
            <icon-fa6-solid:arrow-rotate-right />
          </div>
        </template>
        {{ $t('mediaPreview.rotateRight') }}
      </n-tooltip>
      <n-tooltip v-if="currentMedia.type === 'IMAGE'" trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="zoom(0.2)">
            <icon-zondicons:zoom-in />
          </div>
        </template>
        {{ $t('mediaPreview.zoomIn') }}
      </n-tooltip>
      <n-tooltip v-if="currentMedia.type === 'IMAGE'" trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="zoom(-0.2)">
            <icon-zondicons:zoom-out />
          </div>
        </template>
        {{ $t('mediaPreview.zoomOut') }}
      </n-tooltip>
      <n-tooltip v-if="currentMedia.type === 'IMAGE'" trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="resetStyle">
            <svg-icon icon="garden:original-size-stroke-12" />
          </div>
        </template>
        {{ $t('mediaPreview.resetOrigin') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="download">
            <icon-bxs:download />
          </div>
        </template>
        {{ $t('mediaPreview.download') }}
      </n-tooltip>
      <div class="h-full flex-grow-1" style="-webkit-app-region: drag;" />
    </div>
    <div class="relative w-full h-[calc(100%-30px)] overflow-hidden bg-#f9f9f9">
      <img v-if="currentMedia.type === 'IMAGE'" :src="currentMedia.url" alt=""
        class="relative w-full h-full object-contain select-none cursor-move transition-duration-100 ease-in-out transition-property-transform"
        :draggable="false" :style="imageStyle" @mousedown="mousedown" @mousemove="mousemove($event)" @mouseup="mouseup"
        @mouseleave="mouseup" @wheel="wheel($event)">
      <div v-else class="px-80px w-full h-full">
        <video :src="currentMedia.url" controls controlslist="noremoteplayback noplaybackrate" muted autoplay
          :disablePictureInPicture="true" class="w-full h-full object-contain select-none" />
      </div>
      <div class="flex-center absolute top-0px left-0px w-80px h-full opacity-0 text-36px text-#666"
        :class="[currentIndex !== 0 && 'cursor-pointer hover:opacity-100']" @click="prev">
        <icon-mdi:arrow-left-circle />
      </div>
      <div class="flex-center absolute top-0px right-0px w-80px h-full opacity-0 text-36px text-#666"
        :class="[currentIndex !== (mediaList.length - 1) && 'cursor-pointer hover:opacity-100']" @click="next">
        <icon-mdi:arrow-right-circle />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { throttle } from 'lodash-es'

import { $t } from '@/locales'

const mediaList = ref<{ url: string, type: 'IMAGE' | 'VIDEO' }[]>([])
const currentMedia = ref({
  url: '',
  type: ''
})

const currentIndex = ref(0)
const currentRotate = ref(0)
const currentZoom = ref(1)

const imgOffsetX = ref(0)
const imgOffsetY = ref(0)

const isDragging = ref(false)

const { ipcRenderer } = require('electron')

ipcRenderer.on('showPreview', (event, data: { mediaList: { url: string, type: 'IMAGE' | 'VIDEO' }[], currentMedia: { url: string, type: 'IMAGE' | 'VIDEO' } }) => {
  mediaList.value = data.mediaList
  currentMedia.value = data.currentMedia
  currentIndex.value = data.mediaList.findIndex(item => item.url === data.currentMedia.url)
  currentRotate.value = 0
  currentZoom.value = 1
})

const imageStyle = computed(() => {
  return {
    left: `${imgOffsetX.value}px`,
    top: `${imgOffsetY.value}px`,
    transform: `rotate(${currentRotate.value}deg) scale(${currentZoom.value})`
  }
})

function resetStyle() {
  currentRotate.value = 0
  currentZoom.value = 1
  imgOffsetX.value = 0
  imgOffsetY.value = 0
}

function prev() {
  if (currentIndex.value === 0) {
    window.$message?.info($t('mediaPreview.noMoreMedia'))
    return
  }
  currentIndex.value--
  currentMedia.value = mediaList.value[currentIndex.value]
  resetStyle()
}

function next() {
  if (currentIndex.value === mediaList.value.length - 1) {
    window.$message?.info($t('mediaPreview.noMoreMedia'))
    return
  }
  currentIndex.value++
  currentMedia.value = mediaList.value[currentIndex.value]
  resetStyle()
}

function rotate(deg: number) {
  currentRotate.value += deg
}

function zoom(num: number) {
  if ((currentZoom.value <= 0.4 && num < 0) || (currentZoom.value >= 2 && num > 0)) {
    return
  }
  if (currentZoom.value <= 1) {
    imgOffsetX.value = 0
    imgOffsetY.value = 0
  }
  currentZoom.value += num
}

function download() {
  const src = currentMedia.value.url
  const a = document.createElement('a')
  const getFilename = (url: string): string => {
    const lastSlashIndex = url.lastIndexOf('/')
    if (lastSlashIndex !== -1) {
      return url.substring(lastSlashIndex + 1)
    }
    return url
  }
  a.href = src
  a.download = getFilename(src)
  a.click()
  a.remove()
}

function mousedown() {
  isDragging.value = true
}

function mouseup() {
  isDragging.value = false
}

const mousemove = throttle((event: MouseEvent) => {
  if (!isDragging.value) {
    return
  }
  imgOffsetX.value = imgOffsetX.value + event.movementX
  imgOffsetY.value = imgOffsetY.value + event.movementY
}, 10)

function wheel(event: any) {
  zoom(event.wheelDeltaY > 0 ? 0.2 : -0.2)
}
</script>

<style lang="scss" scoped>
.tool-item {
  --uno: flex-center hover:bg-#ddd w-26px h-26px cursor-pointer;
}
</style>
