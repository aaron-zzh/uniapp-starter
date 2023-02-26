<script setup lang="ts">
import type { Ref } from 'vue'
import { useTabbarStore } from '@/store/tabbar'
import usePager from '@/hooks/pager'
import type { HomeData, SearchParams } from '@/api/common/model'
import type { PostList } from '@/api/post/model'

const config = inject('config') // 注入

const { tabbar } = useTabbarStore()

const { list, pager, loadData, loadMore } = usePager<PostList>('demo')

const homeData: Ref<HomeData> = ref({} as HomeData)
const model = reactive({
  city: ['山东省', '潍坊市', ''],
  showCitySelect: false,
})

// 常量
const events = ['寒雨连江夜入吴', '平明送客楚山孤', '洛阳亲友如相问', '一片冰心在玉壶']
const gridList = ref([
  {
    name: '标题',
    value: '1',
    img: '/static/images/common/1.png',
  },
  {
    name: '标题',
    value: '2',
    img: '/static/images/common/8.png',
  },
  {
    name: '标题',
    value: '3',
    img: '/static/images/common/3.png',
  },
  {
    name: '标题',
    value: '4',
    img: '/static/images/common/4.png',
  },
  {
    name: '标题',
    value: '5',
    img: '/static/images/common/5.png',
  },
  {
    name: '标题',
    value: '6',
    img: '/static/images/common/7.png',
  },
  {
    name: '标题',
    value: '7',
    img: '/static/images/common/6.png',
  },
  {
    name: '更多',
    value: '8',
    img: '/static/images/common/2.png',
  },
])
const bannerList = ref([
  {
    image: '/static/images/common/1.jpg',
  },
  {
    image: '/static/images/common/2.jpg',
  },
  {
    image: '/static/images/common/3.jpg',
  },
])

// 组装查询参数
const params = computed(() => {
  const filter = tabs[current.value].value
  console.log('tab-' + filter)
  const result: SearchParams = {
    kwargs: {
      domain: [
        ['is_published', '=', true],
        ['filter', '=', filter],
      ],
      fields: ['id', 'name', 'tag_ids/name', 'published_date', 'view_count', 'image_url', 'author_id/name'],
      limit: pager.limit,
      offset: pager.offset,
    },
  }
  return result
})

onLoad((options) => {
  // model.id = options.id
  loadData(params)
})
onReachBottom(() => {
  console.info('onReachBottom')
  loadMore()
})
onPullDownRefresh(() => {
  list.value = []
  pager.offset = 0
  loadData(params)
})

const tabs = [
  {
    name: '标签',
    value: '1',
  },
  {
    name: '标签',
    value: '2',
  },
  {
    name: '标签',
    value: '3',
  },
]
const current = ref(0)
const change = (index: number) => {
  current.value = index
  list.value = []
  pager.offset = 0
  loadData(params)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onCityChange = (result: any) => {
  model.city = [result.province.name, result.city.name, result.area.name]
}

const toDemoPage = () => {
  uni.$u.route('pages/demo/index')
}
const toPostList = () => {
  uni.$u.route('pages/post/list')
}
const toMessageList = () => {
  uni.$u.route('pages/me/message')
}
</script>
<script lang="ts">
// 组件名，eslint multi-word-components-name
export default { name: 'HomePage' }
</script>

<template>
  <view class="container">
    <u-navbar :is-back="false" :border-bottom="false">
      <view class="flex items-center" style="width: 100%">
        <view class="flex items-center ml-2">
          <view class="text-16px" @click="model.showCitySelect = true">{{ model.city[1] }}</view>
          <u-icon name="arrow-down" size="28" color="#666" class="mx-1"></u-icon>
        </view>
        <view class="search-wrap" style="width: 100%">
          <u-search placeholder="搜索" disabled :show-action="false" height="56" @click="toPostList"></u-search>
        </view>
        <view class="navbar-right">
          <view class="right-item mr-2" @click="toMessageList">
            <u-icon name="chat" size="46" color="#666"></u-icon>
            <u-badge v-if="homeData.msg_count" :count="homeData.msg_count" size="mini" :offset="[-15, -15]"></u-badge>
          </view>
        </view>
      </view>
    </u-navbar>
    <view class="o-body px-4">
      <view>
        <view class="banner my-3">
          <u-swiper :list="bannerList" height="200"></u-swiper>
        </view>
        <view class="my-3">
          <u-notice-bar mode="vertical" :list="events" :more-icon="true"></u-notice-bar>
        </view>
        <u-grid :col="4" :border="false">
          <u-grid-item v-for="(item, index) in gridList" :key="index">
            <u-image
              width="40px"
              height="40px"
              :src="item.img"
              :fade="false"
              :lazy-load="false"
              :show-loading="false"
            ></u-image>
            <view class="text-#333 text-13px">{{ item.name }}</view>
          </u-grid-item>
        </u-grid>
        <view class="main-btn-box flex-box mb-1 mt-3">
          <view class="main-btn mr-2" @click="toPostList">
            <view class="i-iconoir-www text-20px"></view>
            <view class="ml-1">页面</view>
          </view>
          <view class="main-btn" @click="toDemoPage">
            <view class="i-iconoir-xray-view text-20px"></view>
            <view class="ml-1">组件</view>
          </view>
        </view>
        <view class="news-box">
          <uni-section title="热门新闻" @click="toPostList"></uni-section>
          <view class="">
            <u-tabs v-model="current" :list="tabs" :is-scroll="false" active-color="#3c9cff" @change="change"></u-tabs>
          </view>
          <view v-for="(item, index) in list" :key="index" class="news-item-box">
            <NewsListItem :data="item" />
          </view>
        </view>
      </view>
      <view v-if="list.length > 0 || pager.status == 'loading'" class="my-5">
        <u-loadmore bg-color="#FFF" :status="pager.status" @loadmore="loadData"></u-loadmore>
      </view>
      <view v-if="list.length == 0 && pager.status != 'loading'">
        <u-empty icon-size="360" :src="config.emptyImg"></u-empty>
      </view>
    </view>
    <u-tabbar :list="tabbar" icon-size="24px" :mid-button="true"></u-tabbar>
    <view>
      <CitySelect
        v-model="model.showCitySelect"
        :only-city="true"
        :default-region="model.city"
        @city-change="onCityChange"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background: white;

  .search-wrap {
    margin: 0 20rpx;
    flex: 1;
  }

  .right-item {
    position: relative;
    color: #ffffff;
    display: flex;
  }

  .main-btn {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    border-radius: 4px;
    height: 60px;
    width: 49.9%;
    color: #555; // #243b82;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 1px 3px -1px rgba(140, 190, 238, 0.2);
    background-image: linear-gradient(
      45deg,
      rgba(0, 255, 255, 0.15) 25%,
      rgba(49, 87, 182, 0.15) 50%,
      rgba(174, 109, 109, 0.15) 75%
    );
    background-size: 100%;
  }

  ::v-deep .u-grid-item-box {
    padding: 6px 16px !important;
  }
}
</style>
