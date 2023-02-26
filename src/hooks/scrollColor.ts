import type { Ref } from 'vue'

export default function useScrollColor(y: Ref<number>) {
  const scrollColor = reactive({
    backgroundColor: 'transparent',
    color: 'transparent',
  })

  function doCompute() {
    let val = 0
    const newPos = unref(y)
    if (newPos > 30) {
      val = newPos <= 200 ? (newPos + 20) / 200 : 1
      scrollColor.backgroundColor = `rgb(36, 59, 130, ${val})`
      scrollColor.color = `rgb(238, 238, 283, ${val})`
    } else {
      scrollColor.color = 'transparent'
      scrollColor.backgroundColor = 'transparent'
    }
  }

  if (isRef(y)) {
    // 在创建组件后立即运行，然后跟踪全部依赖关系
    watchEffect(doCompute)
  }

  return { scrollColor }
}
