
import { defineStore } from 'pinia'
import { store } from '@/store'
import {loginApi } from '@/api/user'
import { setCookieMsgToken, getCookieToken, setCookieToken, removeToken,
  removeUserInfoCookies,getUserInfoCookies,setUserInfoCookies,
  setRefreshToken, removeRefreshToken, removeMsgToken } from '@/util/auth'


// 用户登陆状态
interface UserState {
  userInfo?: any;
  token?: string;
}

interface LoginParams {
  userName: string;
  password: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: getUserInfoCookies(),
    token: getCookieToken(),
  }),
  getters: {
    // this 指向  state
    getUserInfo(): any {
      return  this.userInfo
    },
    getToken():  string | any{
      return this.token
    },
  },
  actions:{
    setToken(info: string | undefined) {
      this.token = info ? info : ''
      setCookieToken(info)
    },
    setUserInfo(info: any | null) {
      this.userInfo = info ? info : ''
      setUserInfoCookies(info)
    },
    resetState() {
      removeToken()
      removeUserInfoCookies()
      removeMsgToken()
      this.userInfo = null
      this.token = ''
    },

    async login( params: LoginParams):Promise<any>{
      try{
        const res = await loginApi(params)
        // @ts-ignore
        const {success, data} = res
        if (success) {
          this.setUserInfo(data.curUser)
          this.setToken(data.token)
          setCookieMsgToken(data.msgToken)
        }
        return Promise.resolve(res);
      }catch(error){
        return Promise.reject(error);
      }
    },
    async logout() {
      if (this.getToken) {
        try {
          // 注销token接口
          // await doLogout();

          this.resetState();
          return Promise.resolve();
        } catch {
          console.log('注销Token失败');
          return Promise.reject();
        }
      }

    },

  }
})
// 暴露并使用
//   import { useUserStoreWithOut } from '/@/store/modules/user'
//     const userStore = useUserStoreWithOut()
//    userStore.getToken 或  userStore.getToken()
export function useUserStoreWithOut() {
  return useUserStore(store);
}
