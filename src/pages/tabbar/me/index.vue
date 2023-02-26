<script lang="ts">
export default { name: 'MePage' }
</script>
<script setup lang="ts">
import type { Ref } from 'vue'
import type { UserData } from '@/api/user/model'
import UserApi from '@/api/user'
import { isLogin, toLogin } from '@/utils/public'
import { useUserStore } from '@/store/user'
import { useTabbarStore } from '@/store/tabbar'

const showWechat = ref(false)
const wx = ref('Aaron-ZZH')
const model: Ref<UserData> = ref({
  favor_count: 0,
  follow_count: 0,
  order_count: 0,
} as UserData)

const { tabbar } = useTabbarStore()

const userStore = useUserStore()
const userInfo = computed(() => {
  return userStore.getUserInfo
})

onShow(() => {
  if (isLogin()) {
    getUserData()
  }
})

onPullDownRefresh(() => {
  console.log('refresh')
  if (isLogin()) {
    getUserData()
  } else {
    setTimeout(function () {
      uni.stopPullDownRefresh()
    }, 500)
  }
})

const getUserData = async () => {
  model.value = await UserApi.getUserData()
  uni.stopPullDownRefresh()
}

const logoutDlgShow = ref(false)
const confirm = async () => {
  await userStore.logout()
  logoutDlgShow.value = false
}

const to = (page: string) => {
  if (page === 'login') {
    toLogin()
  } else if (page === 'logout') {
    logoutDlgShow.value = true
  } else {
    let url = `/pages/me/${page}`
    uni.$u.route(url)
  }
}

const onCopy = () => {
  uni.setClipboardData({
    data: wx.value,
    success: function () {
      uni.showToast({
        title: '复制微信号成功',
        icon: 'success',
      })
    },
  })
}

const tools = reactive([
  {
    name: '功能',
    icon: 'i-iconoir-pc-check',
  },
  {
    name: '功能',
    icon: 'i-iconoir-shield-add',
  },
  {
    name: '功能',
    icon: 'i-iconoir-calendar',
  },
  {
    name: '功能',
    icon: 'i-iconoir-search-engine',
  },
  {
    name: '功能',
    icon: 'i-iconoir-iconoir',
  },
  {
    name: '功能',
    icon: 'i-iconoir-bookmark-book',
  },
  {
    name: '功能',
    icon: 'i-iconoir-calculator',
  },
  {
    name: '功能',
    icon: 'i-iconoir-message-text',
  },
])

const btnStyle = reactive({
  padding: '0px 16px',
  border: 'none',
  color: '#987033',
  background: '#efe0ca',
  height: '36px',
  lineHeight: '36px',
})
</script>

