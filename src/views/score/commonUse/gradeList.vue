<template>
  <div>
    <div slot="header">
      <div style="display: flex; justify-content: space-between;">
        <div class="radioBox">
          <span class="sub">科目</span>
          <el-radio-group v-model="selSub" @change="propositionDetail">
            <el-radio v-for="(sub, index) in examInfo.subject" :key="index + 'sub'" :label="sub.id">
              {{ sub.name }}
            </el-radio>
          </el-radio-group>
        </div>
        <div>
          <el-button type="primary" style="width: 100px; height: 32px;" @click="exportGradeInfo">导出</el-button>
        </div>
      </div>
      <div class="radioBox">
        <span class="sub">班级类型</span>
        <el-radio-group v-model="classType" @change="propositionDetail">
          <el-radio key="行政班" :label="2">行政班</el-radio>
          <el-radio key="教学班" :label="3">教学班</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div style="margin-top: 55px;" v-if="tableHead && tableHead.length > 0">
      <el-table
          :data="tableData"
          :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
          :cell-style="{'text-align': 'center',}"
          stripe
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="班级" prop="className" width="150"></el-table-column>
        <el-table-column v-for="head in tableHead" :label="head">
          <el-table-column label="人数">
            <template #default="scope">
              {{ scope.row[head].countStud }}
            </template>
          </el-table-column>
          <el-table-column label="比例">
            <template #default="scope">
              {{ scope.row[head].proportion }}
            </template>
          </el-table-column>
          <el-table-column label="累加值">
            <template #default="scope">
              {{ scope.row[head].totalNum }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <div style="text-align: center; margin-top: 150px;">
        <img style="display: inline-block; position: relative;" src="@/assets/nullStatus.png" alt="">
      </div>
      <div style="height: 22px; font-size: 12px; color: #808080; line-height: 22px; text-align: center;">
        尚未设置等级！
      </div>
    </div>
    <div style="margin-top: 35px;" v-show="tableHead && tableHead.length > 0">
      <Echarts :options="options" :width="'1280px'" :height="'400px'"></Echarts>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getExamScoreTaskByIdApi, getGradeScoreInfoApi,exportGradeScoreApi } from '@/api/scoreManage'
import { ref } from '@vue/runtime-core'

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
  eExamSubjects: any
}

const route = useRoute()
const examId = route.query.examId
const selSub = ref<any>()
const selSubInfo = ref<any>()
const classType = ref<any>(3)
const examInfo = ref<examScore>(new examScore())
const tableData = ref<any>()
const tableHead = ref<any>()
const juniorList = ref<any>()
const keyNameList = ref<any>()
const keyNameMap = ref<any>()
const chartData = ref<any>()
const options = ref<any>({}) //图表的数据对象
const data = reactive({
  routerParam: {
    examId: examId,
    scoreLevel: classType,
    subId: selSub,
  },
})
const {routerParam} = toRefs(data)

function propositionDetail() {
  routerParam.value.subId = selSub
  routerParam.value.scoreLevel = classType
  tableData.value = []
  getGradeScoreInfoApi(routerParam.value).then((res: any) => {
    if (res.success) {
      juniorList.value = res.data.juniorList
      keyNameList.value = res.data.keyNameList
      keyNameMap.value = res.data.keyNameMap
      tableHead.value = []
      chartData.value = []
      if (juniorList && juniorList.value.length > 0) {
        for (let i = 0; i < juniorList.value.length; i++) {
          tableHead.value.push(juniorList.value[i].gradeName)
          let numList = []
          for (let c = 0; c < keyNameList.value.length; c++) {
            let junData = keyNameMap.value[keyNameList.value[c]]
            let cou = 0
            for (let j = 0; j < junData.length; j++) {
              let jun = junData[j]
              if (jun.gradeName == juniorList.value[i].gradeName) {
                cou = 1
                numList.push((jun.percent * 100).toFixed(2))
              }
            }
            if (cou === 0) {
              numList.push(0)
            }
          }
          chartData.value.push(
              {
                name: juniorList.value[i].gradeName,
                type: 'bar',
                stack: '总量',
                barWidth: 20,
                data: numList
              }
          )
        }
        setRadarData(keyNameList.value, tableHead.value, chartData.value)
      }
      for (let k = 0; k < keyNameList.value.length; k++) {
        let data: any = {}
        data.className = keyNameList.value[k]
        let junData = keyNameMap.value[keyNameList.value[k]]
        let totalNum = 0

        for (let v = 0; v < juniorList.value.length; v++) {
          let cou = 0
          let col: any = {}
          for (let j = 0; j < junData.length; j++) {
            let jun = junData[j]
            if (jun.gradeName == juniorList.value[v].gradeName) {
              cou = cou + 1
              totalNum += jun.countStud
              col.countStud = jun.countStud
              col.proportion = (jun.percent * 100).toFixed(2) + '%'
              col.totalNum = totalNum
            }
            //有的指标没有值
            if (cou < 1) {
              col.countStud = 0
              col.proportion = '0.00%'
              col.totalNum = totalNum
            }
            data[juniorList.value[v].gradeName] = col
          }
        }
        tableData.value.push(data)
      }
    }
  })
}

const setRadarData = (keyNameList: any, gradeNameList: any, seriesData: any) => {
  let title = '等级分布'
  options.value = {
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: gradeNameList
    },
    xAxis: {
      type: 'category',
      data: keyNameList,
      name: '学校/班级',
      nameLocation: 'end',
      axisPointer: {
        type: 'shadow'
      },
      axisLabel: {
        interval: 0,//横轴信息全部显示
        rotate: -30//-30度角倾斜显示
      }
    },
    yAxis: {
      type: 'value',
      name: '百分率',
      min: 0,
      max: 100,
      interval: 10,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: seriesData,
    color: ['#1f607c', '#2e6e3e', '#ffa72c', '#f16101', '#ad1603', '#492d45']
  }
}

const getExamScoreTaskById = () => {
  getExamScoreTaskByIdApi({examId: examId}).then((res: any) => {
    if (res.success) {
      examInfo.value = res.data
      const map = []
      for (let [key, value] of Object.entries(examInfo.value.subject)) {
        map.push({id: value, name: key})
      }
      examInfo.value.subject = map
      let subject = examInfo.value.subject.entries().next().value[1]
      routerParam.value.subId = subject.id
      examInfo.value.eExamSubjects = JSON.parse(examInfo.value.eExamSubjects)
      selSub.value = subject.id
      let filter = examInfo.value.eExamSubjects.filter((s: any) => s.id === routerParam.value.subId)
      if (filter) {
        selSubInfo.value = filter[0]
      }
      propositionDetail()
    }
  })
}

const exportGradeInfo = () => {
  routerParam.value.subId = selSub
  routerParam.value.scoreLevel = classType
  exportGradeScoreApi(routerParam.value).then((res:any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '学生等级分布结果.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

onMounted(() => {
  getExamScoreTaskById()
})
</script>

<style lang="scss" scoped>
.radioBox {
  line-height: 40px;
  width: 880px;

  .sub {
    float: left;
    display: inline-block;
    width: 80px;
    height: 40px;
    line-height: 32px;
    font-size: 14px;
    text-align: justify;
    text-align-last: justify;
    padding-right: 20px;
  }

  .el-radio-group {
    display: block;
    float: right;
    width: 800px;
  }
}
</style>
