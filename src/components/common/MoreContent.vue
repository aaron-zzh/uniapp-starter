<script setup lang="ts">
defineProps<{
  title: string
  content: string
  more: boolean
  subTitle?: string
  height?: number
}>()
</script>

<template>
  <view class="content-box mt-4">
    <view class="py-2">
      <u-section :title="title" :sub-title="subTitle || ''" :right="more" font-size="32"></u-section>
    </view>
    <u-read-more :toggle="true" :show-height="height ? height : 400">
      <rich-text class="text-14px" :nodes="content"></rich-text>
    </u-read-more>
  </view>
</template>

<style lang="scss" scoped></style>
