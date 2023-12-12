<script lang="ts">
export default { name: 'OrderPay' }
</script>
<script setup lang="ts">
import type { Ref } from 'vue'
import { isLogin, toLogin } from '@/utils/public'
import type { WxPaymentInfo } from '@/api/order/model'
import { isPhone } from '@/utils/is'
import OderApi from '@/api/order'
import UserApi from '@/api/user'
import storage from '@/utils/storage'
// #ifdef H5
import useWechat from '@/hooks/useWechat'
// #endif
import { useUserStore } from '@/store/user'
import useLoading from '@/hooks/loading'
import OrderApi from '@/api/order'
const { loading, setLoading } = useLoading()
const userStore = useUserStore()
const userInfo = computed(() => {
  return userStore.getUserInfo
})

// #ifdef H5
const { wxPay } = useWechat()
// #endif

const model: Ref<Course> = ref({} as Course)

const show = ref(false)
const result = ref('')
const uFormRef = ref(null)
const login = ref(isLogin())
const form = ref({
  course_id: 0,
  notes: '',
  phone: '',
  promo_code: '',
  price: 0,
  type: '',
  discount_price: 0,
  // #ifdef MP-WEIXIN
  trade_type: 'mp_weixin', // 支付方式
  // #endif
  // #ifdef H5
  // eslint-disable-next-line no-dupe-keys
  trade_type: 'h5_weixin', // 支付方式
  // #endif
})

onLoad((options) => {
  model.value.id = options.id
  form.value.promo_code = options.promo_code || ''
  if (!form.value.promo_code) {
    loadData()
  }

  if (options.code) {
    // #ifdef H5
    UserApi.getOpenId(options.code).then((res) => {
      console.log('---getOpenId--', res)
      const open_id = res.openid
      loginForm.open_id = open_id
      // 扫促销码支付自动登录
      if (open_id && form.value.promo_code) {
        storage.setHasLogin(false)
        storage.setAccessToken('')
        storage.setRefreshToken('')
        storage.setUserInfo({})
        userStore.mpCodeLogin(open_id).then(() => {
          if (isLogin()) {
            login.value = true
            form.value.phone = userInfo.value.phone
            loadData()
          }
        })
      }
    })
    // #endif
  } else {
    // const url = await getAuthUrl()
    // if (url) {
    //   window.open(url, '_self')
    // } else {
    //   uni.$u.toast('获取微信授权链接失败')
    // }
  }
})

const getAuthUrl = async () => {
  return ''
}

onReady(() => {
  console.log('onReady')
  uFormRef.value.setRules(rules)
})
onMounted(() => {
  console.log('onMounted')
  if (!form.value.promo_code) {
    if (!isLogin()) {
      uni.$u.toast('请先登录')
      setTimeout(() => {
        toLogin()
      }, 1000)
    }
  }
  if (isLogin()) form.value.phone = userInfo.value.phone
})

const price_info = ref({ list_price: 0 })
const loadData = async () => {
  if (model.value.id) {
    // model.value = await CourseApi.getCourseDetail(model.value.id)
    // price_info.value = await CourseApi.getPrice(model.value.id)
    model.value.price = price_info.value.list_price
    if (model.value.price == 0) {
      uni.showToast({ title: '已购买该商品' })
      show.value = true
    }

    if (form.value.promo_code) {
      // 扫码支付，验证优惠码是否有效
      setTimeout(() => {
        uFormRef.value.setRules(rules)
        uFormRef.value.validate()
      }, 100)
    }
  }
}

const rules = reactive({
  phone: [
    {
      required: true,
      validator: (rule, value, callback) => {
        return uni.$u.test.mobile(value)
      },
      message: '请输入正确的联系方式',
      trigger: ['blur', 'change'],
    },
  ],
  promo_code: [
    {
      asyncValidator: (rule, value, callback) => {
        if (form.value.promo_code) {
          OderApi.checkPromoCode(model.value.id, form.value.promo_code).then((res) => {
            if (res.price == 0) {
              callback(new Error('优惠码无效'))
            } else {
              form.value.discount_price = res.price
              callback()
            }
          })
        } else {
          callback()
        }
      },
      trigger: ['blur'],
    },
  ],
})

