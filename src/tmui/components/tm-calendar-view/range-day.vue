<template>
  <view class="flex flex-col relative">
    <tm-sheet
      v-if="!props.hideTool"
      :shadow="0"
      :round="0"
      :height="88"
      :margin="[0, 0]"
      :padding="[0, 0]"
      _class="flex flex-col"
    >
      <view class="flex flex-row flex-row-center-center" style="height: 88rpx">
        <view class="px-16" @click.stop="prevYear">
          <tm-icon :user-interaction-enabled="false" :font-size="22" name="tmicon-angle-double-left"></tm-icon>
        </view>
        <view class="px-16" @click.stop="prevMonth">
          <tm-icon :user-interaction-enabled="false" :font-size="22" name="tmicon-angle-left"></tm-icon>
        </view>
        <view class="px-12">
          <tm-text :user-interaction-enabled="false" _class="text-weight-b" :font-size="32" :label="_nowDate"></tm-text>
        </view>
        <view class="px-16" @click.stop="nextMonth">
          <tm-icon :user-interaction-enabled="false" :font-size="22" name="tmicon-angle-right"></tm-icon>
        </view>
        <view class="px-16" @click.stop="nextYear">
          <tm-icon :user-interaction-enabled="false" :font-size="22" name="tmicon-angle-double-right"></tm-icon>
        </view>
      </view>
      <view
        class="absolute t-0 r--6 zIndex-10 round-12 py-4 flex flex-row flex-row-center-center"
        style="width: 90rpx; height: 88rpx"
        @click="nowWeekClick"
      >
        <tm-text
          :user-interaction-enabled="false"
          color="grey"
          _class="text-align-center"
          :font-size="28"
          :label="props.textUnit[8]"
        ></tm-text>
      </view>
    </tm-sheet>

    <view class="flex flex-row flex-row-center-center py-12" :style="[{ height: '74rpx' }]">
      <view v-for="(item, index) in weekStr" :key="index" class="flex-1 flex-center">
        <view style="width: 62rpx" class="flex-center flex-col">
          <tm-text :font-size="24" :label="item"></tm-text>
        </view>
      </view>
    </view>
    <view class="flex flex-col">
      <view
        v-for="(item, index) in _data"
        :key="index"
        class="flex flex-row flex-row-center-center"
        :style="[{ height: '90rpx' }]"
      >
        <view
          v-for="(item2, index2) in item"
          :key="index2"
          class="flex-1 flex flex-row flex-row-center-center"
          @click="clickWeek(item2)"
        >
          <view
            :user-interaction-enabled="false"
            :class="[
              'flex-1',
              startOrAnd(item2.dateStr) == 1 ? 'round-l-24' : '',
              startOrAnd(item2.dateStr) == 2 ? 'round-r-24' : '',
              startOrAnd(item2.dateStr) == 3 ? 'round-24' : '',
              !startOrAnd(item2.dateStr) ? 'round-24' : '',
            ]"
            style="height: 90rpx; overflow: hidden"
          >
            <tm-sheet
              :height="90"
              :shadow="0"
              :round="0"
              :border="item2.extra.color && isSelected(item2.dateStr) ? 1 : 0"
              _class="flex-row"
              :is-disabled-round-andriod="true"
              :paren-class="
                (startOrAnd(item2.dateStr) == 1 ? 'round-l-24' : '') +
                (startOrAnd(item2.dateStr) == 2 ? 'round-r-24' : '') +
                (startOrAnd(item2.dateStr) == 3 ? 'round-24' : '')
              "
              :text="
                startOrAnd(item2.dateStr) == 1 || startOrAnd(item2.dateStr) == 2 || startOrAnd(item2.dateStr) == 3
                  ? false
                  : item2.extra.text !== null
                  ? item2.extra.text
                  : isSelected(item2.dateStr)
              "
              :color="item2.extra.color ? item2.extra.color : isSelected(item2.dateStr) ? _color : 'white'"
              :margin="[0, 0]"
              :padding="[0, 0]"
            >
              <view
                :user-interaction-enabled="false"
                style="width: 90rpx; height: 90rpx"
                :class="[!item2.isNowIn ? 'opacity-6' : '']"
                class="flex-1 flex-center"
              >
                <view
                  style="width: 90rpx"
                  class="flex-center flex-col"
                  :style="[{ opacity: item2.disabled ? '0.3' : '1' }]"
                >
                  <tm-text :font-size="28" :label="item2.date"></tm-text>
                  <tm-text
                    v-if="(startOrAnd(item2.dateStr) == 0 || startOrAnd(item2.dateStr) == 4) && item2.extra.extra"
                    _class="flex-center"
                    :font-size="22"
                    :label="item2.extra.extra"
                  ></tm-text>
                  <tm-text
                    v-if="startOrAnd(item2.dateStr) == 1"
                    _class="flex-center"
                    :font-size="22"
                    label="开始"
                  ></tm-text>
                  <tm-text
                    v-if="startOrAnd(item2.dateStr) == 2"
                    _class="flex-center"
                    :font-size="22"
                    label="结束"
                  ></tm-text>
                  <tm-text
                    v-if="startOrAnd(item2.dateStr) == 3"
                    _class="flex-center"
                    :font-size="20"
                    label="始/止"
                  ></tm-text>
                </view>
              </view>
            </tm-sheet>
          </view>
        </view>
      </view>
    </view>

    <tm-button
      v-if="!props.hideButton"
      :linear="props.linear"
      :linear-deep="props.linearDeep"
      :color="props.color"
      block
      :label="_confirmText"
      :margin="[32, 16]"
      @click="confirm"
    ></tm-button>
  </view>
