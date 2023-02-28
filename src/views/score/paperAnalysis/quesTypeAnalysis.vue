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
    </div>
    <div class="line-container">
      <div class="left">班级类型</div>
      <div class="middle">
        <el-radio-group v-model="scoreLevel" @change="changeData" class="ml-4">
          <el-radio label="0">行政班</el-radio>
          <el-radio label="1">教学班</el-radio>
        </el-radio-group>
      </div>
      <div class="right" style="text-align: right;">
        <el-button class="btn" @click="showAddModel">自定义题型</el-button>
        <el-button class="btn" @click="exportQuesTypeResult">导出</el-button>
      </div>
    </div>
    <div>
      <el-table
          style="width: 100%;"
          :data="columnsData"
          :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
          :cell-style="{'text-align': 'center',}"
          border
          stripe
      >
        <el-table-column fixed prop="className" label="班级"/>
        <el-table-column v-if="columnsData.length>0" v-for="(data,index) in columnsData[0].data" :key="index+'ss'"
                         align="center"
                         :label="data">
          <el-table-column :label="columnsData[0][`quesTypeScore${index}`]">
            <el-table-column :label="columnsData[0][`quesTypeQuesNos${index}`]">
              <el-table-column label="平均分" :prop="`scoreAvg${index}`"/>
              <el-table-column label="得分率" :prop="`scoreRate${index}`"/>
              <el-table-column label="最高分" :prop="`maxScore${index}`"/>
              <el-table-column label="最低分" :prop="`minScore${index}`"/>
              <el-table-column label="满分人数" :prop="`correctNumber${index}`"/>
              <el-table-column label="合格率" :prop="`passRate${index}`"/>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <Dialog :visible="showAdd" :title="'自定义题型设置'" :width="'910px'" @dialogVisible="quesTypeDialog">
    <template #content>
      <div class="text-style">
        如需新增题型分析，请点击“<span class="text-bold">新增题型</span>”后，
        在右侧填入新的题型名称已经选择好该题型包含的试题，点击<span class="text-bold">保存</span>；如修改题型包含试题，
        点击<span class="text-bold">修改</span>后，在右侧显示的结果内进行修改，修改完成后点击<span
          class="text-bold">保存</span>。
        <span class="text-red">所有结果添加/修改好后需点击</span><span class="text-red text-bold">确定</span><span
          class="text-red">！</span>
      </div>
      <div style="display: flex;">
        <div style="width: 600px; height: 500px;">
          <el-scrollbar style="height: 500px;">
            <el-table
                style="width: 100%;"
                :data="quesTypeData"
                :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
                :cell-style="{'text-align': 'center',}"
                border
                stripe
            >
              <el-table-column type="index" align="center" width="80px" label="序号"/>
              <el-table-column prop="quesType" width="90px" label="题型"/>
              <el-table-column prop="quesNos" label="题号"/>
              <el-table-column align="center" width="120px" label="操作">
                <template #default="scope">
                  <a class="cge" @click="editQuesType(scope.row, scope.$index)">修改</a>
                  <a class="del" @click="deleteRow(scope.$index)">删除</a>
                </template>
              </el-table-column>
            </el-table>
            <div class="add-btn" @click="addQuesType">
              <span class="plus-img">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              新增题型
            </div>
          </el-scrollbar>
        </div>
        <div class="ques-list-style">
          <div class="ques-list-show">
            <el-input v-model="addQuesTypeName" class="btn-name-style" placeholder="题型名称"/>
            <el-scrollbar style="margin-top: 10px; height: 400px;">
              <el-tree
                  node-key="id"
                  :data="showQuesList"
                  ref="treeRef"
                  show-checkbox
                  :default-expanded-keys="checkItemArr"
                  :default-checked-keys="checkItemArr"
              />
            </el-scrollbar>
          </div>
          <div class="ques-list-save">
            <el-button class="btn-dis" v-show="!btnDis" @click="saveDis">保存</el-button>
            <el-button class="btn-cli" v-show="btnDis" @click="getCheckedNodes">保存</el-button>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div style="text-align: right;">
        <el-button type="default" style="width: 100px;height: 32px;background: #ECF4FF;" @click="quesTypeDialog(false)">
          取消
        </el-button>
        <el-button type="primary" style="width: 100px;height: 32px" @click="saveQuesTypeSet">确定</el-button>
      </div>
    </template>
  </Dialog>
  <progress-notify
      v-model="dialogVisible"
      :notify-data="notifyData"
      :stroke-width="18"
      @visibleChange="dialogVisibleChange"
      @statusChange="statusChange"
  >

  </progress-notify>
</template>

<script setup lang="ts">

