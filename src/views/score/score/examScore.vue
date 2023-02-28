<template>
  <div>
    <div slot="header" style="height: 50px; display: flex; justify-content: space-between;">
      <div class="card-title">
        <span class="title">成绩分析</span>
      </div>
      <div>
        <el-select v-model="queryFrom.examPeriod" placeholder="学段" style="width: 100px;" @change="changePeriod"
                   clearable>
          <el-option
              v-for="period in examPeriodList"
              :key="period.value"
              :label="period.label"
              :value="period.value"
          />
        </el-select>
        <el-select v-model="queryFrom.examGrade" placeholder="年级" class="ml-10" style="width: 100px;" clearable
                   @change="listAllExamScoreTask">
          <el-option v-for="grade in examGradeList" :key="grade.value" :label="grade.label" :value="grade.value"/>
        </el-select>
        <el-select v-model="queryFrom.examType" placeholder="全部考试" class="ml-10 mr-10" style="width: 100px;"
                   clearable @change="listAllExamScoreTask">
          <el-option v-for="eType in examTypeList" :key="eType.value" :label="eType.label" :value="eType.value"/>
        </el-select>
        <el-button type="primary" @click="goBasicSetting">基础指标设置</el-button>
      </div>
    </div>
    <div v-loading="loading">
      <div v-if="dataList && dataList.length > 0 || total > 0" class="list-box">
        <div v-for="(item, index) in dataList" :key="index" class="each-box">
          <div class="each-top">
            <div class="title">
              <div>
                <span class="title-text" @click="viewReport(item)">{{ item.examName }}</span>
                <span v-if="item.examType === 1" class="title-tips text-blue">校考</span>
                <span v-if="item.examType === 2" class="title-tips text-blue">联校</span>
              </div>
              <div class="mr-10">
                <span class="text-btn-blue" style="margin-right: 20px;" @click="goToExamSet(item)">
                  <SvgIcon class-name="myIcon" icon-class="handle-btn-blue" ></SvgIcon>
                  分析设置
                </span>
                <span class="text-btn-blue" style="margin-right: 20px;" @click="openDownloadReport(item)">
                  <SvgIcon class-name="myIcon" icon-class="download-report"></SvgIcon>
                  成绩分析一键下载
                </span>
                <el-button style="width: 100px; height: 32px;" type="primary" @click="viewReport(item)">查看分析
                </el-button>
              </div>
            </div>
            <div class="detail">
              <span class="detail-each">
                <SvgIcon class-name="myIcon" icon-class="exam-3"></SvgIcon>
                考试时间：{{ item.examStart + '-' + item.examEnd }}
              </span>
              <span class="detail-each">
                <SvgIcon class-name="myIcon" icon-class="exam-4"></SvgIcon>
                年级：{{ item.gradeName }}
              </span>
              <span class="detail-each">
                <SvgIcon class-name="myIcon" icon-class="subject"></SvgIcon>
                科目：{{ item.subCount + '科' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div style="text-align: center;margin-top: 20%">
          <img style="display: inline-block; position: relative;" src="@/assets/nullStatus.png" alt="">
        </div>
        <div style="height: 22px; font-size: 12px; color: #808080; line-height: 22px; text-align: center;">
          还没有成绩分析报告！
        </div>
      </div>
      <div class="Pagination-box mt-10">
        <Pagination v-show="total > 0" :total="total" :align="'right'" v-model:page="queryFrom.page"
                    v-model:limit="queryFrom.limit" @pagination="listAllExamScoreTask"/>
      </div>
    </div>
    <Dialog
        :title="'成绩分析一键下载'"
        :visible="downloadVisible"
        @dialogVisible="downloadReportDialog"
    >
      <template #content>
        <div>
          <span>请选择您需要导出的科目及成绩指标：</span>
          <div style="min-height: 32px; line-height: 32px; display: flex;">
            <span style="height: 32px;width: 65px">科目：</span>
            <el-radio-group v-model="selSub" style="font-size: 12px;">
              <el-radio v-for="(sub, index) in downloadTask.subject" :key="index + 'sub'" :label="sub.id">
                {{ sub.name }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="mt-10">
          <span style="font-size: 14px;">成绩表导出指标：</span>
          <el-checkbox-group v-model="selItem" style="font-size: 14px;">
            <el-checkbox v-for="(item, index) in downloadItem" :key="index + 'item'" :label="item"/>
          </el-checkbox-group>
        </div>
      </template>
      <template #footer>
        <div style="text-align: right;">
          <el-button type="default" style="width: 100px;height: 32px;background: #ECF4FF;" @click="closeDownloadReport">
            取消
          </el-button>
          <el-button type="primary" style="width: 100px;height: 32px" @click="downloadReportFile">确定</el-button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { listAllExamScoreTaskApi, scoreReportExportAllSubApi, scoreReportExportApi } from '@/api/scoreManage'
import { ElMessage } from 'element-plus'
import nullStatus from '@/assets/nullStatus.png'
import { useUserStoreWithOut } from '@/store/modules/user'

class examScore {
  id: any
  examName: any
  examType: any
  type: any
  period: any
  grade: any
  gradeName: any
  schoolTerm: any
  model: any
  examStart: any
  examEnd: any
  subNames: string[] = []
  subject: any
}

class downloadReportClass {
  examId: any
  subId: any
  schoolId: any
  scoreLevel: number = 2
  scoreType: number = 2
  checkTop: string[] = []
}

const router = useRouter()
const userInfo = useUserStoreWithOut().getUserInfo
const examTypeList = ref<any>([
  {value: 1, label: '月考'},
  {value: 2, label: '模考'},
  {value: 3, label: '期中'},
  {value: 4, label: '期末'}
])
const examPeriodList = ref<any>([{value: 2, label: '高中'}, {value: 1, label: '初中'}, {value: 3, label: '小学'}])
const examGradeList = ref<any>([])
const total = ref<any>(0)
const dataList = ref<examScore[]>([])
const loading = ref<boolean>(false)
const downloadVisible = ref<boolean>(false)
const downloadTask = ref<examScore>(new examScore())
const selSub = ref<any>('')
const downloadItem = ref<any>([
  '教学班', '科目', '卷面分', '标准分', '校内排名',
  '行政班排名', '教学班排名', '校内系排名', '行政班系排名', '教学班系排名',
  '校内组合排名', '等级', '选考赋分/学考等级', '得分率'
])
const selItem = ref<any>(['科目', '卷面分', '校内排名', '教学班排名', '等级',])

const data = reactive<any>({
  queryFrom: {
    examPeriod: '',
    examGrade: '',
    examType: '',
    page: 1,
    limit: 10,
    offset: 0,
    step: 6,
  },
  downloadReportParam: new downloadReportClass()
})
const {queryFrom, downloadReportParam} = toRefs(data)

// function start
const changePeriod = () => {
  examGradeList.value = []
  queryFrom.value.examGrade = ''
  if (queryFrom.value.examPeriod === 1) {
    examGradeList.value = [{value: 11, label: '初一'}, {value: 12, label: '初二'}, {value: 13, label: '初三'}]
  } else if (queryFrom.value.examPeriod === 2) {
    examGradeList.value = [{value: 1, label: '高一'}, {value: 2, label: '高二'}, {value: 3, label: '高三'}]
  } else if (queryFrom.value.examPeriod === 3) {
    examGradeList.value = [
      {value: 21, label: '小学一年级'},
      {value: 22, label: '小学二年级'},
      {value: 23, label: '小学三年级'},
      {value: 24, label: '小学四年级'},
      {value: 25, label: '小学五年级'},
      {value: 26, label: '小学六年级'}
    ]
  }
  listAllExamScoreTask()
}

const listAllExamScoreTask = () => {
  loading.value = true
  dataList.value = []
  if (queryFrom.value.page < 0) {
    queryFrom.value.page = 1
  }
  queryFrom.value.offset = queryFrom.value.limit * (queryFrom.value.page - 1)
  listAllExamScoreTaskApi(queryFrom.value).then((res: any) => {
    if (res.success) {
      total.value = res.data.total
      dataList.value = res.data.rows
    } else {
      ElMessage.error(res.message)
    }
    loading.value = false
  })
}

const viewReport = (item: examScore) => {
  // 考试信息存到sessionStore中
  setExamScore(item)
  router.push({name: 'scoreReport', query: {examId: item.id}})
}

const openDownloadReport = (item: examScore) => {
  downloadReportParam.value = new downloadReportClass()
  downloadVisible.value = true
  downloadTask.value = JSON.parse(JSON.stringify(item))
  const map = []
  map.push({id: '全部', name: '全部'})
  for (let [key, value] of Object.entries(downloadTask.value.subject)) {
    map.push({id: value, name: key})
  }
  downloadTask.value.subject = map
  let subs = ['全部']
  subs.push(...downloadTask.value.subNames)
  downloadTask.value.subNames = subs
}

const closeDownloadReport = () => {
  downloadVisible.value = false
  selSub.value = ''
  selItem.value = ['科目', '卷面分', '校内排名', '教学班排名', '等级',]
}

const downloadReportDialog = (key: any) => {
  downloadVisible.value = key
  !key ? downloadTask.value = new examScore() : ''
  if (!key) {
    closeDownloadReport()
  }
}

const downloadReportFile = () => {
  if (!selSub.value || selSub.value.length === 0) {
    ElMessage.error('请选择科目!')
    return
  }
  downloadReportParam.value.examId = downloadTask.value.id
  downloadReportParam.value.subId = selSub.value
  downloadReportParam.value.schoolId = userInfo.schoId
  downloadReportParam.value.checkTop = selItem.value
  if (selSub.value === '全部') {
    scoreReportExportAllSubApi(downloadReportParam.value).then((res: any) => {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/zip'})
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', '分析报告.zip')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  } else {
    scoreReportExportApi(downloadReportParam.value).then((res: any) => {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/zip'})
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', '分析报告.zip')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
}

const setExamScore = (item: examScore) => {
  let cacheData = sessionStorage.getItem('score:' + item.id)
  if (cacheData) {
    sessionStorage.removeItem('score:' + item.id)
  }
  sessionStorage.setItem('score:' + item.id, JSON.stringify(item))
}

const goToExamSet = (item: examScore) => {
  setExamScore(item)
  router.push({name: 'examSetting', query: {'tab': 'fiveRate', 'examId': item.id}})
}


const goBasicSetting = ()=>{
  router.push({name:'basicSetting'})
}

// function end
onMounted(() => {
  listAllExamScoreTask()
})

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
    display: flex;
    justify-content: center;
    align-items: center;

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
    }
  }
}

.list-box {
  .each-box {
    width: 100%;

    .each-top {
      height: 80px;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #d5dae5;
      margin-top: 10px;

      .title {
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;

        .title-text {
          font-size: 15px;
          font-weight: bold;
          color: #202020;
          margin-left: 10px;
          cursor: pointer;
        }

        .title-text:hover {
          color: #4381E5;
        }

        .title-tips {
          display: inline-block;
          padding: 0 6px;
          height: 22px;
          font-size: 12px;
          font-weight: bold;
          background: #e8f1ff;
          border-radius: 4px;
          line-height: 22px;
          margin-left: 10px;
          user-select: none;
        }

        .text-blue {
          color: #4381e5;
        }

        .text-btn-blue {
          color: #4381e5;
          cursor: pointer;
        }

        .text-green {
          color: #00bfa5;
        }

        .icon-btn {
          float: right;
          height: 40px;
          line-height: 40px;
          margin-right: 10px;

          .icon-box {
            line-height: 40px;
            display: inline-block;
            margin-left: 10px;
            cursor: pointer;
            user-select: none;
            color: #4381e5;
          }
        }
      }

      .detail {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        color: #202020;

        .detail-each {
          margin-left: 7px;
          margin-right: 20px;
        }
      }
    }

    .each-bottom {
      background: #f8fbff;
      border-radius: 0 0 4px 4px;
      border: 1px solid #d5dae5;
      padding: 5px 0;

      .line-sub {
        height: auto;
        line-height: 40px;

        .icon-type {
          display: inline-block;
          margin-left: 10px;
          margin-right: 15px;
          color: #fff;
        }

        .text-txt {
          display: inline-block;
          width: 58px;
          font-size: 14px;
          text-align: left;
          color: #202020;
        }

        .btn-list {
          display: inline-block;

          .sub-btn {
            margin-right: 10px;
          }
        }
      }
    }
  }
}

.myIcon {
  width: 20px;
  height: 20px;
  top: 3px;
}

.Pagination-box {
  margin-top: 10px;
}
</style>