</template>

<script lang="ts" setup>
/**
 * 按范围选择的日历。
 * @description 一次只能范围选择一个。
 */
import { computed, ref, Ref, watch, PropType, toRaw, nextTick } from 'vue'
import tmSheet from '../tm-sheet/tm-sheet.vue'
import tmIcon from '../tm-icon/tm-icon.vue'
import tmText from '../tm-text/tm-text.vue'
import tmButton from '../tm-button/tm-button.vue'
import * as dayjs from '../../tool/dayjs/esm/index'
import isoWeek from '../../tool/dayjs/esm/plugin/isoWeek/index'
import isSameOrBefore from '../../tool/dayjs/esm/plugin/isSameOrBefore/index'
import isBetween from '../../tool/dayjs/esm/plugin/isBetween/index'
import minMax from '../../tool/dayjs/esm/plugin/minMax/index'
import tmDivider from '../tm-divider/tm-divider.vue'
import { monthDayItem, dateItemStyle } from './interface'
import { useTmpiniaStore } from '../../tool/lib/tmpinia'
const store = useTmpiniaStore()
/**
 * 事件说明
 * v-model 绑定当前的周次时间开始和结束时间。
 * confirm 当点击确认时触发
 * click-day 日期被选中时触发，注意禁用的日期不会触发 。
 * change 当切换年或者月的时候触发。
 */
const emits = defineEmits(['update:modelValue', 'confirm', 'click-day', 'change'])
const props = defineProps({
  followTheme: {
    type: Boolean,
    default: true,
  },
  //默认显示的日期
  defaultValue: {
    type: Array as PropType<Array<string | number | Date>>,
    default: () => [],
  },
  //当前的周时间段
  modelValue: {
    type: Array as PropType<Array<string | number | Date>>,
    default: () => [],
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
  //指的是：有效的可选时间，小于此时间，不允许选中。
  start: {
    type: [String, Number, Date],
    default: '',
  },
  //指的是：有效的可选时间，大于此时间，不允许选中。
  end: {
    type: [String, Number, Date],
    default: '',
  },
  //被禁用的日期数组。如果["2022-1-1","2022-5-1"]
  //被禁用的日期将无法选中。
  disabledDate: {
    type: Array as PropType<Array<string | number | Date>>,
    default: () => [],
  },
  //设定单个日期的样式。
  dateStyle: {
    type: Array as PropType<Array<dateItemStyle>>,
    default: () => [],
  },
  //隐藏头部操作栏
  hideTool: {
    type: Boolean,
    default: false,
  },
  //隐藏底部确认按钮
  hideButton: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: '确认',
  },
  //周次，本日、本季、本年、本月、本周的文字请按顺序提供文本，方便定义其它语言。
  textUnit: {
    type: Array as PropType<string[]>,
    default: [
      '周次',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '日',
      '本日',
      '本周',
      '本月',
      '本季度',
      '本年',
      '月',
      '第${x}季度',
      '年',
    ],
  },
})
const _color = computed(() => {
  if (props.followTheme && store.tmStore.color) return store.tmStore.color
  return props.color
})
const _confirmText = computed(() => props.confirmText)
const DayJs = dayjs.default
DayJs.extend(isoWeek)
DayJs.extend(isSameOrBefore)
DayJs.extend(isBetween)
DayJs.extend(minMax)
//当前选中的时间数组。
const _value = ref(props.defaultValue)
const weekStr = props.textUnit.slice(1, 8)
//当前需要展示的年月。
const showOpenDate: Ref<dayjs.Dayjs> = ref(setShowopenDate())
//当前月历中的日期。
const _data: Ref<Array<Array<monthDayItem>>> = ref([])
//可选中开始时间
const _start_date = computed(() => {
  let isv = DayJs(props.start).isValid()
  return isv ? DayJs(props.start) : DayJs('1980-1-1')
})
//可选中的结束时间
const _end_date = computed(() => {
  let isv = DayJs(props.end).isValid()
  return isv ? DayJs(props.end) : DayJs('2450-1-1')
})

