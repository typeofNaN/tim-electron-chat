<template>
  <div>
    <n-button type="primary" secondary round @click="showApplyModal">
      <template #icon>
        <svg-icon icon="material-symbols:add" class="text-20px" />
      </template>
      {{ $t('page.contacts.addFriend') }}
    </n-button>
    <n-modal :show="modalShow" preset="card" :title="$t('page.contacts.addFriend')" class="w-500px"
      @close="modalShow = false">
      <n-form ref="formRef" :model="formData" label-placement="left" :label-width="100" :rules="formRules"
        require-mark-placement="left">
        <n-form-item :label="$t('page.contacts.addFriendModal.userID')" path="friendship_add_friend_param_identifier">
          <n-input v-model:value="formData.friendship_add_friend_param_identifier"
            :placeholder="$t('common.placeholder.pleaseInput')" />
        </n-form-item>
        <n-form-item :label="$t('page.contacts.addFriendModal.remark')" path="friendship_add_friend_param_remark">
          <n-input v-model:value="formData.friendship_add_friend_param_remark"
            :placeholder="$t('common.placeholder.pleaseInput')" />
        </n-form-item>
        <n-form-item :label="$t('page.contacts.addFriendModal.source')" path="user_profile_add_permission">
          {{ $t('page.contacts.addFriendModal.sourceValue') }}
        </n-form-item>
        <n-form-item :label="$t('page.contacts.addFriendModal.wording')" path="friendship_add_friend_param_add_wording">
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FormInst } from 'naive-ui'

import { $t } from '@/locales'
import { useChatStore } from '@/store'

enum FriendType {
  SINGLE,
  BOTH
}

interface Emits {
  (e: 'refresh'): void
}
const emit = defineEmits<Emits>()

const chatStore = useChatStore()

const modalShow = ref(false)

const formRef = ref<HTMLElement & FormInst>()
const formData = ref({
  friendship_add_friend_param_identifier: '', // 请求加好友对应的UserID
  friendship_add_friend_param_friend_type: FriendType.BOTH, // 请求添加好友的好友类型
  friendship_add_friend_param_remark: '', // 预备注
  friendship_add_friend_param_group_name: '', // 预分组名
  friendship_add_friend_param_add_source: '', // 加好友来源描述
  friendship_add_friend_param_add_wording: '' // 加好友附言
})

const formRules = {
  friendship_add_friend_param_identifier: {
    required: true,
    trigger: ['blur', 'change'],
    message: $t('page.contacts.addFriendModal.userIdRequired')
  }
}

function showApplyModal() {
  formData.value = {
    friendship_add_friend_param_identifier: '', // 请求加好友对应的UserID
    friendship_add_friend_param_friend_type: FriendType.BOTH, // 请求添加好友的好友类型
    friendship_add_friend_param_remark: '', // 预备注
    friendship_add_friend_param_group_name: '', // 预分组名
    friendship_add_friend_param_add_source: '', // 加好友来源描述
    friendship_add_friend_param_add_wording: '' // 加好友附言
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
    const res = await chatStore.addFriend(postData)
    if (res) {
      modalShow.value = false
      window.$message?.success($t('page.contacts.addFriendModal.applySuccess'))
      emit('refresh')
    } else {
      window.$message?.error($t('page.contacts.addFriendModal.applyFailed'))
    }
  })
}
</script>
