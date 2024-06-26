<script lang="ts">
export default { name: 'PageFirstUI' }
</script>
<template>
  <view class="m-10px">
    <fui-card
      :src="src2"
      image-radius="50%"
      title="First UI"
      color="#465CFF"
      tag="23小时前"
      :header-line="false"
      show-border
    >
      <view class="fui-list__item">
        <image class="fui-cover" src="../../static/images/common/3.jpg" mode="widthFix"> </image>
        <view class="fui-list__title">First UI重磅上线，一款轻量、全面、可靠的移动端组件库。</view>
      </view>
    </fui-card>
    <fui-white-space size="large"></fui-white-space>
    <fui-wing-blank size="small">
      <fui-switch checked></fui-switch>
      <fui-icon name="addfriends" :size="60" color="#465CFF"></fui-icon>
      <fui-icon name="addfriends-fill" :size="60"></fui-icon>

      <view class="m-20px">
        <fui-button text="默认按钮" @click="showToast"></fui-button>
      </view>

      <fui-radio-group>
        <fui-label v-for="(item, index) in radioItems" :key="index">
          <fui-list-cell>
            <view class="fui-align__center">
              <fui-radio :checked="item.checked" :value="item.value"> </fui-radio>
              <text class="fui-text">{{ item.name }}</text>
            </view>
          </fui-list-cell>
        </fui-label>
      </fui-radio-group>
    </fui-wing-blank>

    <fui-toast ref="toast">
      <view class="fui-toast__custom">
        <fui-icon name="checkbox" color="#fff"></fui-icon>
        <text class="fui-toast__txt">操作成功</text>
      </view>
    </fui-toast>
  </view>
</template>

<script lang="ts" setup>
const toast = ref(null)
const showToast = () => {
  let options = {}
  toast.value.show(options)
}
const radioItems = ref([
  {
    name: '小于18岁',
    value: '1',
    checked: true,
  },
  {
    name: '18~28岁',
    value: '2',
    checked: false,
  },
  {
    name: '29~40岁',
    value: '3',
    checked: false,
  },
])
</script>

<style lang="scss" scoped>
@import '@/firstui/fui-css/firstui.scss';

.fui-section__title {
  margin-left: 32rpx;
}

.fui-text {
  font-size: 30rpx;
  padding-left: 16rpx;
}

.fui-list__cell {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fui-page__bd {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.fui-toast__custom {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.fui-toast__txt {
  font-size: 32rpx;
  color: #ffffff;
  padding-top: 12rpx;
  display: block;
}

page {
  font-weight: normal;
  background-color: #eee;
}

.fui-section__title {
  margin-left: 32rpx;
}

.fui-card__content {
  font-size: 28rpx;
  padding: 32rpx 20rpx;
  box-sizing: border-box;
}

.fui-padding {
  padding-left: 32rpx;
  padding-right: 32rpx;
}

.fui-list__item {
  width: 100%;
  height: 385rpx;
  position: relative;
  background: #eee;
}

.fui-cover {
  width: 100%;
  height: 385rpx;
  display: block;
}

.fui-list__title {
  position: absolute;
  left: 0;
  bottom: 0;
  color: #fff;
  font-weight: 500;
  padding: 24rpx 20rpx;
  box-sizing: border-box;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6));
}

.fui-card__title {
  width: 100%;
  padding: 32rpx;
  box-sizing: border-box;
  font-weight: 500;
}
</style>
