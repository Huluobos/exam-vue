import {Request} from "@/util/request";

const {VITE_GLOB_API_URL} = process.env

export function getCurrentOrDefaultSettingApi(grade:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/basicSetting/getCurrentOrDefault',
    method: 'get',
    params: {grade:grade}
  })
}

export function saveSettingApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/basicSetting/saveOrUpdate',
    method: 'post',
    data: data
  })
}
