<template>
  <n-config-provider :theme="theme.naiveTheme" :theme-overrides="theme.naiveThemeOverrides" :locale="naiveLocale"
    :date-locale="naiveDateLocale" class="h-full">
    <naive-provider>
      <router-view v-if="isInitIM" />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGlobalEvents } from '@/composables'
import { naiveLocales, naiveDateLocales } from '@/locales/naive'
import {
  subscribeStore,
  useAppStore,
  useChatStore,
  useThemeStore
} from '@/store'
import { localStg } from '@/utils'

const router = useRouter()

const appStore = useAppStore()

const theme = useThemeStore()

const chatStore = useChatStore()

const naiveLocale = computed(() => {
  return naiveLocales[appStore.currentLocale]
})

const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.currentLocale]
})

const isInitIM = ref(false)

onMounted(async () => {
  chatStore.initIM()
  if (localStg.get('userID') && localStg.get('userSig')) {
    const res = await chatStore.loginIM(localStg.get('userID') as string, localStg.get('userSig') as string)
    if (!res) {
      localStg.remove('userID')
      localStg.remove('userSig')
      router.replace({ name: 'login' })
    }
  }
  isInitIM.value = true
})

subscribeStore()
useGlobalEvents()
</script>
