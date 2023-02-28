<template>
  <div class="container">
    <div class="line-container">
      <div class="left">科&emsp;&emsp;目</div>
      <div class="middle">
        <el-radio-group v-model="curSubId" @change="changeData(true)" class="ml-4">
          <el-radio
                  v-for="sub in subjects"
                  :key=sub.id
                  :label=sub.id>{{ sub.subName }}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="right" style="text-align: right">
        <el-button class="btn" @click="changeSubRate">设置分数线</el-button>
        <el-button class="btn" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <div class="line-container">
      <div class="left">班级类型</div>
      <div class="middle">
        <el-radio-group v-model="classType" @change="changeData(true)" class="ml-4">
          <el-radio label="2">行政班</el-radio>
          <el-radio label="3">教学班</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="line-container">
      <div class="left">分数类型</div>
      <div class="middle">
        <el-radio-group v-model="scoreType" @change="changeData(false)" class="ml-4">
          <el-radio label="1">卷面分数</el-radio>

          <el-radio label="2" v-if="subject.subType === 2">赋分</el-radio>
          <el-radio label="2" v-else disabled>赋分</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div>
      <el-table
              style="width: 100%"
              :data="columnsData"
              :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
              :cell-style="{'text-align': 'center',}"
              border
              stripe
      >
        <el-table-column fixed align="center" label="序号">
          <template #default="scope">
            <span>{{scope.$index +1}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="keyName" label="班级"/>
        <el-table-column fixed prop="allNum" label="有效人数"/>
        <el-table-column fixed prop="maxScore" label="最高分"/>
        <el-table-column fixed prop="minScore" label="最低分"/>
        <el-table-column label="平均分">
          <el-table-column prop="avgScore" label="平均分">
            <template #default="scope">
              <span v-if="null != scope.row.avgScore">{{scope.row.avgScore.toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="avgScoreRanking" label="排名">
            <template #default="scope">
              <span v-if="null != scope.row.avgScoreRanking">{{scope.row.avgScoreRanking}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="本校分差">
            <template #default="scope">
              <span v-if="null != scope.row.schoolAvgScore">{{scope.row.schoolAvgScore.toFixed(2)}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="(subject.highScore)">
          <el-table-column prop="highRate" label="百分比">
            <template #default="scope">
              <span v-if="null != scope.row.highRate">{{(scope.row.highRate*100).toFixed(2)}}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="highRateRanking" label="排名">
            <template #default="scope">
              <span v-if="null != scope.row.highRateRanking">{{scope.row.highRateRanking}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="highNum" label="人数"/>
        </el-table-column>
        <el-table-column :label="(subject.goodScore)">
          <el-table-column prop="goodRate" label="百分比">
            <template #default="scope">
              <span v-if="null != scope.row.goodRate">{{(scope.row.goodRate*100).toFixed(2)}}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="goodRateRanking" label="排名">
            <template #default="scope">
              <span v-if="null != scope.row.goodRateRanking">{{scope.row.goodRateRanking}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="goodNum" label="人数"/>
        </el-table-column>
        <el-table-column :label="(subject.fineScore)">
          <el-table-column prop="fineRate" label="百分比">
            <template #default="scope">
              <span v-if="null != scope.row.fineRate">{{(scope.row.fineRate*100).toFixed(2)}}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="fineRateRanking" label="排名">
            <template #default="scope">
              <span v-if="null != scope.row.fineRateRanking">{{scope.row.fineRateRanking}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="fineNum" label="人数"/>
        </el-table-column>
        <el-table-column :label="(subject.passScore)">
          <el-table-column prop="passRate" label="百分比">
            <template #default="scope">
              <span v-if="null != scope.row.passRate">{{(scope.row.passRate*100).toFixed(2)}}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="passRateRanking" label="排名">
            <template #default="scope">
              <span v-if="null != scope.row.passRateRanking">{{scope.row.passRateRanking}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="passNum" label="人数"/>
        </el-table-column>
        <el-table-column :label="(subject.lowScore)">
          <el-table-column prop="lowRate" label="百分比">
            <template #default="scope">
              <span v-if="null != scope.row.lowRate">{{(scope.row.lowRate*100).toFixed(2)}}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="lowRateRanking" label="排名">
            <template #default="scope">
              <span v-if="null != scope.row.lowRateRanking">{{scope.row.lowRateRanking}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="lowNum" label="人数"/>
        </el-table-column>
      </el-table>
    </div>
    <div class="charts-class" style="margin-top: 30px">
      <Echarts :options="options" :width="'1280px'" :height="'400px'"></Echarts>
    </div>
  </div>
  <el-dialog v-model="changeScore" title="一分五率设置" :width="'600px'">
    <el-row>
      <div class="div-title">类型</div>
      <div class="">
        <el-radio-group v-model="setType" class="ml-4">
          <el-radio label="2">分数比例</el-radio>
          <el-radio label="0">分数</el-radio>
          <el-radio label="1">人数比例</el-radio>
        </el-radio-group>
      </div>

    </el-row>
    <el-row>
      <div class="div-title" style="line-height: 42px;">科目</div>
      <div class="">
        <el-checkbox-group v-model="selectSub">
          <el-checkbox v-for="sub in subjects" :label=sub.id size="large">
            {{ sub.subName }}
          </el-checkbox>
        </el-checkbox-group>

        <!--        <el-radio-group v-model="curSubId" @change="changeData" class="ml-4">-->
        <!--          <el-radio-->
        <!--                  v-for="sub in subjects"-->
        <!--                  :key=sub.id-->
        <!--                  :label=sub.id>{{ sub.subName }}-->
        <!--          </el-radio>-->
        <!--        </el-radio-group>-->
      </div>
    </el-row>
    <el-row>
      <div class="div-title">高分</div>
      <div>
        <el-input v-model="threeRateVo.highValue" class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="margin-top14">
      <div class="div-title">优秀</div>
      <div>
        <el-input v-model="threeRateVo.goodValue" class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="margin-top14">
      <div class="div-title">良好</div>
      <div>
        <el-input v-model="threeRateVo.fineValue" class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="margin-top14">
      <div class="div-title">及格</div>
      <div>
        <el-input v-model="threeRateVo.passValue" class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="margin-top14">
      <div class="div-title">低分</div>
      <div>
        <el-input v-model="threeRateVo.lowValue" class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="mb-4 margin-top14" style="padding-left:230px">
      <el-button type="primary" class="search-button" @click="saveSubRate">保存</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
  import {ElMessage} from 'element-plus'
  import {ref} from "@vue/runtime-core";
  import {exportManyRate, getAllSubjectsApi, getManyRate, saveAllThreeRateSetting} from '@/api/analysis'
  import {studentDetailExport} from "@/api/scoreManage";

  const route = useRoute()
  const examId: any = route.query.examId
  const subjects = ref<any>([])
  const curSubId = ref<string>('')
  const data = reactive({
    classType: '3',
    scoreType: '1',
    queryParams: {
      examId: ref<any>(examId),
      subId: ref<any>(curSubId),
      scoreLevel: ref<any>('2'),
      scoreType: ref<any>('1')
    },
    exportParam: {
      examId: ref<any>(examId),
      subId: ref<any>(curSubId),
      scoreLevel: ref<any>('2'),
      scoreType: ref<any>('1')
    },
    threeRateVo: {
      subIdList: ref<any>([]),
      valueType: ref<any>(0),
      highValue: ref<any>(),
      goodValue: ref<any>(),
      fineValue: ref<any>(),
      passValue: ref<any>(),
      lowValue: ref<any>(),
      examId: ref<any>(examId),
    }
  })
  const {classType, scoreType} = toRefs(data)
  const {queryParams, exportParam, threeRateVo} = toRefs(data)
  const columnsData = ref<any>([])
  const classData = ref<any>([])
  const schoolData = ref<any>([])
  const changeScore = ref<boolean>(false)
  const selectSub = ref<any>([])
  const setType = ref('2')

  function getAllSubjects() {
    getAllSubjectsApi(examId).then((res) => {
      subjects.value = res
      if (subjects.value.length > 0) {
        curSubId.value = subjects.value[0].id
        changeData()
      }
    }).catch((e) => {
      ElMessage.error('查询失败')
    })
  }

  function changeSubRate() {
    changeScore.value = true
    threeRateVo.value.highValue = null
    threeRateVo.value.goodValue = null
    threeRateVo.value.fineValue = null
    threeRateVo.value.passValue = null
    threeRateVo.value.lowValue = null
    selectSub.value = []
    setType.value = '2'
  }

  function saveSubRate() {
    threeRateVo.value.subIdList = selectSub.value
    threeRateVo.value.valueType = setType.value
    saveAllThreeRateSetting(threeRateVo.value).then((res: any) => {
      if (res.success) {
        ElMessage.success('修改成功 !')
        changeScore.value = false
        changeData()
      } else {
        ElMessage.error('修改失败！')
      }
    })
  }

  let classAvgScore = ref<any>([])
  let classNameList = ref<any>([])
  let schoolAvg = ref<any>(0)
  let maxScore = ref<any>(0)
  let minScore = ref<any>(10000)
  let subject = ref<any>({})

  function changeData(changeScoreType : boolean) {
    if (changeScoreType) {
      scoreType.value = '1'
    }
    queryParams.value.scoreLevel = classType.value;
    queryParams.value.scoreType = scoreType.value;
    classAvgScore = ref<any>([])
    classNameList = ref<any>([])
    schoolAvg = ref<any>(0)
    maxScore = ref<any>(0)
    minScore = ref<any>(10000)
    getManyRate(queryParams.value).then((res) => {
      columnsData.value = []
      classData.value = res.data.voList;
      schoolData.value = res.data.schoolData;
      columnsData.value = [...classData.value, ...schoolData.value];
      subject.value = res.data.subject;
      subject.value.highScore = "高分率(≥" + subject.value.highScore + ")"
      subject.value.goodScore = "优秀率(≥" + subject.value.goodScore + ")"
      subject.value.fineScore = "良好率(≥" + subject.value.fineScore + ")"
      subject.value.passScore = "及格率(≥" + subject.value.passScore + ")"
      subject.value.lowScore = "低分率(≤" + subject.value.lowScore + ")"
      for (let classValue of classData.value) {
        classNameList.value.push(classValue.keyName)
        classAvgScore.value.push(classValue.avgScore.toFixed(2))
        if (maxScore.value < (classValue.avgScore.toFixed(0)*1)) {
          maxScore.value = classValue.avgScore.toFixed(0)
        }

        if (minScore.value > (classValue.avgScore.toFixed(2)*1)) {
          minScore.value = classValue.avgScore.toFixed(0)
        }
      }

      for (let schoolValue of schoolData.value) {
        schoolAvg.value = schoolValue.avgScore.toFixed(2);
      }
      maxScore.value = parseFloat(maxScore.value) + 5
      minScore.value = parseFloat(minScore.value) - 5
      // console.log(maxScore.value);
      // console.log("max");
      // console.log(minScore.value);
      // console.log("min");
      showChart();
    })
  }

  function exportExcel() {
    exportParam.value.scoreLevel = classType.value;
    exportParam.value.scoreType = scoreType.value;
    let excelName = ''
    if(classType.value == '2'){
      excelName += '行政班'
    }else{
      excelName += '教学班'
    }
    if(scoreType.value == '1'){
      excelName += '原始分'
    }else{
      excelName += '赋分'
    }
    excelName += '一分五率分析结果'
    exportManyRate(exportParam.value).then((res: any) => {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', excelName+'.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  let options = ref<any>({}) //图表的数据对象

  function showChart() {
    options.value = {
      xAxis: {
        type: 'category',
        data: classNameList
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['班级平均分'],
        top:5
      },
      calculable: true,
      yAxis: {
        type: 'value',
        name: '分数',
        max: maxScore.value,
        min: minScore.value,
        axisLine: {
          show: 'true',
          // symbol: ['none', 'arrow'],
        }
      },
      series: [
        {
          name: '班级平均分',
          data: classAvgScore,
          type: 'line',
          color: '#00C18F',
          lineStyle: {
            type: 'solid',
            color: '#00C18F',
            width: 3
          },
          markLine: {
            data: [
              {
                name: '年级平均分',
                yAxis: schoolAvg,
                label: {
                  formatter: '{b}',
                }
              }
            ],
            label: {
              distance: [20, 8]
            },
            lineStyle: {
              type: 'solid',
              color: '#4381E5',
              width: 3
            },
          }
        }
      ]
    };
  }

  onMounted(() => {
    getAllSubjects()
  })
</script>

<style lang="scss" scoped>

  @import "../../../style/scanMonitor/scanMonitor.scss";
  @import "../../../style/scoreManage/scoreManage";

  :deep(.el-table) {
    thead.is-group tr:nth-child(2) .el-table__cell {
      left: 0 !important;
    }
  }

  .charts-class {
    width: 100%;
    height: 450px;
    background: #F8FBFF;
  }

  .container {
    width: 100%;

    .line-container {
      display: flex;
      height: 32px;
      line-height: 32px;

      .left {
        width: 80px
      }

      .middle {
        flex: 1;
      }

      .right {
        width: 200px;
      }
    }

    .btn {
      background-color: #4381E5;
      color: #FFFFFF;
      font-size: 12px;
    }

    .charts-class {
      width: 100%;
      height: 450px;
      background: #F8FBFF;
    }

    .title {
      font-weight: bold;
      font-size: 16px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
</style>