//当前展示的年月日期。
const _nowDate = computed(() => {
  return showOpenDate.value.format('YYYY-MM')
})
_data.value = getWeekOfMonthArray()

watch(
  [() => props.modelValue, () => props.dateStyle, () => props.disabledDate, () => props.start, () => props.end],
  () => {
    _value.value = props.modelValue
    showOpenDate.value = setShowopenDate()
    _data.value = getWeekOfMonthArray()
  },
  { deep: true }
)

//设置当前需要展示的月份。
function setShowopenDate() {
  //从当前选中的第一个日期开始。如果没有就显示当前本地时间的月。

  if (_value.value.length == 0) {
    return DayJs()
  }
  let n = _value.value[0] || DayJs()
  n = typeof n == 'undefined' || n == null ? DayJs() : n
  return DayJs(n)
}

function nowWeekClick() {
  if (isDisabledDate(DayJs())) {
    uni.showToast({ title: '无法选中', icon: 'none' })
    return
  }
  selected(DayJs().format('YYYY/MM/DD'))
  showOpenDate.value = DayJs()
  _data.value = getWeekOfMonthArray()
  emits('click-day', DayJs().format('YYYY/MM/DD'))
}
function clickWeek(wk: monthDayItem) {
  if (wk.disabled) {
    uni.showToast({ title: '无法选中', icon: 'none' })
    return
  }
  selected(wk.dateStr)
  emits('click-day', wk.dateStr)
}
//选中日期。相同需要减去。重复需要去除。
function selected(item: string | dayjs.Dayjs | number) {
  let nowvalue = [...toRaw(_value.value)]
  if (nowvalue.length < 2) {
    nowvalue.push(DayJs(item).format('YYYY/MM/DD'))
  } else {
    nowvalue = [DayJs(item).format('YYYY/MM/DD')]
  }

  if (nowvalue.length == 2) {
    let dToDayjs = [DayJs(nowvalue[0]), DayJs(nowvalue[1])]
    _value.value = [DayJs.min(dToDayjs), DayJs.max(dToDayjs).format('YYYY/MM/DD')]
  } else {
    _value.value = nowvalue
  }
}
function nextYear() {
  showOpenDate.value = showOpenDate.value.add(1, 'year')
  let dys = getWeekOfMonthArray()
  emits('change', showOpenDate.value.format('YYYY/MM/DD'))
  nextTick(() => {
    _data.value = [...dys]
  })
}
function nextMonth() {
  showOpenDate.value = showOpenDate.value.add(1, 'month')
  let dys = getWeekOfMonthArray()
  emits('change', showOpenDate.value.format('YYYY/MM/DD'))
  nextTick(() => {
    _data.value = [...dys]
  })
}
function prevMonth() {
  showOpenDate.value = showOpenDate.value.subtract(1, 'month')
  let dys = getWeekOfMonthArray()
  emits('change', showOpenDate.value.format('YYYY/MM/DD'))
  nextTick(() => {
    _data.value = [...dys]
  })
}
function prevYear() {
  showOpenDate.value = showOpenDate.value.subtract(1, 'year')
  let dys = getWeekOfMonthArray()
  emits('change', showOpenDate.value.format('YYYY/MM/DD'))
  nextTick(() => {
    _data.value = [...dys]
  })
}
//设置当前选中的日期范围，参数必须为有效的时间数组。
function setDefault(data: Array<string | number | Date> = []) {
  _value.value = props.modelValue
  showOpenDate.value = setShowopenDate()
  _data.value = getWeekOfMonthArray()
}
//获取本月按周分组的时间段。
function getWeekOfMonthArray() {
  let nowMonth: dayjs.Dayjs = showOpenDate.value.date(1)
  let startStatickDay = nowMonth.startOf('month')
  let endStatickDay = nowMonth.endOf('month')

  ///当前月份有多少天。
  let nowMonthDayNum = nowMonth.daysInMonth()
  //第一个日期需要补齐1-7天的。
  let startOfday = startStatickDay.isoWeekday() - 1

  startStatickDay = nowMonth.subtract(Math.abs(startOfday), 'day')
  //最后一个日期也要补齐1-7天。
  let endOfday = 7 - endStatickDay.isoWeekday()
  if (endOfday > 0) {
    endStatickDay = nowMonth.date(nowMonthDayNum).add(Math.abs(endOfday), 'day')
  }

  let startd = DayJs(startStatickDay)
  let arOfmonth: Array<number> = [] //本月的周次。
  let ar: Array<monthDayItem> = []
  function setAr() {
    let dy = props.dateStyle.map((el) => {
      el.date = DayJs(el.date).format('YYYY/MM/DD')
      return el
    })
    let dyObj = {}
    dy.forEach((el) => {
      dyObj[el.date] = el
    })
    let dySet = Object.keys(dyObj)
    while (startd.isSameOrBefore(endStatickDay)) {
      let idate = startd.format('YYYY/MM/DD')
      let ext = dySet.includes(idate) ? dyObj[idate] : {}
      ar.push({
        dateStr: idate,
        date: startd.date() < 10 ? '0' + startd.date() : startd.date(),
        day: startd.isoWeekday(),
        week: startd.isoWeek(),
        isNowIn: isInNowMonth(nowMonth, startd),
        disabled: isDisabledDate(startd),
        extra: {
          date: idate,
          text: null,
          color: '',
          extra: '',
          ...ext,
        },
      })
      arOfmonth.push(startd.isoWeek())
      startd = startd.add(1, 'day')
    }
  }
  setAr()
  // 再检查当前展示时段内有没有满足6*7 42天没有也要补上剩余的天数。
  if (ar.length < 42) {
    let chaJi = 42 - ar.length
    endStatickDay = endStatickDay.add(chaJi, 'day')
    setAr()
  }

  arOfmonth = [...new Set(arOfmonth)]
  let dArray: Array<Array<monthDayItem>> = []
  let index = 0
  dArray.push([])
  ar.forEach((el) => {
    if (el.week == arOfmonth[index]) {
      dArray[index].push(el)
    } else {
      index += 1
      dArray.push([])
      dArray[index].push(el)
    }
  })
  return dArray
}
// 检测now日期是否在某个日期的月份中.
function isInNowMonth(date: string | dayjs.Dayjs | number = '', now: string | dayjs.Dayjs | number = '') {
  let startStatickDay = DayJs(date).startOf('month').format('YYYY/MM/DD')
  let endStatickDay = DayJs(date).endOf('month').format('YYYY/MM/DD')
  return DayJs(now).isBetween(startStatickDay, endStatickDay, 'day', '[]')
}
//检测某个日期，是否在禁用中。
function isDisabledDate(date: string | dayjs.Dayjs | number = '') {
  let valdate = DayJs(date)
  let isds = false
  isds = !valdate.isBetween(_start_date.value, _end_date.value, 'day', '[]')
  for (let i = 0; i < props.disabledDate.length; i++) {
    let item = props.disabledDate[i]
    if (DayJs(item).isSame(valdate, 'day')) {
      isds = true
      break
    }
  }
  return isds
}
//检测 某个日期是否被选中。
function isSelected(date: string | dayjs.Dayjs | number = '') {
  let isSelected = false
  let fr = _value.value.filter((el) => DayJs(el).isSame(date))
  isSelected = fr.length > 0 ? true : false
  if (_value.value.length == 2) {
    isSelected = DayJs(date).isBetween(_value.value[0], _value.value[1], 'day', '[]')
  }
  return isSelected
}
//检测一个日期是否是开始和结束。
function startOrAnd(date: string | dayjs.Dayjs | number = '') {
  //返回1为开始，2为结束,3开始和结束相同，0为非开始和结束以及之间。4为开始和结束之间
  if (_value.value.length == 1) {
    if (DayJs(date).isSame(_value.value[0], 'day')) {
      return 1
    }
  } else if (_value.value.length == 2) {
    if (DayJs(_value.value[1]).isSame(_value.value[0], 'day') && DayJs(date).isSame(_value.value[0], 'day')) {
      return 3
    }
    if (DayJs(date).isSame(_value.value[0], 'day')) {
      return 1
    }
    if (DayJs(date).isSame(_value.value[1], 'day')) {
      return 2
    }
    if (DayJs(date).isBetween(_value.value[0], _value.value[1], 'day', '()')) {
      return 4
    }
  }

  return 0
}
function confirm() {
  let ar = _value.value.map((el) => DayJs(el).format('YYYY/MM/DD'))
  emits('update:modelValue', ar)
  emits('confirm', ar)
}
defineExpose({
  setDefault: setDefault,
  nextYear: nextYear,
  nextMonth: nextMonth,
  prevYear: prevYear,
  prevMonth: prevMonth,
})
</script>

<style></style>
