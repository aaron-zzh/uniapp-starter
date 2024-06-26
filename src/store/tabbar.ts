import { defineStore, acceptHMRUpdate } from 'pinia'

// 组合式 store
const useTabbarStore = defineStore('tabbar', () => {
  const tabbar = [
    {
      iconPath: '/static/images/tabbar/home.png',
      selectedIconPath: '/static/images/tabbar/home-1.png',
      text: '首页',
      pagePath: '/pages/tabbar/home/index',
    },
    {
      iconPath: '/static/images/tabbar/post.png',
      selectedIconPath: '/static/images/tabbar/post-1.png',
      text: '动态',
      midButton: true,
      pagePath: '/pages/tabbar/post/index',
    },
    {
      iconPath: '/static/images/tabbar/me.png',
      selectedIconPath: '/static/images/tabbar/me-1.png',
      text: '我的',
      count: 2,
      isDot: true,
      pagePath: '/pages/tabbar/me/index',
    },
  ]
  return { tabbar }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTabbarStore, import.meta.hot))
}

export default useTabbarStore
