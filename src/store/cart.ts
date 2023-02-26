// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const rawItems = ref([])

  const items = () => {
    return rawItems.value.reduce((items, item) => {
      const existingItem = items.find((it) => it.name === item)

      if (!existingItem) {
        items.push({ name: item, amount: 1 })
      } else {
        existingItem.amount++
      }

      return items
    }, [])
  }

  const addItem = (name: string) => {
    rawItems.value.push(name)
  }

  const removeItem = (name: string) => {
    const i = rawItems.value.lastIndexOf(name)
    if (i > -1) rawItems.value.splice(i, 1)
  }

  const purchaseItems = async () => {
    const user = useUserStore()
    if (!user.name) return

    console.log('Purchasing', items())
    const n = items().length
    rawItems.value = []
    return n
  }

  return { rawItems, addItem, removeItem, purchaseItems }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
