<template>
  <n-space class="h-full px-10px">
    <!-- <hover-container v-if="isUnMaximize" class="w-30px h-full cursor-move select-none" style="-webkit-app-region: drag;"
      :tooltip-content="$t('app.ctrl.dragMove')" :inverted="theme.header.inverted">
      <icon-fluent:arrow-move-20-filled class="text-20px" />
    </hover-container> -->
    <!-- <dark-mode-switch :dark="theme.darkMode" class="text-20px" @update:dark="theme.setDarkMode" /> -->
    <hover-container class="w-30px h-full" :tooltip-content="$t('app.ctrl.topUp')" :inverted="theme.header.inverted"
      @click="toggleTopUp">
      <icon-codicon:pinned-small class="text-20px" :class="{ 'text-primary': isTopUp }" />
    </hover-container>
    <hover-container class="w-30px h-full" :tooltip-content="$t('app.ctrl.minimize')" :inverted="theme.header.inverted"
      @click="minimizeApp">
      <icon-material-symbols:check-indeterminate-small-rounded class="text-20px" />
    </hover-container>
    <hover-container v-if="isUnMaximize" class="w-30px h-full" :tooltip-content="$t('app.ctrl.maximize')"
      :inverted="theme.header.inverted" @click="maximizeApp">
      <icon-fluent:square-12-regular class="text-20px" />
    </hover-container>
    <hover-container v-else class="w-30px h-full" :tooltip-content="$t('app.ctrl.unMaximize')"
      :inverted="theme.header.inverted" @click="maximizeApp">
      <icon-fluent:square-multiple-16-regular class="text-20px" />
    </hover-container>
    <hover-container class="w-30px h-full" :tooltip-content="$t('app.ctrl.exitApp')" :inverted="theme.header.inverted"
      @click="exitApp">
      <icon-material-symbols:close-rounded class="text-20px" />
    </hover-container>
  </n-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { $t } from '@/locales'
import { useThemeStore } from '@/store'

const { ipcRenderer } = require('electron')

const theme = useThemeStore()

const isTopUp = ref(false)
const isUnMaximize = ref(true)

function toggleTopUp() {
  isTopUp.value = !isTopUp.value
  ipcRenderer.send('toggleTopUp', isTopUp.value)
}

function minimizeApp() {
  ipcRenderer.send('minimizeApp')
}

function maximizeApp() {
  ipcRenderer.send('maximizeApp')
}

function exitApp() {
  // window.$dialog?.destroyAll()
  // window.$dialog?.create({
  //   type: 'info',
  //   title: $t('app.exit.title'),
  //   content: $t('app.exit.content'),
  //   positiveText: $t('app.exit.confirm'),
  //   negativeText: $t('app.exit.miniSize'),
  //   closeOnEsc: false,
  //   maskClosable: false,
  //   onPositiveClick: () => {
  //     setTimeout(() => {
  //       ipcRenderer.send('closeApp', 'exit')
  //     }, 400)
  //   },
  //   onNegativeClick: () => {
  //     setTimeout(() => {
  //       ipcRenderer.send('closeApp', 'mini')
  //     }, 400)
  //   }
  // })
  ipcRenderer.send('closeApp', 'exit')
}

ipcRenderer.on('maximize', () => {
  isUnMaximize.value = false
})
ipcRenderer.on('unmaximize', () => {
  isUnMaximize.value = true
})
</script>