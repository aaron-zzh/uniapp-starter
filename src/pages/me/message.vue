<script lang="ts">
export default { name: 'MessagePage' }
</script>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Message } from '@/api/user/model'
import type { SearchParams } from '@/api/common/model'
import { useUserStore } from '@/store/user'
import usePager from '@/hooks/pager'
const config = inject('config') // 注入
const emptyImg = '/static/images/common/avatar.jpg'

const userStore = useUserStore()
const { id: user_id } = storeToRefs(userStore)

const { list, pager, loadData, loadMore } = usePager<Message>('demo')

const params = computed(() => {
  const result: SearchParams = {
    kwargs: {
      domain: [['user_id', '=', user_id.value]],
      fields: ['id', 'type', 'title', 'icon', 'date'],
      limit: pager.limit,
      offset: pager.offset,
    },
  }
  return result
})

onMounted(() => {
  loadData(params)
})

onPullDownRefresh(() => {
  console.log('refresh')
  list.value = []
  pager.offset = 0
  loadData(params)
})

const toDetail = (message: Message) => {
  uni.$u.route({
    url: 'pages/post/detail',
    params: {
      id: message.id,
    },
  })
}

const getInfo = (message: Message) => {
  if (message.type == 'post') {
    return message.from + ' | 发布了新动态'
  } else if (message.type == 'system') {
    return '系统消息'
  }
}
</script>

<template>
  <view class="container">
    <u-no-network></u-no-network>
    <view>
      <u-empty icon-size="360" :src="config.emptyImg" text="暂无消息" :show="list.length == 0"></u-empty>
    </view>
    <view v-if="list.length > 0" class="list-box px-2">
      <scroll-view scroll-y style="height: calc(100vh - 60px); width: 100%" @scrolltolower="loadMore">
        <view v-for="(message, index) in list" :key="index" class="card my-2 rd-2 p-2">
          <view class="py-2 b-b-1 b-#eee flex-box justify-between" @click="toDetail(message)">
            <view class="flex">
              <u-image
                width="40px"
                height="40px"
                :src="message.icon ? config.domain + message.icon : emptyImg"
                border-radius="4px"
                shape="circle"
              ></u-image>
              <view class="ml-2">
                <view class="text-14px mb-2">
                  {{ getInfo(message) }}
                </view>
                <view class="text-14px mb-2">
                  {{ message.title || message.name }}
                </view>
                <view class="text-12px color-#888">
                  {{ message.date }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="list.length > 0" class="my-5">
          <u-loadmore :status="pager.status" font-size="24" @loadmore="loadMore" />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 44px);
  overflow: hidden;
  background: #fff;
}
</style>
