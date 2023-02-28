<template>
  <div>
    <div slot="header">
      <div class="card-title">
        <span class="title">{{ subName }}科目设置</span>
        <span v-if="subjectProcess.step < 3 && subjectProcess.model < 3" class="toggle-btn">
          <img class="img" :src="toggleIcon" alt="">
          <el-link :underline="false" type="primary" class="text" @click="typeChangeVisible = true">切换科目模式</el-link>
        </span>
        <div class="changeScore">
          <div :class="[isPaperStudentResult ? 'left text' : 'left text active']"
          @click="((subjectProcess.model < 3 && subjectProcess.uploadSuccessCount <= 0) || (subjectProcess.model === 3 && subjectProcess.step <= 4)) && changeScore(false)">
            <span class="txt">先扫后阅</span>
          </div>
          <div :class="[isPaperStudentResult ? 'right text active' : 'right text']"
          @click="((subjectProcess.model < 3 && subjectProcess.uploadSuccessCount <= 0) || (subjectProcess.model === 3 && subjectProcess.step <= 4)) && changeScore(true)">
            <span class="txt">导入小题分</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="subjectCard" class="subject-card">
      <div class="item">
        <img class="img" :src="processSuccess" alt="">
      </div>
      <div class="item2">考务人员管理</div>
      <div class="item3">
        <span class="mb-5" style="display: flex;">
          <span class="mr-12" style="width: 98px;">本科目考生总数</span>
          <span class="text-green">{{ subjectProcess.studentCount }}</span>
          <span>人</span>
        </span>
        <span class="mb-5" style="display: flex;">
          <span class="mr-12" style="width: 98px;">本科目班级总数</span>
          <span class="text-green">{{ subjectProcess.classCount }}</span>
          <span>个</span>
        </span>
        <span style="display: flex;">
          <span class="mr-12" style="width: 98px;">教学班总数</span>
          <span class="text-green">{{ subjectProcess.teachClassCount }}</span>
          <span>个</span>
        </span>
      </div>
      <div class="item4">
        <el-button type="primary" style="width: 140px; height: 32px;" @click="goStudentManagement">考生管理</el-button>
      </div>
      <div class="line-bg"></div>
    </div>

    <!--  第三方模式  -->
    <div v-if="subjectProcess.sheetCardType === 0" ref="subjectCard" class="subject-card" :class="'card-dark'">
      <div class="item">
        <img class="img" :src="subjectProcess.step < 2 ? processNotStarted : processSuccess" alt="">
      </div>
      <div class="item2">试卷题块建立</div>
      <div class="item3">
        <span>设置试卷结构及答案</span>
      </div>
      <div class="item4">
        <el-button type="primary" style="width: 140px; height: 32px;" @click="goQuestionStructure">试题结构建立
        </el-button>
      </div>
      <div class="line-bg" :class="subjectProcess.step < 2 ? 'line-bg-info' : ''"></div>
    </div>

    <div v-if="subjectProcess.sheetCardType === 0 && !isPaperStudentResult" ref="subjectCard" class="subject-card">
      <div class="item">
        <img class="img" :src="subjectProcess.step < 3 ? processNotStarted : processSuccess" alt="">
      </div>
      <div class="item2">模版框选制作</div>
      <div class="item3"><span>设置标题、考号、客观题等模板位置</span></div>
      <div class="item4">
        <el-button :disabled="subjectProcess.step < 2" :type="subjectProcess.step < 2 ? 'info' : 'primary'"
          :plain="subjectProcess.step < 2" style="width: 140px; height: 32px;" @click="goMarkTemplate">模板制作
        </el-button>
      </div>
      <div class="line-bg" :class="subjectProcess.step < 3 ? 'line-bg-info' : ''"></div>
    </div>
    <!--  第三方模式结束  -->

    <!--  系统答题卡模式  -->
    <div v-if="subjectProcess.sheetCardType === 1" ref="subjectCard" class="subject-card card-dark">
      <div class="item">
        <img class="img" :src="subjectProcess.step < 2 ? processNotStarted : processSuccess" alt="">
      </div>
      <div class="item2">系统答题卡关联</div>
      <div class="item3">
        <span style="margin-bottom: 18px; display: flex;">
          <span class="mr-10" style="min-width: 126px;">修改试卷结构及答案</span>
          <span class="text-blue text-blue-link">去处理</span>
        </span>
        <span style="display: flex;">
          <span class="mr-10" style="min-width: 126px;">修改模版框选大小</span>
          <span class="text-blue text-blue-link">去处理</span>
        </span>
      </div>
      <div class="item4">
        <el-button type="primary" style="width: 140px; height: 32px;">系统答题卡关联</el-button>
      </div>
      <div class="line-bg" :class="subjectProcess.step < 2 ? 'line-bg-info' : ''"></div>
    </div>
    <!--  系统答题卡模式结束  -->

    <div v-if="!isPaperStudentResult" ref="subjectCard" class="subject-card"
      :class="subjectProcess.sheetCardType === 0 ? 'card-dark' : ''">
      <div class="item">
        <img class="img"
          :src="subjectProcess.step < 4 && subjectProcess.uploadSuccessCount <= 0 ? processNotStarted : processSuccess"
          alt="">
      </div>
      <div class="item2">学生答卷扫描</div>
      <div class="item3">
        <span style="margin-bottom: 18px;">
          <span class="mr-10">已上传学生/参加考试学生</span>
          <span class="text-green">
            {{ subjectProcess.uploadSuccessCount }} / {{ subjectProcess.studentCount }}
          </span>
        </span>
        <span>
          <span style="margin-right: 85px;">缺考学生数量</span>
          <span class="text-green">{{ subjectProcess.absentStudentCount }}</span>
        </span>
      </div>
      <div class="item5">
        <span style="margin-bottom: 18px;">
          <span class="mr-10">未上传学生数量</span>
          <span class="text-green">{{ subjectProcess.notUploadCount }}</span>
        </span>
        <span>
          <span
            :class="subjectProcess.uploadSuccessCount > 0 ? ['text-blue', 'cursor-pointer', 'text-blue-link'] : 'un-click-text'"
            @click="goObjectError">查看扫描明细结果</span>
        </span>
      </div>
      <div class="item4">
        <el-button :disabled="subjectProcess.step < 3" :type="subjectProcess.step < 3 ? 'info' : 'primary'"
          :plain="subjectProcess.step < 3" style="width: 140px; height: 32px;" @click="goScanMonitor">扫描监控
        </el-button>
      </div>
      <div class="line-bg" :class="subjectProcess.step < 4 ? 'line-bg-info' : ''"></div>
    </div>

    <div ref="subjectCard" class="subject-card" :class="subjectProcess.sheetCardType === 0 ? '' : 'card-dark'">
      <div class="item">
        <img class="img"
        v-if="subjectProcess.model!==3"
          :src="(subjectProcess.quesCount <= 0 || subjectProcess.unassignedQuesCount > 0 || subjectProcess.notSelectionQuesCount > 0)
          && !canStepFrom3To5 && subjectProcess.step < 6 ? processNotStarted : processSuccess"
          alt="">
           <img class="img"
           v-else
          :src="subjectProcess.step<3 ?  processNotStarted :processSuccess"
          alt="1111">
      </div>
      <div class="item2">
        {{ isPaperStudentResult ? '题块建立' : '题块与阅卷任务分配' }}
      </div>
      <div class="item3" v-if="!isPaperStudentResult">
        <span style="margin-bottom: 18px;">
          共 <span class="text-green-no-mr">{{ subjectProcess.quesCount }}</span> 个题块,
          <span class="text-green-no-mr">
            {{ subjectProcess.unassignedQuesCount > 0 ? subjectProcess.unassignedQuesCount : 0 }}
          </span> 个题块未分配阅卷,
          <span class="text-green-no-mr">{{ subjectProcess.notSelectionQuesCount }}</span> 个题块未完成框选
        </span>
        <span>
          <span>已完成 </span>
          <span class="text-green">{{ subjectProcess.completedTaskCount }}%</span>
          <span>阅卷任务 </span>
          <span
            :class="subjectProcess.step >= 3 ? ['text-blue-no-mr', 'cursor-pointer', 'text-blue-link'] : 'un-click-text'"
            @click="goMarkDetail">查看阅卷明细</span>
        </span>
      </div>
      <div class="item3" v-else>
        <span style="">
          共 <span class="text-green-no-mr">{{ subjectProcess.quesCount }}</span> 个题块
        </span>
      </div>
      <div class="item4">
        <el-button :disabled="subjectProcess.step < 2" :type="subjectProcess.step < 2 ? 'info' : 'primary'"
          :plain="subjectProcess.step < 2" style="width: 140px; height: 32px;"
          @click="goMarkPaper">{{ isPaperStudentResult ? '题块建立' : '题块与阅卷任务分配' }}
        </el-button>
      </div>
      <div class="line-bg"  v-if="subjectProcess.model!==3"
        :class="(subjectProcess.quesCount <= 0 || subjectProcess.unassignedQuesCount > 0 || subjectProcess.notSelectionQuesCount > 0)
          && !canStepFrom3To5 && subjectProcess.step < 6 ? 'line-bg-info' : ''">
      </div>
       <div v-else class="line-bg"
        :class=" subjectProcess.step<3? 'line-bg-info' : ''">
      </div>
    </div>

    <!-- 小题分导入 start’ -->
    <div v-if="isPaperStudentResult && subjectProcess.model === 3" ref="subjectCard" class="subject-card" :class="'card-dark'">
      <div class="item">
        <img class="img" :src="subjectProcess.step < 5 ? processNotStarted : processSuccess" alt="">
      </div>
      <div class="item2">小题分导入</div>
      <div class="item3">
        <span>{{ subjectProcess.step > 4 ? subjectProcess.step === 6 ? '小题分已导入' : '小题分已导入，请发布成绩' : '小题分未导入，请导入小题分' }}</span>
      </div>
      <div class="item4">
        <el-button :disabled="subjectProcess.step < 4 || subjectProcess.step === 6"
          :type="subjectProcess.step < 4  || subjectProcess.step === 6? 'info' : 'primary'"
          :plain="subjectProcess.step < 4 || subjectProcess.step === 6" style="width: 140px; height: 32px;"
          @click="postPaperStudentResult">导入小题分
        </el-button>
      </div>
      <div class="line-bg" :class="subjectProcess.step > 4 ? '' : 'line-bg-info'"></div>
    </div>
    <!-- 小题分导入 end -->

    <div ref="subjectCard" class="subject-card"
      :class="(subjectProcess.sheetCardType === 0 && !isPaperStudentResult) ? 'card-dark' : ''">
      <div class="item">
        <img class="img" :src="subjectProcess.step < 6 || subjectProcess.step === 7 ? processNotStarted : processSuccess"
          alt="">
      </div>
      <div class="item2">成绩发布</div>
      <div class="item3">
        <span v-if="subjectProcess.step < 6 && subjectProcess.step !== 7">
          成绩未发布
        </span>
        <span v-else>
          {{ subjectProcess.step === 7 ? '成绩未发布' : '成绩已发布' }}
          <span style="color: #4381e5; font-size: 14px; cursor: pointer;" class="text-blue-link" @click="goScoreManage">
            查看成绩页面
          </span>
        </span>
      </div>
      <div class="item4">
        <el-button v-if="subjectProcess.model === 3" :disabled="subjectProcess.step < 5"
          :type="subjectProcess.step < 5 ? 'info' : 'primary'" :plain="subjectProcess.step < 5"
          style="width: 140px; height: 32px;" @click="calculateScore">成绩发布
        </el-button>

        <el-button v-else
          :disabled="subjectProcess.model !== 3 && (subjectProcess.step < 5 || remainNum > 0) && !canStepFrom3To5 && subjectProcess.step < 6"
          :type="subjectProcess.step < 5 && !canStepFrom3To5 ? 'info' : 'primary'"
          :plain="subjectProcess.step < 5 && !canStepFrom3To5" style="width: 140px; height: 32px;"
          @click="calculateScore">成绩发布
        </el-button>
      </div>
    </div>

    <el-dialog width="700px" v-model="typeChangeVisible" title="请选择科目模式" destroy-on-close :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false">
      <template #default>
        <div class="sheet-card-dialog">
          <div class="sheet-card-type system" :class="subjectProcess.sheetCardType === 1 ? 'sel' : ''">
            <img :src="sheetCardSystem" alt="">
          </div>
          <div class="sheet-card-type other" :class="subjectProcess.sheetCardType <= 0 ? 'sel' : ''"
            @click="subjectProcess.sheetCardType = 0">
            <img :src="sheetCardOther" alt="">
          </div>
        </div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="updateSheetCardType(subjectProcess.sheetCardType)">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <score-publish v-model="dialogVisible" :notify-data="notifyData" @visibleChange="dialogVisibleChange"
      @statusChange="statusChange" :queryParam="{ subId: subjectProcess.subId, ...route.query }" :msg="msg"
      :publishStatus="publishStatus"></score-publish>

    <el-dialog width="640px" v-model="PSRVisible" :title="PSRtitle" destroy-on-close>
      <template #default>
        <div class="PSRcontent">
          <p>说明：</p>
          <p>1.客观题题目需填写学生具体选项(如A、B、C、D等)，如无具体选项明细，则只需填分值即可</p>
          <p>2.主观题请直接填入分值</p>
          <p>3.学号不可以重复</p>
        </div>

      </template>
      <template #footer>
        <div class="dialog-footer">
          <div class="footTxt">
            <img class="imgRed" src="@/assets/exam-score/icon-e-3.png" alt="">
            <span class="redTxt">请下载模板，并按模板格式填写后，再导入数据</span>
          </div>
          <el-button @click="downloadTempForPSR()">下载模板</el-button>
          <el-upload ref="uploadFile" class="upload-demo" :action="importPaperStudentResult" :limit="1"
            :on-exceed="handleExceed"
            :headers="headers" :data="uploadData" :before-upload="beforeUploadFunction" :on-success="uploadBtnClick"
            :on-progress="uploadProgress" :show-file-list="false" accept=".xlsx,.xls">
            <el-button type="primary">导入数据</el-button>
          </el-upload>



          <div class="uploadProgress" v-if='PSRUploading >= 0'>
            <el-progress :percentage="PSRUploading" :indeterminate="(PSRUploading >= 0 && PSRUploading < 100)"
              :stroke-width="14" color="#4381E5" />
          </div>
          <div class="uploadProgressIcon" v-if="PSRUploadResult !== 'false'">
            <img v-if="PSRUploadResult === 'success'" src="@/assets/exam-score/icon-e-2.png" alt="">
            <img v-else src="@/assets/exam-score/icon-e-1.png" alt="">
          </div>
          <div class="uploadProgressAbout" v-if="PSRUploadResult === 'error'">
            <p v-for="(key, index) in PSRUploadResultText" v-show="key && key !== null && key !== ''" :key="index + 'p'">{{ key
            }}</p>
          </div>
          <!-- -->
          <div class="successText" v-if="PSRUploadResult === 'success'" >
            导入成功，请至 <span class="text-blue">科目流程</span> 处发布成绩！
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// import { genFileId } from 'element-plus'
// import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

