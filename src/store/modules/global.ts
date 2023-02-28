
import { defineStore } from 'pinia'
import { store } from '@/store'



export const globalStore = defineStore({
  id: 'global',
  state: () => ({
    activeIndex: <string>'/',
   
  }),
  getters: {
    // this 指向  state
    getActiveIndex(): any {
      return this.activeIndex
    },
  },
  actions: {
    setActiveIndex(data: any) {
      this.activeIndex = data ? data : ''
    },

  }
})

export function globalStoreWithOut() {
  return globalStore(store);
}
