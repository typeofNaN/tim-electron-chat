<template>
  <div class="h-full">
    <CallHeader />
    <global-content :show-padding="false" />
  </div>
</template>

<script lang="ts" setup>
import CallHeader from './components/call-header/index.vue'
import { GlobalContent } from '../common'
</script>