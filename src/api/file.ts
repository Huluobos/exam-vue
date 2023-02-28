// https://www.521ke.com/manager/cardImage/imageUpload?r=n
import { Request } from '@/util/request';

// @ts-ignore
const {VITE_TINY_FILE_URL, VITE_GLOB_API_URL} = process.env

export function imageUpload(data: any) {
  return Request.axiosInstance({
    url: VITE_TINY_FILE_URL + '/manager/cardImage/imageUpload?r=n',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export const updateTeachFileUpload = VITE_GLOB_API_URL + '/newexam/student/updateTeach'

export const updateStusentExamNoUpload = VITE_GLOB_API_URL + '/newexam/baseExam/importUpdateStudentNo'

export const importFilterStudent = VITE_GLOB_API_URL + '/newexam/student/importFilterStudents'

export const importScoreSet = VITE_GLOB_API_URL + '/newexam/student/importScoreSet'

/**
 * 参数：
 * examId
 */
export const importPaperStudentResult = VITE_GLOB_API_URL + '/newexam/situation/importNewPaperStudentResult'
