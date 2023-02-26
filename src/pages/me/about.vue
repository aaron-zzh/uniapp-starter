<script lang="ts">
export default { name: 'AboutPage' }
</script>
<script setup lang="ts">
const to = (url: string) => {
  uni.navigateTo({
    url: url,
  })
}
</script>

<template>
  <view>
    <view class="mr-2 mx-4">
      <view style="height: 96rpx" class="u-flex u-row-between padding-sm item" @click="to('/pages/me/introduction')">
        <view style="color: #0d0d0d">平台介绍</view>
        <view>
          <u-icon name="arrow-right" color="#A3A3A3" size="28"></u-icon>
        </view>
      </view>
      <view style="height: 96rpx" class="u-flex u-row-between padding-sm item" @click="to('/pages/me/agreement')">
        <view style="color: #0d0d0d">用户协议</view>
        <view>
          <u-icon name="arrow-right" color="#A3A3A3" size="28"></u-icon>
        </view>
      </view>
      <view style="height: 96rpx" class="u-flex u-row-between padding-sm item" @click="to('/pages/me/privacy')">
        <view style="color: #0d0d0d">隐私政策</view>
        <view>
          <u-icon name="arrow-right" color="#A3A3A3" size="28"></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.item {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 17px;
  background-color: #ffffff;
  margin-bottom: 2rpx;
}
</style>
