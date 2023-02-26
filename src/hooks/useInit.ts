import { parseUrl } from '@/utils/public'

export function useInit() {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const { fullPath } = page.$page
  const { name: pageName, path: pagePath, query: pageQuery } = parseUrl(fullPath)
  onShow(() => {
    console.log('Page Show in hooks ==', pagePath)
  })
  onHide(() => {
    console.log('Page Hide in hooks ==')
  })
  return {
    pageName,
    pagePath,
    pageQuery,
  }
}
