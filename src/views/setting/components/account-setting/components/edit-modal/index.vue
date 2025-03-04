<template>
  <div>
    <n-button type="warning" round secondary @click="showEditModal">
      <template #icon>
        <svg-icon icon="mdi:briefcase-edit-outline" class="text-20px" />
      </template>
      {{ $t('page.setting.editInfo') }}
    </n-button>
    <n-modal :show="modalShow" preset="card" :title="$t('page.setting.editInfo')" class="w-500px"
      @close="modalShow = false">
      <n-form ref="formRef" :model="formData" label-placement="left" :label-width="100" :rules="formRules"
        require-mark-placement="left">
        <n-form-item :label="$t('page.chat.userInfo.avatar')" path="user_profile_face_url">
          <n-upload :show-file-list="false">
            <custom-avatar :src="formData.user_profile_face_url" :size="80" class="cursor-pointer" />
          </n-upload>
        </n-form-item>
        <n-form-item :label="$t('page.chat.userInfo.nickname')" path="user_profile_nick_name">
          <n-input v-model:value="formData.user_profile_nick_name"
            :placeholder="$t('common.placeholder.pleaseInput')" />
        </n-form-item>
        <n-form-item :label="$t('page.chat.userInfo.gender')" path="user_profile_gender">
          <n-select v-model:value="formData.user_profile_gender" :options="GenderOptions"
            :placeholder="$t('common.placeholder.pleaseSelect')" />
        </n-form-item>
        <n-form-item :label="$t('page.chat.userInfo.birthday')" path="user_profile_birthday">
          <n-date-picker v-model:value="formData.user_profile_birthday" class="w-full" />
        </n-form-item>
        <n-form-item :label="$t('page.chat.userInfo.signature')" path="user_profile_self_signature">
          <n-input v-model:value="formData.user_profile_self_signature" type="textarea"
            :placeholder="$t('common.placeholder.pleaseInput')" />
        </n-form-item>
        <n-form-item :label="$t('page.chat.userInfo.friendAddPermission')" path="user_profile_add_permission">
          <n-select v-model:value="formData.user_profile_add_permission" :options="AddFriendPermissionOptions"
            :placeholder="$t('common.placeholder.pleaseSelect')" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex-center gap-20px">
          <n-button @click="modalShow = false">
            {{ $t('common.cancel') }}
          </n-button>
          <n-button type="primary" @click="handleSave">
            {{ $t('common.confirm') }}
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInst } from 'naive-ui'
import { cloneDeep } from 'lodash-es'

import { AddFriendPermissionOptions } from '@/constants/addFriendPermission'
import { GenderOptions } from '@/constants/gender'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { formatterTime } from '@/utils/common/datetime'

const chatStore = useChatStore()

const modalShow = ref(false)

const formRef = ref<HTMLElement & FormInst>()
const formData = ref({
  user_profile_face_url: '',
  user_profile_nick_name: '',
  user_profile_gender: 0,
  user_profile_birthday: new Date(),
  user_profile_self_signature: '',
  user_profile_add_permission: 0,
  user_profile_location: '',
  user_profile_language: 0,
  user_profile_level: 0,
  user_profile_role: 0,
  user_profile_custom_string_array: []
})

const formRules = {
  user_profile_nick_name: {
    required: true,
    trigger: ['blur', 'change'],
    message: $t('page.setting.formValid.nicknameIsRequired')
  }
}

function showEditModal() {
  formData.value = {
    ...cloneDeep(chatStore.myInfo),
    user_profile_birthday: new Date(chatStore.myInfo.user_profile_birthday).getTime()
  }
  modalShow.value = true
}

function handleSave(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors: any) => {
    if (errors) {
      return
    }
    const postData = {
      user_profile_item_nick_name: formData.value.user_profile_nick_name,
      user_profile_item_gender: formData.value.user_profile_gender,
      user_profile_item_face_url: formData.value.user_profile_face_url,
      user_profile_item_self_signature: formData.value.user_profile_self_signature,
      user_profile_item_location: formData.value.user_profile_location,
      user_profile_item_language: formData.value.user_profile_language,
      user_profile_item_birthday: ~~formatterTime(formData.value.user_profile_birthday, 'YYYYMMDD'),
      user_profile_item_level: formData.value.user_profile_level,
      user_profile_item_role: formData.value.user_profile_role,
      user_profile_item_custom_string_array: formData.value.user_profile_custom_string_array,
      user_profile_item_add_permission: formData.value.user_profile_add_permission
    }
    const res = await chatStore.updateSelfUserProfile(postData)
    if (res) {
      await chatStore.getMyInfo()
      modalShow.value = false
      window.$message?.success($t('common.editSuccess'))
    }
  })
}
</script>
