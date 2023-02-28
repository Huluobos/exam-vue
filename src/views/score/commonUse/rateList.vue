<template>
  <div>
    <div slot="header">
      <div style="display: flex; justify-content: space-between;">
        <div class="radioBox">
          <span class="sub">赋分类型</span>
          <el-radio-group v-model="gradeType" @change="propositionDetail(true)">
            <el-radio key="等级赋分" :label="1">等级赋分</el-radio>
            <el-radio key="学考等级" :label="2">学考等级</el-radio>
          </el-radio-group>
        </div>
        <div v-if="subs && subs.length > 0">
          <el-button type="primary" style="width: 100px; height: 32px;" @click="exportScoreAnalysisGrade">导出
          </el-button>
        </div>
      </div>
      <div v-if="subs && subs.length > 0">
        <div class="radioBox">
          <span class="sub">科目</span>
          <el-radio-group v-model="selSub" @change="propositionDetail(false)">
            <el-radio v-for="(sub, index) in subs" :key="index + 'sub'" :label="sub.id">
              {{ sub.name }}
            </el-radio>
          </el-radio-group>
        </div>
        <div class="radioBox">
          <span class="sub">班级类型</span>
          <el-radio-group v-model="scoreLevel" @change="propositionDetail(false)">
            <el-radio key="行政班" :label="2">行政班</el-radio>
            <el-radio key="教学班" :label="3">教学班</el-radio>
          </el-radio-group>
        </div>
      </div>

    </div>
    <div v-show="subs && subs.length > 0">
      <el-table
          :data="tableData"
          :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
          :cell-style="{'text-align': 'center',}"
          border
          stripe
      >
        <el-table-column label="等级" prop="gradeName" width="150"></el-table-column>
        <el-table-column label="赋分" :prop="gradeType === 2?'gradeName':'rateScore'" width="150"></el-table-column>
        <el-table-column label="切分线" width="150">
          <template #default="scope">
            {{ scope.row.subUnits[selSub] ? scope.row.subUnits[selSub].paperScore : '' }}
          </template>
        </el-table-column>
        <el-table-column label="全部">
          <template #default="scope">
            {{ scope.row.subUnits[selSub] ? scope.row.subUnits[selSub].totalNum : '' }}
          </template>
        </el-table-column>
        <el-table-column v-for="name in classNameList" :label="name">
          <template #default="scope">
            {{ getClassData(scope.row, name) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="!subs || subs.length <= 0">
      <div style="text-align: center; margin-top: 150px;">
        <img style="display: inline-block; position: relative;" src="@/assets/nullStatus.png" alt="">
      </div>
      <div style="height: 22px; font-size: 12px; color: #808080; line-height: 22px; text-align: center;">
        尚未设置赋分！
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/runtime-core';
import { useUserStoreWithOut } from '@/store/modules/user';
import {
  exportGradeScoreApi, exportScoreAnalysisGradeApi,
  getExamScoreTaskByIdApi,
  getRateListApi,
  getRateSubjectApi,
  getSonExamByIdApi
} from '@/api/scoreManage'

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
const examId: any = route.query.examId
const gradeType = ref<any>(1)
const scoreLevel = ref<any>(3)
const subs = ref<any>()
const selSub = ref<any>()
const examInfo = ref<examScore>(new examScore())
const classNameList = ref<any>()
const tableData = ref<any>()
const data = reactive({
  routerParam: {
    examId: ref<any>(examId),
    subjectId: ref<any>(selSub),
    gradeType: ref<any>(gradeType),
    scoreLevel: ref<any>(scoreLevel),
  },
})
const {routerParam} = toRefs(data)

const getExamScoreTaskById = () => {
  getExamScoreTaskByIdApi({examId: examId}).then((res: any) => {
    if (res.success) {
      examInfo.value = res.data
      const map = []
      for (let [key, value] of Object.entries(examInfo.value.subject)) {
        map.push({id: value, name: key})
      }
      examInfo.value.subject = map
      propositionDetail(true)
    }
  })
}

function propositionDetail(reset?: any) {
  routerParam.value.examId = examId
  routerParam.value.gradeType = gradeType.value
  routerParam.value.scoreLevel = scoreLevel.value
  if (!reset) {
    routerParam.value.subjectId = selSub.value
  } else {
    routerParam.value.subjectId = undefined
    subs.value = []
    selSub.value = ''
  }
  getRateListApi(routerParam.value).then((res: any) => {
    if (res.data.subjects && JSON.stringify(res.data.subjects).length > 2 && reset) {
      subs.value = []
      selSub.value = ''
      const map = []
      for (let [key, value] of Object.entries(res.data.subjects)) {
        map.push({id: value, name: key})
      }
      subs.value = map
      if (!selSub.value) {
        let subject = subs.value.entries().next().value[1]
        routerParam.value.subjectId = subject.id
        selSub.value = subject.id
      }
    }
    classNameList.value = res.data.classNameList
    tableData.value = res.data.data
  })
}

function getClassData(row: any, className: any) {
  if (row.subUnits[selSub.value]) {
    let classMap = row.subUnits[selSub.value].classMap
    return classMap ? classMap[className] : ''
  }
}

const exportScoreAnalysisGrade = () => {
  routerParam.value.examId = examId
  routerParam.value.gradeType = gradeType.value
  routerParam.value.scoreLevel = scoreLevel.value
  routerParam.value.subjectId = selSub.value
  exportScoreAnalysisGradeApi(routerParam.value).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    let fileName = gradeType.value === 1 ? '等级赋分' : '学考等级'
    link.setAttribute('download', fileName + '结果.xlsx')
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
  min-width: 880px;
  height: 45px;

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
    min-width: 800px;
  }
}
</style>
