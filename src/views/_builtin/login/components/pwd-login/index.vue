<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="getOffSet">
    <n-form-item path="account">
      <n-input v-model:value="model.account" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </n-form-item>
    <n-form-item path="password">
      <n-input v-model:value="model.password" type="password" show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')" />
    </n-form-item>
    <n-space :vertical="true" :size="24">
      <div class="flex-y-center justify-between">
        <n-checkbox v-model:checked="rememberMe">{{ $t('page.login.pwdLogin.rememberMe') }}</n-checkbox>
        <n-button :text="true" @click="toLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </n-button>
      </div>
      <n-button type="primary" size="large" :block="true" :round="true" :loading="auth.loginLoading" @click="getOffSet">
        {{ $t('page.login.common.confirm') }}
      </n-button>
      <!-- <div class="flex-y-center justify-between">
        <n-button class="flex-1" :block="true" @click="toLoginModule('code-login')">
          {{ loginModuleLabels['code-login'] }}
        </n-button>
        <div class="w-12px" />
        <n-button class="flex-1" :block="true" @click="toLoginModule('register')">
          {{ loginModuleLabels.register }}
        </n-button>
      </div> -->
    </n-space>
    <!-- <other-account @login="handleLoginOtherAccount" /> -->
    <n-modal v-model:show="showModal" :mask-closable="false">
      <n-card :title="$t('page.login.pwdLogin.imgValidTitle')" :bordered="false" class="w-360px">
        <template #header-extra>
          <icon-material-symbols:close-rounded @click="showModal = false" class="cursor-pointer text-20px" />
        </template>
        <slide-verify ref="slideBlock" :l="42" :r="8" :w="310" :h="200" :left="offset"
          :slider-text="$t('page.login.pwdLogin.slideRightValid')" :imgs="imgList" @success="onSuccess" @fail="onFail"
          @refresh="refresh" />
      </n-card>
    </n-modal>
  </n-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'

import { useRouterPush } from '@/composables'
// import { loginModuleLabels } from '@/constants'
import { $t } from '@/locales'
import { LoginApi } from '@/service'
import { useAuthStore } from '@/store'
import { formRules } from '@/utils'
// import { OtherAccount } from './components'
import { SlideVerify } from './components'
import img1 from '@/assets/images/imgValid/1.jpg'
import img2 from '@/assets/images/imgValid/2.jpg'
import img3 from '@/assets/images/imgValid/3.jpg'
import img4 from '@/assets/images/imgValid/4.jpg'
import img5 from '@/assets/images/imgValid/5.jpg'
import img6 from '@/assets/images/imgValid/6.jpg'
import img7 from '@/assets/images/imgValid/7.jpg'
import img8 from '@/assets/images/imgValid/8.jpg'
import img9 from '@/assets/images/imgValid/9.jpg'
import img10 from '@/assets/images/imgValid/10.jpg'

const auth = useAuthStore()
const { login } = useAuthStore()
const { toLoginModule } = useRouterPush()

const formRef = ref<HTMLElement & FormInst>()

const model = reactive({
  account: '',
  password: ''
})

const rules: FormRules = {
  account: formRules.account,
  password: formRules.pwd
}

const rememberMe = ref(false)

const showModal = ref(false)
const offset = ref(100)
const imgValidKey = ref('')
const imgList = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10
]

async function handleSubmit() {
  const { account, password } = model

  showModal.value = false

  login({
    account,
    password,
    offset: offset.value,
    imgValidKey: imgValidKey.value
  })
}

// function handleLoginOtherAccount(param: { account: string; password: string }) {
//   const { account, password } = param
//   login(account, password)
// }

async function getOffSet() {
  await formRef.value?.validate()

  const { error, data } = await LoginApi.getOffset()
  if (!error) {
    offset.value = data.offset
    imgValidKey.value = data.key
    showModal.value = true
  }
}

function onSuccess() {
  handleSubmit()
}

function onFail() {
  window.$message?.error($t('page.login.codeLogin.validFail'))
  getOffSet()
}

function refresh() {
  getOffSet()
}
</script>
