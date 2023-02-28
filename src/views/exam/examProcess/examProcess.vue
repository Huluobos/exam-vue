<template>
  <div>
    <div slot="header">
      <div class="card-title">
        <span class="title">
          {{ examName }}
        </span>
      </div>
      <div slot="header" style="width: 560px; display: flex;border-bottom:1px solid #D3E0F4">
        <div class="background-class">
          <span class="background-font-style">考试进程</span>
        </div>
        <div class="not-background-class" @click="toStudent()">
          <span class="not-background-font-style">考生信息</span>
        </div>
      </div>
      <div>
        <el-table :data="dataList" style="width: 100%"
          :header-cell-style="{ 'background': '#D3E0F4', 'text-align': 'center', 'color': '#202020', 'font-size': '14px' }"
          :cell-style="{ 'text-align': 'center', }" border stripe>
          <el-table-column prop="subName" label="科目">
            <template #default="scope">
              <el-button type="text" @click="toSubProcess(scope.row.subName)">{{ scope.row.subName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="fullScore" label="满分" width="100">
            <template #default="scope">
              <span v-if="scope.row.fullScore === 0">-</span>
              <span v-else>{{ scope.row.fullScore }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="studentNumber" label="参考学生" width="180">
            <template #default="scope">
              <el-button type="text" @click="goStudentManagement(scope.row)"
                :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.studentNumber }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="paperStructure" label="试卷结构" width="100">
            <template #default="scope">
              <el-button v-if="scope.row.paperStructure === '未建立'" type="text" @click="toSubItem(scope.row)"
                :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.paperStructure }}</el-button>
              <!--              <el-button v-if="scope.row.paperStructure === '未建立'"  type="info"  @click="toSubItem(scope.row)">{{scope.row.paperStructure}}</el-button>-->
              <el-button v-else type="text" @click="toSubItem(scope.row)"
                :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.paperStructure }}</el-button>

            </template>
          </el-table-column>
          <el-table-column prop="templateDesign" label="模板制作" width="100">
            <template #default="scope">
              <span v-if="scope.row.model !== 3">
                <span
                  v-if="scope.row.paperStructure === '未建立' && scope.row.templateDesign === '未完成'">{{ scope.row.answerObjective }}</span>
                <el-button v-else-if="scope.row.paperStructure === '已建立' && scope.row.templateDesign === '未完成'"
                  type="text" @click="toTemplate(scope.row)"
                  :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.templateDesign }}</el-button>
                <el-button v-else type="text" @click="toTemplate(scope.row)"
                  :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.templateDesign }}</el-button>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="scanningUpload" label="扫描上传" width="100">
            <template #default="scope">
              <span v-if="scope.row.model !== 3">
                <span v-if="scope.row.uploadSuccessCount === 0">{{ scope.row.scanningUpload }}</span>
                <el-button v-else type="text" @click="toSaomiao(scope.row)"
                  :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.scanningUpload }}</el-button>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="readingAssignment" label="阅卷分配" width="100">
            <template #default="scope">
              <span v-if="scope.row.model !== 3">
                <span
                  v-if="scope.row.uploadSuccessCount === 0 && scope.row.readingAssignment === '未完成'">{{ scope.row.readingAssignment }}</span>
                <el-button v-else-if="scope.row.uploadSuccessCount !== 0 && scope.row.readingAssignment === '未完成'"
                  type="text" @click="toFenpei(scope.row)"
                  :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.readingAssignment }}</el-button>
                <el-button v-else type="text" @click="toFenpei(scope.row)"
                  :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.readingAssignment }}</el-button>
              </span>
              <span v-else>-</span>

            </template>
          </el-table-column>
          <el-table-column prop="markingProgress" label="阅卷进度 " width="100">
            <template #default="scope">
              <span v-if="scope.row.model !== 3">
                <span
                  v-if="scope.row.markingProgress === '0%' || scope.row.markingProgress === '0.00%'">{{ scope.row.markingProgress }}</span>
                <el-button v-else type="text" @click="toJindu(scope.row)"
                  :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.markingProgress }}</el-button>
              </span>
              <span v-else>-</span>

            </template>
          </el-table-column>
          <el-table-column prop="answerObjective" label="客观题答案 " width="100">
            <template #default="scope">

              <span
                v-if="scope.row.paperStructure === '未建立' && scope.row.answerObjective === '未完成'">{{ scope.row.answerObjective }}</span>
              <el-button v-else-if="scope.row.paperStructure === '已建立' && scope.row.answerObjective === '未完成'"
                type="text" @click="toSubItem(scope.row)"
                :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.answerObjective }}</el-button>
              <el-button v-else type="text" @click="toSubItem(scope.row)"
                :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.answerObjective }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="abnormalTest" label="异常试卷 ">
            <template #default="scope">
              <span v-if="scope.row.model !== 3">
                <span v-if="scope.row.abnormalTest <= 0">无</span>
                <el-button v-else type="text" @click="toyuejuan(scope.row)"
                  :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.abnormalTest }}</el-button>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="publishedResults" label="发布成绩 ">
            <template #default="scope">
              <span v-if="scope.row.publishedResults === '未发布'">{{ scope.row.publishedResults }}</span>
              <el-button v-else type="text" @click="toChengJi(scope.row)"
                :disabled="scope.row.sheetCardType < 0 && scope.row.model !==3">{{ scope.row.publishedResults }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align: right;margin-top: 10px;display: none">
        <el-pagination background v-show="total > 0" :total="total" layout="total, prev, pager, next"
          :current-page="queryParams.page" :page-size="queryParams.limit" @current-change="getList" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findExamProgressList } from '@/api/exam'
