<script setup lang="ts">
import PostApi from '@/api/post'
import useLoading from '@/hooks/loading'
const { loading, setLoading } = useLoading()

// ==== 数据 ====
const uFormRef = ref(null)
const form = reactive({
  content: '',
  phone: '',
  tags_ids: [],
})

const show = ref(false)
const showTypeSel = ref(false)
const rules = reactive({
  content: [
    {
      required: true,
      min: 20,
      message: '请输入不少于20个字长度的说明',
      trigger: ['blur', 'change'],
    },
  ],
  phone: [
    {
      required: true,
      validator: (rule, value, callback) => {
        return uni.$u.test.mobile(value)
      },
      message: '请输入正确的手机号',
      trigger: ['blur', 'change'],
    },
  ],
  tags_ids: [
    {
      required: true,
      type: 'array',
      message: '请选择标签',
      trigger: ['blur', 'change'],
    },
  ],
})

// ===== 动作 ======
const curType = ref('post')
const showPopup = (type = 'post') => {
  show.value = true
}

const onConfirm = () => {
  if (loading.value) return
  uFormRef.value.setRules(rules)
  uFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('验证通过')
      submit()
    } else {
      console.log('验证失败')
    }
  })
}

const submit = () => {
  setLoading(true)
  PostApi.newPost(unref(form))
    .then(() => {
      setLoading(false)
      uni.showToast({ title: '提交成功', icon: 'none' })
      show.value = false
    })
    .catch(() => {
      setLoading(false)
    })
}

// ===== 对外接口 ======
defineExpose({
  showPopup,
})
</script>

<template>
  <u-popup v-model="show" mode="bottom" height="480px" closeable close-icon-pos="top-left" :border-radius="12">
    <view class="content">
      <view class="head text-18px pb-2"> 发布 </view>
      <u-form ref="uFormRef" :model="form" label-width="200" label-position="top" :label-style="{ fontSize: '16px' }">
        <u-form-item label="内容" required prop="content">
          <u-input
            v-model="form.content"
            type="textarea"
            placeholder="请填写内容（不少于20字）"
            :border="false"
            maxlength="240"
            focus
            height="120"
            cursor-spacing="20"
          />
        </u-form-item>
        <u-form-item label="联系方式" label-position="left" required prop="phone">
          <u-input v-model="form.phone" placeholder="请输入联系方式" :border="false" />
        </u-form-item>
        <u-form-item label="标签 (可多选)" required prop="demand_ids">
          <view class="type-box" style="height: 90px">
            <view class="flex-box flex-wrap">
              <u-tag
                v-for="(item, index) in 3"
                :key="index"
                closeable
                mode="dark"
                text="已选"
                class="m-2"
                type="primary"
                shape="circle"
                @close="() => {}"
              ></u-tag>
              <u-button
                :custom-style="{ color: '#666', margin: 0 }"
                type="info"
                size="mini"
                shape="circle"
                @click="showTypeSel = true"
              >
                <u-icon name="plus" />添加
              </u-button>
            </view>
          </view>
        </u-form-item>
      </u-form>
      <view class="confirm-btn">
        <u-button type="primary" :loading="loading" @click="onConfirm">确定</u-button>
      </view>
    </view>
  </u-popup>
</template>

<style lang="scss" scoped>
.content {
  background-color: #fff;
  color: #000;
  padding: 12px;
  text-align: center;

  .head {
    width: 100%;
    text-align: center;
    line-height: 26px;
    border-bottom: 1px solid #eee;
  }
  .title {
    font-size: 16px;
    margin: 10px 0;
  }
  .confirm-btn {
    margin-top: 20px;
  }
}
</style>