import {
  getMarkScheduleApi,
  getSubjectProcessInfoApi,
  updateSubjectSheetCardTypeApi,
  calculateScoreApi,
  checkSubjectQuesApi
} from '@/api/subject'
import { importPaperStudentResult } from '@/api/file'
import { exportPaperStuResultModelTempApi } from '@/api/scoreManage'
import { updateSubjectExamTypeApi } from '@/api/subject'

import { ElMessage } from 'element-plus'
import { useUserStoreWithOut } from '@/store/modules/user'
import router from '@/router'

// 图标资源引入
import toggleIcon from '@/assets/toggle-icon.png'
import processSuccess from '@/assets/process_success.png'
import processNotStarted from '@/assets/process_not_started.png'
import sheetCardSystem from '@/assets/sheet-card-system.png'
import sheetCardOther from '@/assets/sheet-card-other.png'
import ScorePublish from 'components/ProgressNotify/scorePublish.vue';




type apiType = {
  examId: any,
  subName: any,
  sheetCardType: any
}
const token = useUserStoreWithOut().getToken
const headers = {
  'Authorization': token
}

const userInfo = useUserStoreWithOut().getUserInfo
const route = useRoute()
const examId = route.query.examId
let subName = route.query.subName
let gradeId = route.query.grade
const typeChangeVisible = ref<boolean>(false)
const remainNum = ref<number>(100) // 剩余
const canStepFrom3To5 = ref<boolean>(false)  // 是否能从3跳到5，因为没有主观题，并且已有扫描任务