import {
  getAllSubjectsApi,
  findPaperResultApi,
  getAllPaperSubjectsApi,
  saveQuesTypeSetApi,
  getQuesKnowAbility,
  exportManyRate,
  exportQuesKnowAbility,
  getManyRate,
  findResultBySubNameAndQue,
  findQuesTypeResult,
  exportPaperKnowledge, exportPaperQuesType
} from "@/api/analysis"
import {ElMessage} from 'element-plus'
import router from "@/router";


const {VITE_GLOB_API_URL} = process.env
const route = useRoute()
const examId: any = route.query.examId
const {proxy} = getCurrentInstance() as any
const subjects = ref<any>([])
const curSubId = ref<any>('')
const curSubName = ref<any>('')
const scoreLevel = ref<string>('1')
const columnsData = ref<any>([])
const showAdd = ref(false)
const quesTypeData = ref<any>([])
const btnDis = ref(false)
const addQuesTypeName = ref<any>('')
const disQuesSel = ref(true)
const objChildren = ref<any>([])
const subjChildren = ref<any>([])
const treeRef = ref()
const showQuesList = [
  {
    id: 1,
    label: '客观题',
    children: objChildren,
    'disabled': disQuesSel
  }, {
    id: 2,
    label: '主观题',
    children: subjChildren,
    'disabled': disQuesSel
  },
]
const checkItemArr = ref<any>([])
const editIndex = ref<any>()
const dialogVisible = ref<boolean>(false)
const notifyData = ref<any>({})

function dialogVisibleChange(f: any) {
  dialogVisible.value = f
}

function statusChange(f: any) {

}

watch(() => dialogVisible, (newVal) => {
  if (!newVal.value) {
    notifyData.value = {}
  }
})
proxy.$socket.off('notify').on('notify', (res: any) => {
  if (res && res.notifyId === 'analysisExam') {
    notifyData.value = res
  }
  if (res.percent === 100) {
    dialogVisible.value = false
    findResult()
  }
});

function getAllSubjects() {
  getAllPaperSubjectsApi(examId).then((res: any) => {
    res = res.filter((currentValue: any, index: number, arr: any, thisValue: any) => {
      return !currentValue.total
    })
    subjects.value = res
    if (subjects.value.length > 0) {
      curSubId.value = subjects.value[0].id
      curSubName.value = subjects.value[0].subName
      findResult()
    }
  }).catch((e) => {
    ElMessage.error('查询失败')
  })
}

