<template>
  <div class="flex items-center fixed top-0px left-0px w-full h-30px z-9999">
    <div class="h-full flex-grow-1" style="-webkit-app-region: drag;" />
    <AppCtrl />
  </div>
</template>

<script lang="ts" setup>
import AppCtrl from '../app-ctrl/index.vue'
</script>