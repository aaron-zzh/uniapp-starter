<script lang="ts">
export default { name: 'PageDemo' }
</script>
<script setup lang="ts">
import type { AuthorInfo } from '@/api/common/model'

const model: AuthorInfo = reactive({} as AuthorInfo)
const auiLoadingRef = ref(null)

onLoad((options) => {
  console.log('onLoad options', options)
  model.id = options.id
})
onShow(() => {
  console.log('onShow')
})
onReady(() => {
  console.log('onReady')
})
onMounted(() => {
  console.log('onMounted')
  loadData()
})

const loadData = async () => {
  if (!auiLoadingRef.value) return
  auiLoadingRef.value.show()
  setTimeout(() => {
    auiLoadingRef.value.hide()
  }, 1000)
}
</script>

<template>
  <view class="container">
    <u-no-network></u-no-network>
    <view class="page p1 b-1"> Page </view>
    <AuiLoading ref="auiLoadingRef" :type="4" direction="row" msg="加载中" :mask="false" />
  </view>
</template>

<style lang="scss" scoped>
.container {
  background: #fff;
}
</style>
