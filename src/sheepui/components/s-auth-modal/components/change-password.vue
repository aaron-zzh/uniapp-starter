<!-- 修改密码（登录时）  -->
<template>
  <view>
    <!-- 标题栏 -->
    <view class="head-box ss-m-b-60">
      <view class="head-title ss-m-b-20">修改密码</view>
      <view class="head-subtitle">如密码丢失或未设置,请点击忘记密码重新设置</view>
    </view>

    <!-- 表单项 -->
    <uni-forms
      ref="changePasswordRef"
      v-model="state.model"
      :rules="state.rules"
      validate-trigger="bind"
      label-width="140"
      label-align="center"
    >
      <uni-forms-item name="code" label="验证码">
        <uni-easyinput
          v-model="state.model.code"
          placeholder="请输入验证码"
          type="number"
          maxlength="4"
          :input-border="false"
        >
          <template #right>
            <button
              class="ss-reset-button code-btn code-btn-start"
              :disabled="state.isMobileEnd"
              :class="{ 'code-btn-end': state.isMobileEnd }"
              @tap="getSmsCode('changePassword')"
            >
              {{ getSmsTimer('resetPassword') }}
            </button>
          </template>
        </uni-easyinput>
      </uni-forms-item>

      <uni-forms-item name="reNewPassword" label="密码">
        <uni-easyinput v-model="state.model.password" type="password" placeholder="请输入密码" :input-border="false">
          <template #right>
            <button class="ss-reset-button login-btn-start" @tap="changePasswordSubmit">确认</button>
          </template>
        </uni-easyinput>
      </uni-forms-item>
    </uni-forms>

    <button class="ss-reset-button type-btn" @tap="closeAuthModal">取消修改</button>
  </view>
</template>

<script setup>
import { ref, reactive, unref } from 'vue'
import { code, password } from '@/sheep/validate/form'
import { closeAuthModal, getSmsCode, getSmsTimer } from '@/hooks/useModal'
import UserApi from '@/api/member/user'

const changePasswordRef = ref(null)

// 数据
const state = reactive({
  model: {
    mobile: '', // 手机号
    code: '', // 验证码
    password: '', // 密码
  },
  rules: {
    code,
    password,
  },
})

// 更改密码
async function changePasswordSubmit() {
  // 参数校验
  const validate = await unref(changePasswordRef)
    .validate()
    .catch((error) => {
      console.log('error: ', error)
    })
  if (!validate) {
    return
  }
  // 发起请求
  const { code } = await UserApi.updateUserPassword(state.model)
  if (code !== 0) {
    return
  }
  // 成功后，只需要关闭弹窗
  closeAuthModal()
}
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
