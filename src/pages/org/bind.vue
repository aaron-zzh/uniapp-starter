<script lang="ts">
export default { name: 'OrderPay' }
</script>
<script setup lang="ts">
import type { Ref } from 'vue'
import { isLogin, toLogin, uploadFile } from '@/utils/public'
import UserApi from '@/api/user'
import CommonApi from '@/api/common'
import storage from '@/utils/storage'

import useUserStore from '@/store/user'
import useLoading from '@/hooks/loading'
import { OrgInfo } from '@/api/user/model'
const { loading, setLoading } = useLoading()
const userStore = useUserStore()

const model: Ref<OrgInfo> = ref({} as OrgInfo)

const title = ref('')

onLoad(async (options) => {
  console.log('onLoad options', options)
  model.value.id = parseInt(options.id || 0)
  if (!options.id) {
    title.value = '未指定机构'
    uni.$u.toast('未指定机构')
    return
  }
  setLoading(true)
  if (isLogin()) {
    bindOrg()
  } else {
    uni.$u.toast('请先登录')
    setTimeout(() => {
      toLogin()
    }, 1000)
  }
  // #ifdef H5
  if (options.code) {
    UserApi.getOpenId(options.code, 'snsapi_base')
      .then((res) => {
        console.log(res)
        const open_id = res.openid
        loginForm.union_id = res.unionid || ''
        loginForm.nickname = res.nickname || ''
        loginForm.avatar_url = res.headimgurl || ''
        if (open_id) {
          loginForm.open_id = open_id
          doLoginAndBind()
        } else {
          uni.showModal({
            title: '提示',
            content: '请在微信中打开',
            showCancel: false,
          })
        }
      })
      .catch(() => (show.value = true))
  } else {
    // 跳转授权
    const url = await getBindUrl()
    if (url) {
      window.open(url, '_self')
    } else {
      uni.$u.toast('获取绑定链接失败')
    }
  }
  // #endif
})

const getBindUrl = async () => {
  const data = await CommonApi.queryList('ydt.org', {
    kwargs: {
      domain: [['id', '=', model.value.id]],
      fields: ['id', 'name', 'bind_url'],
      limit: 1,
      offset: 0,
    },
  })
  if (data.records.length > 0) {
    return data.records[0].bind_url
  }
}

const loginForm = reactive({
  agree: false,
  open_id: '',
  union_id: '',
  nickname: '',
  avatar_url: '',
  type: 'h5',
  platform: import.meta.env.VITE_APP_PLATFORM,
})

const getUserData = async () => {
  const info = await UserApi.getUserData()
  userStore.setUserInfo({
    is_org_admin: info.is_org_admin,
  })
  return info
}

const bindOrg = async () => {
  if (model.value.id) {
    const res = await UserApi.bingOrg(model.value.id)
    if (res) {
      const data = await getUserData()
      if (data.is_org_admin) {
        result.value = true
      }
    }
    setLoading(false)
    show.value = true
  }
}

const doLoginAndBind = () => {
  storage.setHasLogin(false)
  storage.setAccessToken('')
  storage.setRefreshToken('')
  storage.setUserInfo({})
  userStore.login(loginForm).then((info) => {
    if (info && info.id && loginForm.avatar_url) {
      uploadFile(info.id, 'res.users', 'image_1920', loginForm.avatar_url, false)
    }
    if (isLogin()) {
      bindOrg()
    }
  })
}

const show = ref(false)
const result = ref(false)
const content = computed(() => {
  return result.value ? '绑定成功' : '绑定失败'
})
const toDetail = () => {
  if (result.value) {
    uni.$u.route({
      type: 'redirectTo',
      url: 'pages/org/detail',
      params: {
        id: model.value.id,
      },
    })
  } else {
    uni.switchTab({
      url: `/pages/tabbar/home/index`,
    })
  }
}
</script>

<template>
  <view class="container">
    <u-no-network></u-no-network>
    <view v-if="title" class="p-16px">
      <u-alert-tips type="warning" :title="title"></u-alert-tips>
    </view>
    <view v-if="loading" class="my-20px flex-center">
      <view class="i-svg-spinners-12-dots-scale-rotate text-40px color-#93a0ff"></view>
    </view>
    <u-modal v-model="show" :content="content" @confirm="toDetail"></u-modal>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  min-height: calc(100vh - 44px);
}
</style>
