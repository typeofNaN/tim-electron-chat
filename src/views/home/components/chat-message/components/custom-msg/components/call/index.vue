<template>
  <div class="flex items-center gap-6px py-4px px-10px b-rd-4px text-gray-900"
    :class="[props.isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']">
    <svg-icon :icon="props.msg.content.isVideoCall === 'Y' ? 'ic:round-videocam' : 'ic:round-call'" />
    <template v-if="props.msg.content.result === CallResultEnum.ACCEPT">
      {{ props.msg.content.duration }} "
    </template>
    <template v-else>
      {{ $t(CallResultMap[props.msg.content.result as CallResultEnum]) }}
    </template>
  </div>
</template>

<script lang="ts" setup>
import { CallResultEnum, CallResultMap } from '@/constants/callResult'
import { $t } from '@/locales'

interface Props {
  msg: any
  isMyMsg: boolean
}
const props = defineProps<Props>()
</script>