const data = reactive({
  subjectProcess: {
    step: 0,
    sheetCardType: -1,
    completedTaskCount: '0%',
    subId: '',
    subName: '',
    uploadSuccessCount: 0,
    model: 1
  },
  markScheduleQuery: {
    examId: '',
    subName: '',
    specType: 0
  },
  totalNumVos: [{
    paperTotalNum: 0,
    realTotalNum: 0,
    lostNum: 0,
  }],
  routerParam: {
    examId: ref<any>(''),
    subName: ref<any>(''),
    grade: ref<any>(''),
    subId: ref<any>(''),
    schoolId: ref<any>(''),
  },
  dialogVisible: false,
  notifyData: {},
  msg: {
    objAnswer: null,
    objAnswerNoScore: null,
    multiObjSet: null,
    quesNum: null,
    imgError: null,
  },
  publishStatus: 0,
  uploadData: {
    // 文件上传对象
    uploadData: {},
    examId: ref<any>(''),
    subName: ref<any>(''),
  },
})

const { subjectProcess, markScheduleQuery, totalNumVos, dialogVisible, notifyData, msg, publishStatus, uploadData } = toRefs(data)

/**
 * 切换小题分按钮
 * @param bool
 */
const isPaperStudentResult = ref<boolean>(true) // 是否是小题分导入模式
const PSRVisible = ref<boolean>(false) //小题分导入弹窗 显示隐藏
const PSRUploading = ref<number>(-1) //小题分导入进度条
const PSRUploadResult = ref<string>('false') //导入结果 ‘false’ ‘error’ ‘success’
const PSRUploadResultText = ref<string[]>([]) //导入错误信息
const PSRtitle = ref<string>('导入科目学生答题明细') //导入弹窗标题

