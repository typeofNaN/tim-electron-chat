<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit"
    class="w-full">
    <n-form-item path="userID">
      <n-input v-model:value="model.userID" :placeholder="$t('page.login.signLogin.userIDPlaceholder')" />
    </n-form-item>
    <n-form-item path="userSig">
      <n-input v-model:value="model.userSig" :placeholder="$t('page.login.signLogin.userSigPlaceholder')" />
    </n-form-item>
    <n-space :vertical="true" :size="24">
      <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit">
        {{ $t('page.login.common.confirm') }}
      </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst, FormRules } from 'naive-ui'

import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { formRules, localStg } from '@/utils'

const router = useRouter()
const chatStore = useChatStore()

const formRef = ref<HTMLElement & FormInst>()

const model = reactive({
  userID: '',
  userSig: ''
})

const rules: FormRules = {
  userID: formRules.userID,
  userSig: formRules.userSig
}

async function handleSubmit() {
  const { userID, userSig } = model

  const res = await chatStore.loginIM(userID, userSig)
  if (res) {
    window.$message?.success($t('page.login.common.loginSuccess'))
    localStg.set('userID', userID)
    localStg.set('userSig', userSig)
    router.replace({ name: 'home' })
  } else {
    window.$message?.error($t('page.login.common.loginFail'))
  }
}
</script>
