<script setup lang="ts">
import useFavor from '@/hooks/favor'
import useLoading from '@/hooks/loading'
import { isLogin } from '@/utils/public'
import type { PostList } from '@/api/post/model'

import PostApi from '@/api/post'

const emit = defineEmits(['comment'])
const props = defineProps<{ post: PostList; list: boolean }>()

const config = inject('config') // 注入
const { toggle } = useFavor('blog.post')
const { loading, setLoading } = useLoading()

// const model = ref(props.post) // 不可行，初始化时为空，不能检测到props变化
// 方法1：
const model = toRef(props, 'post')
// 方法2：
// const { post } = toRefs(props)

// 预览图片
const imgList = computed(() => {
  let imgs = model.value.pictures ? model.value.pictures.split(',') : []
  return imgs.map((v) => config.domain + v)
})
const viewImage = (index: number) => {
  uni.previewImage({
    urls: imgList.value,
    current: index,
  })
}

// 点赞
const liked = ref(false)
const onClickLike = async () => {
  if (loading.value) return
  setLoading(true)
  // const res = await PostApi.votePost(model.value.id, !liked.value)
  setLoading(false)
  model.value.vote_count += 1
  liked.value = !liked.value
}

// 评论
const show = ref(false)
const uFormRef = ref(null)
const form = reactive({
  content: '',
})
const rules = reactive({
  content: [
    {
      required: true,
      min: 10,
      message: '请输入不少于10个字长度的评论',
      trigger: ['blur'],
    },
  ],
})
const onClickComment = () => {
  if (props.list) return
  // if (!isLogin()) {
  //   uni.$u.toast('请先登录')
  //   return
  // }
  show.value = true
  nextTick(() => {
    uFormRef.value.setRules(rules)
  })
}
const onConfirm = async () => {
  uFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('验证通过')
      let data = unref(form)
      setLoading(true)
      PostApi.comment(model.value.id, data.content)
        .then((res) => {
          emit('comment') // 父组件刷新评论
          uni.showToast({ title: '提交成功', icon: 'none' })
          show.value = false
          form.content = ''
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      console.log('验证失败')
    }
  })
}

// 收藏
const onClickFavor = async () => {
  const res = await toggle(model.value.id)
  if (res !== undefined) {
    model.value.user_favorite = res
  }
}
const toPost = () => {
  if (!props.list) {
    return
  }
  uni.$u.route({
    url: 'pages/post/detail',
    params: {
      id: props.post.id,
    },
  })
}
</script>

<template>
  <view class="post-item-box py-2 b-b-1 b-#eee">
    <AuthorF v-if="post.author_id && post.author_id.id" :author="post.author_id" />
    <view class="post-list-content-box" @click="toPost">
      <view class="mb-4">
        <view class="text-16px font-bold my-1 color-#333">
          {{ post.name }}
        </view>
        <view v-if="list">
          <u-read-more :toggle="true" :show-height="240" close-text="展开" :text-indent="false">
            <rich-text class="text-14px color-#333" :nodes="post.brief"></rich-text>
          </u-read-more>
        </view>
        <view v-else>
          <u-parse :html="post.content" :domain="config.domain"></u-parse>
        </view>
      </view>
      <scroll-view v-if="imgList && imgList.length > 0" scroll-x style="width: 100%; height: 160rpx">
        <view style="width: 100%; height: 100%" class="flex">
          <view v-for="(item, index) in imgList" :key="item" class="mr-1" @click.stop="viewImage(index)">
            <u-image width="100px" height="80px" :src="item"></u-image>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="post-action-box flex-box text-18px color-#888 mt-2 py-1">
      <view class="flex-box mr-6" @click="onClickLike">
        <view
          :class="{ 'i-ant-design-like-outlined': !liked, 'i-ant-design-like-filled': liked, 'color-blue': liked }"
        ></view>
        <view class="ml-1 text-14px">
          {{ model.vote_count }}
        </view>
      </view>
      <view class="flex-box mr-6" @click="onClickComment">
        <view class="i-ant-design-message-outlined"></view>
        <view class="ml-1 text-14px">
          {{ model.child_count }}
        </view>
      </view>
      <view class="flex-box mr-6" @click="onClickFavor">
        <view
          :class="{
            'i-ant-design-star-outlined': !model.user_favorite,
            'i-ant-design-star-filled': model.user_favorite,
            'color-blue': model.user_favorite,
          }"
        ></view>
        <view class="ml-1 text-14px">
          {{ model.favourite_count }}
        </view>
      </view>
      <view v-if="list" class="flex-box ml-a text-14px color-blue" @click="toPost">
        详情<u-icon name="arrow-right"></u-icon>
      </view>
      <view v-else class="flex-box ml-a text-14px color-blue" @click="onClickComment"> 回复 </view>
    </view>
    <u-popup
      v-model="show"
      mode="bottom"
      height="240px"
      closeable
      close-icon-pos="top-right"
      :border-radius="12"
      @open="form.content = ''"
    >
      <view class="content">
        <view class="head text-18px pb-2"> 回复 </view>
        <u-form ref="uFormRef" :model="form" label-width="160" label-position="top" :label-style="{ fontSize: '16px' }">
          <u-form-item label="" required prop="content">
            <u-input
              v-model="form.content"
              type="textarea"
              placeholder="请在输入回复（不少于10字）"
              :border="false"
              maxlength="240"
              focus
              height="120"
              cursor-spacing="20"
            />
          </u-form-item>
        </u-form>
        <view class="confirm-btn">
          <u-button type="primary" :loading="loading" @click="onConfirm">确定</u-button>
        </view>
      </view>
    </u-popup>
  </view>
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
