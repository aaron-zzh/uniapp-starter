<template>
  <view ref="scroll-list" class="scroll-list">
    <scroll-view
      class="scroll-list__scroll-view"
      scroll-x
      :show-scrollbar="false"
      :upper-threshold="0"
      :lower-threshold="0"
    >
      <view class="scroll-list__scroll-view__content">
        <slot />
      </view>
    </scroll-view>
  </view>
</template>

<!-- filename: ScrollList.vue -->
<script setup lang="ts">
// ...
</script>

<style lang="scss" scoped>
.scroll-list {
  padding-bottom: 10px;
  &__scroll-view {
    display: flex;
    &__content {
      display: flex;
    }
  }
}
</style>
