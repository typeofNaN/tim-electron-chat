<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="phone">
      <n-input v-model:value="model.phone" :placeholder="$t('page.login.common.phonePlaceholder')" />
    </n-form-item>
    <n-form-item path="code">
      <div class="flex-y-center w-full">
        <n-input v-model:value="model.code" :placeholder="$t('page.login.common.codePlaceholder')" />
        <div class="w-18px" />
        <n-button size="large" :disabled="isCounting" :loading="smsLoading" @click="handleSmsCode">
          {{ label }}
        </n-button>
      </div>
    </n-form-item>
    <n-space :vertical="true" :size="18">
      <n-button type="primary" size="large" :block="true" :round="true" :loading="auth.loginLoading"
        @click="handleSubmit">
        {{ $t('page.login.common.confirm') }}
      </n-button>
      <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInst } from 'naive-ui'

import { useRouterPush } from '@/composables'
import { useSmsCode } from '@/hooks'
import { $t } from '@/locales'
import { useAuthStore } from '@/store'
import { formRules } from '@/utils'

const auth = useAuthStore()
const { toLoginModule } = useRouterPush()
const {
  label,
  isCounting,
  loading: smsLoading,
  getSmsCode
} = useSmsCode()

const formRef = ref<HTMLElement & FormInst>()

const model = reactive({
  phone: '',
  code: ''
})

const rules = {
  phone: formRules.phone,
  code: formRules.code
}

function handleSmsCode() {
  getSmsCode(model.phone)
}

async function handleSubmit() {
  await formRef.value?.validate()
  window.$message?.success($t('page.login.common.validateSuccess'))
}
</script>
