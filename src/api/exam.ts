import { Request } from '@/util/request';

// @ts-ignore
const {VITE_GLOB_API_URL} = process.env


/**
 * 考试任务列表
 * @param data
 */
export function findBySchoolGradeAndType(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/findBySchoolGradeAndType',
    method: 'post',
    params: data,
  })
}

/**
 * 新增考试
 * @param data
 */
export function saveOrUpdateExam(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/saveOrUpdateConfig',
    method: 'post',
    data,
  })
}


/**
 * 编辑考试
 * @param data
 */
export function UpdateExam(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/updateConfig',
    method: 'post',
    data,
  })
}

/**
 * 删除考试任务
 * @param data
 */
export function deleteExamById(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/deleteConfigById',
    method: 'post',
    data,
  })
}

/**
 *  查询考试信息
 * @param datagetExamMessageById
 */
export function getExamMessageById(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/getExamMessageById',
    method: 'post',
    params: {
      examId: data
    },
  })
}

/**
 *  查询科目
 * @param data
 */
export function findSubBySchoId(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/eExam/findSubBySchoId',
    method: 'post',
    params: {
      gradeType: data
    },
  })
}

/**
 *  查询科目
 * @param data
 */
export function findSubByExamId(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/eExam/findSubByExamId',
    method: 'post',
    params: {
      examId: data
    },
  })
}

/**
 *  查询科目
 * @param data
 */
export function findSubListByExamId(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/eExam/findSubListByExamId',
    method: 'post',
    params: {
      examId: data
    },
  })
}


/**
 *  查询科目
 * @param data
 */
export function findRepublicSubListByExamId(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/eExam/findRepublicSubListByExamId',
    method: 'post',
    params: {
      examId: data
    },
  })
}


/**
 *  查询科目
 * @param data
 */
export function findnotTotalSubListByExamId(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/eExam/findNotTotalSubListByExamId',
    method: 'post',
    params: {
      examId: data
    },
  })
}

/**
 *  查询等级科目
 * @param data
 */
export function findLevelRepublicSubListByExamId(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/eExam/findLevelRepublicSubListByExamId',
    method: 'post',
    params: {
      examId: data
    },
  })
}


/**
 *  查询班级
 * @param data
 */
export function findClassBySchoId(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/findClassBySchoId',
    method: 'post',
    params: {
      gradeType: data
    },
  })
}


/**
 * 获取考试进程
 * @param data
 */
export function findExamProgressList(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/findExamProgressList',
    method: 'post',
    params: data,
  })
}

/**
 * 获取考试进程
 * @param data
 */
export function findExamStudent(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/findExamStudentList',
    method: 'post',
    params: data,
  })
}

/**
 * 获取考生信息
 * @param data
 */
export function findStuMessageList(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/findStuMessageList',
    method: 'post',
    params: data,
  })
}


/**
 * 下载模板
 * @param data
 */
export function downloadTemp(examId: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/downloadTemp',
    params: {
      examId: examId
    },
    method: 'post',
    responseType: 'blob'
  })
}

/**
 * 添加学生
 * @param data
 */
export function addExamStudentApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/addExamStudentWithSubs',
    method: 'post',
    data
  })
}

/**
 * 修改班级
 * @param data
 */
export function updateStudentClass(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/modifyClass',
    method: 'post',
    data
  })
}

/**
 * 题块关联试题
 * @param data
 */
export function areaRelationQuesApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/areaRelationQues',
    method: 'post',
    data
  })
}

/**
 * 查询所有题块
 * @param data
 */
export function getAllQuesAreaApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/taskAllArea',
    method: 'get',
    params: data
  })
}

/**
 * 添加题块
 * @param data
 */
export function addQuesAreaApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/addQuesArea',
    method: 'get',
    params: data
  })
}

/**
 * 删除题块
 * @param data
 */
export function deleteQuesAreaApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/deleteQuesArea',
    method: 'post',
    data
  })
}

/**
 * 合并试题打分
 * @param data
 */
export function mergeQuesScoreApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/mergeQuesScore',
    method: 'post',
    data
  })
}

/**
 * 取消合并
 * @param data
 */
export function unmergeQuesScoreApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/unmergeQuesScore',
    method: 'post',
    data
  })
}

/**
 * 一题一块
 * @param data
 */
export function oneQuesOneAreaGenApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/oneQuesOneAreaGen',
    method: 'get',
    params: data
  })
}

/**
 * 更新题块名称
 * @param data
 */
export function changeQuesAreaNameApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/changeQuesAreaName',
    method: 'get',
    params: data
  })
}

/**
 * 判断是否有主观题
 * @param data
 */
export function checkSubjectQuesApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/checkSubjectQues',
    method: 'get',
    params: {
      examId: data.examId,
      subName: data.subName
    }
  })
}