<template>
  <view class="user-container">
    <view class="absolute w100vh">
      <image class="w100vh" src="/static/images/me/wd190.png" />
    </view>
    <view class="relative mx-4">
      <view class="user-box">
        <view class="flex-box mt-5">
          <view class="flex justify-center items-center w-125 h-125 rd-50% bg-white">
            <image class="w-110 h-110 rd-50%" src="/static/images/me/avatar.png" />
          </view>
          <text v-if="userInfo.id" class="c-black ml-3">{{ userInfo.name }}</text>
          <text v-else class="c-black ml-3" @click="to('login')">点击登录</text>
        </view>
      </view>
      <view class="user-info-box mb-4">
        <view class="bottom margin-top">
          <view class="flex-box justify-around">
            <view class="u-flex-col u-row-center u-col-center" @click="to('sample')">
              <view class="number">{{ model.favor_count }}</view>
              <view class="color-#666 text-12px">收藏</view>
            </view>
            <view class="u-flex-col u-row-center u-col-center" @click="to('sample')">
              <view class="number">{{ model.follow_count }}</view>
              <view class="color-#666 text-12px">关注</view>
            </view>
            <view class="u-flex-col u-row-center u-col-center" @click="to('order')">
              <view class="number">{{ model.order_count }}</view>
              <view class="color-#666 text-12px">预约</view>
            </view>
          </view>
        </view>
      </view>
      <view class="vip-box action-box" style="background-color: #faecda">
        <view class="flex-box">
          <u-icon name="integral" size="30px" color="rgb(152, 112, 51)"></u-icon>
          <view class="flex flex-col flex-1 ml-2">
            <view class="color-#987033 font-bold">U-Starter会员</view>
            <view class="text-12px">成为会员享专属权益</view>
          </view>
          <u-button shape="circle" :hair-line="false" :custom-style="btnStyle">立即开通</u-button>
        </view>
      </view>
      <view class="action-box">
        <u-grid :col="4" :border="false">
          <u-grid-item v-for="(item, index) in tools" :key="index">
            <view :class="item.icon" style="font-size: 24px" />
            <view class="text-12px mt-1 color-#666">{{ item.name }}</view>
          </u-grid-item>
        </u-grid>
      </view>
      <view class="action-box">
        <u-cell-group>
          <u-cell-item icon="star-fill" title="我的收藏"></u-cell-item>
          <u-cell-item icon="shopping-cart-fill" title="我的预约"></u-cell-item>
          <u-cell-item icon="bell-fill" title="我的消息" @click="to('message')"></u-cell-item>
          <u-cell-item icon="eye-fill" title="浏览记录"></u-cell-item>
        </u-cell-group>
      </view>
      <view class="action-box">
        <u-cell-group>
          <!-- todo  -->
          <!-- <u-cell-item icon="setting" title="个人设置"></u-cell-item> -->
          <u-cell-item icon="server-man" title="微信客服" @click="showWechat = true"></u-cell-item>
          <u-cell-item title="关于我们" @click="to('about')">
            <template #icon>
              <view class="i-iconoir-info-empty text-17px mr-1"></view>
            </template>
          </u-cell-item>
          <u-cell-item title="退出登录" @click="to('logout')">
            <template #icon>
              <view class="i-ant-design-logout-outlined text-17px mr-1"></view>
            </template>
          </u-cell-item>
        </u-cell-group>
      </view>
      <u-tabbar :list="tabbar" icon-size="24px" :mid-button="true"></u-tabbar>
    </view>
    <u-modal
      v-model="logoutDlgShow"
      show-cancel-button
      :async-close="true"
      content="确定要退出？"
      @confirm="confirm"
    ></u-modal>
    <u-popup v-model="showWechat" mode="center" closeable height="300px" width="260px" :border-radius="12">
      <view class="info-box mt-3">
        <view style="widows: 160px; height: 160px">
          <u-image width="160px" height="160px" src="/static/images/me/aaron.jpg"></u-image>
        </view>
        <u-button
          class="mt-3"
          :custom-style="{
            padding: '0px 40px',
            height: '34px',
            color: '#FFF',
            background: '#243b82',
            border: 'none',
          }"
          color="primary"
          :hair-line="false"
          size="mini"
          shape="circle"
          @click="onCopy"
          >复制微信号</u-button
        >
        <view class="text-12px color-#333 mt-1"> 客服微信号: {{ wx.wechat }} </view>
      </view>
    </u-popup>
  </view>
</template>
<style lang="scss" scoped>
.user-container {
  background-color: #fafafa;
  position: relative;
  z-index: 1;
  .settings-btn {
    position: absolute;
    top: 16px;
    right: 16px;
  }
  .user-box {
    padding: 10px;
  }
  .user-info-box {
    width: 100%;
    background-color: transparent;
    padding: 10px;
    .number {
      font-size: 20px;
      font-weight: bold;
      margin: 3px;
    }
  }
  .action-box {
    padding: 10px;
    color: #555;
    background-color: #fff;
    border-radius: 10rpx;
    // box-shadow: 0px 0px 10px -5px rgba(84, 84, 84, 0.2);
    box-shadow: 0px 0px 4px -1px rgba(140, 190, 238, 0.2);
    margin-bottom: 16px;
  }
  ::v-deep .u-grid-item-box {
    padding: 10px 4px !important;
  }
  ::v-deep .u-cell {
    color: #666;
    padding: 8px;
    .u-cell_title {
      color: #333;
      font-size: 14px !important;
    }
  }

  .info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 30px;
    text-align: center;
  }
}
</style>
