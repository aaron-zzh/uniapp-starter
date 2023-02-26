import { defineStore } from 'pinia'
// 小程序不支持！！
import { useMediaControls } from '@vueuse/core'

export const useVideoPlayer = defineStore('video', () => {
  const videoElement = ref<HTMLVideoElement>()
  const src = ref('/static/video/r.mp4')
  const { playing, volume, currentTime, togglePictureInPicture } = useMediaControls(videoElement, { src })

  function loadVideo(element: HTMLVideoElement, url: string) {
    videoElement.value = element
    if (url) {
      src.value = url
    }
  }

  return {
    src,
    playing,
    volume,
    currentTime,
    loadVideo,
    togglePictureInPicture,
  }
})
