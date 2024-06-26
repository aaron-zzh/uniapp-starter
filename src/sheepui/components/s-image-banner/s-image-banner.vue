<!-- 装修图文组件：图片轮播 -->
<template>
  <su-swiper
    :list="imgList"
    :dot-style="data.indicator === 'dot' ? 'long' : 'tag'"
    image-mode="scaleToFill"
    dot-cur="bg-mask-40"
    :seize-height="300"
    :autoplay="data.autoplay"
    :interval="data.interval * 1000"
    :mode="data.type"
  />
</template>

<script setup>
import { computed } from 'vue'
import sheep from '@/sheep'

// 轮播图
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  styles: {
    type: Object,
    default: () => ({}),
  },
})

const imgList = computed(() =>
  props.data.items.map((item) => {
    const src = item.type === 'img' ? item.imgUrl : item.videoUrl
    return {
      ...item,
      type: item.type === 'img' ? 'image' : 'video',
      src: sheep.$url.cdn(src),
      poster: sheep.$url.cdn(item.imgUrl),
    }
  })
)
</script>

<style></style>
