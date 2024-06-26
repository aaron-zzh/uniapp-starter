<script lang="ts">
export default { name: 'OrgPage' }
</script>
<script setup lang="ts">
import type { OrgInfo } from '@/api/user/model'
import type { SearchParams } from '@/api/common/model'
import { isLogin } from '@/utils/public'
import useUserStore from '@/store/user'
import usePager from '@/hooks/pager'
// const config = inject('config') // 注入

const userStore = useUserStore()
const userInfo = computed(() => {
  return userStore.getUserInfo
})

const model = reactive({
  keyword: '',
  category: 0,
  city: ['山东省', '', ''], //城市
  sortby: 1,
  cityName: '地区',
  sortbyName: '排序',
  categoryName: '类型',
})

const { list, pager, loadData, loadMore } = usePager<OrgInfo>('ydt.org')

const params = computed(() => {
  const order = sortOptions.value[model.sortby - 1].order
  const domain: Array<[]> = []
  let fields = []

  if (currentTabIndex.value == 0) {
    if (!userInfo.value.is_admin) {
      // 销售员查看自己的
      domain.push(['user_id', '=', userInfo.value.id])
    } else {
      domain.push(['user_id', '!=', false])
    }
  }

  if (model.keyword) {
    domain.push('|')
    domain.push(['name', 'like', model.keyword])
    domain.push(['code', 'like', model.keyword])
  }
  if (model.category) {
    domain.push(['major', '=', model.category])
  }
  if (model.city[0]) {
    domain.push(['state_id.name', 'like', model.city[0]])
  }
  if (model.city[1]) {
    domain.push(['city_id.name', '=', model.city[1]])
  }
  if (model.city[2]) {
    domain.push(['county_id.name', '=', model.city[2]])
  }
  moreFilter.value.forEach((filter) => {
    if (filter.active) {
      domain.push(filter.domain)
    }
  })
  if (currentTabIndex.value == 0) {
    fields = [
      'id',
      'name',
      'code',
      'user_id/name',
      'user_id/avatar_256',
      'city_id/name',
      'county_id/name',
      'street',
      'student_count',
      'card_count',
    ]
  } else {
    fields = ['id', 'name', 'code', 'user_id/name', 'city_id/name', 'county_id/name', 'street']
  }
  const result: SearchParams = {
    kwargs: {
      domain,
      fields,
      limit: pager.limit,
      offset: pager.offset,
      order,
    },
  }
  return result
})

onMounted(() => {
  if (!isLogin()) {
    uni.$u.toast('请先登录')
    return
  }
  if (userInfo.value.is_admin || userInfo.value.is_salesman) {
    loadData(params)
  } else {
    uni.$u.toast('无权限')
  }
})

onPullDownRefresh(() => {
  console.log('refresh')
  confirmSearch()
})

onNavigationBarButtonTap((e) => {
  onCreate()
})

const onCreate = () => {
  if (userInfo.value.is_salesman) {
    uni.navigateTo({
      url: './detail',
    })
  } else {
    uni.$u.toast('请联系管理员新增')
  }
}

const confirmSearch = () => {
  pager.offset = 0
  list.value = []
  loadData(params)
}

const toOrg = (id: number) => {
  uni.$u.route({
    url: 'pages/org/detail',
    params: {
      id,
    },
  })
}

const toDetail = (org: OrgInfo) => {
  if (userInfo.value.is_admin || currentTabIndex.value == 0) {
    toOrg(org.id)
  } else {
    if (org.user_id.name) {
      uni.$u.toast('已被领取')
    } else {
      toOrg(org.id)
    }
  }
}

// 搜索筛选排序
const showCitySelect = ref(false)
const sortOptions = ref([
  {
    label: '默认排序',
    value: 1,
    order: 'id desc',
  },
  {
    label: '学员最多',
    value: 2,
    order: 'student_count desc',
  },
  {
    label: '缴费最多',
    value: 3,
    order: 'card_count desc',
  },
])
const categoryOptions = ref([
  {
    name: '全部',
    label: '全部',
    value: 0,
  },
  {
    name: '美术',
    label: '美术',
    value: 'ms',
  },
  {
    name: '舞蹈',
    label: '舞蹈',
    value: 'wd',
  },
  {
    name: '书法',
    label: '书法',
    value: 'sf',
  },
  {
    name: '航空',
    label: '航空',
    value: 'hk',
  },
  {
    name: '表演',
    label: '表演',
    value: 'by',
  },
  {
    name: '音乐',
    label: '音乐',
    value: 'yy',
  },
])
const tabList = ref([
  {
    name: '我的机构',
  },
  {
    name: '机构清单',
  },
])

const onOpenArea = (index: number) => {
  if (index == 0) {
    showCitySelect.value = true
  }
}

const onClose = () => {
  closeDropdown()
}

const onCityChange = (result) => {
  model.city = [result.province.name, result.city.name, result.area.name]
  for (let i = 2; i >= 0; i--) {
    if (model.city[i]) {
      model.cityName = model.city[i]
      break
    }
  }
  confirmSearch()
  closeDropdown()
}

const onChangeSortby = (index: number) => {
  model.sortby = index
  model.sortbyName = sortOptions.value[index - 1].label
  confirmSearch()
}
const onChangeCategory = (index: number) => {
  model.category = index
  model.categoryName = categoryOptions.value.filter((v) => v.value == index)[0].label
  confirmSearch()
}

const uDropdownRef = ref(null)
const closeDropdown = () => {
  if (uDropdownRef.value) {
    uDropdownRef.value.close()
  }
}

