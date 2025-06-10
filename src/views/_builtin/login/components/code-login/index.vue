<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <n-form-item path="userID">
      <n-input v-model:value="model.userID" :placeholder="$t('page.login.common.phonePlaceholder')" />
    </n-form-item>
    <n-form-item path="userSig">
      <div class="flex-y-center w-full">
        <n-input v-model:value="model.userSig" :placeholder="$t('page.login.common.codePlaceholder')" />
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
      <!-- <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </n-button> -->
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'

// import { useRouterPush } from '@/composables'
import { useSmsCode } from '@/hooks'
import { $t } from '@/locales'
import { useAuthStore, useChatStore } from '@/store'
import { formRules, localStg } from '@/utils'

const router = useRouter()
const chatStore = useChatStore()

const auth = useAuthStore()
// const { toLoginModule } = useRouterPush()
const {
  label,
  isCounting,
  loading: smsLoading,
  getSmsCode
} = useSmsCode()

const formRef = ref<HTMLElement & FormInst>()

const model = reactive({
  phone: '',
  code: '',
  userID: '',
  userSig: ''
})

const rules = {
  // phone: formRules.phone,
  // code: formRules.code
  userID: formRules.userID,
  userSig: formRules.userSig
}

function handleSmsCode() {
  getSmsCode(model.phone)
}

async function handleSubmit() {
  // await formRef.value?.validate()
  // window.$message?.success($t('page.login.common.validateSuccess'))
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
