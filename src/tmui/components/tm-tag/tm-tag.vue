<template>
  <view v-if="show" class="flex flex-row" :class="[loading ? 'opacity-5' : '']">
    <tm-translate ref="anitag" name="zoom" reverse :auto-play="false" @end="aniEnd">
      <tm-sheet
        :transprent="props.transprent"
        :color="props.color"
        _class="flex-row flex flex-row-center-center"
        :_style="customCSSStyle"
        :follow-theme="props.followTheme"
        :follow-dark="props.followDark"
        :dark="props.dark"
        :round="props.round"
        :shadow="(props.checkable && checked_com) || !props.checkable ? props.shadow : 0"
        @click="onclick"
        :outlined="props.checkable && !checked_com ? true : props.outlined"
        :border="props.border"
        :border-style="props.borderStyle"
        :border-direction="props.borderDirection"
        :text="props.checkable && !checked_com ? true : props.text"
        :linear="props.linear"
        :linear-deep="props.linearDeep"
        :margin="props.margin"
        :padding="[wh.px, wh.py]"
        :border-color="props.borderColor"
        :linear-color="props.linearColor"
      >
        <tm-icon
          v-if="props.icon && props.iconAlign == 'left'"
          :color="_fontColor"
          :name="props.icon"
          :follow-dark="props.followDark"
          :font-size="wh.fontSize"
          :dark="props.dark"
          :user-interaction-enabled="false"
        ></tm-icon>

        <view class="flex-1 flex flex-center px-12">
          <slot name="default">
            <tm-text
              :color="_fontColor"
              :font-size="wh.fontSize"
              :follow-dark="props.followDark"
              :user-interaction-enabled="false"
              :dark="props.dark"
              :label="props.label"
            ></tm-text>
          </slot>
        </view>
        <view @click.stop="">
          <tm-icon
            v-if="props.closable && !loading"
            :color="_fontColor"
            :follow-dark="props.followDark"
            :_class="props.icon ? 'pl-10' : ''"
            :font-size="wh.fontSize * 0.8"
            name="tmicon-times"
            :dark="props.dark"
            @click="closeTag"
          ></tm-icon>
        </view>
        <tm-icon
          v-if="props.icon && props.iconAlign == 'right'"
          :color="_fontColor"
          :name="props.icon"
          :follow-dark="props.followDark"
          :font-size="wh.fontSize"
          :dark="props.dark"
          :user-interaction-enabled="false"
        ></tm-icon>
        <view
          v-if="loading"
          :user-interaction-enabled="false"
          class="pl-10 flex flex-center flex-row"
          style="line-height: 0"
        >
          <tm-icon
            :color="_fontColor"
            :follow-dark="props.followDark"
            :font-size="wh.fontSize * 0.8"
            name="tmicon-loading"
            spin
            :dark="dark"
          >
          </tm-icon>
        </view>
      </tm-sheet>
    </tm-translate>
  </view>
</template>

<script lang="ts" setup>
/**
 * 标签
 */
