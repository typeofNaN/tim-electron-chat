<template>
  <div class="h-full flex justify-between items-center select-none">
    <div class="flex items-center ml-18px">
      <img :src="logo" alt="" class="w-24px h-24px" />
    </div>
    <div class="h-full flex-grow-1" style="-webkit-app-region: drag;" />
    <AppCtrl />
  </div>
</template>

<script lang="ts" setup>
import { AppCtrl } from '@/layouts/common/global-header/components'
import logo from '@/assets/images/logo.png'
</script>