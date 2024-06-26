<script lang="ts">
export default { name: 'NutuiDemo' }
</script>
<script setup lang="ts">
const searchValue = ref('')
onLoad((options) => {
  console.log('onLoad options', options)
})
onShow(() => {
  console.log('onShow')
})
onReady(() => {
  console.log('onReady')
})
onMounted(() => {
  console.log('onMounted')
})

const toast = useToast()

const onClick = () => {
  toast.text('提交成功')
}

const demoSignUrl = ref('')
const confirm = (canvas, data) => {
  if (data === '') {
    console.log(canvas)
    return false
  }
  demoSignUrl.value = data
  console.log('图片地址', canvas, data)
}
const clear = () => {
  demoSignUrl.value = ''
  console.log('清除事件')
}
</script>

<template>
  <view class="container">
    <nut-searchbar v-model="searchValue">
      <template #leftin>
        <nut-icon name="search2" />
      </template>
      <template #rightout>搜索</template>
    </nut-searchbar>
    <nut-button type="primary" @click="onClick">主要按钮</nut-button>
    <!-- 或者（仅限unplugin方式） -->
    <NutButton type="primary" :custom-style="{ padding: '40px', marginLeft: '20px' }">主要按钮</NutButton>
    <nut-divider>文本</nut-divider>

    <nut-toast></nut-toast>

    <nut-cell title="Text 文字提示" is-link @click="showText"></nut-cell>

    <nut-signature stroke-style="red" @confirm="confirm" @clear="clear" />
    <image v-if="demoSignUrl" :src="demoSignUrl" class="demoSignUrl" />
  </view>
</template>

<style lang="scss" scoped>
.container {
  background: #fff;
  padding: 16px;
}
#spcanvas {
  height: 400px;
}
.demoSignUrl {
  width: 100px;
  height: 100px;
}
</style>
