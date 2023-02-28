import {Request} from '@/util/request';
const {VITE_GLOB_API_URL } = process.env


export function getAllMarkingListApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/getAllMarkingList',
    method: 'post',
    params: data,
  })
}