function findResult() {
  findQuesTypeResult(examId, curSubId.value, scoreLevel.value).then((res: any) => {
    columnsData.value = []
    const classResultsList = res.classResultsList
    const schoolResultsList = res.schoolResultsList
    const classNameList = res.classNames
    const questionsVos = res.questionsVos
    const eExamQuesTypeMapVoList = res.eExamQuesTypeMapVoList
    let column: any = {
      'className': '全部',
      data: []
    }
    let typeNameList = [];
    for (let v = 0; v < eExamQuesTypeMapVoList.length; v++) {
      const vo = eExamQuesTypeMapVoList[v]
      typeNameList.push(vo.quesTypeName)
    }
    let count = 0
    quesTypeData.value = []
    for (let x = 0; x < eExamQuesTypeMapVoList.length; x++) {
      let typeNumCount = 0;
      //获取当前题型的全部试题
      const quesList = eExamQuesTypeMapVoList[x].eExamQuestionTypeList
      const typeName = eExamQuesTypeMapVoList[x].quesTypeName
      let quesTypeQuesNos = ''
      let quesTypeQuesIds = []
      let createTime = new Date()
      for (let q = 0; q < quesList.length; q++) {
        if (q === quesList.length - 1) {
          quesTypeQuesNos += quesList[q].quesNo
        } else {
          quesTypeQuesNos += quesList[q].quesNo + ","
        }
        quesTypeQuesIds.push(quesList[q].quesId)
        createTime = quesList[q].createTime
      }
      //题型
      const quesTypeVo: any = {
        'quesType': typeName,
        'quesNos': quesTypeQuesNos,
        'quesTypeQuesIds': quesTypeQuesIds,
        'createTime': createTime
      }
      quesTypeData.value.push(quesTypeVo)
      column['quesTypeName' + count] = typeName
      column['quesTypeQuesNos' + count] = "对应小题：" + quesTypeQuesNos

      for (let s = 0; s < schoolResultsList.length; s++) {
        const schoolRes = schoolResultsList[s]
        if (typeName === schoolRes.typeName) {
          column['scoreAvg' + count] = schoolRes.scoreAvg
          column['scoreRate' + count] = schoolRes.scoreRate
          column['maxScore' + count] = schoolRes.maxScore
          column['minScore' + count] = schoolRes.minScore
          column['correctNumber' + count] = schoolRes.correctNumber
          column['passRate' + count] = schoolRes.passRate
          column['quesTypeScore' + count] = "分值：" + schoolRes.scoreTotal
          typeNumCount ++
        }
      }
      if(typeNumCount === 0){
        column['scoreAvg' + count] = '-'
        column['scoreRate' + count] =  '-'
        column['maxScore' + count] =  '-'
        column['minScore' + count] =  '-'
        column['correctNumber' + count] = '-'
        column['passRate' + count] =  '-'
        column['quesTypeScore' + count] = "分值：0"
      }
      count++
    }
    column.data = typeNameList
    columnsData.value.push(column)
    for (let classNum in classNameList) {
      count = 0
      const className = classNameList[classNum]
      let columnClass: any = {
        'className': className,
        data: []
      }
      for (let x = 0; x < eExamQuesTypeMapVoList.length; x++) {
        let typeNumCount = 0;
        //获取当前题型的全部试题
        const quesList = eExamQuesTypeMapVoList[x].eExamQuestionTypeList
        const typeName = eExamQuesTypeMapVoList[x].quesTypeName
        let quesTypeQuesNos = ''
        for (let q = 0; q < quesList.length; q++) {
          if (q === quesList.length - 1) {
            quesTypeQuesNos += quesList[q].quesNo
          } else {
            quesTypeQuesNos += quesList[q].quesNo + ","
          }
        }
        columnClass['quesTypeName' + count] = typeName
        columnClass['quesTypeQuesNos' + count] = "对应小题：" + quesTypeQuesNos
        for (let s = 0; s < classResultsList.length; s++) {
          const classRes = classResultsList[s]
          if (typeName === classRes.typeName && className === classRes.className) {
            columnClass['scoreAvg' + count] = classRes.scoreAvg
            columnClass['scoreRate' + count] = classRes.scoreRate
            columnClass['maxScore' + count] = classRes.maxScore
            columnClass['minScore' + count] = classRes.minScore
            columnClass['correctNumber' + count] = classRes.correctNumber
            columnClass['passRate' + count] = classRes.passRate
            columnClass['quesTypeScore' + count] = "分值：" + classRes.scoreTotal
            typeNumCount ++
          }
        }
        if(typeNumCount === 0){
          columnClass['scoreAvg' + count] = "-"
          columnClass['scoreRate' + count] = "-"
          columnClass['maxScore' + count] = "-"
          columnClass['minScore' + count] = "-"
          columnClass['correctNumber' + count] = "-"
          columnClass['passRate' + count] = "-"
          columnClass['quesTypeScore' + count] = "分值：0"
        }
        count++
      }
      columnClass.data = typeNameList
      columnsData.value.push(columnClass)
    }
    objChildren.value = []
    subjChildren.value = []
    for (let q = 0; q < questionsVos.length; q++) {
      const quesVo = questionsVos[q]
      const que: any = {
        'id': quesVo.quesId,
        'label': quesVo.fullNo,
        'disabled': disQuesSel
      }
      //0 主观题 1 客观题
      if (quesVo.subjObje === 1) {
        objChildren.value.push(que)
      } else {
        subjChildren.value.push(que)
      }
    }
  })
}

const resetChecked = () => {
  treeRef.value.setCheckedKeys([])
}

function saveDis() {
  ElMessage.warning('请先点击新增题型！')
}

const getCheckedNodes = () => {
  const selList = treeRef.value.getCheckedNodes(false, false)
  const typeName = addQuesTypeName.value
  let quesTypeQuesNos = ''
  if (!typeName) {
    ElMessage.warning('请填写试题名称！')
    return
  }
  if (selList.length == 0) {
    ElMessage.warning('请选择试题！')
    return
  }
  let quesTypeQuesIds = []
  for (let s = 0; s < selList.length; s++) {
    if (selList[s].label == "客观题" || selList[s].label == "主观题") {
      continue
    }
    if (s == selList.length - 1) {
      quesTypeQuesNos += selList[s].label
    } else {
      quesTypeQuesNos += selList[s].label + ","
    }
    quesTypeQuesIds.push(selList[s].id)
  }
  const quesTypeVo: any = {
    'quesType': typeName,
    'quesNos': quesTypeQuesNos,
    'quesTypeQuesIds': quesTypeQuesIds,
    'createTime': new Date()
  }
  if (editIndex.value >= 0) {
    // 修改保存
    quesTypeData.value[editIndex.value] = quesTypeVo
  } else {
    // 新增保存
    quesTypeData.value.push(quesTypeVo)
  }
  btnDis.value = false
  disQuesSel.value = true
  addQuesTypeName.value = ''
  checkItemArr.value = []
  treeRef.value.setCheckedKeys([])
}

function showAddModel() {
  showAdd.value = true
  btnDis.value = false
  disQuesSel.value = true
  addQuesTypeName.value = ''
  checkItemArr.value = []
}