const orderNo = ref('')

// 点击登录按钮
const phoneLogin = async () => {
  if (!loginForm.open_id && import.meta.env.MODE != 'development') {
    uni.showModal({
      title: '提示',
      content: '请在微信中打开',
      showCancel: false,
      complete: () => {
        uni.reLaunch({
          url: '/pages/login/index',
        })
      },
    })
    return false
  }
  if (!validateCode()) return false

  storage.setHasLogin(false)
  storage.setAccessToken('')
  storage.setRefreshToken('')
  storage.setUserInfo({})
  return await userStore.login(loginForm)
}

const onClickPay = async () => {
  if (loading.value) return

  result.value = ''
  if (model.value.id) {
    form.value.course_id = model.value.id
  } else {
    uni.showToast({ title: '未知商品', icon: 'error' })
  }

  if (!isLogin()) {
    // #ifndef H5
    uni.$u.toast('请先登录')
    setTimeout(() => {
      toLogin()
    }, 1000)
    return
    // #endif

    // 公众号走注册逻辑，先注册再支付
    // #ifdef H5
    // eslint-disable-next-line no-unreachable
    loginForm.phone = form.value.phone
    if (!(await phoneLogin())) return
    login.value = isLogin()
    if (!login.value) {
      uni.$u.toast('请先登录')
      setTimeout(() => {
        toLogin()
      }, 1000)
      // eslint-disable-next-line no-unreachable
      return false
    }
    // #endif
  }

  uFormRef.value.setRules(rules)
  uFormRef.value.validate((valid: boolean) => {
    if (valid) {
      form.value.price = model.value.price || 0
      if (!form.value.price && !form.value.discount_price) {
        uni.showToast({ title: '价格错误', icon: 'error' })
        return
      }

      let data = unref(form)
      setLoading(true)
      OderApi.createOrder(data)
        .then(async (res) => {
          orderNo.value = res.name
          result.value = await orderPayment(res.pay_info)
          show.value = true
          setLoading(false)
        })
        .catch((res: Error) => {
          result.value = res.message
          show.value = true
          setLoading(false)
        })
    } else {
      console.log('验证失败')
    }
  })
}

const orderPayment = (res: WxPaymentInfo): Promise<string> => {
  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider: 'wxpay', // 微信支付
      orderInfo: res.order_info,
      timeStamp: res.time_stamp,
      nonceStr: res.nonce_str,
      package: res.package,
      signType: res.sign_type,
      paySign: res.pay_sign,
      success: (res) => {
        uni.showToast({ title: '支付成功', icon: 'success' })
        resolve('支付成功')
      },
      fail: (err) => {
        if (err.errMsg.indexOf('fail cancel') == -1) {
          // 发起支付失败
          uni.showToast({ title: '支付失败', icon: 'error' })
          console.error('uni.requestPayment:fail', err)
          resolve('支付失败')
        } else {
          // 用户取消支付
          uni.showToast({ title: '已取消', icon: 'none' })
          resolve('已取消')
        }
      },
    })
  })
  // #endif
  // #ifdef H5
  // eslint-disable-next-line no-unreachable
  return wxPay(res)
  // #endif
}

const toDetail = () => {
  if (model.value.id) {
    uni.$u.route(`pages/course/detail?id=${model.value.id}`)
  }
}

const btnStyle = {
  backgroundImage: 'linear-gradient(270deg, rgba(0, 0, 0, 0) 68.44%, #64b5ef 75.52%, rgba(0, 0, 0, 0) 100%)',
  backgroundRepeat: 'no-repeat',
  animation: 'bg-move linear 5s infinite',
}

// 注册
const loginForm = reactive({
  agree: false,
  phone: '',
  password: '',
  code: '',
  type: '',
  open_id: '',
  union_id: '',
  nickname: '',
  avatar_url: '',
  platform: import.meta.env.VITE_APP_PLATFORM,
})

// 验证码
const codeRef = ref()
const tips = ref('')
const isWaitCode = ref(false)

const validatePhone = (): boolean => {
  if (!isPhone(form.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return false
  }
  return true
}
const validateCode = (): boolean => {
  if (!loginForm.code) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return false
  }
  return true
}

