<template>
  <div class="display-inline-block py-4px px-10px b-rd-4px break-all bg-gray-100 dark:bg-gray-800">
    {{ $t('msgNotification.customMessage') }}
  </div>
</template>

<script lang="ts" setup>
interface Props {
  msg: any
}

defineProps<Props>()
</script>
