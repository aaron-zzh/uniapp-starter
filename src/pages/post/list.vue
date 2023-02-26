<script lang="ts">
export default { name: 'PostListPage' }
</script>
<script setup lang="ts">
import type { SearchParams } from '@/api/common/model'
import type { PostList } from '@/api/post/model'

import usePager from '@/hooks/pager'

const config = inject('config') // 注入

const { list, pager, loadData, loadMore } = usePager<PostList>('blog.post')

const keyword = ref('')
const tabs = ref([
  {
    name: '类别1',
  },
  {
    name: '类别2',
  },
  {
    name: '类别3',
  },
])
const current = ref(0)
// 组装查询参数
const params = computed(() => {
  const category = tabs.value[current.value].name
  let domain: Array<[string, string, string | boolean | number]> = [
    ['blog_id.name', '=', category],
    ['is_published', '=', true],
  ]
  if (keyword.value) {
    domain.push(['name', 'ilike', keyword.value])
  }
  const result: SearchParams = {
    kwargs: {
      domain,
      fields: ['id', 'name', 'tag_ids/name', 'published_date', 'view_count', 'image_url', 'author_id/name'],
      limit: pager.limit,
      offset: pager.offset,
    },
  }
  return result
})

onMounted(() => {
  loadData(params)
})

onReachBottom(() => {
  loadMore()
})

// 筛选
const change = (index: number) => {
  current.value = index
  confirmSearch()
}
const confirmSearch = () => {
  list.value = []
  pager.offset = 0
  loadData(params)
}
</script>

<template>
  <view class="container mx-3">
    <!-- scroll-view 与 u-sticky 同时使用可能存在问题-->
    <u-sticky>
      <view class="search-box bg-white">
        <u-search
          v-model="keyword"
          shape="round"
          :clearabled="true"
          input-align="center"
          height="66"
          placeholder="输入关键词搜索"
          :show-action="false"
          @search="confirmSearch"
          @change="$u.debounce(confirmSearch, 500)"
        ></u-search>
      </view>
      <u-tabs :list="tabs" :is-scroll="false" :current="current" active-color="#3c9cff" @change="change"></u-tabs>
    </u-sticky>
    <view v-if="list.length == 0 && pager.status != 'loading'">
      <u-empty icon-size="360" :src="config.emptyImg"></u-empty>
    </view>
    <view class="news-box" style="border-top: 1px solid #eee">
      <view v-for="(item, index) in list" :key="index" class="news-item-box">
        <NewsListItem :data="item" />
      </view>
    </view>
    <view v-if="list.length > 0" class="my-5">
      <u-loadmore bg-color="#FFF" :status="pager.status" @loadmore="loadMore"></u-loadmore>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background: white;
  .news-box {
    margin: 10px;
  }
  .news-item-box {
    border-bottom: 1px solid #eee;
  }
}
</style>
