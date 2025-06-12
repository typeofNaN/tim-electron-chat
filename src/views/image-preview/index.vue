<template>
  <div class="w-full h-full bg-#fff">
    <div class="w-full h-30px flex-y-center gap-4px px-4px">
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="prev">
            <icon-ooui:previous-ltr />
          </div>
        </template>
        {{ $t('imagePreview.prev') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="next">
            <icon-ooui:previous-rtl />
          </div>
        </template>
        {{ $t('imagePreview.next') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="rotate(-90)">
            <icon-fa6-solid:arrow-rotate-left />
          </div>
        </template>
        {{ $t('imagePreview.rotateLeft') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="rotate(90)">
            <icon-fa6-solid:arrow-rotate-right />
          </div>
        </template>
        {{ $t('imagePreview.rotateRight') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="zoom(0.2)">
            <icon-zondicons:zoom-in />
          </div>
        </template>
        {{ $t('imagePreview.zoomIn') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="zoom(-0.2)">
            <icon-zondicons:zoom-out />
          </div>
        </template>
        {{ $t('imagePreview.zoomOut') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="resetStyle">
            <svg-icon icon="garden:original-size-stroke-12" />
          </div>
        </template>
        {{ $t('imagePreview.resetOrigin') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="tool-item" @click="download">
            <icon-bxs:download />
          </div>
        </template>
        {{ $t('imagePreview.downloadImage') }}
      </n-tooltip>
      <div class="h-full flex-grow-1" style="-webkit-app-region: drag;" />
    </div>
    <div class="w-full h-[calc(100%-30px)] overflow-hidden bg-#f9f9f9">
      <img :src="currentImgUrl" alt=""
        class="relative w-full h-full object-contain select-none cursor-move transition-duration-100 ease-in-out transition-property-transform"
        :draggable="false" :style="imageStyle" @mousedown="mousedown" @mousemove="mousemove($event)" @mouseup="mouseup"
        @mouseleave="mouseup" @wheel="wheel($event)">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { throttle } from 'lodash-es'

import { $t } from '@/locales'

const imgList = ref<string[]>([])
const currentImgUrl = ref('')

const currentIndex = ref(0)
const currentRotate = ref(0)
const currentZoom = ref(1)

const imgOffsetX = ref(0)
const imgOffsetY = ref(0)

const isDragging = ref(false)

const { ipcRenderer } = require('electron')

ipcRenderer.on('showPreview', (event, data: { imageList: string[], currentImage: string }) => {
  imgList.value = data.imageList
  currentImgUrl.value = data.currentImage
  currentIndex.value = data.imageList.findIndex(item => item === data.currentImage)
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
    window.$message?.info($t('imagePreview.noMoreImage'))
    return
  }
  currentIndex.value--
  currentImgUrl.value = imgList.value[currentIndex.value]
  resetStyle()
}

function next() {
  if (currentIndex.value === imgList.value.length - 1) {
    window.$message?.info($t('imagePreview.noMoreImage'))
    return
  }
  currentIndex.value++
  currentImgUrl.value = imgList.value[currentIndex.value]
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
  const src = currentImgUrl.value
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
