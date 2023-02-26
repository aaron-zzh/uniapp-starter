<script setup lang="ts">
import type { PostList } from '@/api/post/model'

const config = inject('config') // 注入

const props = defineProps<{ data: PostList }>()

const toPostDetail = (id: string | number) => {
  uni.$u.route({
    url: 'pages/post/detail',
    params: {
      id,
    },
  })
}
</script>

<template>
  <view class="item-container" @click="toPostDetail(data.id)">
    <view class="info-box">
      <view class="title line-3">{{ data.name }}</view>
      <view class="flex flex-row items-center justify-start color-#888 text-12px">
        <view class="user mr-3" style="width: 100px"
          ><u-icon name="account" class="mr-1" />{{ data.author_id && data.author_id.name }}</view
        >
        <view><u-icon name="eye" class="mr-1" />{{ data.view_count }}</view>
      </view>
    </view>
    <view class="img-box">
      <u-image
        width="150px"
        height="100%"
        :src="data.image_url ? config.domain + data.image_url : config.emptyImg"
        border-radius="4px"
      ></u-image>
      <u-tag
        class="img-tag"
        :text="data.tag_ids.length > 0 ? data.tag_ids[0].name : '动态'"
        mode="dark"
        size="mini"
        type="info"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.item-container {
  height: 100px;
  background: #fff;
  display: flex;
  margin: 10px 0;
  align-items: center;
}
.info-box {
  padding: 4px 0;
  padding-right: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 156px);
  justify-content: space-between;
}
.title {
  font-size: 16px;
  margin: 4px 0;
}

.img-box {
  position: relative;
  color: #fff;
  height: 100%;
  margin: 10px 0px;
  overflow: hidden;
}
.img-tag {
  position: absolute;
  top: 3px;
  right: 3px;
}
</style>
