<!-- 短信登录 - smsLogin  -->
<template>
  <view>
    <!-- 标题栏 -->
    <view class="head-box ss-m-b-60">
      <view class="ss-flex ss-m-b-20">
        <view class="head-title head-title-line head-title-animation">短信登录</view>
        <view class="head-title-active ss-m-r-40" @tap="showAuthModal('accountLogin')"> 账号登录 </view>
      </view>
      <view class="head-subtitle">未注册的手机号，验证后自动注册账号</view>
    </view>

    <!-- 表单项 -->
    <uni-forms
      ref="smsLoginRef"
      v-model="state.model"
      :rules="state.rules"
      validate-trigger="bind"
      label-width="140"
      label-align="center"
    >
      <uni-forms-item name="mobile" label="手机号">
        <uni-easyinput v-model="state.model.mobile" placeholder="请输入手机号" :input-border="false" type="number">
          <template #right>
            <button
              class="ss-reset-button code-btn code-btn-start"
              :disabled="state.isMobileEnd"
              :class="{ 'code-btn-end': state.isMobileEnd }"
              @tap="getSmsCode('smsLogin', state.model.mobile)"
            >
              {{ getSmsTimer('smsLogin') }}
            </button>
          </template>
        </uni-easyinput>
      </uni-forms-item>

      <uni-forms-item name="code" label="验证码">
        <uni-easyinput
          v-model="state.model.code"
          placeholder="请输入验证码"
          :input-border="false"
          type="number"
          maxlength="4"
        >
          <template #right>
            <button class="ss-reset-button login-btn-start" @tap="smsLoginSubmit">登录</button>
          </template>
        </uni-easyinput>
      </uni-forms-item>
    </uni-forms>
  </view>
</template>

<script setup>
import { ref, reactive, unref } from 'vue'
import sheep from '@/sheep'
import { code, mobile } from '@/sheep/validate/form'
import { showAuthModal, closeAuthModal, getSmsCode, getSmsTimer } from '@/hooks/useModal'
import AuthUtil from '@/api/member/auth'

const smsLoginRef = ref(null)

const emits = defineEmits(['onConfirm'])

const props = defineProps({
  agreeStatus: {
    type: Boolean,
    default: false,
  },
})

// 数据
const state = reactive({
  isMobileEnd: false, // 手机号输入完毕
  codeText: '获取验证码',
  model: {
    mobile: '', // 手机号
    code: '', // 验证码
  },
  rules: {
    code,
    mobile,
  },
})

// 短信登录
async function smsLoginSubmit() {
  // 参数校验
  const validate = await unref(smsLoginRef)
    .validate()
    .catch((error) => {
      console.log('error: ', error)
    })
  if (!validate) {
    return
  }
  if (!props.agreeStatus) {
    emits('onConfirm', true)
    sheep.$helper.toast('请勾选同意')
    return
  }
  // 提交数据
  const { code } = await AuthUtil.smsLogin(state.model)
  if (code === 0) {
    closeAuthModal()
  }
}
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
