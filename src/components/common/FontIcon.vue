<script setup lang="ts">
const emit = defineEmits(['click'])
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#333',
  },
  size: {
    type: String,
    default: '32rpx',
  },
  rotate: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <view
    :class="['iconfont', `icon-${props.icon}`]"
    :style="{
      color: props.color,
      fontSize: props.size,
      transform: `rotate(${rotate}deg)`,
    }"
    @click="emit('click')"
  ></view>
</template>

<style lang="scss" scoped></style>