const sendCode = async () => {
  if (!validatePhone()) {
    return
  }
  try {
    if (codeRef.value.canGetCode) {
      uni.showLoading({
        title: '正验发送验证码',
      })
      await UserApi.sendCode(form.value.phone)
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

const codeChange = (text: string) => {
  tips.value = text
}
const codeEnd = () => {
  isWaitCode.value = false
}
</script>

<template>
  <view class="container">
    <u-no-network></u-no-network>
    <view class="pt-1px">
      <view class="m-16px p-4px flex flex-col items-center bg-white rd-4px">
        <view class="w-80%">
          <u-form ref="uFormRef" :model="form" label-width="160" label-position="left">
            <u-form-item label="商品" prop="name" :border-bottom="false">
              <u-input
                v-model="model.name"
                disabled
                :custom-style="{ letterSpacing: '1px', fontSize: '18px' }"
                input-align="center"
                trim
              />
            </u-form-item>
            <u-form-item label="价格" prop="price" :border-bottom="false">
              <view v-if="form.discount_price" class="text-16px color-red text-center w-100%">
                ￥{{ form.discount_price }}
                <span class="text-12px color-gray line-through">￥{{ model.price }}</span>
                <u-tag
                  v-if="form.discount_price && form.discount_price < 10"
                  class="flex-box my-1 ml-10px"
                  text="促销特价"
                  size="mini"
                  type="error"
                />
              </view>
              <view v-else class="text-16px color-red text-center w-100%"> ￥{{ model.price }} </view>
            </u-form-item>
            <view class="mb-4px">
              <u-line color="#eee" border-style="dashed"></u-line>
            </view>
            <u-form-item label="优惠码" prop="promo_code" :border-bottom="false">
              <u-input
                v-model="form.promo_code"
                :disabled="show"
                :custom-style="{ letterSpacing: '1px', fontSize: '16px' }"
                input-align="center"
                :border="true"
                border-color="#243b82"
                clearable
                placeholder="请输入优惠码"
                trim
              />
            </u-form-item>
            <u-form-item label="联系方式" prop="phone" :border-bottom="false">
              <u-input
                v-model="form.phone"
                :disabled="show"
                :custom-style="{ fontSize: '16px' }"
                input-align="center"
                :border="true"
                border-color="#243b82"
                clearable
                placeholder="请输入联系方式"
                trim
              />
            </u-form-item>
            <!-- #ifdef H5 -->
            <u-form-item v-if="!login" label="验证码" :border-bottom="false">
              <template #right>
                <u-input
                  v-model="loginForm.code"
                  :custom-style="{ fontSize: '14px' }"
                  input-align="center"
                  :border="true"
                  border-color="#243b82"
                  clearable
                  placeholder="请输入验证码"
                  trim
                />
                <u-verification-code ref="codeRef" :seconds="60" keep-running @end="codeEnd" @change="codeChange" />
                <u-button class="ml-4px" size="mini" :type="isWaitCode ? 'default' : 'primary'" @click="sendCode">{{
                  tips
                }}</u-button>
              </template>
            </u-form-item>
            <!-- #endif -->
            <u-form-item label="备注" prop="code" :border-bottom="false">
              <u-input
                v-model="form.notes"
                type="textarea"
                :disabled="show"
                :custom-style="{ fontSize: '14px' }"
                maxlength="100"
                :border="true"
                border-color="#243b82"
                clearable
                placeholder="其他需要（非必填）"
                trim
              />
            </u-form-item>
          </u-form>
          <view v-if="show && result" class="my-20px flex-center h-40px text-16px">
            <view v-if="orderNo" class="color-#888">【订单: {{ orderNo }}】 </view>
            <view class="color-blue">{{ result }} </view>
          </view>
          <view v-if="loading" class="my-20px flex-center">
            <view class="i-svg-spinners-12-dots-scale-rotate text-40px color-#93a0ff"></view>
          </view>
          <view v-if="!loading" my-20px>
            <u-button v-if="show" type="primary" @click="toDetail">查看商品</u-button>
            <u-button v-if="!show" type="primary" :custom-style="btnStyle" @click="onClickPay">微信支付</u-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background-color: #eee;
  min-height: 100vh;
}
</style>
