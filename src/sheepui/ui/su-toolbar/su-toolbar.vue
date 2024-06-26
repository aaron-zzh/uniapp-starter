<template>
  <view v-if="show" class="u-toolbar" @touchmove.stop.prevent="noop">
    <view class="u-toolbar__cancel__wrapper" hover-class="u-hover-class">
      <text
        class="u-toolbar__wrapper__cancel"
        :style="{
          color: cancelColor,
        }"
        @tap="cancel"
      >
        {{ cancelText }}
      </text>
    </view>
    <text v-if="title" class="u-toolbar__title u-line-1">{{ title }}</text>
    <view class="u-toolbar__confirm__wrapper" hover-class="u-hover-class">
      <text
        class="u-toolbar__wrapper__confirm"
        :style="{
          color: confirmColor,
        }"
        @tap="confirm"
      >
        {{ confirmText }}
      </text>
    </view>
  </view>
</template>

<script>
/**
 * Toolbar 工具条
 * @description
 * @tutorial https://www.uviewui.com/components/toolbar.html
 * @property {Boolean}	show			是否展示工具条（默认 true ）
 * @property {String}	cancelText		取消按钮的文字（默认 '取消' ）
 * @property {String}	confirmText		确认按钮的文字（默认 '确认' ）
 * @property {String}	cancelColor		取消按钮的颜色（默认 '#909193' ）
 * @property {String}	confirmColor	确认按钮的颜色（默认 '#3c9cff' ）
 * @property {String}	title			标题文字
 * @event {Function}
 * @example
 */
export default {
  name: 'SuToolbar',
  props: {
    // 是否展示工具条
    show: {
      type: Boolean,
      default: true,
    },
    // 取消按钮的文字
    cancelText: {
      type: String,
      default: '取消',
    },
    // 确认按钮的文字
    confirmText: {
      type: String,
      default: '确认',
    },
    // 取消按钮的颜色
    cancelColor: {
      type: String,
      default: '#909193',
    },
    // 确认按钮的颜色
    confirmColor: {
      type: String,
      default: '#3c9cff',
    },
    // 标题文字
    title: {
      type: String,
      default: '',
    },
  },
  methods: {
    // 点击取消按钮
    cancel() {
      this.$emit('cancel')
    },
    // 点击确定按钮
    confirm() {
      this.$emit('confirm')
    },
    // 阻止事件冒泡
    preventEvent(e) {
      e && typeof e.stopPropagation === 'function' && e.stopPropagation()
    },
    // 空操作
    noop(e) {
      this.preventEvent(e)
    },
  },
}
</script>

<style lang="scss" scoped>
.u-toolbar {
  height: 42px;
  @include flex;
  justify-content: space-between;
  align-items: center;

  &__wrapper {
    &__cancel {
      color: #111111;
      font-size: 15px;
      padding: 0 15px;
    }
  }

  &__title {
    color: #000000;
    padding: 0 60rpx;
    font-size: 16px;
    flex: 1;
    text-align: center;
  }

  &__wrapper {
    &__confirm {
      color: #ffffff;
      font-size: 15px;
      padding: 0 15px;
    }
  }
}
</style>
