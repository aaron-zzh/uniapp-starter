/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from 'vue'
import type { SearchParams, PageInfo } from '@/api/common/model'
import CommonApi from '@/api/common'
export const listData = [
  {
    id: '1',
    author_id: {
      name: '张三',
      expertise: '擅长业务',
      icon: '',
    },
    tag_ids: [{ name: '标签' }],
    name: '标题1',
    content:
      '山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？',
    view_count: 10,
  },
  {
    id: '2',
    author_id: {
      name: '李四',
      expertise: '擅长业务: 心理咨询',
      icon: '',
    },
    tag_ids: [{ name: '标签' }],
    name: '标题1',
    content:
      '山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？',
    view_count: 10,
  },
]

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
      pager.params.kwargs.offset = list.value.length
      loadData(pager.params)
    }
  }

  // 模拟分页
  const addRandomData = () => {
    return new Promise<any>(function (resolve) {
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
