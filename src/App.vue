<script setup lang="ts">
import useAppStore from '@/store/app'
import { setupPermission } from '@/permission'
import { ShoproInit } from './sheep'

const appStore = useAppStore()

onLaunch(() => {
  console.log('App Launch')
  // #ifndef H5
  appStore.initSystemInfo()
  // #endif
  setupPermission()

  // 隐藏原生导航栏 使用自定义底部导航
  // uni.hideTabBar()

  // 加载Shopro底层依赖
  ShoproInit()
})

onError((err) => {
  console.log('AppOnError:', err)
})

onShow((options) => {
  // App Show
  console.log('App Show')
  // #ifndef H5
  // appStore.checkUpdate()
  // #endif

  // #ifdef APP-PLUS
  // 获取urlSchemes参数
  const args = plus.runtime.arguments
  // eslint-disable-next-line no-empty
  if (args) {
  }

  // 获取剪贴板
  uni.getClipboardData({
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    success: (res) => {},
  })
  // #endif

  // #ifdef MP-WEIXIN
  // 确认收货回调结果
  console.log(options, 'options')
  // #endif
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
// 每个页面都会加载
@import './uni_modules/vk-uview-ui/index.scss';
@import './static/main.scss';

/* #ifdef APP-PLUS-NVUE */
@import './tmui/scss/nvue.css';
/* #endif */
/* #ifndef APP-PLUS-NVUE */
@import './tmui/scss/noNvue.css';
/* #endif */

// yudao
// @import './static/scss/index.scss';
// nutui
@import 'nutui-uniapp/styles/index.scss';
</style>
