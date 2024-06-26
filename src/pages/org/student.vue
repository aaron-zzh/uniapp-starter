<script lang="ts">
export default { name: 'OrgPage' }
</script>
<script setup lang="ts">
import type { StudentInfo } from '@/api/user/model'
import type { SearchParams } from '@/api/common/model'
import useUserStore from '@/store/user'
import usePager from '@/hooks/pager'
// import { toNumber } from '@/uni_modules/lime-shared'
// const config = inject('config') // 注入

const userStore = useUserStore()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userInfo = computed(() => {
  return userStore.getUserInfo
})

const model = reactive({
  keyword: '',
  org_id: 0,
})

onLoad((options) => {
  console.log('onLoad options', options)
  model.org_id = options.id
})

const { list, pager, loadData, loadMore } = usePager<StudentInfo>('lxw.student')

const params = computed(() => {
  const domain: Array<[]> = [['org_id', '=', parseInt(model.org_id)]]
  if (model.keyword) {
    domain.push('|')
    domain.push(['name', 'like', model.keyword])
    domain.push(['gr_no', 'like', model.keyword])
  }
  const result: SearchParams = {
    kwargs: {
      domain,
      fields: ['id', 'name', 'phone', 'gr_no', 'nickname', 'face_image', 'locked', 'total_time', 'org_id/name'],
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
  confirmSearch()
})

const confirmSearch = () => {
  pager.offset = 0
  list.value = []
  loadData(params)
}

const onCopy = (name: string, code: string) => {
  if (!code) {
    return
  }
  uni.setClipboardData({
    data: code,
    success: function () {
      uni.showToast({
        title: '已复制' + name,
        icon: 'success',
      })
    },
  })
}
</script>

<template>
  <view class="container">
    <u-no-network></u-no-network>
    <view class="search-box bg-white">
      <u-search
        v-model="model.keyword"
        style="width: 100%"
        shape="round"
        :clearabled="true"
        input-align="center"
        height="66"
        placeholder="输入学号或姓名搜索"
        :show-action="false"
        @search="confirmSearch"
        @change="$u.debounce(confirmSearch, 500)"
      ></u-search>
    </view>
    <view v-if="list.length == 0 && pager.status != 'loading'">
      <EmptyImage />
    </view>
    <view v-if="list.length > 0" class="list-box">
      <scroll-view scroll-y style="height: calc(100vh - 110px); width: 100%" @scrolltolower="loadMore">
        <view class="pb-20px">
          <view class="text-right mx-16px">学生总数：{{ pager.total }}</view>
          <view v-for="(student, index) in list" :key="index" class="card my-10px px-16px">
            <view class="p-2 rd flex" style="box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px">
              <view class="mr-10px flex flex-col items-center">
                <u-avatar class="mr-4px" :src="`data:image/*;base64,${student.face_image}`"></u-avatar>
                <u-tag v-if="student.locked" mode="dark" text="已锁定" size="mini" class="m-2" type="error"></u-tag>
              </view>
              <view class="text-16px flex-1">
                <view class="cell" @click.stop="onCopy('学号', student.gr_no)">
                  <span class="c-label">学号：</span>
                  <span class="c-value font-600">{{ student.gr_no }}</span>
                </view>
                <view class="cell">
                  <span class="c-label">姓名：</span>
                  <span class="c-value">{{ student.name == '姓名' ? '未设置' : student.name }}</span>
                </view>
                <view class="cell" @click.stop="onCopy('电话', student.phone)">
                  <span class="c-label">电话：</span>
                  <span class="c-value">{{ student.phone }}</span>
                </view>
                <view class="cell">
                  <span class="c-label">机构：</span>
                  <span class="c-value">{{ student.org_id.name }}</span>
                </view>
              </view>
            </view>
          </view>
          <view v-if="list.length > 0" class="my-5">
            <u-loadmore :status="pager.status" font-size="24" @loadmore="loadMore" />
          </view>
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
  .cell {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
    .c-label {
      color: #666;
    }
    .c-value {
      flex: 1;
      color: #000;
    }
  }
}
</style>