// 更改类型 小题分导入/先越后扫
function changeScore(bool: boolean) {
  const params = {
    examId: examId,
    subName: subName,
    model: bool ? 3 : 1 //1 先扫后阅 2 先阅后扫 3 小题分导入
  }
  updateSubjectExamTypeApi(params).then((res: any) => {
    if (res.success) {
      isPaperStudentResult.value = bool
      subjectProcess.value.model = bool ? 3 : 1
      ElMessage.success('修改成功')
      // 重新获取页面数据
      const query = ref<apiType>({
        examId: examId,
        subName: subName,
        sheetCardType: undefined
      })
      getSubjectProcessInfo(query.value)
    } else {
      isPaperStudentResult.value = !bool
      ElMessage.error('修改失败')
    }

  })

}
// 导入小题分按钮 PSRVisible
function postPaperStudentResult() {
  PSRVisible.value = true
  PSRtitle.value = '导入'+ (subName|| subjectProcess.value.subName) +'科目学生答题明细'
  PSRUploading.value = -1
  PSRUploadResult.value = 'false'
  PSRUploadResultText.value = []
}
// 下载模板
function downloadTempForPSR() {
  const params = {
    examId: examId,
    subName: subName,
  }
  exportPaperStuResultModelTempApi(params).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    let fileName = '小题分导入模板'
    link.setAttribute('download', fileName + '.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

const beforeUploadFunction = () => {
  PSRUploading.value = 0
  uploadData.value.examId = examId
  uploadData.value.subName = subName
}
const uploadProgress = (evt: any, file: any, files: any) => {
  PSRUploading.value = Math.floor(evt.percent)
}

const uploadFile = ref() //获取上传dom
const handleExceed = (files: any,)=>{
  uploadFile.value!.clearFiles()
  const file = files[0]
  file.uid = Math.floor(Math.random()*1000 +Math.random()*100 +Math.random()*10+Math.random())
  uploadFile.value!.handleStart(file)
  uploadFile.value!.submit()
}

const uploadBtnClick = (response: any,) => {
  if (response.success) {
    const { emptyScoreError, notExistStu, overScoreError, violationQuesError } = response.data
    if (emptyScoreError.length === 0 && overScoreError.length === 0 && violationQuesError.length === 0 && (notExistStu === '' || notExistStu === undefined || notExistStu === null)) {
      PSRUploadResult.value = 'success'
      PSRUploading.value = 100

      // ElMessage({
      //   message: '小题分导入成功，将在3秒后自动关闭弹窗',
      //   type: 'success',
      //   duration: 4000
      // })

      // setTimeout(() => {
      //   PSRVisible.value = false
      // }, 4000)

      // 重新获取页面数据
      const query = ref<apiType>({
        examId: examId,
        subName: subName,
        sheetCardType: undefined
      })
      getSubjectProcessInfo(query.value)

    } else {
      PSRUploadResult.value = 'error'
      PSRUploading.value = 0
      PSRUploadResultText.value = [...emptyScoreError, ...overScoreError, ...violationQuesError, notExistStu]
    }
  } else {
    PSRUploadResult.value = 'error'
    PSRUploading.value = 0
    PSRUploadResultText.value = [response.message]
  }
  // 清楚文件列表
  // const uploadFile = ref() //获取上传dom
  // uploadFile.value!.clearFiles()
}



/**
 * 获取科目进度信息
 * @param query
 */
function getSubjectProcessInfo(query: any) {
  getSubjectProcessInfoApi(query).then((res: any) => {
    if (res.success) {
      // 判断答题卡类型

      subjectProcess.value = res.data
      if (subjectProcess.value.model > 2) {
        isPaperStudentResult.value = true
        typeChangeVisible.value = false
      } else {
        isPaperStudentResult.value = false
        typeChangeVisible.value = subjectProcess.value.sheetCardType < 0
      }


      if (subjectProcess.value.sheetCardType < 0) {
        subjectProcess.value.sheetCardType = 0
      }
      markScheduleQuery.value.examId = query.examId
      markScheduleQuery.value.subName = query.subName
      getMarkSchedule(markScheduleQuery.value)
      if (subjectProcess.value.step === 3) {
        checkSubjectQues()
      }
      let examInfo = sessionStorage.getItem(examId as string)
      if (examInfo) {
        let parse = JSON.parse(examInfo)
        parse.subId = subjectProcess.value.subId
        parse.subName = subjectProcess.value.subName
        sessionStorage.setItem(parse.id, JSON.stringify(parse))
      }
    } else {
      ElMessage.error('查询失败')
    }
  })
}

/**
 * 更新类型
 * @param type
 */
function updateSheetCardType(type: any) {
  const update = ref<apiType>({
    examId: examId,
    subName: subName,
    sheetCardType: type,
  })
  updateSubjectSheetCardTypeApi(update.value).then((res: any) => {
    if (res.success) {
      ElMessage.success('修改成功 !')
      typeChangeVisible.value = false
    } else {
      ElMessage.error('修改失败 !')
    }
  })
}

/**
 * 获取阅卷进度
 * @param query
 */
function getMarkSchedule(query: any) {
  getMarkScheduleApi(query).then((res: any) => {
    if (res.success) {
      totalNumVos.value = res.totalNumVos
      if (totalNumVos.value.length > 0) {
        let subTotalGiven = 0 //55
        let totalLeaveNum = 0//0
        for (let i = 0; i < totalNumVos.value.length; i++) {
          subTotalGiven += totalNumVos.value[i].paperTotalNum
          totalLeaveNum += totalNumVos.value[i].lostNum
        }
        const subTotalDone = subTotalGiven - totalLeaveNum//55
        const totalNum = subTotalDone + totalLeaveNum//55
        remainNum.value = totalLeaveNum
        subjectProcess.value.completedTaskCount = (subTotalDone * 100 / totalNum).toFixed(2)
        if (res.step && subjectProcess.value.step < res.step) {
          subjectProcess.value.step = res.step
        }
      }
    }
  })
}

/**
 * 计算成绩
 */
function calculateScore() {
  const data = {
    examId: examId,
    subId: subjectProcess.value.subId,
  }
  dialogVisible.value = true
  publishStatus.value = 0
  calculateScoreApi(data).then((res: any) => {
    if (!res.success) {
      if (res.errorCode === 1) {
        msg.value = res.data
        publishStatus.value = 2
      }
    }else{
      msg.value = {
        objAnswer: null,
        objAnswerNoScore: null,
        multiObjSet: null,
        quesNum: null,
        imgError: null,
      }
    }
    const query = ref<apiType>({
      examId: examId,
      subName: subName,
      sheetCardType: undefined
    })
    getSubjectProcessInfo(query.value)
  })
}

/**
 *
 */
function checkSubjectQues() {
  const data = {
    examId: examId,
    subName: subName,
  }
  checkSubjectQuesApi(data).then((res: any) => {
    if (res.success) {
      canStepFrom3To5.value = true
    }
  })
}

function dialogVisibleChange(f: any) {
  dialogVisible.value = f
}

function statusChange(f: any) {
  publishStatus.value = f
}

/*页面跳转相关区域*/
const { routerParam } = toRefs(data)

// 跳转单科学生管理页面
function goStudentManagement() {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subjectProcess.value.subId
  router.push({ name: 'subjectStudentManagement', query: routerParam.value })
}

// 跳转扫描监控
const goScanMonitor = () => {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subjectProcess.value.subId
  routerParam.value.schoolId = userInfo.schoId
  router.push({ name: 'scanMonitor', query: routerParam.value })
}

// 跳转阅卷题块建立
const goMarkPaper = () => {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subjectProcess.value.subId
  routerParam.value.grade = route.query.grade
  sessionStorage.setItem('model', '')
  sessionStorage.setItem('model', JSON.stringify(subjectProcess.value.model))
  router.push({ name: 'markPaper', query: routerParam.value })
}

/* 跳转模板制作 */
function goMarkTemplate() {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subjectProcess.value.subId
  router.push({
    name: 'processTemplate', query: {
      examId: routerParam.value.examId,
      subId: routerParam.value.subId,
      subName: routerParam.value.subName
    }
  })
}

/* 跳转试卷试题结构建立页面 */
function goQuestionStructure() {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subjectProcess.value.subId
  router.push({
    name: 'processObjectiveItem', query: {
      examId: routerParam.value.examId,
      subId: routerParam.value.subId,
      subName: routerParam.value.subName
    }
  })
}

/* 跳转阅卷明细 */
function goMarkDetail() {
  if (subjectProcess.value.step >= 3) {
    routerParam.value.examId = examId
    routerParam.value.subName = subName
    routerParam.value.subId = subjectProcess.value.subId
    router.push({
      name: 'processProcess', query: {
        examId: routerParam.value.examId,
        subId: routerParam.value.subId,
        subName: routerParam.value.subName
      }
    })
  }
}

/* 跳转扫描结果（客观题异常） */
function goObjectError() {
  if (subjectProcess.value.step >= 3 && subjectProcess.value.uploadSuccessCount > 0) {
    routerParam.value.examId = examId
    routerParam.value.subName = subName
    routerParam.value.subId = subjectProcess.value.subId
    router.push({
      name: 'processObjectError', query: {
        examId: routerParam.value.examId,
        subId: routerParam.value.subId,
        subName: routerParam.value.subName
      }
    })
  }
}

/* 成绩页面 */
function goScoreManage() {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subjectProcess.value.subId
  routerParam.value.schoolId = userInfo.schoId
  router.push({
    name: 'processOverview', query: {
      examId: routerParam.value.examId,
      subId: routerParam.value.subId,
      subName: routerParam.value.subName,
      schoolId: routerParam.value.schoolId
    }
  })
}

/*页面跳转区域结束*/
onMounted(() => {

  if (subName) {
    const query = ref<apiType>({
      examId: examId,
      subName: subName,
      sheetCardType: undefined
    })
    getSubjectProcessInfo(query.value)
  }
})

watch(() => dialogVisible, (newVal) => {
  if (!newVal.value) {
    notifyData.value = {}
  }
})

const { proxy }: any = getCurrentInstance()

proxy.$socket.off('notify').on('notify', (res: any) => {
  if (res && res.notifyId === 'calculateScore') {
    notifyData.value = res
  }
});


</script>

<style lang="scss" scoped>
.card-title {
  margin-bottom: 14px;
  height: 22px;

  .title {
    font-size: 16px;
    font-weight: bold;
    color: #202020;
    line-height: 22px;
    margin-right: 20px;
  }

  .toggle-btn {
    line-height: 22px;

    .text {
      width: 93px;
      height: 22px;
      font-size: 14px;
      color: #4381e5;
      line-height: 22px;
    }

    .img {
      width: 20px;
      height: 20px;
      display: inline-block;
    }
  }

  // 小题分切换按钮
  .changeScore {
    float: right;
    margin-top: -5px;
    width: 210px;
    height: 32px;
    line-height: 28px;
    background: #F0F0F0;
    border-radius: 16px;
    padding: 2px;

    cursor: pointer;
    user-select: none;

    .text {
      width: 100px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      color: #808080;
      padding-left: 30px;
      position: relative;
      z-index: 10;
    }

    .left {
      float: left;
      background: url('@/assets/exam-score/icon-1-1.png') 5px 3.5px no-repeat;
      background-size: 20px 20px;
    }

    .right {
      float: right;
      background: url('@/assets/exam-score/icon-2-1.png') 5px 3.5px no-repeat;
      background-size: 20px 20px;
    }

    .left.active {
      color: #4381E5;
      background-color: #FFFFFF;
      background-image: url('@/assets/exam-score/icon-1-2.png');
      background-position: 5px 3.5px;
      background-size: 20px 20px;
      box-shadow: 0px 0px 0px 1px #D5DAE5;
      border-radius: 14px;
      transition-property: color 1s, background-color 1s, background-image 1s;
      transition-timing-function: ease;
    }

    .right.active {
      color: #4381E5;
      background-color: #FFFFFF;
      background-image: url('@/assets/exam-score/icon-2-2.png');
      background-position: 5px 3.5px;
      background-size: 20px 20px;
      box-shadow: 0px 0px 0px 1px #D5DAE5;
      border-radius: 14px;
      transition-property: color 1s, background-color 1s, background-image 1s;
      transition-timing-function: ease;
    }

  }
}

.subject-card {
  background-color: #f8fbff;
  border-radius: 4px;
  width: 1280px;
  height: 100px;
  position: relative;
  margin-bottom: 10px;

  .item {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0, -50%);
    width: 30px;
    height: 30px;

    .img {
      width: 30px;
      height: 30px;
    }
  }

  .item2 {
    margin-left: 70px;
    line-height: 100px;
    font-size: 14px;
    font-weight: bold;
    color: #202020;
  }

  .item3 {
    margin-left: 220px;
    position: absolute;
    top: 50%;
    display: grid;
    transform: translate(0, -50%);
  }

  .item5 {
    margin-left: 520px;
    position: absolute;
    top: 50%;
    display: grid;
    transform: translate(0, -50%);
  }

  .item4 {
    position: absolute;
    right: 0;
    margin-right: 20px;
    top: 50%;
    transform: translate(0, -50%);
  }
}

.card-dark {
  background: #f1f6fd;
}

.sheet-card-dialog {
  display: flex;
  justify-content: center;

  .sheet-card-type {
    width: 270px;
    height: 220px;
    background: #d5dae5;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 250px;
      height: 200px;
    }
  }

  .sel {
    background: #4381e5;
  }
}

