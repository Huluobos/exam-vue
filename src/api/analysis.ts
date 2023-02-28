import { Request } from '@/util/request';
import exam from "@/router/modules/exam";

// @ts-ignore
const {VITE_GLOB_API_URL} = process.env


/**
 * 获取所有科目
 * @param examId
 */
export function getAllSubjectsApi(examId: string) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/getAllSubjects',
    method: 'get',
    params: {
      examId: examId
    },
  })
}
/**
 * 获取所有科目
 * @param examId
 */
export function getAllPaperSubjectsApi(examId: string) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/getAllPaperSubjects',
    method: 'get',
    params: {
      examId: examId
    },
  })
}
/**
 * 分数段 名次段 百分比段 查询
 * @param data
 */
export function getScoreSegmentResultApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/getScoreSegmentResult',
    method: 'get',
    params: data,
  })
}

export function getManyRate(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/manyRate',
    method: 'post',
    params: data,
  })
}
export function saveAllThreeRateSetting(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/saveAllThreeRateSetting',
    method: 'post',
    data,
  })
}

/**
 * 分数段 名次段 百分比段 设置查询
 * @param data
 */
export function getSchoolAllSubSegmentApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/schoolAllSubSegment',
    method: 'get',
    params: data,
  })
}

/**
 * 获取过滤学生
 * @param data
 */
export function findFilterStudent(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/listFilterStudent',
    method: 'post',
    params: data,
  })
}


/**
 * 添加过滤学生
 * @param data
 */
export function addFilterStudent(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/addFilterStudent',
    method: 'post',
    data
  })
}


/**
 * 删除
 * @param data
 */
export function deleteFilterStudent(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/deleteFilterStudent',
    method: 'post',
    params: data,
  })
}


/**
 * 下载模板
 * @param data
 */
export function downloadTemp() {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/downloadTemp',
    method: 'post',
    responseType: 'blob'
  })
}

/**
 * 下载赋分设置模板
 * @param data
 */
export function downloadScoreSetTemp() {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/student/downloadScoreSetTemp',
    method: 'post',
    responseType: 'blob'
  })
}

/**
 * 获取等级设置
 * @param data
 */
export function gradeScoreJunior(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/level/gradeScoreJunior',
    method: 'post',
    data
  })
}

/**
 * 获取等级设置
 * @param data
 */
export function saveGradeScoreJunior(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/level/saveGrade',
    method: 'post',
    data
  })
}

export function saveAnotherSubSet(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/level/saveAnotherSubSet',
    method: 'post',
    data
  })
}

/**
 * 删除单个配置
 * @param data
 */
export function deleteSegmentApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/deleteSegment',
    method: 'post',
    params: data,
  })
}


/**
 * 添加 赋分设置 等级
 * @param data
 */
export function saveGradeScoreSet(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/scoreSet/addSd',
    method: 'post',
    data
  })
}

/**
 * 添加 赋分设置 学考
 * @param data
 */
export function saveGradeScoreSetXue(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/scoreSet/addXue',
    method: 'post',
    data
  })
}

/**
 * 获取 赋分设置
 * @param data
 */
export function queryGradeScoreSet(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/scoreSet/getScoreSet',
    method: 'post',
    data
  })
}

export function deleteSubScoreSet(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/scoreSet/deleteSubScoreSet',
    method: 'post',
    data
  })
}



export function saveAnotherSubScoreSet(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/level/saveAnotherSubScoreSet',
    method: 'post',
    data
  })
}

/**
 * 删除所有配置
 * @param data
 */
export function deleteAllShareSegmentApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/deleteAllShareSegment',
    method: 'post',
    params: data,
  })
}

/**
 * 设置默认指标
 * @param data
 */
export function setDefaultSegmentApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/defaultSegment',
    method: 'post',
    params: data,
  })
}

/**
 * 设置默认指标
 * @param data
 */
export function saveSegmentApi(examId:any, data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/saveSegment?examId='+examId,
    method: 'post',
    data: data,
  })
}

/**
 * 按科目查找试卷分析结果
 * @param data
 */
