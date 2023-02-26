/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from 'vue'
import type { SearchParams, PageInfo } from '@/api/common/model'
import CommonApi from '@/api/common'
import { listData } from '@/pages/post/data'

// 注意：分页时 offset 采用的是数据行偏移量，非第几页，需根据后台接口调整
export default function usePager<Model>(model: string) {
  const list: Ref<Array<Model>> = ref([])
  const pager = reactive({
    params: {} as SearchParams,
    status: 'loadmore',
    total: 0,
    offset: 0,
    limit: 10,
  })

  const loadData = async (params: any) => {
    let res = {} as PageInfo<Model>
    pager.status = 'loading'
    pager.params = unref(params)
    try {
      if (model == 'demo') {
        res = await addRandomData() // 模拟分页 api
      } else {
        res = await CommonApi.queryList(model, unref(params))
      }
    } catch (e) {
      pager.status = 'loadmore'
      uni.stopPullDownRefresh()
      return
    }

    list.value.push(...res.records)
    pager.total = res.total
    if (list.value.length >= pager.total) {
      pager.status = 'nomore'
    } else {
      pager.status = 'loadmore'
    }
    uni.stopPullDownRefresh() // 结束下拉刷新时需要
  }

  // 获取更多
  const loadMore = () => {
    if (pager.status == 'loadmore') {
      pager.offset = list.value.length // 此处为数据行偏移量，非第几页
      // console.log(JSON.stringify(pager.params.kwargs.domain))
      loadData(pager.params)
    }
  }

  // 模拟分页
  const addRandomData = () => {
    return new Promise<any>(function (resolve, reject) {
      const result: any = { total: 20, records: [] }
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          const index = uni.$u.random(0, listData.length - 1)
          const item = JSON.parse(JSON.stringify(listData[index]))
          item.id = uni.$u.guid()
          result.records.push(item)
        }
        resolve(result)
      }, 600)
    })
  }

  return {
    list,
    pager,
    loadData,
    loadMore,
  }
}
