<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
export default { name: 'ComponentDemo' }
</script>
<script setup lang="ts">
import CommonApi from '@/api/common'
import PostApi from '@/api/post'
import useTimeAgo from '@/hooks/timeAgo'
import { useInit } from '@/hooks/useInit'
import uniAsync from '@/utils/uniAsync'

import { TransitionPresets } from '@vueuse/core'
import md5 from 'blueimp-md5'
const config = inject('config') // 注入

const i18n = inject('i18n') // 注入
console.log(i18n.greetings.hello, '111', config.oss, import.meta.env.MODE, process.env.NODE_ENV)

// 访问插件全局函数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { proxy }: any = getCurrentInstance()
const { $translate } = proxy
console.log($translate('greetings.hello'))
console.log(md5('message'))

const auiLoadingRef = ref(null)

// vueuse 示例
const { x, y } = useMouse()
const { count, inc, dec } = useCounter()
const { counter, pause, resume } = useInterval(500, { controls: true })
const formatter = ref('YYYY-MM-DD HH:mm:ss')
const formatted = useDateFormat(useNow(), formatter)
const timeAgo = useTimeAgo('2022-12-08 11:30')

const source = ref(0)
const output = useTransition(source, {
  duration: 30000,
  transition: TransitionPresets.easeOutExpo,
})
source.value = 5000

const color = computed(() => {
  return `rgb(255, ${output.value % 255}, 0)`
})

onLoad(() => {
  console.log('onLoad demo')
  const { pageName, pagePath, pageQuery } = useInit()
  console.log(pageName, pagePath, pageQuery, 'pageName, pagePath, pageQuery')
})
onShow(() => {
  console.log('onShow demo in page')
})
onReady(() => {
  console.log('onReady demo')
  auiLoadingRef.value.show()
})

onMounted(() => {
  console.log('onMounted demo')
  // auiLoadingRef.value.show()
  setTimeout(() => {
    auiLoadingRef.value.hide()
  }, 1000)
})

const getTest = async () => {
  // const res = await CommonApi.queryList('blog.post', {})
  const res = await CommonApi.getAllList('blog.post')
  // const res = await CommonApi.test()
  uni.$u.toast(JSON.stringify(res))
}
const postTest = async () => {
  const res = await PostApi.newPost({ name: '1' })
  console.log(res, 'postTest')
}

const uniAsyncTest = async () => {
  const systemInfo = await uniAsync.getSystemInfo()
  console.log(systemInfo, 'systemInfo')
}

const onScrollToLower = () => {
  console.log('自定义 onScrollToLower')
}
</script>

<template>
  <view class="container mx-4">
    <u-section class="my-4" title="时间格式化" sub-title="" :arrow="false" />
    <h3>{{ formatted }}</h3>
    <h1>{{ timeAgo }}</h1>
    <u-section class="my-4" title="图表" sub-title="" :arrow="false" />
    <RadarCharts />
    <u-section class="my-4" title="UnoCSS" sub-title="" :arrow="false" />
    <button bg="red-400" class="w-200" text="14px" m="4">按钮</button>
    <button class="bg-blue-400 w-200 text-16px m-4">按钮</button>
    <view class="custom-div">@unocss/transformer-directives</view>
    <u-section class="my-4" title="UnoCSS icon" sub-title="" :arrow="false" />
    <view class="flex justify-start">
      <!-- A basic anchor icon from Phosphor icons -->
      <view class="i-ph-anchor-simple-thin" />
      <!-- An orange alarm from Material Design Icons -->
      <view class="i-mdi-alarm text-orange-400" />
      <!-- A large Vue logo -->
      <view class="i-logos-vue text-3xl" />
      <!-- Sun in light mode, Moon in dark mode, from Carbon -->
      <view>
        <button class="i-carbon-sun dark:i-carbon-moon" />
      </view>
      <!-- Twemoji of laugh, turns to tear on hovering -->
      <view class="i-twemoji-grinning-face-with-smiling-eyes hover:i-twemoji-face-with-tears-of-joy" />
    </view>

    <u-section class="my-4" title="Vueuse 示例" sub-title="" :arrow="false" />
    <h3>Mouse: {{ x }} x {{ y }}</h3>
    <h3>
      Counter: {{ count }}
      <a class="mr-10px" @click="inc()">+</a>
      <a @click="dec()">-</a>
    </h3>
    <p>Interval fired: {{ counter }}</p>
    <p :style="`color: ${color}`">transition fired: {{ Math.round(output) }}+</p>

    <u-section class="my-4" title="Vue 插件" sub-title="" :arrow="false" />
    <h1>{{ $translate('greetings.hello') }}</h1>

    <u-section class="my-4" title="接口测试" sub-title="" :arrow="false" />

    <button m="4" @click="getTest">getTest</button>
    <button m="4" @click="postTest">postTest</button>
    <button m="4" @click="uniAsyncTest">uniAsyncTest</button>

    <u-section class="my-4" title="滚动测试" sub-title="" :arrow="false" />
    <view class="h-400 b-2 b-solid border-red-100">
      <PullList :on-scroll-to-lower="onScrollToLower">
        <template #list>
          <view v-for="i in 20" :key="i" class="p-10">scroll</view>
        </template>
      </PullList>
    </view>

    <AuiLoading ref="auiLoadingRef" :type="4" direction="row" msg="加载中" :mask="false" />
  </view>
</template>

<style lang="scss" scoped>
.container {
  margin-bottom: 100px;
  text-align: center;
  p {
    margin: 10px;
  }

  .custom-div {
    --at-apply: text-center my-0 font-bold text-18px;
    --at-apply: 'hover:text-red';
  }
}
</style>