.mb-5 {
  margin-bottom: 5px;
}

.mr-12 {
  margin-right: 12px;
}

.text-blue {
  color: #4381e5;
  margin-right: 5px;
  min-width: 35px;
  text-align: center;
}

.text-green {
  color: #00bfa5;
  margin-right: 5px;
  min-width: 35px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}

.text-green-no-mr {
  color: #00bfa5;
  min-width: 35px;
  font-weight: bold;
  font-size: 14px;
}

.text-blue-no-mr {
  color: #4381e5;
  min-width: 35px;
}

.text-blue-link {
  border-bottom: solid 1px #4381e5;
  padding-bottom: 4px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.line-bg {
  width: 2px;
  height: 80px;
  background-color: #4381e5;
  position: absolute;
  z-index: 1;
  top: 65px;
  left: 34px;
}

.line-bg-info {
  background-color: #c2c2c2;
}

.un-click-text {
  color: #c2c2c2;
  cursor: not-allowed;
}

.PSRcontent {
  height: 90px;
  padding: 5px;
  line-height: 20px;
  background: #F8FBFF;
  border-radius: 4px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #202020;

  p {
    line-height: 20px;
    height: 20px;
  }


}

.footTxt {
  float: left;
  font-size: 12px;
  color: #FF3333;
  height: 32px;
  line-height: 32px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .redTxt {
    display: block;
    padding-left: 5px;
  }

  .imgRed {
    display: block;
    width: 20px;
    height: 20px;
  }
}

.uploadProgress {
  margin-top: 20px;
  margin-bottom: 10px;

  :deep(.el-progress-bar__outer) {
    background-color: #D5DAE5;
  }
}

.uploadProgressIcon {
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  img {
    width: 150px;
    height: 100px;
  }
}
.successText{
  width: 100%;
  text-align: center;
  margin-top: 10px;
  color: #202020;
  font-size: 14px;
  .text-blue{
    color: #4381e5;
  }
}

.uploadProgressAbout {
  width: 100%;
  max-height: 200px;
  min-height: 50px;
  padding: 5px;
  background: #F8FBFF;
  border-radius: 4px;
  line-height: 20px;
  font-size: 14px;
  color: #202020;
  text-align: left;
  overflow-y: auto;
}

.upload-demo {
  display: inline-block;
  margin-left: 10px;
}
</style>