import router from "@/router";
import { getMarkSchedulesApi } from '@/api/subject'

class markSchedule {
  examId: any
  subNames: any
  specType: any
}

const route = useRoute()
const examId = route.query.examId
const total = ref<any>(0)
const dataList = ref<any[]>([])

const examName = ref<any>('')
const pageType = ref<string>('examProcess')
const data = reactive({
  queryParams: {
    page: 1,
    limit: 10,
    offset: 0,
    examId: ref<any>('')
  },
  routerStudentParam: {
    examId: ref<any>('')
  },
  routerSubjectParam: {
    examId: ref<any>(''),
    subName: ref<string>(''),
    subId: ref<string>(''),
  },
  routerParam: {
    examId: ref<any>(''),
    subName: ref<any>(''),
    gradeId: ref<any>(''),
    subId: ref<any>(''),
    schoolId: ref<any>(''),
  },
  markScheduleQuery: new markSchedule(),
})

const { queryParams, routerStudentParam, routerSubjectParam, routerParam } = toRefs(data)

function listExamProgressList(data: any) {
  findExamProgressList(data).then((res: any) => {
    total.value = res.data.total
    dataList.value = res.data.rows
    examName.value = res.data.eName
    getMarkSchedules()
  })
}

function getMarkSchedules() {
  let subNames = []
  let markScheduleData = new markSchedule()
  markScheduleData.specType = 0
  markScheduleData.examId = examId
  for (let i = 0; i < dataList.value.length; i++) {
    let data = dataList.value[i]
    subNames.push(data.subName)
  }
  markScheduleData.subNames = subNames
  getMarkSchedulesApi(markScheduleData).then((res: any) => {
    if (res.success) {
      for (let i = 0; i < dataList.value.length; i++) {
        let sub = dataList.value[i].subName
        if (res[sub]) {
          let totalNumVos = res[sub].totalNumVos
          if (totalNumVos.length > 0) {
            let subTotalGiven = 0 //55
            let totalLeaveNum = 0//0
            for (let i = 0; i < totalNumVos.length; i++) {
              subTotalGiven += totalNumVos[i].paperTotalNum
              totalLeaveNum += totalNumVos[i].lostNum
            }
            const subTotalDone = subTotalGiven - totalLeaveNum
            const totalNum = subTotalDone + totalLeaveNum
            dataList.value[i].markingProgress = (subTotalDone * 100 / totalNum).toFixed(2) + '%'
          }
        }
      }
    }
  })
}

function getList(curPage: any) {
  if (curPage < 0) {
    curPage = 1
  }
  queryParams.value.page = curPage
  queryParams.value.offset = queryParams.value.limit * (queryParams.value.page - 1)
  listExamProgressList(queryParams.value)
}

onMounted(() => {
  queryParams.value.examId = examId
  listExamProgressList(queryParams.value)
})

function toStudent() {
  routerStudentParam.value.examId = examId
  router.push({ name: 'stuMessage', query: routerStudentParam.value })
}

function toSubProcess(subName: any) {
  routerSubjectParam.value.examId = examId
  routerSubjectParam.value.subName = subName
  let examInfo = sessionStorage.getItem(examId as any)
  if (examInfo) {
    let parse = JSON.parse(examInfo)
    parse.subName = subName
    setExamPaper(parse)
  }
  router.push({ name: 'subjectProcessIndex', query: routerSubjectParam.value })
}

function setExamPaper(item: any) {
  sessionStorage.setItem(item.id, JSON.stringify(item))
}

