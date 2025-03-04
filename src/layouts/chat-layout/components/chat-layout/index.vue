<template>
  <div class="h-full">
    <div class="bg-#f5f5f5 dark:bg-#1e1e1e h-30px">
      <slot name="header" />
    </div>
    <div class="flex h-[calc(100%-30px)]">
      <div class="w-60px bg-#f5f5f5 dark:bg-#1e1e1e">
        <slot name="sider" />
      </div>
      <div class="flex w-[calc(100%-60px)]">
        <slot />
      </div>
    </div>
  </div>
</template>
