<template>
  <div class="container">
    <div class="line-container">
      <div class="left">科&emsp;&emsp;目</div>
      <div class="middle">
        <el-radio-group v-model="curSubId" @change="changeData" class="ml-4">
          <el-radio
            v-for="sub in subjects"
            :key=sub.id
            :label=sub.id>{{ sub.subName }}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="right" style="text-align: right">
        <el-button class="btn" @click="exportExcel">导出</el-button>
        <el-button class="btn" @click="exportDetailExcel">导出班级学生答题情况</el-button>
        <form ref="form_ExcelExport" action="" method="post">
          <input type="hidden" name ="param">
        </form>
      </div>
    </div>
    <div class="line-container">
      <div class="left">班级类型</div>
      <div class="middle">
        <el-radio-group v-model="scoreLevel" @change="changeData" class="ml-4">
          <el-radio label="1">行政班</el-radio>
          <el-radio label="4">教学班</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div>
      <el-table
        style="width: 100%;"
        :data="columnsData"
        :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
        :cell-style="{'text-align': 'center'}"
        border
        stripe
      >
        <el-table-column sortable fixed :sort-method="compareString" prop="fullNo" label="题目" width="90"/>
        <el-table-column sortable fixed prop="score" label="分数" width="95"/>
        <el-table-column v-if="titleNames.length>0" v-for="(title,index) in titleNames" :key="title"
                         :label="title">
          <el-table-column sortable label="平均分" :prop="`scoreAvg${index}`"  width="95">
            <template #default="data">
              <span v-if="data.row[`scoreAvg${index}`] === undefined" >-</span>
              <span v-else>{{ data.row[`scoreAvg${index}`] }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="得分率" :prop="`scoreRate${index}`" width="95">
            <template #default="data">
              <span v-if="data.row[`scoreRate${index}`] === undefined" >-</span>
              <span v-else>{{ data.row[`scoreRate${index}`] }}</span>
            </template>
          </el-table-column>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">

  import {getAllSubjectsApi, findPaperResultApi, getAllPaperSubjectsApi} from "@/api/analysis"
  import {compareString} from "@/util/compare"
  import {ElMessage} from "element-plus/es"
  import {ref} from "@vue/runtime-core"

  const {VITE_GLOB_API_URL} = process.env
  const route = useRoute()
  const examId: any = route.query.examId

  const subjects = ref<any>([])
  const curSubId = ref<any>('')
  const curSubName = ref<any>('')
  const scoreLevel = ref<string>('4')
  const columnsData = ref<any>([])
  const titleNames = ref<any>([])

  function getAllSubjects() {
    getAllPaperSubjectsApi(examId).then((res:any) => {
      res = res.filter((currentValue:any,index:number,arr:any,thisValue:any)=>{
        return !currentValue.total
      })
      subjects.value = res
      if (subjects.value.length > 0) {
        curSubId.value = subjects.value[0].id
        curSubName.value = subjects.value[0].subName

        findPaperResult()
      }
    }).catch((e) => {
      ElMessage.error('查询失败')
    })
  }

  function findPaperResult() {
    const param = {
      examId: examId,
      subjectName: curSubName.value,
      studType: 1, // 过滤特长生和
      scoreLevel: scoreLevel.value
    }
    titleNames.value = []
    columnsData.value = []
    findPaperResultApi(param).then((res:any) => {
      // 排序 将学校层级放前面，后面的按照班级排序
      res.sort((l:any, r:any)=>{
        if (l.scoreLevel === 2 && r.scoreLevel !== 2){
          return -1
        }else if (l.scoreLevel !== 2 && r.scoreLevel === 2){
          return 1
        }else if (l.scoreLevel === 2 && r.scoreLevel === 2){
          return compareString(l.genePaperInfo.fullNo, r.genePaperInfo.fullNo)
        }else if (l.className === r.className){
          return compareString(l.genePaperInfo.fullNo, r.genePaperInfo.fullNo)
        }else{
          return compareString(l.className, r.className)
        }
      })

      for (let i=0;i<res.length;i++) {
        const data = res[i]
        const geneInfo = data.genePaperInfo
        const index = findGeneInfo(geneInfo.fullNo)
        if (index === -1) {
          const lineData:any = {
            fullNo: geneInfo.fullNo,
            score: geneInfo.score
          }
          const name = (data.scoreLevel === 2) ? '全部':data.className
          let column = titleNames.value.indexOf(name)
          if (column < 0) {
            titleNames.value.push(name)
            column = titleNames.value.length - 1
          }

          lineData['name'+column] = name
          lineData['scoreAvg'+column] = data.scoreAvg
          lineData['scoreRate'+column] = data.scoreRate
          columnsData.value.push(lineData)
        }else{
          const lineData:any = columnsData.value[index]
          const name = (data.scoreLevel === 2) ? '全部':data.className

          let column = titleNames.value.indexOf(name)
          if (column < 0) {
            titleNames.value.push(name)
            column = titleNames.value.length - 1
          }

          lineData['name'+column] = name
          lineData['scoreAvg'+column] = data.scoreAvg
          lineData['scoreRate'+column] = data.scoreRate
        }
      }

    }).catch((e) => {
      console.error(e)
      ElMessage.error('查询失败')
    })
  }

  function findGeneInfo(fullNo:any) {
    const data = columnsData.value
    for (let i=0;i<data.length;i++) {
      if (data[i].fullNo === fullNo) {
        return i
      }
    }
    return -1;
  }

  function changeData() {
    for (let sub of subjects.value) {
      if (sub.id === curSubId.value) {
        curSubName.value = sub.subName
        break
      }
    }
    findPaperResult()
  }

  function exportExcel(){
    document.location.href = VITE_GLOB_API_URL+"/newexam/situation/excelExport/paperQuestion" +
      "?examId="+examId+"&studType=1&scoreLevel=" + scoreLevel.value
  }

  function exportDetailExcel(){
    document.location.href = VITE_GLOB_API_URL+"/newexam/situation/excelExport/paperQuestionClassInfo" +
      "?examId="+examId+ "&subName="+curSubName.value+"&studType=1&scoreLevel=" + scoreLevel.value
  }

  onMounted(() => {
    getAllSubjects()

  })
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;

    .line-container {
      display: flex;
      height: 32px;
      line-height: 32px;

      .left {
        width: 80px;
      }

      .middle {
        flex: 1;
      }

      .right {
        width: 250px;
      }
    }

    .btn {
      background-color: #4381E5;
      color: #FFFFFF;
      font-size: 12px;
    }

    :deep(.el-table__header-wrapper) {
      th {
        left: unset !important;
      }
    }
  }
</style>
