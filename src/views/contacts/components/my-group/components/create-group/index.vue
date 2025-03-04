<template>
  <n-modal :show="modalShow" preset="card" :title="$t('page.contacts.createGroup')" class="w-500px"
    @close="modalShow = false">
    <n-form ref="formRef" :model="formData" label-placement="left" :label-width="120" :rules="formRules"
      require-mark-placement="left">
      <n-form-item :label="$t('page.contacts.createGroupModal.groupName')"
        path="friendship_add_friend_param_identifier">
        <n-input v-model:value="formData.friendship_add_friend_param_identifier"
          :placeholder="$t('common.placeholder.pleaseInput')" />
      </n-form-item>
      <n-form-item :label="$t('page.contacts.createGroupModal.groupType')" path="friendship_add_friend_param_remark">
        <n-input v-model:value="formData.friendship_add_friend_param_remark"
          :placeholder="$t('common.placeholder.pleaseInput')" />
      </n-form-item>
      <n-form-item :label="$t('page.contacts.createGroupModal.setAdministrator')" path="user_profile_add_permission">
        <n-input v-model:value="formData.friendship_add_friend_param_remark"
          :placeholder="$t('common.placeholder.pleaseInput')" />
      </n-form-item>
      <n-form-item :label="$t('page.contacts.createGroupModal.groupAnnouncement')"
        path="friendship_add_friend_param_add_wording">
        <n-input v-model:value="formData.friendship_add_friend_param_add_wording" type="textarea"
          :placeholder="$t('common.placeholder.pleaseInput')" />
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FormInst } from 'naive-ui'

import { $t } from '@/locales'
import { useChatStore } from '@/store'

interface Emits {
  (e: 'refresh'): void
}
const emit = defineEmits<Emits>()

defineExpose({
  showModal
})

const chatStore = useChatStore()

const modalShow = ref(false)

const formRef = ref<HTMLElement & FormInst>()
const formData = ref({
  friendship_add_friend_param_identifier: '',
  friendship_add_friend_param_remark: '',
  friendship_add_friend_param_group_name: '',
  friendship_add_friend_param_add_source: '',
  friendship_add_friend_param_add_wording: ''
})

const formRules = {}

function showModal() {
  formData.value = {
    friendship_add_friend_param_identifier: '',
    friendship_add_friend_param_remark: '',
    friendship_add_friend_param_group_name: '',
    friendship_add_friend_param_add_source: '',
    friendship_add_friend_param_add_wording: ''
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
      ...formData.value
    }
    const res = await chatStore.createGroup(postData)
    if (res) {
      modalShow.value = false
      window.$message?.success($t('page.contacts.createGroupModal.createSuccess'))
      emit('refresh')
    } else {
      window.$message?.error($t('page.contacts.createGroupModal.createFailed'))
    }
  })
}
</script>