<script setup lang="ts">
import type { AuthorInfo } from '@/api/common/model'

const props = defineProps<{ author: AuthorInfo }>()
const author = toRef(props, 'author')

const toAuthor = () => {
  uni.$u.route({
    url: 'pages/author/detail',
    params: {
      id: props.author.id,
    },
  })
}
</script>

<template>
  <view class="author-info-box flex-box flex-1 color-#888 text-12px items-center" style="height: 55px">
    <u-avatar
      :src="`data:image/*;base64,${author.avatar_256}`"
      :show-level="author.certified"
      size="mini"
      @click="toAuthor"
    ></u-avatar>
    <view class="p-1 ml-1 flex-1">
      <view class="inline-block" @click="toAuthor">
        <view class="text-14px color-#333">
          {{ author.name }}
        </view>
        <view v-if="author.certified" class="flex-box text-12px color-#888 my-1">
          <view class="flex-box text-10px color-#ff9900 mr-1">U-Starter认证老师</view>
        </view>
      </view>
    </view>
    <FollowBtn :id="author.id" v-model:followed="author.user_follow" type="app.author" />
  </view>
</template>

<style lang="scss" scoped></style>