import tmSheet from '../tm-sheet/tm-sheet.vue'
import tmApp from '../tm-app/tm-app.vue'
import tmText from '../tm-text/tm-text.vue'
import tmDivider from '../tm-divider/tm-divider.vue'
import tmIcon from '../tm-icon/tm-icon.vue'
import tmTranslate from '../tm-translate/tm-translate.vue'
import {
  getCurrentInstance,
  computed,
  ref,
  provide,
  inject,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  PropType,
} from 'vue'
import { cssstyle, tmVuetify } from '../../tool/lib/interface'
import { custom_props, computedClass, computedStyle } from '../../tool/lib/minxs'
// #ifdef APP-PLUS-NVUE
const Binding = uni.requireNativePlugin('bindingx')
const dom = uni.requireNativePlugin('dom')
// #endif
// 混淆props共有参数
const props = defineProps({
  ...custom_props,
  followTheme: {
    type: [Boolean],
    default: true,
  },
  transprent: {
    type: [Boolean],
    default: false,
  },
  border: {
    type: [Number],
    default: 0,
  },
  round: {
    type: [Number],
    default: 2,
  },
  shadow: {
    type: [Number],
    default: 1,
  },
  margin: {
    type: Array as PropType<Array<number>>,
    default: () => [10, 10],
  },
  padding: {
    type: Array as PropType<Array<number>>,
    default: () => [0, 0],
  },

  //是否开启标签可选中状态。
  checkable: {
    type: [Boolean],
    default: false,
  },
  //只有当checkable为true时有效。
  checked: {
    type: [Boolean],
    default: false,
  },
  //标签是否处于加载中。
  load: {
    type: [Boolean],
    default: false,
  },
  //标签尺寸
  size: {
    type: String as PropType<'xs' | 's' | 'm' | 'n' | 'g' | 'lg'>,
    default: 'm', //xs|s|m|n|g|lg
  },
  fontSize: {
    type: [Number],
    default: 0,
  },
  //是否允许关闭标签。
  closable: {
    type: [Boolean],
    default: false,
  },
  //标签上显示图标。
  icon: {
    type: [String],
    default: '',
  },
  /**图标在文字的左还是右 */
  iconAlign: {
    type: String as PropType<'left' | 'right'>,
    default: 'left',
  },
  label: {
    type: [String],
    default: '',
  },
  fontColor: {
    type: String,
    default: '',
  },
  beforeClose: {
    type: Function,
    default: null,
  },
})
const emits = defineEmits(['click', 'close', 'change', 'update:checked'])

const anitag = ref<InstanceType<typeof tmTranslate> | null>(null)
//自定义样式：
const customCSSStyle = computed(() => computedStyle(props))
//自定类
const customClass = computed(() => computedClass(props))
//显示
const show = ref(true)
//是否选中。
const _checked_ = ref(false)
const _fontColor = computed(() => props.fontColor)
//是否加载中.
const loading = computed(() => props.load)
const checked_com = computed({
  get: function () {
    return _checked_.value
  },
  set: function (val: boolean) {
    _checked_.value = val
    emits('update:checked', _checked_.value)
  },
})
checked_com.value = props.checked
watch(
  () => props.checked,
  (newval) => {
    checked_com.value = newval
    emits('change', checked_com.value)
  }
)
const wh = computed(() => {
  if (props.size == 'xs') {
    return {
      px: props.padding[0] || 10,
      py: props.padding[1] || 4,
      fontSize: props.fontSize || 22,
    }
  } else if (props.size == 's') {
    return {
      px: props.padding[0] || 14,
      py: props.padding[1] || 4,
      fontSize: props.fontSize || 24,
    }
  } else if (props.size == 'm') {
    return {
      px: props.padding[0] || 16,
      py: props.padding[1] || 8,
      fontSize: props.fontSize || 26,
    }
  } else if (props.size == 'n') {
    return {
      px: props.padding[0] || 18,
      py: props.padding[1] || 10,
      fontSize: props.fontSize || 28,
    }
  } else if (props.size == 'g') {
    return {
      px: props.padding[0] || 20,
      py: props.padding[1] || 12,
      fontSize: props.fontSize || 32,
    }
  } else if (props.size == 'lg') {
    return {
      px: props.padding[0] || 24,
      py: props.padding[1] || 16,
      fontSize: props.fontSize || 36,
    }
  }
  return {
    px: props.padding[0],
    py: props.padding[1],
    fontSize: props.fontSize,
  }
})

function onclick(e: TouchEvent | MouseEvent) {
  emits('click', e)
  if (loading.value) return
  checked_com.value = !checked_com.value
}
function aniEnd() {
  show.value = false
  emits('close')
}
async function closeTag(e: TouchEvent | MouseEvent) {
  if (loading.value) return
  e.stopPropagation()
  let p: Function | boolean = true
  if (typeof props.beforeClose == 'function') {
    p = await props.beforeClose()
    if (typeof p == 'function') {
      p = await p()
    }
    if (!p) return
  }
  if (anitag.value) {
    anitag.value.play()
  } else {
    show.value = false
    emits('close')
  }
}
</script>
