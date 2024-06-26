<script lang="ts">
export default { name: 'LoginPage' }
</script>
<script setup lang="ts">
import useUserStore from '@/store/user'
import useLoading from '@/hooks/loading'
import UserApi from '@/api/user'
import { isWeiXin, whetherNavigate, isLogin } from '@/utils/public'
import { isPhone } from '@/utils/is'
import storage from '@/utils/storage'

const { loading, setLoading } = useLoading()

const userStore = useUserStore()

const loginForm = reactive({
  agree: false,
  phone: '',
  password: '',
  code: '',
  encryptedData: '',
})

const back = () => {
  //#ifdef MP-WEIXIN
  whetherNavigate('wx')
  //#endif
  // #ifndef MP-WEIXIN
  whetherNavigate()
  //#endif
}

// const code = ref('')
const showBack = ref(false)
const isWxH5 = ref(false)
const codeRef = ref()
const tips = ref('')
const loginType = ref('passwd')
const isWaitCode = ref(false)

// const onChangeType = () => {
//   loginType.value = loginType.value === 'passwd' ? 'smsCode' : 'passwd'
// }

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

const validatePasswd = (): boolean => {
  if (!loginForm.password) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
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

// 登录请求
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
  }
}

// 点击登录按钮
const phoneLoginHandler = async () => {
  if (loading.value) return
  if (loginType.value === 'passwd') {
    if (!validatePasswd() && !validatePhone()) return
  } else if (!validateCode() && !validatePhone()) return

  await doLogin()
}

const toPage = (page: string) => {
  uni.navigateTo({ url: `/pages/me/${page}` })
}

onLoad(() => {
  if (wx.getUserProfile) {
    console.log('-----getUserProfile----')
  }
})

onShow(() => {
  // 只要是app登录的全部清除内容
  // #ifdef APP-PLUS
  storage.setAccessToken('')
  storage.setRefreshToken('')
  storage.setUserInfo({})
  // #endif
})

onMounted(() => {
  //判断是否微信浏览器
  isWxH5.value = isWeiXin()
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openType = computed(() => {
  if (!isLogin()) return null
  return 'getPhoneNumber'
})

const customStyle = computed(() => {
  return {
    background: loginForm.phone
      ? 'linear-gradient(90deg, #399fd0 20.21%, #3c9cff 99.86%)'
      : 'linear-gradient(57.72deg, #1995ff 18.14%, #3c9cff 98.44%);',
  }
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
        <u-field v-model="loginForm.phone" placeholder="请填写手机号(11位)" type="number" maxlength="11" focus>
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

        <u-field v-else v-model="loginForm.password" placeholder="请填写密码" type="password">
          <template #icon>
            <image class="w-41 h-41" src="../../static/images/login/code.png" />
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
            class="w-600"
            type="primary"
            :loading="loading"
            :custom-style="customStyle"
            @click="phoneLoginHandler"
          >
            登录
          </u-button>
          <!-- <view class="w-600 mt-2 mb-6 text-left block color-blue" @click="onChangeType">
            {{ loginType === 'passwd' ? '手机验证码登录' : '用户名密码登录' }}
          </view> TODO-->
        </view>
      </view>
      <!-- <view class="wx-btn-box">
        <button class="wx-btn" :open-type="openType" @getphonenumber="wxLoginHandler" @click="onWxLogin">
          <u-icon name="weixin-circle-fill" color="#28bb28" size="36px"></u-icon>
        </button>
      </view> -->
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
}
</style>