const moreFilter = ref([
  {
    label: '已合作',
    domain: ['is_partner', '=', true],
    active: false,
  },
  {
    label: '未合作',
    domain: ['is_partner', '=', false],
    active: false,
  },
  {
    label: '有文化课',
    domain: ['cultural_course', '=', true],
    active: false,
  },
])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onChangeFilter = (index: any) => {
  let filter = moreFilter.value[index]
  filter.active = !filter.active
}
const onConfirmFilter = () => {
  confirmSearch()
  closeDropdown()
}

const currentTabIndex = ref(0)
const onTabChange = (e) => {
  console.log(e)
  currentTabIndex.value = e
  confirmSearch()
}
</script>

<template>
  <view class="container">
    <u-no-network></u-no-network>
    <u-navbar :border-bottom="false">
      <view class="w-100%">
        <view class="flex-1"></view>
        <view class="c-#666 relative flex justify-end mr-20px" @click="onCreate">
          <u-icon name="plus" size="36"></u-icon><span>新增</span>
        </view>
      </view>
    </u-navbar>
    <view class="mx-16px">
      <u-subsection :list="tabList" :current="currentTabIndex" @change="onTabChange"></u-subsection>
    </view>
    <view class="search-box bg-white">
      <u-search
        v-model="model.keyword"
        style="width: 100%"
        shape="round"
        :clearabled="true"
        input-align="center"
        height="66"
        placeholder="输入名称搜索"
        :show-action="false"
        @search="confirmSearch"
        @change="$u.debounce(confirmSearch, 500)"
      ></u-search>
    </view>

    <view class="filter-box bg-white">
      <u-dropdown
        ref="uDropdownRef"
        height="80"
        title-size="28"
        menu-icon-size="24"
        :close-on-click-mask="true"
        active-color="#3c9cff"
        :border-bottom="true"
        @open="onOpenArea"
      >
        <u-dropdown-item :title="model.cityName"> </u-dropdown-item>
        <u-dropdown-item
          v-model="model.sortby"
          :title="model.sortbyName"
          :options="sortOptions"
          @change="onChangeSortby"
        ></u-dropdown-item>
        <u-dropdown-item
          v-model="model.category"
          :title="model.categoryName"
          :options="categoryOptions"
          @change="onChangeCategory"
        ></u-dropdown-item>
        <u-dropdown-item title="其他">
          <view class="slot-content">
            <view class="item-box">
              <view
                v-for="(item, index) in moreFilter"
                :key="index"
                class="item"
                :class="[item.active ? 'active' : '']"
                @tap="onChangeFilter(index)"
              >
                {{ item.label }}
              </view>
            </view>
            <u-button type="primary" @click="onConfirmFilter">确定</u-button>
          </view>
        </u-dropdown-item>
      </u-dropdown>
    </view>
    <view v-if="list.length == 0 && pager.status != 'loading'">
      <EmptyImage />
    </view>
    <view v-if="list.length > 0" class="list-box">
      <scroll-view scroll-y style="height: calc(100vh - 170px); width: 100%" @scrolltolower="loadMore">
        <view v-for="(org, index) in list" :key="index" class="card my-10px px-16px">
          <view
            class="p-2 rd flex flex-col"
            style="box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px"
            @click="toDetail(org)"
          >
            <view class="flex-box justify-between mb-1">
              <view
                class="flex-1 text-17px line-1 font-600"
                :style="{ color: currentTabIndex == 1 && org.user_id.name ? '#888' : '#000' }"
              >
                {{ org.name }} <span class="text-12px">({{ org.code }}) </span>
              </view>
              <view class="text-12px">
                {{ org.city_id.name }}{{ org.county_id.name ? '/' + org.county_id.name : '' }}
              </view>
            </view>
            <view v-if="currentTabIndex == 0" class="flex-box justify-between w-100% text-14px mb-4px">
              <view> 登录学员：{{ org.student_count }}</view>
              <view> 缴费数量：{{ org.card_count }}</view>
            </view>
            <view class="flex-box justify-between w-100% text-13px color-#666 mb-4px">
              <view class="line-1"> {{ org.street }}</view>
            </view>
            <view v-if="org.user_id && org.user_id.name && userInfo.is_admin" class="flex-center w-100%">
              <u-avatar class="flex" size="mini" :src="`data:image/*;base64,${org.user_id.avatar_256}`"></u-avatar>
              <view class="w-100% ml-2 text-13px color-#666">
                {{ org.user_id.name }}
              </view>
            </view>
          </view>
        </view>
        <view v-if="list.length > 0" class="my-5">
          <u-loadmore :status="pager.status" font-size="24" @loadmore="loadMore" />
        </view>
      </scroll-view>
    </view>
    <CitySelect v-model="showCitySelect" :default-region="model.city" @city-change="onCityChange" @close="onClose" />
  </view>
</template>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 44px);
  overflow: hidden;
  background: #fff;
  .search-box {
    display: flex;
    padding: 16rpx 32rpx;
  }

  .slot-content {
    background-color: #ffffff;
    padding: 24rpx;

    .item-box {
      margin-bottom: 50rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .item {
        min-width: 83px;
        text-align: center;
        border: 1px solid $u-type-primary;
        color: $u-type-primary;
        padding: 3px 12px;
        border-radius: 20px;
        margin-top: 14px;
      }

      .active {
        color: #ffffff;
        background-color: $u-type-primary;
      }
    }
  }
}
</style>
