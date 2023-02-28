<template>
  <div class="container">
    <div class="line-container dis">
      <div class="title-style ">分析模式</div>
      <div class="title-value ">说明：此分析模式用于学生新高考模式下的各种选科组合及系别排名使用，如不属于新高考，默认传统模式。</div>
    </div>
    <div class="line-container dis" style="height: 45px">
      <el-select v-model="value" class="m-2 select-style" placeholder="请选择" size="large">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
        />
      </el-select>
    </div>
    <div class="line-container margin-top10">
      <div class="left title-style" style="line-height: 32px">定制科目</div>
      <div class="right" style="text-align: right">
        <el-button class="btn" @click="mergeSubBtn">合并科目</el-button>
      </div>
    </div>
    <div class="margin-top10">
      <el-table
              style="width: 100%"
              :data="subjects"
              :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
              :cell-style="{'text-align': 'center',}"
              border
              stripe
              @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"/>
        <el-table-column prop="index" label="序号">
          <template #default="scope">
            <span>{{scope.$index +1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subName" label="科目"/>
        <el-table-column prop="fullScore" label="满分分值"/>
        <el-table-column prop="allStudentNum" label="成绩总数"/>
        <el-table-column prop="dataSource" label="数据来源">
          <template #default="scope">
            <div v-if="scope.row.dataSource === 1 || scope.row.dataSource === null">网阅</div>
            <div v-if="scope.row.dataSource === 2">导入</div>
            <div v-if="scope.row.dataSource === 3">
              <el-popover
                      placement="top"
                      :width="200"
                      trigger="hover"
                      :content="scope.row.mergedSub"
              >
                <template #reference>
                  <a class="a-style">合成</a>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="conversionFormula" label="成绩折算">
          <template #default="scope">
            <div v-if="scope.row.conversionFormula == 1">+{{scope.row.conversionScore}}</div>
            <div v-if="scope.row.conversionFormula == 2">-{{scope.row.conversionScore}}</div>
            <div v-if="scope.row.conversionFormula == 3">*{{scope.row.conversionScore}}</div>
            <div v-if="scope.row.conversionFormula == 4">/{{scope.row.conversionScore}}</div>
            <div v-if="scope.row.conversionFormula == null">----</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <a class="a-style" v-if="scope.row.conversionFormula === null"
               @click="conversion(scope.row.subName,scope.row.id)">成绩折算</a>
            <a class="a-style1" v-if="scope.row.conversionFormula !== null"
               @click="cancelCon(scope.row.subName,scope.row.id)">取消折算</a>
            <a class="del-style" v-if="scope.row.merged" @click="delSub(scope.row.id,scope.row.subName)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="line-container margin-top10">
    <div class="left title-style1" style="line-height: 32px">学生成绩查询权限</div>
  </div>
  <div class="line-container margin-top10">
    <div class="line-container dis">
      <div class="title-style2 ">学生查成绩</div>
      <div class="margin-left25" style="flex: 1">
        <div class="mb-2 flex items-center text-sm">
          <el-radio-group v-model="selOpen" class="ml-4">
            <el-radio label="0" size="large">不可查询</el-radio>
            <el-radio label="1" size="large">学生可查</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="line-container dis">
      <div class="title-style2 ">学生看排名</div>
      <div class="margin-left25" style="flex: 1">
        <div class="mb-2 flex items-center text-sm">
          <el-radio-group v-model="selRank" class="ml-4">
            <el-radio label="0" size="large">可查看</el-radio>
            <el-radio label="1" size="large">不可查看</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="line-container dis">
      <div class="title-style2 ">学生看成绩</div>
      <div class="margin-left25" style="flex: 1">
        <div class="mb-2 flex items-center text-sm">
          <el-radio-group v-model="selScore" class="ml-4">
            <el-radio label="1" size="large">看分数</el-radio>
            <el-radio label="2" size="large">看等级</el-radio>
            <el-radio label="3" size="large">分数+等级</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="line-container margin-top10">
      <div class="left title-style" style="line-height: 32px"></div>
      <div class="right" style="text-align: right">
        <el-button class="btn" @click="changeExam">保存</el-button>
      </div>
    </div>
  </div>

  <el-dialog v-model="conScore" :title="conversionSub" :width="'600px'">
    <el-row>
      <div class="div-title">类&emsp;&emsp;型</div>
      <div class="margin-left25">
        <el-radio-group v-model="conType" class="ml-4">
          <el-radio label="1">原始分</el-radio>
          <el-radio label="2">赋分</el-radio>
        </el-radio-group>
      </div>
    </el-row>
    <el-row class="margin-top10">
      <div class="div-title">折算方式</div>
      <div class="margin-left25">
        <el-select v-model="conValue" class="m-2 select-style1" placeholder="请选择" size="large">
          <el-option label="加" value="1"/>
          <el-option label="减" value="2"/>
          <el-option label="乘" value="3"/>
          <el-option label="除" value="4"/>
        </el-select>

      </div>
      <div class="margin-left25">
        <el-input-number v-model="conScoreValue" class="con-input" :controls="false"></el-input-number>
      </div>
    </el-row>
    <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px" type="info"
                         @click="conScore = false">取消</el-button>
              <el-button style="width: 100px; height: 32px" type="primary"
                         @click="conFun">确定</el-button>
            </span>
    </template>
  </el-dialog>
  <el-dialog v-model="conCancel" title="取消折算" :width="'600px'">
    <div class="con-text-style">是否取消 <span class="con-sub-style">{{cancelSubName}}</span> 科目的成绩折算，恢复到原始数据？</div>
    <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px" type="info"
                         @click="conCancel = false">取消</el-button>
              <el-button style="width: 100px; height: 32px" type="danger"
                         @click="cancelFun">确定</el-button>
            </span>
    </template>
  </el-dialog>
  <el-dialog v-model="mergeSub" title="合并科目" :width="'600px'">
    <el-row>
      <div class="merge-title">您确定要将下列科目合并成一个新的科目吗（如总分）？</div>
    </el-row>
    <el-row v-if="selSubNum" class="margin-top10">
      <div class="height30 dis float-right">
        <div class="hintRed-img hintRed-img-style" style="margin-top: 2px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div class="merge-wrong">请至少选择两个科目！</div>
      </div>
    </el-row>
    <el-row v-if="selSubNum1" class="margin-top10">
      <div class="merge-title">{{selSubNames}}</div>
    </el-row>
    <el-row class="margin-top10">
      <div class="merge-title1">新科目名称</div>
      <div>
        <el-input v-model="nuwSubName" class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="margin-top10">
      <div class="merge-title1">分数类型</div>
      <div>
        <el-radio-group v-model="mergeScoreType" class="ml-4">
          <el-radio label="1">原始分</el-radio>
          <el-radio label="2">赋分</el-radio>
        </el-radio-group>
      </div>
    </el-row>
    <el-row class="margin-top10">
      <div class="merge-title1">计算方式</div>
      <div>
        <el-radio-group v-model="mergeScoreSubType" class="ml-4" @change="changeType">
          <el-radio label="1">按科目</el-radio>
          <el-radio label="2">按成绩</el-radio>
          <el-radio label="3">3+1+2</el-radio>
        </el-radio-group>
      </div>
    </el-row>
    <el-row class="margin-top10">
      <div class="merge-title1">是否总分</div>
      <div>
        <el-select v-model="mergeTotal" class="m-2 select-style1" placeholder="请选择" size="large">
          <el-option label="否" value="0"/>
          <el-option label="是" value="1"/>
        </el-select>
      </div>
    </el-row>
    <el-row class="margin-top10">
      <div class="merge-title1">是否过滤单科缺考</div>
      <div>
        <el-select v-model="mergeFilter" class="m-2 select-style1" placeholder="请选择" size="large">
          <el-option label="否" value="0"/>
          <el-option label="是" value="1"/>
        </el-select>
      </div>
    </el-row>

    <el-row v-if="showSub" class="dis">
      <div v-for="(m,index) in subNumList.subNum">
        <div class="margin-top10" style="width: 250px;display: flex">
          <div class="merge-title1" v-if="showRank">第{{m.rank}}名</div>
          <div class="merge-title1" v-else>{{m.subName}}</div>
          <div style="width: 200px;">
            <el-input v-model="m.percent" class="merge-input" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')">
              <template #append>%</template>
            </el-input>
          </div>
        </div>
      </div>
    </el-row>

    <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px" type="info"
                         @click="mergeSub = false">取消</el-button>
              <el-button style="width: 100px; height: 32px" type="primary"
                         @click="mergeSubFun">确定</el-button>
            </span>
    </template>

  </el-dialog>
  <el-dialog v-model="delSubShow" title="删除科目" :width="'600px'">
    <el-row>
      <div class="con-text-style">是否删除 <span class="con-sub-style">{{delSubName}}</span> 科目的成绩，删除后不可恢复？</div>
    </el-row>
    <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px" type="info"
                         @click="delSubShow = false">取消</el-button>
              <el-button style="width: 100px; height: 32px" type="danger"
                         @click="clearSub">确定</el-button>
            </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

  import {ElMessage} from 'element-plus'
  import {ref} from "@vue/runtime-core";
  import {
    baseSetting,
    cancelConApi,
    changeExamApi,
    conversionApi, deleteSub,
    getAllSubjectsApi,
    scoreMerge, scoreMergeRanking, scoreMergeX
  } from "@/api/analysis";

  class SubNum {
    subId: any
    subName: any
    percent: any
    rank: any

    constructor(subId: any, subName: any, percent: any, rank: any) {
      this.subId = subId
      this.subName = subName
      this.percent = percent
      this.rank = rank
    }
  }

  const route = useRoute()
  const value = ref(1)
  const examId: any = route.query.examId
  const subjects = ref<any>([])
  const subNumList = reactive({
    subNum : []
  })
  const exam = ref<any>({})
  const options = [
    {value: 1, label: '传统模式',},
    {value: 4, label: '3+1+2',},
    {value: 2, label: '7选3',},
    {value: 3, label: '6选3',}
  ]
  const selOpen = ref<string>('0')
  const selRank = ref<string>('0')
  const selScore = ref<string>('1')
  const multipleSelection = ref<any>([])
  const selSubIds = ref<any>('')
  const selSubIdList = ref<any>([])
  const selSubNames = ref<any>('')
  const selSubNum = ref<boolean>(true)
  const selSubNum1 = ref<boolean>(false)
  const showSub = ref<boolean>(false)
  const showRank = ref<boolean>(false)
  const nuwSubName = ref<any>('')
  const mergeScoreType = ref<any>('1')
  const mergeScoreSubType = ref<any>('1')
  const mergeTotal = ref<any>('0')
  const mergeFilter = ref<any>('0')
  const delSubName = ref<any>('')
  const delSubId = ref<any>('')
  const delSubShow = ref<boolean>(false)
  const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
    selSubIds.value = ''
    selSubIdList.value = []
    selSubNames.value = ''
    subNumList.subNum = []
    let i = 1;
    for (let v of multipleSelection.value) {
      // selSubIds.value.push(v.id)
      selSubIds.value = selSubIds.value + "、" + (v.id)
      selSubIdList.value.push(v.id)
      selSubNames.value += v.subName + "、"
      subNumList.subNum.push(new SubNum(v.id, v.subName, 100, i))
      i++
    }
    if (selSubNames != '') {
      selSubNames.value = selSubNames.value.substring(0, selSubNames.value.length - 1)
    }
  }
  const conversionSub = ref<string>('成绩折算')
  const conScore = ref<boolean>(false)
  const conCancel = ref<boolean>(false)
  const mergeSub = ref<boolean>(false)
  const conType = ref<any>('1')
  const conValue = ref('1')
  const conScoreValue = ref("")
  const cancelSubName = ref('')
  const cancelSubId = ref('')
  const data = reactive({
    conversionParam: {
      examId: ref<any>(examId),
      subjectId: ref<any>(''),
      conValue: conValue,
      conType: conType,
      conScoreValue: conScoreValue
    }, examParam: {
      examId: ref<any>(examId),
      examMode: value,
      published: selOpen,
      rankShow: selRank,
      studCheck: selScore
    }, mergeSubParam: {
      subNumList: subNumList.subNum,
      newName: nuwSubName,
      examId:examId,
      subIds: selSubIds,
      subType:1,
      scoreType: mergeScoreType,
      isTotal: mergeTotal,
      isFilter: mergeFilter
    }
  })
  const {conversionParam, examParam, mergeSubParam} = toRefs(data)

  function conversion(subName: string, subId: string) {
    conScore.value = true
    conType.value = '1'
    conValue.value = '1'
    conScoreValue.value = '0'
    conversionParam.value.subjectId = subId
    conversionSub.value = "成绩折算-" + subName
  }

  function conFun() {
    conversionApi(conversionParam.value).then((res: any) => {
      if (res.success) {
        ElMessage.success('折算分数成功 !')
        conScore.value = false
        getAllSubjects()
      } else {
        conScore.value = false
        ElMessage.error('折算分数失败!')
      }
    })
  }

  function cancelCon(subName: string, subId: string) {
    conCancel.value = true
    cancelSubName.value = subName
    cancelSubId.value = subId
  }

  function cancelFun() {
    cancelConApi(cancelSubId.value, examId).then((res: any) => {
      if (res.success) {
        conCancel.value = false
        ElMessage.success('取消成功 !')
        getAllSubjects()
      } else {
        conCancel.value = false
        ElMessage.error('取消失败!')
      }
    })
  }


  function getAllSubjects() {
    baseSetting(examId).then((res) => {
      subjects.value = res.data.data
      exam.value = res.data.exam
      value.value = exam.value.examMode
      selOpen.value = exam.value.published + ''
      selRank.value = exam.value.rankShow + ''
      if (0 === exam.value.studCheck) {
        selScore.value = '1'
      } else {
        selScore.value = exam.value.studCheck + ''
      }
    }).catch((e) => {
      ElMessage.error('查询失败')
    })
  }

  function changeExam() {
    changeExamApi(examParam.value).then((res) => {
      ElMessage.success('修改成功 !')
    })
  }

  function mergeSubBtn() {
    mergeSub.value = true
    console.log(subNumList.subNum);
    if (selSubIdList.value.length > 1) {
      selSubNum.value = false
      selSubNum1.value = true
      showSub.value = true
    } else {
      selSubNum.value = true
      selSubNum1.value = false
      showSub.value = false
    }
    nuwSubName.value = ''
    mergeScoreType.value = '1'
    mergeTotal.value = '0'
    mergeFilter.value = '0'
    mergeScoreSubType.value = '1'
    changeType()
  }

  function changeType() {
    if (mergeScoreSubType.value == 3) {
      showSub.value = false;
    } else {
      showSub.value = true;
    }
    if (mergeScoreSubType.value == 2) {
      showRank.value = true;
    } else {
      showRank.value = false;
    }
  }

  function delSub(subId: any,subName: any){
    delSubName.value = subName
    delSubId.value = subId
    delSubShow.value = true
  }

  function clearSub() {
    deleteSub(examId, delSubId.value).then((res) => {
      if (res.success) {
        ElMessage.success('删除成功 !')
        delSubShow.value = false
        getAllSubjects()
      } else {
        ElMessage.error('删除失败!')
      }
    })
  }

  function mergeSubFun() {
    mergeSubParam.value.subNumList = subNumList.subNum;
    if(selSubIdList.value.length > 1){
      if(null == mergeSubParam.value.newName || mergeSubParam.value.newName==''){
        ElMessage.error('请填写合成科目的名称!')
        return
      }
      if (mergeScoreSubType.value == 1) {
        scoreMerge(mergeSubParam.value).then((res) =>{
          if (res.success) {
            ElMessage.success('合并成功 !')
            getAllSubjects()
          } else {
            ElMessage.error('合并失败!')
          }
        })
      } else if (mergeScoreSubType.value == 2) {
        scoreMergeRanking(mergeSubParam.value).then((res) =>{
          if (res.success) {
            ElMessage.success('合并成功 !')
            getAllSubjects()
          } else {
            ElMessage.error('合并失败!')
          }
        })
      } else {
        scoreMergeX(mergeSubParam.value).then((res) =>{
          if (res.success) {
            ElMessage.success('合并成功 !')
            getAllSubjects()
          } else {
            ElMessage.error('合并失败!')
          }
        })
      }
      mergeSub.value = false
    }else{
      ElMessage.error('请至少选择两个科目!')
    }

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

  :deep(.el-input__inner) {
    height: 32px !important;
  }


  :deep(.el-input-group__append, .el-input-group__prepend) {
    background-color: #ffffff;
    color: #808080;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 0;
    border-radius: var(--el-input-border-radius);
     padding: 0 0;
    width: 25px;
    white-space: nowrap;
    text-align: center;
  }
  .merge-title {
    height: 19px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #202020;
    line-height: 19px;
  }

  .merge-title1 {
    width: 100px;
    height: 32px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #202020;
    line-height: 32px;
    text-align: left;
  }

  .merge-wrong {
    height: 24px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #FF3333;
    line-height: 24px;
  }

  .merge-input {
    width: 100px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #D5DAE5;
  }

  .charts-class {
    width: 100%;
    height: 450px;
    background: #F8FBFF;
  }

  .con-text-style {
    height: 19px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #202020;
    line-height: 19px;
  }

  .con-sub-style {
    height: 24px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FF3333;
    line-height: 24px;
  }

  .select-style {
    width: 150px;
  }

  .select-style1 {
    width: 100px;
  }


  .con-input {
    width: 100px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #D5DAE5;
  }

  .a-style {
    width: 89px;
    height: 22px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #4381E5;
    line-height: 22px;
  }

  .a-style1 {
    width: 89px;
    height: 22px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FF3333;
    line-height: 22px;
  }

  .del-style {
    margin-left: 20px;
    height: 22px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FF3333;
    line-height: 22px;
  }

  .margin-left25 {
    margin-left: 25px;
  }

  .title-style {
    height: 22px;
    width: 88px;
    font-size: 15px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #202020;
    line-height: 22px;
  }

  .title-style2 {
    width: 78px;
    line-height: 40px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #202020;
  }

  .title-style1 {
    height: 22px;
    width: 367px;
    font-size: 15px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #202020;
    line-height: 22px;
  }

  .title-value {
    flex: 1;
    height: 22px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #808080;
    line-height: 22px;
  }

  .container {
    width: 100%;

    .line-container {
      display: flex;
      height: 32px;
      line-height: 32px;

      .left {
        width: 1100px
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
      width: 100px;
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
