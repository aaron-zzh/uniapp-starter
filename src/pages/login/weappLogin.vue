<script setup lang="ts">
import useUserStore from '@/store/user'
import useLoading from '@/hooks/loading'
import UserApi from '@/api/user'
import { whetherNavigate } from '@/utils/public'
import { isPhone } from '@/utils/is'
import storage from '@/utils/storage'

const { loading, setLoading } = useLoading()
const userStore = useUserStore()

const loginForm = reactive({
  agree: false,
  phone: '',
  code: '',
  iv: '',
  encryptedData: '',
})

const back = () => {
  whetherNavigate('wx')
}

const code = ref('')
const showBack = ref(true)
const showWxAuth = ref(false)
const codeRef = ref()
const tips = ref('')
const loginType = ref('wxCode')
const isRegistered = ref(false)
const isWaitCode = ref(false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onChangeType = () => {
  loginType.value = loginType.value === 'smsCode' ? 'wxCode' : 'smsCode'
}

// 验证码登录
const codeChange = (text: string) => {
  tips.value = text
}
const codeEnd = () => {
  isWaitCode.value = false
}

const validateCode = (): boolean => {
  if (!loginForm.code) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return false
  }
  return true
}

const validatePhone = (): boolean => {
  if (!isPhone(loginForm.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return false
  }
  return true
}

const validateAgree = (): boolean => {
  if (!loginForm.agree) {
    uni.showToast({ title: '请先阅读并同意用户协议', icon: 'none' })
    return false
  }
  return true
}

// 发送验证码
const sendCode = async () => {
  if (!validatePhone()) {
    return
  }
  try {
    if (codeRef.value.canGetCode) {
      uni.showLoading({
        title: '正验发送验证码',
      })
      await UserApi.sendCode(loginForm.phone)
      uni.hideLoading()
      uni.showToast({ title: '验证码已发送', icon: 'none' })
      isWaitCode.value = true
      codeRef.value.start()
    } else {
      uni.showToast({ title: '倒计时结束后再发送！', icon: 'none' })
    }
  } catch (err) {
    uni.showToast({ title: `验证码发送失败,${err}`, icon: 'error' })
    isWaitCode.value = false
  }
}

// 登录/注册请求
const doLogin = async () => {
  if (!validateAgree()) return
  setLoading(true)
  try {
    storage.setHasLogin(false)
    storage.setAccessToken('')
    storage.setRefreshToken('')
    storage.setUserInfo({})
    await userStore.login(loginForm)
    uni.showToast({ title: '登录成功' })
    whetherNavigate()
  } finally {
    setLoading(false)
    showWxAuth.value = false
  }
}

const phoneLoginHandler = async () => {
  if (loading.value) return
  if (!validateCode() && !validatePhone()) return
  await doLogin()
}

const wxLoginHandler = () => {
  // #ifdef MP-WEIXIN
  uni.login({
    provider: 'weixin',
    success: (res) => {
      // console.log(res)
      setLoading(true)
      try {
        storage.setHasLogin(false)
        storage.setAccessToken('')
        storage.setRefreshToken('')
        storage.setUserInfo({})
        userStore.wxCodeLogin(res.code).then(() => {
          isRegistered.value = true
          loginForm.agree = true
        })
      } finally {
        setLoading(false)
      }
    },
    fail: (err) => {
      console.error(`login error: ${err}`)
    },
  })
  // #endif
}

const toPage = (page: string) => {
  uni.navigateTo({ url: `/pages/me/${page}` })
}

onLoad(() => {
  if (wx.getUserProfile) {
    console.log('-----getUserProfile----')
  }
})

onMounted(() => {
  //#ifdef MP-WEIXIN
  // 小程序默认分享
  uni.showShareMenu({ withShareTicket: true })
  // 自动登录
  if (!storage.getHasLogout) {
    wxLoginHandler()
  }
  uni.login({
    provider: 'weixin',
    success: (res) => {
      code.value = res.code
    },
  })
  // #endif
})

// 微信小程序授权登录
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onWxLogin = (e: any) => {
  if (e.detail?.errMsg === 'getPhoneNumber:fail user deny') {
    uni.showToast({ title: '已拒绝', icon: 'none' })
  } else {
    loginForm.code = code.value
    loginForm.iv = e.detail?.iv
    loginForm.encryptedData = e.detail?.encryptedData
    doLogin()
  }
}

const customStyle = computed(() => {
  return {
    background: loginForm.phone
      ? 'linear-gradient(90deg, #399fd0 20.21%, #3c9cff 99.86%)'
      : 'linear-gradient(57.72deg, #1995ff 18.14%, #3c9cff 98.44%);',
  }
})

const openType = computed(() => {
  return loginForm.agree ? 'getPhoneNumber' : null
})
</script>

<template>
  <view class="login">
    <u-navbar :custom-back="back" :is-back="showBack" :border-bottom="false"></u-navbar>

    <image class="login-background" src="../../static/images/common/cover-pattern.png" />
    <view class="login-content">
      <view class="login-form">
        <view class="mb-10 px-3 flex flex-col text-#333 justify-center">
          <view class="text-22px">您好</view>
          <view class="text-26px font-500">欢迎登录U-Starter</view>
        </view>
        <u-field
          v-if="loginType === 'smsCode'"
          v-model="loginForm.phone"
          placeholder="请填写手机号(11位)"
          type="number"
          maxlength="11"
          focus
        >
          <template #icon>
            <image class="w-41 h-41" src="../../static/images/login/account.png" />
          </template>
        </u-field>
        <u-field v-if="loginType === 'smsCode'" v-model="loginForm.code" placeholder="请填写验证码">
          <template #icon>
            <image class="w-41 h-41" src="../../static/images/login/code.png" />
          </template>
          <template #right>
            <u-verification-code ref="codeRef" :seconds="60" keep-running @end="codeEnd" @change="codeChange" />
            <u-button size="mini" :type="isWaitCode ? 'default' : 'primary'" @click="sendCode">{{ tips }}</u-button>
          </template>
        </u-field>

        <view class="agreement flex items-center my-2 ml-4 text-12px lh-24px">
          <u-checkbox-group>
            <u-checkbox v-model="loginForm.agree" :size="28" :label-size="26"> 我已阅读并同意 </u-checkbox>
            <text class="color-#0070f9" @click="toPage('agreement')">《用户协议》</text>
            和
            <text class="color-#0070f9" @click="toPage('agreement')">《隐私政策》</text>
          </u-checkbox-group>
        </view>
        <view class="login-action">
          <u-button
            v-if="loginType === 'smsCode'"
            class="w-600"
            type="primary"
            :loading="loading"
            :custom-style="customStyle"
            @click="phoneLoginHandler"
          >
            登录
          </u-button>
          <u-button
            v-if="loginType === 'wxCode' && !isRegistered"
            class="w-600"
            type="primary"
            :open-type="openType"
            @getphonenumber="onWxLogin"
            @click="validateAgree"
          >
            微信登录
          </u-button>
          <u-button v-if="loginType === 'wxCode' && isRegistered" class="w-600" type="primary" @click="back">
            微信登录
          </u-button>
          <!-- <view class="w-600 mt-2 mb-6 text-left block color-blue" @click="onChangeType">
            {{ loginType === 'smsCode' ? '微信登录' : '手机验证码登录' }}
          </view> -->
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  ::v-deep .fild-body .u-field__input-wrap {
    height: 32px;
  }

  .login-background {
    position: absolute;
    top: 0;
    width: 100%;
    height: 200px;
  }

  .login-content {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-form {
    margin-top: 120px;
    width: 700rpx;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
    z-index: 10;

    .login-action {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
    }
  }
  .wx-btn-box {
    position: absolute;
    bottom: 60px;
    z-index: 9;

    .wx-btn {
      margin: 0;
      padding-left: 0;
      padding-right: 0;
      border: none;
      outline: none;
      border-color: transparent;
      background-color: transparent;
      line-height: 0;
      &::after {
        border: none;
      }
    }
  }
  .tips {
    width: 80%;
    text-align: left;
    margin: 6% 10%;
    margin-top: 48rpx;
    line-height: 1.75;
  }
}
</style>
