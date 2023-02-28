import {Request} from '@/util/request';
const {VITE_GLOB_API_URL } = process.env


// enum Api {
//   Login = '/login',
//   Logout = '/logout'
// }

export function loginApi(parameter: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/sso/doAjaxLogin',
    method: 'post',
    params: {
      userName: parameter.userName,
      password: parameter.password,
      notToken:true,
    },
    
  })
}

export function getUserInfoApi(params:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/sso/getUserInfo',
    method: 'get',
    params,
  })
}


export function logoutApi() {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/sso/doLogout',
    method: 'post',
  })
}



export function changePassApi(params:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/users/changepass',
    method: 'post',
    params,
  })
}

export function loginAsApi(params:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/users/loginAs',
    method: 'post',
    params,
  })
}


// export function doLogout() {
//   return http.get({ url: Api.Logout });
// }

