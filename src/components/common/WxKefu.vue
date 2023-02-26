<script setup lang="ts">
import storage from '@/utils/storage'
const config = inject('config') // 注入

const props = defineProps<{
  data: {
    wechat: string
  }
}>()

const show = ref(false)
const wx = ref(props.data.wechat)
const onConfirm = () => {
  uni.setClipboardData({
    data: wx.value,
    success: function () {
      uni.showToast({
        title: '复制微信号成功',
        icon: 'success',
      })
    },
  })
}
const hideKefu = ref(Boolean(storage.getHideKefu()))
const hide = ref(false)
const onHide = () => {
  storage.setHideKefu(true)
  hideKefu.value = true
}
</script>

<template>
  <view>
    <view v-show="!show && !hideKefu" class="wxkefu-container" @click="show = true">
      <view class="mx-2">
        <u-image width="40px" height="40px" :src="`${config.oss}/common/kefu.jpeg`" shape="circle"></u-image>
      </view>
    </view>
    <u-popup v-model="show" mode="center" closeable height="350px" width="70%" :border-radius="12">
      <view class="image-box">
        <u-image width="50px" height="50px" :src="`${config.oss}/common/kefu.jpeg`" shape="circle"></u-image>
      </view>
      <view class="info-box mt-3">
        <view class="text-17px">
          Hi家长，我是你的择校规划师 ~ <br />
          可以为你提供：
        </view>
        <view class="text-14px color-#243b82 mt-6" style="text-align: left; line-height: 26px">
          - 专业解答择校问题<br />
          - 全面介绍学校专业<br />
          - 择校报名大礼包<br />
          - 同城/同校交流群<br />
        </view>
        <view class="text-12px color-#888 mt-6"> 微信号: {{ wx }} </view>
        <u-button
          class="mt-3"
          :custom-style="{ padding: '0px 40px', height: '34px', color: '#FFF', background: '#243b82', border: 'none' }"
          color="primary"
          :hair-line="false"
          size="mini"
          shape="circle"
          @click="onConfirm"
          >复制微信号</u-button
        >
        <view class="mt-2">
          <u-checkbox v-model="hide" :size="28" :label-size="26" @click="onHide"> 不显示 </u-checkbox>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<style lang="scss" scoped>
.wxkefu-container {
  display: flex;
  align-items: center;
  background: $uni-color-primary;
  position: fixed;
  bottom: 90px;
  right: 0;
  height: 54px;
  width: 58px;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  z-index: 999;
}
.info-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
  text-align: center;
}
.image-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: -30px;
  z-index: 1000;
}

::v-deep .uni-scroll-view {
  overflow: visible !important;
}
::v-deep .u-mode-center-box {
  overflow: visible !important;
}
</style>
