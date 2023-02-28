import { Request } from '@/util/request';
// @ts-ignore
const { VITE_GLOB_API_URL } = process.env

export function getSubjectProcessInfoApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/subject/getSubjectProcessInfo',
    method: 'post',
    params: data,
  })
}

export function updateSubjectSheetCardTypeApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/subject/updateSubjectSheetCardType',
    method: 'post',
    params: data,
  })
}

/**
 * 获取一个科目的阅卷进度
 * @param data
 */
export function getMarkScheduleApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/subject/getMarkSchedule',
    method: 'get',
    params: {
      examId: data.examId,
      subName: data.subName,
      specType: data.specType,
    },
  })
}

/**
 * 获取多个科目的阅卷进度
 * @param data
 */
export function getMarkSchedulesApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/subject/getMarkSchedules',
    method: 'post',
    data,
  })
}

export function listBasicStudentBySubIdApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/listStudent',
    method: 'post',
    params: data,
  })
}

export function modifyTeachClassApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/modifyTeachClass',
    method: 'post',
    data,
  })
}

export function updateExamNoApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/updateExamNo',
    method: 'post',
    data,
  })
}

export function setSignApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/marking/setSign',
    method: 'post',
    data,
  })
}

export function getTeachClassNameListApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/getTeachClassInfo',
    method: 'get',
    params: data
  })
}

export function getClassNameListApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/getTeachClassInfo',
    method: 'get',
    params: data
  })
}

export function postResExcelDownloadApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/updateTeachSingleTemp',
    data,
    method: 'post',
    responseType: 'blob'
  })
}

export function delStudentApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/basic/delStudent',
    method: 'post',
    params: {
      examStudId: data
    }
  })
}

export function addExamBasicStudentApi(data:any, subjectId:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/basic/addExamStudent',
    method: 'post',
    data,
    params: {
      subjectId: subjectId
    }
  })
}

export function basicStudentTipsApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/basic/studentFeatures/studentTips',
    method: 'get',
    params: data
  })
}
export function studentTipsByStudNo(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/basic/studentFeatures/studentTipsByStudNo',
    method: 'get',
    params: data
  })
}

export function basicStudentTipsByExamNoApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/basic/studentFeatures/studentTipsByExamNo',
    method: 'get',
    params: data
  })
}

export function newBasicStudentTipsByExamNoApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/basic/studentFeatures/newFindStuByLikeExamNo',
    method: 'get',
    params: data
  })
}

export function basicStudentTipsByStudentNameApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/basic/studentFeatures/studentTipsByStudentName',
    method: 'get',
    params: data
  })
}

export function calculateScoreApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/calculateScore',
    method: 'post',
    params: {
      examId: data.examId,
      subId: data.subId
    },
  })
}

/**
 * 判断是否有主观题，是否可以点亮状态
 * @param data
 */
export function checkSubjectQuesApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/subject/checkSubjectQues',
    method: 'post',
    params: {
      examId: data.examId,
      subName: data.subName
    },
  })
}

/**
 * examId
 * subName
 * model 1 先扫后阅 2 先阅后扫 3 小题分导入
 * @param data
 */
export function updateSubjectExamTypeApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/subject/updateSubjectExamType',
    method: 'post',
    params: data,
  })
}

