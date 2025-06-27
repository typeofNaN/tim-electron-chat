<template>
  <div class="p-10px w-240px b-rd-4px select-none"
    :class="[props.isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:bg-gray-800']">
    <div class="flex items-center">
      <custom-avatar :src="props.msg.content.avatarUrl" :size="40" />
      <n-ellipsis class="pl-10px w-[calc(100%-40px)] text-14px text-gray-900 dark:text-gray-100">
        {{ props.msg.content.nickname }}
      </n-ellipsis>
    </div>
    <div class="my-10px h-1px" :class="[props.isMyMsg ? 'bg-gray-400' : 'bg-gray-300']" />
    <div class="text-12px" :class="[props.isMyMsg ? 'text-gray-500' : 'text-gray-400']">
      {{ $t('page.chat.friendIsOnline') }}
    </div>
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
