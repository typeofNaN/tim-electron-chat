<template>
  <div class="h-full">
    <div class="flex justify-between items-center px-10px h-80px b-b-2 b-b-solid b-b-#eee dark:b-b-#111">
      <div class="flex items-center">
        <div class="flex-center w-40px h-40px b-rd-50% bg-green text-20px color-#fff">
          <svg-icon icon="mdi:information-variant" />
        </div>
        <div class="pl-10px text-16px select-none">{{ $t('page.setting.about') }}</div>
      </div>
    </div>
    <n-scrollbar class="h-[calc(100%-80px)]">
      <div class="p-10px">
        <n-descriptions label-placement="left" :column="1" bordered>
          <n-descriptions-item :label="$t('page.setting.applicationName')">
            <div class="flex justify-between items-center gap-30px h-full">
              {{ packageJson.name }}
              <icon-ri:github-fill class="text-18px cursor-pointer" @click="toGithub(packageJson.homepage)" />
            </div>
          </n-descriptions-item>
          <n-descriptions-item :label="$t('page.setting.version')">
            <div class="flex justify-between items-center gap-30px h-full">
              v{{ packageJson.version }}
              <n-button type="warning" text @click="checkUpdate">{{ $t('page.setting.checkUpdate') }}</n-button>
            </div>
          </n-descriptions-item>
          <n-descriptions-item :label="$t('page.setting.author')">
            <div class="flex justify-between items-center gap-30px h-full">
              {{ packageJson.author.name }}
              <icon-ri:github-fill class="text-18px cursor-pointer" @click="toGithub(packageJson.author.url)" />
            </div>
          </n-descriptions-item>
          <n-descriptions-item :label="$t('page.setting.help')">
            <div class="flex justify-between items-center gap-30px h-full">
              <n-button type="primary" text @click="toGithub(packageJson.homepage)">
                {{ $t('page.setting.helpDocument') }}
              </n-button>
              <span class="color-transparent select-none">{{ $t('page.setting.helpDocument') }}</span>
            </div>
          </n-descriptions-item>
          <n-descriptions-item :label="$t('page.setting.feedback')">
            <div class="flex justify-between items-center gap-30px h-full">
              <n-button type="warning" text @click="toGithub(packageJson.bugs.url)">
                {{ $t('page.setting.submitFeedback') }}
              </n-button>
              <span class="color-transparent select-none">{{ $t('page.setting.submitFeedback') }}</span>
            </div>
          </n-descriptions-item>
        </n-descriptions>
      </div>
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/locales'
import packageJson from '~/package.json'

const { ipcRenderer } = require('electron')

function checkUpdate() {
  ipcRenderer.send('checkUpdate')

  ipcRenderer.once('notNeedUpdate', () => {
    window.$message?.info($t('system.notNeedUpdate'))
  })
}

function toGithub(url: string) {
  ipcRenderer.send('openBrowser', url)
}
</script>