<template>
  <view class="check-box" :class="{ selected: modelValue }" @click="toggle">
    <FontIcon v-show="modelValue" icon="tick" size="28rpx" color="#fff" />
  </view>
</template>

<script setup lang="ts">
import FontIcon from './FontIcon.vue'
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [Boolean, String],
    default: false,
  },
})

// 勾选、取消勾选
const toggle = () => {
  const value = !props.modelValue
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.check-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40rpx;
  width: 40rpx;
  border: 2rpx solid #ccc;
  border-radius: 50%;
  background: #fff;
  &.selected {
    border-color: $uni-color-primary;
    background: $uni-color-primary;
  }
}
</style>
