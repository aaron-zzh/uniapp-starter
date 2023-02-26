import useLoading from '@/hooks/loading'
import { isLogin } from '@/utils/public'
import CommonApi from '@/api/common'

export default function useFavor(modelName: string) {
  const { loading, setLoading } = useLoading()

  const toggle = async (id: number) => {
    if (!isLogin()) {
      uni.$u.toast('请先登录')
      return
    }

    if (loading.value) {
      uni.$u.toast('请先稍后操作')
      return
    }
    setLoading(true)
    try {
      const res = await CommonApi.toggleFavor(modelName, id)
      setLoading(false)
      return res.favourite
    } catch {
      setLoading(false)
    }
  }

  return {
    toggle,
  }
}