function addQuesType() {
  btnDis.value = true
  disQuesSel.value = false
  editIndex.value = -1
  addQuesTypeName.value = ''
  treeRef.value.setCheckedKeys([])
}

const deleteRow = (index: number) => {
  quesTypeData.value.splice(index, 1)
  ElMessage.success('删除成功！')
}

const editQuesType = (quesType: any, index: any) => {
  checkItemArr.value = []
  editIndex.value = index
  if (quesType && quesType.quesTypeQuesIds.length > 0) {
    addQuesTypeName.value = quesType.quesType
    treeRef.value.setCheckedKeys(quesType.quesTypeQuesIds)
    btnDis.value = true
    disQuesSel.value = false
    checkItemArr.value = quesType.quesTypeQuesIds
  }
}

const saveQuesTypeSet = () => {
  let saveData: any = {}
  saveData.examId = examId
  saveData.subId = curSubId.value
  let quesTypeVos = []
  for (const quesType of quesTypeData.value) {
    let quesTypeVo: any = {}
    quesTypeVo.quesTypeName = quesType.quesType
    quesTypeVo.quesNoList = quesType.quesNos.split(',')
    quesTypeVo.quesIdList = quesType.quesTypeQuesIds
    quesTypeVo.createTime = quesType.createTime
    quesTypeVos.push(quesTypeVo)
  }
  saveData.examQuesTypeVo = quesTypeVos

  saveQuesTypeSetApi(saveData).then((res: any) => {
    console.log(res);
    if (res.success) {
      showAdd.value = false
      dialogVisible.value = true
      ElMessage.success('保存成功！')
    }
  })
}

function changeData() {
  findResult()
}

function exportQuesTypeResult() {
  exportPaperQuesType(examId, scoreLevel.value).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '题型分析结果.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

const quesTypeDialog = (key: boolean) => {
  showAdd.value = key
}


onMounted(() => {
  getAllSubjects()
})

</script>

<style lang="scss" scoped>
:deep(.el-table) {
  thead.is-group tr:nth-child(2) .el-table__cell {
    left: 0 !important;
  }
}

.container {
  width: 100%;

  .line-container {
    display: flex;
    height: 50px;
    line-height: 50px;

    .left {
      width: 80px;
    }

    .left1 {
      width: 1110px;
    }

    .middle {
      flex: 1;
    }

    .right {
      width: 210px;
    }
  }

  .btn {
    background-color: #4381E5;
    color: #FFFFFF;
    font-size: 12px;
  }

  .title-style {
    height: 22px;
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #202020;
    line-height: 50px;
  }

  .edit-img {
    width: 20px;
    height: 20px;
    background: url('@/assets/edit.png') 100% no-repeat;
    background-size: 100% 100%;
    line-height: 20px;
  }

  .complete-img {
    width: 20px;
    height: 20px;
    background: url('@/assets/complete.png') 100% no-repeat;
    background-size: 100% 100%;
    line-height: 20px;
  }

  .edit-img-style {
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
}

.text-style {
  height: 60px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #202020;
  line-height: 26px;
}

.text-bold {
  font-weight: bold;
}

.text-red {
  color: #FF3333;
}

.cge {
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #4381E5;
  line-height: 22px;
}

.del {
  margin-left: 15px;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #FF3333;
  line-height: 22px;
}

.ques-list-style {
  flex: 1;
  margin-left: 20px;
  width: 250px;
  height: 500px;
  background: #FFFFFF;
  border: 1px solid #D5DAE5;
}

.ques-list-show {
  height: 460px;
}

.ques-list-save {
  width: 249px;
  height: 39px;
  background: #FFFFFF;
  border-top: 1px solid #D5DAE5;
  border-right: 1px solid #D5DAE5;
  border-bottom: 1px solid #D5DAE5;
  text-align: right;
}

.btn-dis {
  width: 50px;
  height: 24px;
  background: #C2C2C2;
  border-radius: 4px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #FFFFFF;
  line-height: 16px;
  margin-top: 7px;
  margin-right: 15px;
}

.btn-cli {
  width: 50px;
  height: 24px;
  background: #4381E5;
  border-radius: 4px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #FFFFFF;
  line-height: 16px;
  margin-top: 7px;
  margin-right: 15px;
}

.btn-name-style {
  width: 215px;
  height: 32px;
  background: #FFFFFF;
  margin-top: 10px;
  margin-left: 10px;
}

.plus-img {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px !important;
  background: url('@/assets/plus.png') 100% no-repeat;
  background-size: 100% 100%;
  line-height: 20px;
  margin-right: 2px;
}

.add-btn {
  cursor: pointer;
  margin-top: 15px;
  height: 19px;
  font-size: 14px;
  color: #4381E5;
  line-height: 19px;
}
</style>
