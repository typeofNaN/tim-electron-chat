<template>
  <div class="h-full">
    <div class="flex justify-between items-center px-10px h-80px b-b-2 b-b-solid b-b-#eee dark:b-b-#111">
      <div class="flex items-center">
        <div class="flex-center w-40px h-40px b-rd-50% bg-yellow">
          <svg-icon icon="tdesign:system-setting" class="text-20px color-#fff" />
        </div>
        <div class="pl-10px text-16px select-none">{{ $t('page.setting.systemSetting') }}</div>
      </div>
    </div>
    <n-scrollbar class="h-[calc(100%-80px)]">
      <div class="m-auto mt-60px w-360px">
        <n-divider title-placement="center">
          {{ $t('layout.settingDrawer.themeModeTitle') }}
        </n-divider>
        <n-space vertical size="large">
          <setting-menu :label="$t('layout.settingDrawer.followSystemTheme')">
            <n-switch :value="theme.followSystemTheme" @update:value="theme.setFollowSystemTheme">
              <template #checked>
                <icon-ic-baseline-do-not-disturb class="text-14px text-white" />
              </template>
              <template #unchecked>
                <icon-ic-round-hdr-auto class="text-14px text-white" />
              </template>
            </n-switch>
          </setting-menu>
          <setting-menu :label="$t('layout.settingDrawer.darkMode')">
            <n-switch :value="theme.darkMode" @update:value="theme.setDarkMode">
              <template #checked>
                <icon-mdi-white-balance-sunny class="text-14px text-white" />
              </template>
              <template #unchecked>
                <icon-mdi-moon-waning-crescent class="text-14px text-white" />
              </template>
            </n-switch>
          </setting-menu>
        </n-space>
        <n-divider title-placement="center">
          {{ $t('layout.settingDrawer.systemThemeTitle') }}
        </n-divider>
        <n-grid :cols="8" :x-gap="8" :y-gap="12">
          <n-grid-item v-for="color in theme.themeColorList" :key="color" class="flex-x-center">
            <color-checkbox :color="color" :checked="color === theme.themeColor" @click="theme.setThemeColor(color)" />
          </n-grid-item>
        </n-grid>
        <n-space :vertical="true" class="pt-12px">
          <n-color-picker :value="theme.themeColor" :show-alpha="false" @update-value="theme.setThemeColor" />
          <n-button :block="true" :type="otherColorBtnType" @click="openModal">
            {{ $t('layout.settingDrawer.systemTheme.moreColors') }}
          </n-button>
        </n-space>
        <color-modal :visible="visible" @close="closeModal" />
      </div>
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useBoolean } from '@/hooks'
import { ColorCheckbox, ColorModal } from '@/layouts/common/setting-drawer/components/theme-color-select/components'
import { $t } from '@/locales'
import { useThemeStore } from '@/store'
import { isInTraditionColors } from '@/settings'
import SettingMenu from '@/layouts/common/setting-drawer/components/setting-menu/index.vue'

const theme = useThemeStore()

const { bool: visible, setTrue: openModal, setFalse: closeModal } = useBoolean()

const isInOther = computed(() => isInTraditionColors(theme.themeColor))
const otherColorBtnType = computed(() => (isInOther.value ? 'primary' : 'default'))
</script>
