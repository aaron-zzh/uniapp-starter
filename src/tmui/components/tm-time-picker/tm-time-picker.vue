<template>
  <view @click="_show = !_show">
    <!-- #ifdef APP-NVUE -->
    <view :event-penetration-enabled="true"><slot></slot></view>
    <!-- #endif -->
    <!-- #ifndef APP-NVUE -->
    <slot></slot>
    <!-- #endif -->
    <tm-drawer
      ref="drawer"
      :disabble-scroll="true"
      :round="props.round"
      :height="dHeight"
      :show="_show"
      :ok-color="props.color"
      :title="_title"
      :closeable="true"
      @update:show="_show = $event"
      @close="close"
      @open="open"
      @ok="confirm"
    >
      <tm-time-view
        :height="dHeight - 230"
        :model-value="_value"
        :model-str="_strvalue"
        :default-value="_value"
        :disabled-date="props.disabledDate"
        :format="props.format"
        :show-detail="props.showDetail"
        :show-suffix="props.showSuffix"
        :start="props.start"
        :end="props.end"
        @update:model-value="_value = $event"
        :immediate-change="props.immediateChange"
        @update:model-str="_strvalue = $event"
        @change="change"
      ></tm-time-view>
      <tm-button
        :label="_confirmText"
        block
        :margin="[32, 12]"
        :color="props.color"
        :linear="props.linear"
        :linear-deep="props.linearDeep"
        :round="props.btnRound"
        @click="confirm"
      >
      </tm-button>
      <view :style="{ height: sysinfo.bottomSafe + 'px' }"></view>
    </tm-drawer>
  </view>
</template>
<script lang="ts" setup>
/**
 * 日历(弹层式)
 * @description 用法见：tm-calendar-view组件，与其一致的用法。
 */
import { computed, ref, watch, PropType, Ref, inject, getCurrentInstance, nextTick, watchEffect } from 'vue'
import { custom_props, computedTheme, computedClass, computedStyle, computedDark } from '../../tool/lib/minxs'
import tmTimeView from '../tm-time-view/tm-time-view.vue'
import tmDrawer from '../tm-drawer/tm-drawer.vue'
import TmSheet from '../tm-sheet/tm-sheet.vue'
import tmText from '../tm-text/tm-text.vue'
import tmButton from '../tm-button/tm-button.vue'
import { useWindowInfo } from '../../tool/useFun/useWindowInfo'

const proxy = getCurrentInstance()?.proxy ?? null
const drawer = ref<InstanceType<typeof tmDrawer> | null>(null)
const emits = defineEmits([
  'update:modelValue',
  'update:modelStr',
  'update:show',
  'confirm',
  'change',
  'cancel',
  'close',
  'open',
])

const props = defineProps({
  ...custom_props,
  show: {
    type: Boolean,
    default: false,
  },
  immediateChange: {
    type: Boolean,
    default: false,
  },
  /**
   * 这里是动态返回时间戳。这是一个标准的时间，不管showDetail是如何设置都将不影响这里的输出。
   * 并且fomart不会影响这里的双向绑定。只会影响model-str
   */
  modelValue: {
    type: [Number, String, Date],
    default: '',
  },
  /**
   * 这里和modelValue不一样，它只代表格式化输出显示，因此这里可能并不是一个有效的时间值。
   * 比如:format为"MM/DD",那这里就会显示12/10这样的时间格式，因此并不是一个正确的时间，
   * 这里主要是为了方便表单上页面的显示控制输入。如果真要保存到数据库，你应该保存modelValue的值。
   */
  modelStr: {
    type: [String],
    default: '',
  },
  defaultValue: {
    type: [Number, String, Date],
    default: '',
  },
  /**
   * 禁用的部分日期，禁用的日期将不会被选中，就算滑到了该位置，也会回弹到之前的时间。
   * 现在暂时只禁用到天，也就是一个时间到天这如果==下面的禁用日期，就会选不中。
   */
  disabledDate: {
    type: Array as PropType<Array<number | string | Date>>,
    default: (): Array<number | string | Date> => [],
  },
  //展示格式。最终影响到modelStr输出格式的内容。
  format: {
    type: String,
    default: 'YYYY/MM/DD',
  },
  //需要展现的时间格式类型
  showDetail: {
    type: Object as PropType<showDetail>,
    default: () => {
      return {
        year: true,
        month: true,
        day: true,
        hour: false,
        minute: false,
        second: false,
      }
    },
  },
  //日期的后缀，
  showSuffix: {
    type: Object,
    default: () => {
      return {
        year: '年',
        month: '月',
        day: '日',
        hour: '时',
        minute: '分',
        second: '秒',
      }
    },
  },
  start: {
    type: [Number, String, Date],
    default: '2008/01/01 00:00:00',
  },
  end: {
    type: [Number, String, Date],
    default: '',
  },
  height: {
    type: Number,
    default: 700,
  },
  color: {
    type: String,
    default: 'primary',
  },
  linear: {
    type: String,
    default: '',
  },
  linearDeep: {
    type: String,
    default: 'light',
  },
  btnRound: {
    type: Number,
    default: 3,
  },
  round: {
    type: Number,
    default: 12,
  },
  title: {
    type: String,
    default: '请选择时间',
  },
  confirmText: {
    type: String,
    default: '确认选择',
  },
})

const _show = ref(props.show)
const isConfirm = ref(false) //是否点了确认按钮。
const _value = ref(props.defaultValue)
const _strvalue = ref('')
const _title = computed(() => props.title)
const _confirmText = computed(() => props.confirmText)

const sysinfo = useWindowInfo()

function close() {
  if (!isConfirm.value) {
    emits('cancel')
    //取消了，但没点确认，则要恢复默认值。
    _value.value = ''
    nextTick(() => {
      _value.value = props.modelValue ? props.modelValue : props.defaultValue
    })
  }
  emits('close')
  emits('update:show', false)
  isConfirm.value = false
}
function open() {
  emits('open')
}

watchEffect(() => {
  _show.value = props.show
})
watch(
  () => props.modelValue,
  () => {
    _value.value = props.modelValue
  },
  { deep: true }
)
function change(e: string | number) {
  emits('change', e)
}

function confirm() {
  emits('confirm', _value.value)
  emits('update:modelValue', _value.value)
  emits('update:modelStr', _strvalue.value)
  nextTick(() => {
    isConfirm.value = true
    drawer.value?.close()
  })
}

const dHeight = computed(() => {
  return props.height + sysinfo.bottomSafe + 80
})
</script>
