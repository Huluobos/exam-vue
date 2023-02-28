import {Request} from '@/util/request';

const {VITE_GLOB_API_URL} = process.env


export function getBatchInfos(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/batchInfos',
    method: 'post',
    params: query,
  })
}

export function getClassScanDetail(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/classScanDetailApi',
    method: 'post',
    params: {
      examId: query.examId,
      subName: query.subName,
      examType: query.examType,
      className: query.className,
      schoolId: query.schoolId,
    },
  })
}

export function batchStatistics(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/batchStatistics',
    method: 'post',
    params: query,
  })
}

export function classScanDetail(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/classScanDetail',
    method: 'post',
    params: query,
  })
}

export function errorInfos(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/errorInfos',
    method: 'post',
    params: query,
  })
}

export function deleteErrorInfo(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/deleteErrorInfo',
    method: 'post',
    params: query,
  })
}

export function getNotUploadStuds(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/getNotUploadStuds',
    method: 'post',
    params: query,
  })
}

export function getMissExamStudsApi(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/getMissExamStuds',
    method: 'post',
    params: {
      examId: query.examId,
      schoolId: query.schoolId,
      subName: query.subName,
      className: query.className,
      page: query.page,
      size: query.limit
    },
  })
}

export function getExamStuImgsByType(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/getExamStuImgsByType',
    method: 'post',
    params: query
  })
}

export function changeStudImgStatus(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/changeStudImgStatus',
    method: 'post',
    params: query,
  })
}

export function studentDetailExport(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/excelExport/studentDetail',
    method: 'post',
    params: query,
    responseType: 'blob'
  })
}
