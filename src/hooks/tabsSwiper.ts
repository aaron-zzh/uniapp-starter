/* eslint-disable @typescript-eslint/no-explicit-any */
export default function useTabsSwiper() {
  const tabCurrent = ref(0)
  const swiperCurrent = ref(0)
  const tabsRef = ref(null)
  const tabsChange = (index: number): any => {
    swiperCurrent.value = index
  }

  const transition = (e: { detail: { dx: any } }): any => {
    const dx = e.detail.dx
    tabsRef.value.setDx(dx)
  }

  const animationfinish = (e: { detail: { current: any } }) => {
    const cur = e.detail.current
    tabsRef.value.setFinishCurrent(cur)
    swiperCurrent.value = cur
    tabCurrent.value = cur
  }

  return {
    tabsRef,
    tabCurrent,
    swiperCurrent,
    tabsChange,
    transition,
    animationfinish,
  }
}
