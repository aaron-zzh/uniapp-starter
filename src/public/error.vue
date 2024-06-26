<!-- 错误界面 -->
<template>
  <view class="error-page">
    <s-empty
      v-if="errCode === 'NetworkError'"
      icon="/static/internet-empty.png"
      text="网络连接失败"
      show-action
      action-text="重新连接"
      button-color="#ff3000"
      @clickAction="onReconnect"
    />
    <s-empty
      v-else-if="errCode === 'TemplateError'"
      icon="/static/internet-empty.png"
      text="未找到模板"
      show-action
      action-text="重新加载"
      button-color="#ff3000"
      @clickAction="onReconnect"
    />
    <s-empty
      v-else-if="errCode !== ''"
      icon="/static/internet-empty.png"
      :text="errMsg"
      show-action
      action-text="重新加载"
      button-color="#ff3000"
      @clickAction="onReconnect"
    />
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { ShoproInit } from '@/sheep'

const errCode = ref('')
const errMsg = ref('')

onLoad((options) => {
  errCode.value = options.errCode
  errMsg.value = options.errMsg
})

// 重新连接
async function onReconnect() {
  uni.reLaunch({
    url: '/pages/index/index',
  })
  await ShoproInit()
}
</script>

<style lang="scss" scoped>
.error-page {
  width: 100%;
}
</style>
