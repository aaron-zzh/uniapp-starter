<script lang="ts">
export default { name: 'PostPage' }
</script>
<script setup lang="ts">
import type { SearchParams } from '@/api/common/model'
import type { PostList } from '@/api/post/model'
import { useTabbarStore } from '@/store/tabbar'
import usePager from '@/hooks/pager'
import useTabsSwiper from '@/hooks/tabsSwiper'

const { tabbar } = useTabbarStore()
const { tabsRef, tabCurrent, swiperCurrent, tabsChange, transition, animationfinish } = useTabsSwiper()

const { list, pager, loadData, loadMore } = usePager<PostList>('demo')

const tabs = ref([
  {
    name: '热门动态',
  },
  {
    name: '我的关注',
  },
])

const params = computed(() => {
  const result: SearchParams = {
    kwargs: {
      domain: [['type', '=', 'post']],
      fields: ['id', 'name', 'brief', 'view_count', 'vote_count', 'child_count', 'favourite_count', 'create_date'],
      limit: pager.limit,
      offset: pager.offset,
    },
  }
  return result
})

onMounted(() => {
  loadData(params)
})

const onChange = (index: number) => {
  tabsChange(index)
  list.value = []
  pager.offset = 0
  loadData(params)
}
</script>

<template>
  <view class="container">
    <u-navbar :is-back="false" title="">
      <view class="u-tabs-box mx-1">
        <u-tabs-swiper
          ref="tabsRef"
          bg-color="#FFF"
          :list="tabs"
          :current="tabCurrent"
          :is-scroll="true"
          active-color="#000"
          inactive-color="#888"
          font-size="32"
          :active-item-style="{ fontWeight: 600 }"
          swiper-width="750"
          :bar-style="{ backgroundColor: '#3c9cff', height: '2px' }"
          @change="onChange"
        >
        </u-tabs-swiper>
      </view>
    </u-navbar>
    <view class="o-body">
      <swiper
        class="flex-1 pt-1"
        duration="300"
        :current="swiperCurrent"
        @transition="transition"
        @animationfinish="animationfinish"
      >
        <swiper-item class="swiper-item">
          <scroll-view scroll-y class="o-scroll-view" @scrolltolower="loadMore">
            <view class="page-box">
              <view v-for="(item, index) in list" :key="index" class="post-item-box px-3">
                <PostListItem :post="item" :list="true"></PostListItem>
              </view>
              <view class="pt-4 pb-8">
                <u-loadmore bg-color="#FFF" :status="pager.status" @loadmore="loadMore"></u-loadmore>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiper-item">
          <scroll-view scroll-y class="o-scroll-view">
            <view class="page-box">
              <view class="py-6">
                <u-divider half-width="100" font-size="24">没有更多了</u-divider>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <view class="fixed">
      <u-tabbar :list="tabbar" icon-size="24px" :mid-button="true"></u-tabbar>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100%;
  position: relative;
  background: white;
  .o-body {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 94px);
    .o-scroll-view {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
