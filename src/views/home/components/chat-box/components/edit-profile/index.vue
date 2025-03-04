<template>
  <n-modal :show="modalShow" preset="card" :title="$t('page.chat.userInfo.editProfile')" class="w-400px"
    @close="modalShow = false">
    <n-form ref="formRef" :model="formData" label-placement="left" :label-width="80" :rules="formRules"
      require-mark-placement="left">
      <n-form-item :label="$t('page.chat.userInfo.remark')" path="friend_profile_item_remark">
        <n-input v-model:value="formData.friend_profile_item_remark"
          :placeholder="$t('common.placeholder.pleaseInput')" />
      </n-form-item>
      <n-form-item :label="$t('page.chat.userInfo.groupName')" path="friend_profile_item_group_name_array">
        <n-select v-model:value="formData.friend_profile_item_group_name_array"
          :placeholder="$t('common.placeholder.pleaseSelect')" multiple />
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
const formData = ref<{ friend_profile_item_remark: string; friend_profile_item_group_name_array: string[] }>({
  friend_profile_item_remark: '',
  friend_profile_item_group_name_array: []
})

const identifierId = ref('')
const formRules = {}

/**
 * @description 显示编辑好友资料的模态框
 * @param {Object} params - 参数对象
 * @param {string} params.identifier - 好友的唯一标识符
 * @param {string} params.remark - 好友的备注
 * @param {string[]} params.group - 好友所在的分组数组
 */
function showModal({ identifier, remark, group }: { identifier: string; remark: string; group: string[] }) {
  identifierId.value = identifier
  formData.value = {
    friend_profile_item_remark: remark,
    friend_profile_item_group_name_array: group
  }
  modalShow.value = true
}

/**
 * @description 处理保存好友资料的操作
 * @param {MouseEvent} e - 点击事件对象
 * @returns {Promise<void>}
 */
function handleSave(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors: any) => {
    if (errors) {
      return
    }
    const postData = {
      ...formData.value
    }
    // 调用store方法修改好友资料
    const res = await chatStore.modifyFriendProfile(identifierId.value, postData)
    if (res) {
      modalShow.value = false
      window.$message?.success($t('common.editSuccess'))
      // 通知父组件刷新数据
      emit('refresh')
    } else {
      window.$message?.error($t('common.editFail'))
    }
  })
}
</script>