<template>
  <view class="flex-row flex flex-row-center-center">
    <view v-for="(item, index) in _datalist" :key="index" :class="[`px-${props.gutter / 2}`]">
      <tm-sheet
        :round="props.round"
        :border="props.border"
        :text="props.text"
        :color="props.color"
        :width="_size"
        :height="_size"
        :margin="[0, 0]"
        :padding="[0, 0]"
        _class="flex-center"
        @click="emits('click')"
        :outlined="props.outlined"
        :follow-theme="props.followTheme"
      >
        <tm-text
          v-if="item.value !== ''"
          :user-interaction-enabled="false"
          :label="item.value"
          :color="props.fontColor"
          :font-size="props.fontSize"
        ></tm-text>
        <tm-icon
          v-if="item.value == '' && index !== _valueLen && props.type == 'line' && props.showLine"
          :user-interaction-enabled="false"
          :color="props.fontColor"
          name="tmicon-ios-remove"
        ></tm-icon>
        <tm-icon
          v-if="item.value == '' && index !== _valueLen && props.type == 'dot' && props.showLine"
          :user-interaction-enabled="false"
          :color="props.fontColor"
          :font-size="20"
          name="tmicon-yuan"
        ></tm-icon>

        <!-- #ifndef APP-NVUE -->
        <tm-sheet
          v-if="item.value == '' && index === _valueLen"
          :follow-theme="props.followTheme"
          :user-interaction-enabled="false"
          paren-class="tmSkeletonLine"
          class="tmSkeletonLine"
          :width="6"
          :color="props.fontColor || props.color"
          :height="_size / 2"
          :margin="[0, 0]"
          :padding="[0, 0]"
        >
        </tm-sheet>
        <!-- #endif -->
        <!-- #ifdef APP-NVUE -->
        <inputinit
          v-if="item.value == '' && index === _valueLen"
          :follow-theme="props.followTheme"
          :size="_size"
          :color="props.fontColor || props.color"
        ></inputinit>
        <!-- #endif -->
      </tm-sheet>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue'
import tmIcon from '../tm-icon/tm-icon.vue'
import tmSheet from '../tm-sheet/tm-sheet.vue'
import tmText from '../tm-text/tm-text.vue'
import { custom_props } from '../../tool/lib/minxs'
import inputinit from './inputinit.vue'
const emits = defineEmits(['click'])
const props = defineProps({
  ...custom_props,
  followTheme: {
    type: [Boolean],
    default: true,
  },
  text: {
    type: [Boolean],
    default: true,
  },
  size: {
    type: Number,
    default: 100,
  },
  gutter: {
    type: Number,
    default: 24,
  },
  round: {
    type: Number,
    default: 2,
  },
  border: {
    type: Number,
    default: 2,
  },
  //未输入时的闪烁形状，
  //圆：dot,线型:line
  type: {
    type: String,
    default: 'line',
  },
  /**
   * 是否显示中间的闪烁图标。
   */
  showLine: {
    type: [Boolean],
    default: true,
  },
  fontSize: {
    type: Number,
    default: 44,
  },
  //不填写时，默认自动配色。
  fontColor: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary',
  },
  //数量
  count: {
    type: Number,
    default: 4,
  },
  value: {
    type: [Number, String],
    default: '',
  },
})

const _mtype = computed(() => props.type)
const _count = computed(() => props.count)
const _valueLen = computed(() => String(props.value).split('').length)
const _size = computed(() => props.size)
const _datalist = computed(() => {
  let list = []
  let _value = String(props.value).split('')
  for (let i = 0; i < _count.value; i++) {
    list.push({
      value: _value[i] ?? '',
      index: i,
    })
  }
  return list
})
</script>
<style scoped>
/* #ifndef APP-NVUE */
.tmSkeletonLine {
  animation: loading 1s linear infinite;
}

@keyframes loading {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

/* #endif */
</style>