function toSubItem(row: any) {
  routerSubjectParam.value.examId = examId
  routerSubjectParam.value.subName = row.subName
  let examInfo = sessionStorage.getItem(examId as any)
  if (examInfo) {
    let parse = JSON.parse(examInfo)
    parse.subName = row.subName
    setExamPaper(parse)
  }
  routerSubjectParam.value.subId = row.id
  router.push({ name: 'processObjectiveItem', query: routerSubjectParam.value })
}

function toTemplate(row: any) {
  routerSubjectParam.value.examId = examId
  routerSubjectParam.value.subId = row.id
  let examInfo = sessionStorage.getItem(examId as any)
  if (examInfo) {
    let parse = JSON.parse(examInfo)
    parse.subName = row.subName
    setExamPaper(parse)
  }
  router.push({ name: 'processTemplate', query: routerSubjectParam.value })
}

function toSaomiao(row: any) {
  routerSubjectParam.value.examId = examId
  routerSubjectParam.value.subId = row.id
  routerSubjectParam.value.subName = row.subName
  let examInfo = sessionStorage.getItem(examId as any)
  if (examInfo) {
    let parse = JSON.parse(examInfo)
    console.log()
    parse.subName = row.subName
    setExamPaper(parse)
  }
  router.push({ name: 'scanMonitor', query: routerSubjectParam.value })
}

function toyuejuan(row: any) {
  routerSubjectParam.value.examId = examId
  routerSubjectParam.value.subId = row.id
  routerSubjectParam.value.subName = row.subName
  let examInfo = sessionStorage.getItem(examId as any)
  if (examInfo) {
    let parse = JSON.parse(examInfo)
    console.log()
    parse.subName = row.subName
    setExamPaper(parse)
  }
  router.push({ name: 'subQuesDetail', query: routerSubjectParam.value })
}

// 跳转单科学生管理页面
function goStudentManagement(row: any) {
  routerParam.value.examId = examId
  routerParam.value.subName = row.subName
  let examInfo = sessionStorage.getItem(examId as any)
  if (examInfo) {
    let parse = JSON.parse(examInfo)
    parse.subName = row.subName
    setExamPaper(parse)
  }
  routerParam.value.subId = row.id
  router.push({ name: 'subjectStudentManagement', query: routerParam.value })
}

function toFenpei(row: any) {
  routerParam.value.examId = examId
  routerParam.value.subName = row.subName
  let examInfo = sessionStorage.getItem(examId as any)
  if (examInfo) {
    let parse = JSON.parse(examInfo)
    parse.subName = row.subName
    setExamPaper(parse)
  }
  routerParam.value.subId = row.id
  router.push({ name: 'markPaper', query: routerParam.value })
}

function toJindu(row: any) {
  routerParam.value.examId = examId
  routerParam.value.subName = row.subName
  let examInfo = sessionStorage.getItem(examId as any)
  if (examInfo) {
    let parse = JSON.parse(examInfo)
    parse.subName = row.subName
    setExamPaper(parse)
  }
  routerParam.value.subId = row.id
  router.push({ name: 'processProcess', query: routerParam.value })
}


function toChengJi(row: any) {
  routerParam.value.examId = examId
  routerParam.value.subName = row.subName
  let examInfo = sessionStorage.getItem(examId as any)
  if (examInfo) {
    let parse = JSON.parse(examInfo)
    parse.subName = row.subName
    setExamPaper(parse)
  }
  routerParam.value.subId = row.id
  router.push({ name: 'processOverview', query: routerParam.value })
}

</script>

<style lang="scss">
.card-title {
  margin-bottom: 16px;
  height: 22px;

  .title {
    font-size: 16px;
    font-weight: bold;
    color: #202020;
    line-height: 22px;
    margin-right: 20px;
  }
}

.operate-btn {
  line-height: 22px;
  display: flex;
  justify-content: right;
  align-items: center;
  margin-bottom: 12px;
  text-align: right;

  .text {
    font-size: 14px;
    color: #4381E5;
    line-height: 22px;
    margin-left: 5px;
  }

  .img {
    width: 20px;
    height: 20px;
  }
}

.background-font-style {
  width: 90px;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei, sans-serif;
  font-weight: bold;
  color: #fff;
  line-height: 22px;
  align-items: center;
  display: inline-block;
}

.not-background-font-style {
  width: 90px;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei, sans-serif;
  font-weight: bold;
  color: #808080;
  line-height: 22px;
  align-items: center;
  display: inline-block;
}

.background-class {
  width: 120px;
  height: 40px;
  background: #4381e5;
  border-radius: 10px 10px 0 0;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}

.not-background-class {
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
}

.table-header {
  background: #D3E0F4;
  text-align: center;
}
</style>
