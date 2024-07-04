<script lang="ts">
export default { name: 'IndexPage' }
</script>
<script setup lang="ts">
// const title = ref(import.meta.env.VITE_APP_TITLE)
onMounted(() => {
  setTimeout(() => {
    uni.switchTab({ url: '/pages/tabbar/home/index' })
  }, 1500)
})
</script>

<template>
  <view class="flex flex-col items-center justify-center border-base" style="height: 100vh">
    <view class="flex flex-col items-center justify-center">
      <text class="title">服务平台</text>
    </view>
    <image class="logo" src="/static/logo.png" />
  </view>
</template>

<style scoped>
.logo {
  height: 80px;
  width: 80px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: rgb(24, 24, 192);
  letter-spacing: 12px;
  writing-mode: vertical-lr;
  /* margin-top: 10px; */
}
</style>