/**
 * 设置步骤
 * @param data
 */
export function setStepApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/setStep',
    method: 'post',
    params: {
      subjectId: data.subjectId,
      step: data.step,
      canBeBack: data.canBeBack
    }
  })
}

/**
 * 修改考生考号
 * @param data
 */
export function updateStuExamNo(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/updateExamNo',
    method: 'post',
    params: data,
  })
}

/**
 * 删除
 * @param data
 */
export function deleteStuInfo(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/delStuByIdAndAllSubs',
    method: 'post',
    params: data,
  })
}

/**
 * 客观题列表
 * @param data
 */
export function queryKeGuan(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/getQuesSplitInfo',
    method: 'post',
    params: data,
  })
}

/**
 * 客观题列表
 * @param data
 */
export function updateMarkAreaInfos(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/updateMarkAreaInfos',
    method: 'post',
    data
  })
}


/**
 * 查询阅卷任务分配信息
 * @param data
 */
export function findMarkTaskListApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/findMarkTaskList',
    method: 'post',
    params: data
  })
}

/**
 * 查询全部阅卷老师
 * @param data
 */
export function getSchoolTeachersApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/teacherManager/getSchoolTeachers',
    method: 'post',
    data
  })
}
/**
 * 更新阅卷状元
 * @param params
 */
export function updOpenTaskPaperApi(params: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/updOpenTaskPaper',
    method: 'post',
    params: params
  })
}

/**
 * 查询阅卷状态和成绩状态
 * @param params
 */
export function listByExamIdAndSubNameApi(params: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/listByExamIdAndSubName',
    method: 'post',
    params: params
  })
}

/**
 * 更新评分设置
 * @param examId
 * @param data
 */
export function updateQuesMarkTypeAndTeacherApi(examId: String,data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/updateQuesMarkTypeAndTeacher',
    method: 'post',
    params: {
      examId: examId
    },
    data
  })
}

/**
 * 更新题块相关信息
 * @param examId
 * @param data
 */
export function updQuesAreaInfoApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/updQuesAreaInfo',
    method: 'post',
    data
  })
}

/**
 * 批量更新客观题答案
 * @param examId
 * @param data
 */
export function updQuesAnswerApi(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/updQuesAnswerApi',
    method: 'post',
    data,
  })
}

/**
 * 更新阅卷老师
 * @param areaId
 * @param arbiTeacType
 * @param data
 */
export function updateQuesAreaTaskTeacherApi(areaId: string,arbiTeacType: number, data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/updateQuesAreaTaskTeacher',
    method: 'post',
    params: {
      areaId: areaId,
      arbiTeacType: arbiTeacType
    },
    data
  })
}

/**
 * 更新阅卷老师
 * @param param
 */
export function findClassTeacherListApi(param:object) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/findClassTeacherList',
    method: 'post',
    params: param
  })
}

/**
 * 获取上传试卷总数和学生总数
 * @param param
 */
export function getDetailStatisticsApi(param:object) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/getDetailStatistics',
    method: 'post',
    params: param
  })
}

/**
 * 批量更新全部信息
 * @param data
 * @param params
 */
export function updQuesAreaListApi(data: object, params:object) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/marking/updQuesAreaList',
    method: 'post',
    params: params,
    data
  })
}

/**
 * 更新学科组长
 * @param data
 * @param params
 */
export function saveSubLeaderApi(data: object, params:object) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/teacherManager/saveSubLeader',
    method: 'post',
    params: params,
    data
  })
}

/**
 * 查询学科组长
 * @param params
 */
export function findSubLeaderApi(params:object) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/teacherManager/findSubLeader',
    method: 'post',
    params: params
  })
}


/**
 * 添加客观题
 * @param data
 */
export function adKeQuestion(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/saveMarkAreaInfos',
    method: 'post',
    params: data,
  })
}

/**
 * 添加选做题
 * @param data
 */
export function addChooseQuestion(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/saveChoiceData',
    method: 'post',
    params: data,
  })
}

/**
 * 添加小题
 * @param data
 */
export function addsmallQuestionData(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/saveSmallData',
    method: 'post',
    params: data,
  })
}


/**
 * 删除客观题
 * @param data
 */
export function deleteKeQuestion(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/deleteMarkAreaInfos',
    method: 'post',
    params: data,
  })
}

/**
 * 设置评分标准
 * @param data
 */
export function chooseSet(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/saveChooseSet',
    method: 'post',
    params: data,
  })
}

/**
 * 设置评分标准
 * @param data
 */
export function chooseSetInfo(data: any) {
  return Request.axiosInstance({
    url: VITE_GLOB_API_URL + '/newexam/baseExam/chooseSetInfo',
    method: 'post',
    params: data,
  })
}
