<template>
  <n-space class="h-full px-10px">
    <hover-container class="w-30px h-full" :tooltip-content="$t('app.ctrl.topUp')" :inverted="theme.header.inverted"
      @click="toggleCallChatTopUp">
      <icon-codicon:pinned-small class="text-20px" :class="{ 'text-primary': isTopUp }" />
    </hover-container>
    <hover-container class="w-30px h-full" :tooltip-content="$t('app.ctrl.minimize')" :inverted="theme.header.inverted"
      @click="minimizeCallChat">
      <icon-material-symbols:check-indeterminate-small-rounded class="text-20px" />
    </hover-container>
    <hover-container v-if="isUnMaximize" class="w-30px h-full" :tooltip-content="$t('app.ctrl.maximize')"
      :inverted="theme.header.inverted" @click="maximizeCallChat">
      <icon-fluent:square-12-regular class="text-20px" />
    </hover-container>
    <hover-container v-else class="w-30px h-full" :tooltip-content="$t('app.ctrl.unMaximize')"
      :inverted="theme.header.inverted" @click="maximizeCallChat">
      <icon-fluent:square-multiple-16-regular class="text-20px" />
    </hover-container>
    <hover-container class="w-30px h-full" :tooltip-content="$t('common.close')" :inverted="theme.header.inverted"
      @click="closeCallChat">
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

function toggleCallChatTopUp() {
  isTopUp.value = !isTopUp.value
  ipcRenderer.send('toggleCallChatTopUp', isTopUp.value)
}

function minimizeCallChat() {
  ipcRenderer.send('minimizeCallChat')
}

function maximizeCallChat() {
  ipcRenderer.send('maximizeCallChat')
}

function closeCallChat() {
  // ipcRenderer.send('closeCallChat', 'exit')
  ipcRenderer.send('requestExitCallRoom')
}

ipcRenderer.on('maximize', () => {
  isUnMaximize.value = false
})
ipcRenderer.on('unmaximize', () => {
  isUnMaximize.value = true
})
</script>