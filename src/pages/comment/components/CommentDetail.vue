<script setup lang="ts">
import type { Ref } from 'vue'
import type { Comment } from '@/api/post/model'
// import { isLogin } from '@/utils/public'
import PostApi from '@/api/post'
import useLoading from '@/hooks/loading'
const { loading, setLoading } = useLoading()

const emit = defineEmits(['update:show', 'submitted'])
const props = defineProps<{
  show: boolean
  comments: Comment[]
}>()

// import { listData } from '../data'
const commentList: Ref<Comment[]> = toRef(props, 'comments')
// const toAllReply = (comment:Comment) => {
//   uni.$u.route({
//     url: '/pages/comment/reply',
//     params: {
//       id: comment.id,
//     }
//   })
// }

const getVoted = (comment: Comment) => {
  console.log(comment.user_vote, comment.content)
  return comment.user_vote > 0
}
const onClickVote = async (comment: Comment) => {
  const res = await PostApi.votePost(comment.id, !getVoted(comment))
  comment.vote_count = res.vote_count
  comment.user_vote = getVoted(comment) ? 0 : 1
}

const show = toRef(props, 'show')

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
      trigger: ['blur', 'change'],
    },
  ],
})

let curComment: Comment = {} as Comment
const onClickComment = (comment: Comment) => {
  curComment = comment
  // if (!isLogin()) {
  //   uni.$u.toast('请先登录')
  //   return
  // }
  show.value = true
  emit('update:show', true)
  nextTick(() => {
    if (!uFormRef.value) {
      return
    }
    uFormRef.value.setRules(rules)
  })
}
const onConfirm = async () => {
  if (!uFormRef.value) {
    return
  }
  uFormRef.value.setRules(rules)
  uFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('验证通过')
      let data = unref(form)
      setLoading(true)
      PostApi.comment(curComment.id, data.content)
        .then((res) => {
          console.log(res)
          setLoading(false)
          emit('submitted')
          uni.showToast({ title: '提交成功', icon: 'none' })
          show.value = false
          emit('update:show', false)
          form.content = ''
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      console.log('验证失败')
    }
  })
}
</script>

<template>
  <view>
    <view v-for="res in commentList" :key="res.id" class="comment">
      <view v-if="res.create_uid" class="o-left">
        <image :src="`data:image/*;base64,${res.create_uid.avatar_256}`" mode="aspectFill"></image>
      </view>
      <view class="right">
        <view class="top">
          <view class="name">{{ res.create_uid && res.create_uid.name }}</view>
          <view class="like" :class="{ highlight: getVoted(res) }">
            <view class="num">{{ res.vote_count }}</view>
            <u-icon v-if="!getVoted(res)" name="thumb-up" :size="30" color="#9a9a9a" @click="onClickVote(res)"></u-icon>
            <u-icon v-if="getVoted(res)" name="thumb-up-fill" :size="30" @click="onClickVote(res)"></u-icon>
          </view>
        </view>
        <view class="content">
          <rich-text class="text-14px mt-4" :nodes="res.content"></rich-text>
        </view>
        <view v-if="res.child_ids && res.child_ids.length > 0" class="reply-box">
          <view v-for="item in res.child_ids" :key="item.id" class="item">
            <view class="username">{{ item.create_uid && item.create_uid.name }}</view>
            <rich-text :nodes="item.content"></rich-text>
          </view>
          <!-- <view class="all-reply" @tap="toAllReply" v-if="res.child_count">
						共{{ res.child_count }}条回复
						<u-icon class="more" name="arrow-right" :size="26"></u-icon>
					</view> -->
        </view>
        <view class="bottom">
          {{ res.create_date }}
          <view class="reply" @click="onClickComment(res)">回复</view>
        </view>
      </view>
    </view>
    <u-popup
      v-model="show"
      mode="bottom"
      height="240px"
      closeable
      close-icon-pos="top-right"
      :border-radius="12"
      @open="form.content = ''"
      @close="emit('update:show', false)"
    >
      <view class="dlg_content">
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
.comment {
  display: flex;
  padding: 30rpx;
  .o-left {
    image {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background-color: #f2f2f2;
    }
  }
  .right {
    flex: 1;
    padding-left: 20rpx;
    font-size: 14px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;
      .name {
        color: #5677fc;
      }
      .like {
        display: flex;
        align-items: center;
        color: #9a9a9a;
        font-size: 13px;
        .num {
          margin-right: 4rpx;
          color: #9a9a9a;
        }
      }
      .highlight {
        color: #5677fc;
        .num {
          color: #5677fc;
        }
      }
    }
    .content {
      margin-bottom: 10rpx;
    }
    .reply-box {
      background-color: rgb(242, 242, 242);
      border-radius: 12rpx;
      .item {
        padding: 20rpx;
        border-bottom: solid 2rpx $u-border-color;
        .username {
          font-size: 24rpx;
          color: #999999;
        }
      }
      .all-reply {
        padding: 20rpx;
        display: flex;
        color: #5677fc;
        align-items: center;
        .more {
          margin-left: 6rpx;
        }
      }
    }
    .bottom {
      margin-top: 20rpx;
      display: flex;
      font-size: 24rpx;
      color: #9a9a9a;
      .reply {
        color: #5677fc;
        margin-left: 6px;
      }
    }
  }
}

.dlg_content {
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