export function findPaperResultApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/situation/findPaperResult',
    method: 'get',
    params: data,
  })
}

/**
 * 导出一分多率
 * @param query
 */
export function exportManyRate(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/exportManyRate',
    method: 'post',
    params: query,
    responseType: 'blob'
  })
}

/**
 * 获取所有科目
 * @param examId
 */
export function baseSetting(examId: string) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/baseSetting',
    method: 'get',
    params: {
      examId: examId
    },
  })
}
export function conversionApi(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/conversion',
    method: 'post',
    params: query
  })
}
export function cancelConApi(subId: string,examId:string) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/cancelCon',
    method: 'post',
    params: {
      subjectId: subId,
      examId: examId
    },
  })
}
export function changeExamApi(query: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/changeExam',
    method: 'post',
    params:query,
  })
}
export function deleteSub(examId:any,subId: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/delete',
    method: 'post',
    params:{
      examId:examId,
      subjectId:subId
    },
  })
}
export function scoreMerge(data :any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/scoreMerge',
    method: 'post',
    data,
  })
}
export function scoreMergeRanking(data :any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/scoreMergeRanking',
    method: 'post',
    data,
  })
}
export function scoreMergeX(data :any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/analysis/scoreMergeX',
    method: 'post',
    data,
  })
}

export function getQuesKnowAbility(examId: string,subId:string) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/situation/getQuesKnowAbility',
    method: 'post',
    params: {
      subId: subId,
      examId: examId
    },
  })
}
/**
 * 设置默认指标
 * @param examId
 */
export function exportQuesKnowAbility(examId:string) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/situation/excelExport/quesKnowAbility',
    method: 'post',
    params: {
      examId: examId
    },
    responseType: 'blob'
  })
}

/**
 * 导出知识点分析
 * @param examId
 */
export function exportPaperKnowledge(examId:string,classType:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/knowledge/excelExport/paperKnowledge',
    method: 'post',
    params: {
      examId: examId,
      classType:classType
    },
    responseType: 'blob'
  })
}
/**
 * 导出知识点分析
 * @param examId
 */
export function exportPaperAbility(examId:string,classType:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/ability/excelExport/paperAbility',
    method: 'post',
    params: {
      examId: examId,
      classType:classType
    },
    responseType: 'blob'
  })
}

export function findResultBySubNameAndQue(examId: string,subId:string,classType:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/knowledge/findResultBySubNameAndQue',
    method: 'post',
    params: {
      subId: subId,
      examId: examId,
      classType:classType
    },
  })
}
export function findAbiResultBySubNameAndQue(examId: string,subId:string,classType:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/ability/findResultBySubNameAndQue',
    method: 'post',
    params: {
      subId: subId,
      examId: examId,
      classType:classType
    },
  })
}
export function findQuesTypeResult(examId: string,subId:string,classType:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/quesType/findQuesTypeResult',
    method: 'post',
    params: {
      subId: subId,
      examId: examId,
      classType:classType
    },
  })
}

export function queryKnowByPeriodSubNameApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/question/queryKnowByPeriodSubName',
    method: 'get',
    params: data,
  })
}

export function queryAbilityByPeriodSubNameApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/question/queryAbilityByPeriodSubName',
    method: 'get',
    params: data,
  })
}

export function saveQuesKnowRelationshipApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/question/saveQuesKnowRelationship',
    method: 'post',
    data,
  })
}

export function saveQuesAbilityRelationshipApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/question/saveQuesAbilityRelationship',
    method: 'post',
    data,
  })
}

export function saveQuesTypeSetApi(data:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/question/saveQuesTypeSet',
    method: 'post',
    data,
  })
}
export function analysisKnowAbi(examId: string,subId:string) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/question/analysisKnowAbi',
    method: 'post',
    params: {
      subId: subId,
      examId: examId
    },
  })
}
/**
 * 导出知识点分析
 * @param examId
 */
export function exportPaperQuesType(examId:string,classType:any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/quesType/excelExport',
    method: 'post',
    params: {
      examId: examId,
      classType:classType
    },
    responseType: 'blob'
  })
}