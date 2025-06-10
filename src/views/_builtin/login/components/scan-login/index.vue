<template>
  <div class="flex-center p-12px bg-#fff">
    <n-qr-code :value="text" :size="200" error-correction-level="H" type="svg" :padding="0" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const text = ref('https://www.baidu.com')
</script>