<!-- 装修商品组件：标题栏 -->
<template>
  <view class="ss-title-wrap ss-flex ss-col-center" :class="[state.typeMap[data.textAlign]]" :style="[elStyles]">
    <view class="title-content">
      <!-- 主标题 -->
      <view v-if="data.title" class="title-text" :style="[titleStyles]">{{ data.title }}</view>
      <!-- 副标题 -->
      <view v-if="data.description" :style="[descStyles]" class="sub-title-text">{{ data.description }}</view>
    </view>
    <!-- 查看更多 -->
    <view
      v-if="data.more?.show"
      class="more-box ss-flex ss-col-center"
      :style="{ color: data.descriptionColor }"
      @tap="sheep.$router.go(data.more.url)"
    >
      <view v-if="data.more.type !== 'icon'" class="more-text">{{ data.more.text }} </view>
      <text v-if="data.more.type !== 'text'" class="_icon-forward"></text>
    </view>
  </view>
</template>

<script setup>
/**
 * 标题栏
 */
import { reactive } from 'vue'
import sheep from '@/sheep'

// 数据
const state = reactive({
  typeMap: {
    left: 'ss-row-left',
    center: 'ss-row-center',
  },
})

// 接收参数
const props = defineProps({
  data: {
    type: Object,
    default() {},
  },
  styles: {
    type: Object,
    default() {},
  },
})

// 组件样式
const elStyles = {
  background: `url(${sheep.$url.cdn(props.data.bgImgUrl)}) no-repeat top center / 100% auto`,
  fontSize: `${props.data.titleSize}px`,
  fontWeight: `${props.data.titleWeight}px`,
}

// 标题样式
const titleStyles = {
  color: props.data.titleColor,
  fontSize: `${props.data.titleSize}px`,
  textAlign: props.data.textAlign,
}

// 副标题
const descStyles = {
  color: props.data.descriptionColor,
  textAlign: props.data.textAlign,
  fontSize: `${props.data.descriptionSize}px`,
  fontWeight: `${props.data.descriptionWeight}px`,
}
</script>

<style lang="scss" scoped>
.ss-title-wrap {
  height: 80rpx;
  position: relative;

  .title-content {
    .title-text {
      font-size: 30rpx;
      color: #333;
    }

    .sub-title-text {
      font-size: 22rpx;
      color: #999;
    }
  }

  .more-box {
    white-space: nowrap;
    font-size: 22rpx;
    color: #999;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20rpx;
  }
}
</style>
