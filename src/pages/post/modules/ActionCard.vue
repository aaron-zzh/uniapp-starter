<script setup lang="ts">
// import type { Ref } from 'vue'
const btnStyle = {
  fontSize: '14px',
  lineHeight: '22px',
  height: '28px',
  color: '#FFF',
  background: 'transparent',
}
</script>
<template>
  <view class="flex-box justify-between">
    <view style="line-height: 18px">
      <view class="text-14px italic font-600">标题</view>
      <view class="text-12px">子标题</view>
      <view class="text-12px">详情</view>
    </view>
    <view class="">
      <u-button size="mini" shape="circle" :custom-style="btnStyle">预约咨询</u-button>
      <view class="text-11px m-1">{{ `已有${100}人参加` }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
