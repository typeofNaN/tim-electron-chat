<template>
  <div class="flex items-center gap-6px py-4px px-10px b-rd-4px text-gray-900"
    :class="[props.isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']">
    {{ $t('page.chat.friendApplyMessage') }}
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/locales'

interface Props {
  msg: any
  isMyMsg: boolean
}
const props = defineProps<Props>()
</script>