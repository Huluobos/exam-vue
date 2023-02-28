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
      <div class="left1 title-style">知识点、能力点标注</div>
      <div class="right" style="text-align: right">
        <el-button class="btn" @click="exportKnowAbi">导出细目表</el-button>
        <el-button class="btn" @click="edit" v-show="showEditBtn">
          <div class="edit-img edit-img-style">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          编辑
        </el-button>
        <el-button class="btn" v-show="showAddBtn" @click="save">
          <div class="complete-img edit-img-style">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          完成
        </el-button>
        <form ref="form_ExcelExport" action="" method="post">
          <input type="hidden" name="param">
        </form>
      </div>
    </div>
    <div>
      <el-table
          style="width: 100%"
          :data="quesKnowAbi"
          :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
          :cell-style="{'text-align': 'center',}"
          border
          stripe
      >
        <el-table-column sortable :sort-method="compareString" prop="quesNo" label="题号" width="90"/>
        <el-table-column sortable prop="quesType" label="题型" width="100"/>
        <el-table-column sortable prop="quesScore" label="分值" width="90"/>
        <el-table-column sortable prop="knowNames" label="知识点">
          <template #default="scope">
            <span v-if="null != scope.row.knowNames && ''!== scope.row.knowNames ">{{ scope.row.knowNames }}</span>
            <span v-else v-show="showEmpty">-</span>
            <span v-show="addShow" @click="addKnow(scope.row)"
                  class="plus-img">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="abilityNames" label="能力点">
          <template #default="scope">
            <span v-if="null != scope.row.abilityNames && ''!== scope.row.abilityNames">{{
                scope.row.abilityNames
              }}</span>
            <span v-else v-show="showEmpty">-</span>
            <span v-show="addShow" class="plus-img"
                  @click="addAbility(scope.row)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="line-container">
      <div class="left1 title-style">知识点分析</div>
    </div>
    <div class="line-container">
      <div class="left text-style" style="line-height: 44px;">班级类型</div>
      <div class="middle">
        <el-radio-group v-model="scoreLevel" @change="getKnowResult" class="ml-4">
          <el-radio label="1" class="text-style">行政班</el-radio>
          <el-radio label="4" class="text-style">教学班</el-radio>
        </el-radio-group>
      </div>
      <div class="right" style="text-align: right;">
        <el-button class="btn" @click="exportKnowResult">导出</el-button>
      </div>
    </div>
    <div v-show="showKnowTable">
      <el-table
          style="width: 100%"
          :data="columnsData"
          :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
          :cell-style="{'text-align': 'center',}"
          border
          stripe
      >
        <el-table-column sortable fixed prop="knowName" label="知识点"/>
        <el-table-column sortable fixed prop="knowScore" label="分值"/>
        <el-table-column sortable fixed prop="knowQuesNos" label="小题"/>
        <el-table-column v-if="columnsData.length>0" v-for="(data,index) in columnsData[0].data" :key="index+'ss'"
                         align="center"
                         :label="data">
          <el-table-column label="平均分" :prop="`avgScore${index}`"></el-table-column>
          <el-table-column label="得分率" :prop="`scoreRate${index}`"></el-table-column>
        </el-table-column>

      </el-table>
    </div>
    <div v-show="showKnowEmpty" style="text-align: center; height: 180px;">
      <div class="empty-img"></div>
      <div class="empty-style">尚未标注知识点！</div>
    </div>
    <div class="line-container">
      <div class="left1 title-style">能力点分析</div>
    </div>
    <div class="line-container">
      <div class="left text-style" style="line-height: 44px;">班级类型</div>
      <div class="middle">
        <el-radio-group v-model="scoreLevelAbi" @change="getAbiResult" class="ml-4">
          <el-radio label="1" class="text-style">行政班</el-radio>
          <el-radio label="4" class="text-style">教学班</el-radio>
        </el-radio-group>
      </div>
      <div class="right" style="text-align: right">
        <el-button class="btn" @click="exportAbilityResult">导出</el-button>
      </div>
    </div>
    <div v-show="showAbilityTable">
      <el-table
          style="width: 100%;"
          :data="columnsAbiData"
          :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
          :cell-style="{'text-align': 'center',}"
          border
          stripe
      >
        <el-table-column sortable fixed prop="abilityName" label="能力点"/>
        <el-table-column sortable fixed prop="abilityScore" label="分值"/>
        <el-table-column sortable fixed prop="abilityQuesNos" label="小题"/>
        <el-table-column v-if="columnsAbiData.length>0" v-for="(data,index) in columnsAbiData[0].data" :key="index+'ss'"
                         align="center"
                         :label="data">
          <el-table-column label="平均分" :prop="`avgScore${index}`"></el-table-column>
          <el-table-column label="得分率" :prop="`scoreRate${index}`"></el-table-column>
        </el-table-column>

      </el-table>
    </div>
    <div v-show="showAbilityEmpty" style="text-align: center; height: 180px;">
      <div class="empty-img"></div>
      <div class="empty-style">尚未标注能力点！</div>
    </div>
  </div>
  <Dialog
      v-if="showKnow"
      :title="addDialogTitle"
      :visible="showKnow"
      @dialogVisible="dialogSelectVisible"
      :width="'660px'"
  >
    <template #content>
      <div style="padding: 10px;display: flex;justify-content: space-between;">
        <div style="width: 300px;height: 480px;background: #FFFFFF;border-radius: 4px;border: 1px solid #D5DAE5;">
          <div
              style="height: 40px;background: #D3E0F4;text-align: center;line-height: 40px;color: #202020;font-size: 14px;">
            知识点目录
          </div>
          <div style="padding: 10px 10px 0;height: 438px;width: 300px;overflow: auto">
            <el-input v-model="filterText" placeholder="请输入搜索信息"/>
            <el-tree
                ref="treeKnowRef"
                :data="treeData"
                :props="defaultProps"
                :filter-node-method="filterKnowNode"
                :default-expanded-keys="checkItemArr"
                :default-checked-keys="checkItemArr"
                show-checkbox
                node-key="knowCode"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                :check-strictly="true"
                @check="check"
            />
          </div>
        </div>
        <div>
          <div
              @click="addQuesKnow"
              style="width: 32px;height: 32px;background: #D5DAE5;border-radius: 4px;margin-top: 142px;text-align: center;line-height: 32px;cursor: pointer;user-select: none">
            <SvgIcon class-name="myIcon" icon-class="arrow-right-grey"></SvgIcon>
          </div>
        </div>
        <div style="width: 200px;height: 480px;background: #FFFFFF;border: 1px solid #D5DAE5;">
          <div
              style="height: 40px;background: #D3E0F4;text-align: center;line-height: 40px;color: #202020;font-size: 14px;position: relative;user-select: none">
            添加
            <div style="position: absolute;top: 0;right: 10px;font-size: 12px;color: #4381E5;cursor: pointer"
                 @click="clearQuesKnow">清空
            </div>
          </div>
          <div v-for="know in quesKnows" style="display: flex;justify-content: space-between;padding-top: 5px">
            <div style="margin-left: 5px;white-space:pre-wrap;width: 140px;line-height: 22px;">{{ know.knowName }}</div>
            <div style="color: #FF3333;margin-right: 10px;line-height: 22px;height: 22px;cursor: pointer"
                 @click="removeQuesKnow(know.knowCode)">删除
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div style="text-align: right;">
        <el-button style="width: 100px; height: 32px;background: #ECF4FF;" @click="dialogSelectVisible(false)">取消
        </el-button>
        <el-button type="primary" style="width: 100px; height: 32px;" @click="saveQuesKnow">确定</el-button>
      </div>
    </template>
  </Dialog>
  <Dialog
      v-if="showAbility"
      :title="addDialogTitle"
      :visible="showAbility"
      @dialogVisible="dialogSelectAbilityVisible"
      :width="'660px'"
  >
    <template #content>
      <div style="padding: 10px;display: flex;justify-content: space-between;">
        <div style="width: 300px;height: 480px;background: #FFFFFF;border-radius: 4px;border: 1px solid #D5DAE5;">
          <div
              style="height: 40px;background: #D3E0F4;text-align: center;line-height: 40px;color: #202020;font-size: 14px;">
            能力点目录
          </div>
          <div style="padding: 10px 10px 0;height: 438px;width: 300px;overflow: auto">
            <el-input v-model="filterText" placeholder="请输入搜索信息"/>
            <el-tree
                ref="treeAbilityRef"
                :data="abilityTreeData"
                :props="defaultAbilityProps"
                :filter-node-method="filterAbilityNode"
                :default-expanded-keys="checkItemArr"
                :default-checked-keys="checkItemArr"
                show-checkbox
                node-key="typeName"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                :check-strictly="true"
                @check="checkAbility"
            />
          </div>
        </div>
        <div>
          <div
              @click="addQuesAbility"
              style="width: 32px; height: 32px;background: #D5DAE5;border-radius: 4px;margin-top: 142px;text-align: center;line-height: 32px;cursor: pointer;user-select: none">
            <SvgIcon class-name="myIcon" icon-class="arrow-right-grey"></SvgIcon>
          </div>
        </div>
        <div style="width: 200px;height: 480px;background: #FFFFFF;border: 1px solid #D5DAE5;">
          <div
              style="height: 40px;background: #D3E0F4;text-align: center;line-height: 40px;color: #202020;font-size: 14px;position: relative;user-select: none">
            添加
            <div style="position: absolute;top: 0;right: 10px;font-size: 12px;color: #4381E5;cursor: pointer"
                 @click="clearQuesAbility">清空
            </div>
          </div>
          <div v-for="ability in quesAbilities" style="display: flex;justify-content: space-between;padding-top: 5px">
            <div style="margin-left: 5px;white-space:pre-wrap;width: 140px;line-height: 22px;">{{ ability }}</div>
            <div style="color: #FF3333;margin-right: 10px;line-height: 22px;height: 22px;cursor: pointer"
                 @click="removeQuesAbility(ability)">删除
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div style="text-align: right;">
        <el-button style="width: 100px; height: 32px;background: #ECF4FF;" @click="dialogSelectAbilityVisible(false)">取消
        </el-button>
        <el-button type="primary" style="width: 100px; height: 32px;" @click="saveQuesAbility">确定</el-button>
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
  analysisKnowAbi, exportPaperAbility,
  exportPaperKnowledge,
  exportQuesKnowAbility, findAbiResultBySubNameAndQue,
  findResultBySubNameAndQue,
  getAllPaperSubjectsApi,
  getQuesKnowAbility, queryAbilityByPeriodSubNameApi,
  queryKnowByPeriodSubNameApi, saveQuesAbilityRelationshipApi,
  saveQuesKnowRelationshipApi, saveQuesTypeSetApi,
} from '@/api/analysis'
import {compareString} from '@/util/compare'
import {ElMessage} from 'element-plus/es'
import {ref} from '@vue/runtime-core'
import {getExamScoreTaskByIdApi} from '@/api/scoreManage'

const route = useRoute()
const examId: any = route.query.examId

const subjects = ref<any>([])
const curSubId = ref<any>('')
const curSubName = ref<any>('')
const scoreLevel = ref<string>('4')
const scoreLevelAbi = ref<string>('4')
const columnsData = ref<any>([])
const columnsAbiData = ref<any>([])
const quesKnowAbi = ref<any>([])
const titleNames = ref<any>([])
const showEmpty = ref(true)
const addShow = ref(false)
const showEditBtn = ref(true)
const showAddBtn = ref(false)
const showKnow = ref(false)
const showAbility = ref(false)
const treeData = ref<any>()
const abilityTreeData = ref<any>()
const examInfo = ref<any>()
const runCount = ref<any>(0)
const addDialogTitle = ref<any>('')
const filterText = ref<any>()

const showAbilityTable = ref(false)
const showKnowTable = ref(false)
const showKnowEmpty = ref(true)
const showAbilityEmpty = ref(true)
const defaultProps = {
  children: 'children',
  label: 'knowName',
}
const defaultAbilityProps = {
  children: 'children',
  label: 'typeName',
}
const checkItemArr = ref<any>([])
const knowCodes = ref<any>([])
const quesKnows = ref<any>([])
const abilityNames = ref<any>([])
const quesAbilities = ref<any>([])
const curQuesId = ref<any>()
const treeKnowRef = ref()
const treeAbilityRef = ref()

const data = reactive({
  saveQuesKnowParam: {
    examId: '',
    subjectId: '',
    quesId: '',
    knowList: [],
    abilities: [],
  }
})

const {saveQuesKnowParam} = toRefs(data)

let classNames = ref<any>([])
const {proxy} = getCurrentInstance() as any
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
    getKnowResult()
    getAbiResult()
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
      if(subjects.value[0].merged){
        showEditBtn.value = false
      }
      getAllKnowAndAbility()
    }
  }).catch((e) => {
    ElMessage.error('查询失败')
  })
}

function getQuesKnowAbi() {
  getQuesKnowAbility(examId, curSubId.value).then((res: any) => {
    quesKnowAbi.value = res.data
  })
}

function changeData() {
  for (let i = 0; i < subjects.value.length; i++) {
    if (subjects.value[i].id === curSubId.value) {
      curSubName.value = subjects.value[i].subName
      if(subjects.value[i].merged){
        showEditBtn.value = false
      }else{
        showEditBtn.value = true
      }
    }
  }
  getAllKnowAndAbility()
}

function edit() {
  showEmpty.value = false
  addShow.value = true
  showEditBtn.value = false
  showAddBtn.value = true
}

function save() {
  showEmpty.value = true
  addShow.value = false
  showEditBtn.value = true
  showAddBtn.value = false
  analysisKnowAbi(examId, curSubId.value).then((res:any) => {
    if(res.success){
      ElMessage.success('保存成功！')
      dialogVisible.value = true
      // getAllKnowAndAbility()
    }
  })
}

function addKnow(ques: any) {
  showKnow.value = true
  addDialogTitle.value = '知识点添加'
  knowCodes.value = []
  checkItemArr.value = []
  quesKnows.value = []
  if (ques.knowNames && ques.knowNames.length > 0) {
    const quesKnow = ques.knowNames.split(';')
    let each = findCurKnowByName(treeData.value, quesKnow)
    quesKnows.value = each
    checkItemArr.value = []
    if (each) {
      each.map((e: any) => checkItemArr.value.push(e.knowCode))
    }
  }
  knowCodes.value = checkItemArr.value
  curQuesId.value = ques.quesId
}

const addAbility = (ques: any) => {
  showAbility.value = true
  addDialogTitle.value = '能力点添加'
  checkItemArr.value = []
  if (ques.abilityNames && ques.abilityNames.length > 0) {
    checkItemArr.value = ques.abilityNames.split(';')
  }
  quesAbilities.value = [...checkItemArr.value]
  abilityNames.value = checkItemArr.value
  curQuesId.value = ques.quesId
}

const findCurKnowByName = (dataList: any, quesKnow: any) => {
  let result: any = []
  for (const d of dataList) {
    if (quesKnow.indexOf(d.knowName) >= 0) {
      result.push(d)
    }
    if (d.children) {
      let childResult = findCurKnowByName(d.children, quesKnow)
      if (childResult.length > 0) {
        result.push(...childResult)
      }
    }
  }
  return result
}

const findCurKnowByCode = (dataList: any, quesKnow: any) => {
  let result: any = []
  for (const d of dataList) {
    if (quesKnow.indexOf(d.knowCode) >= 0) {
      result.push(d)
    }
    if (d.children) {
      let childResult = findCurKnowByCode(d.children, quesKnow)
      if (childResult.length > 0) {
        result.push(...childResult)
      }
    }
  }
  return result
}

onMounted(() => {
  getAllSubjects()
})

function exportKnowAbi() {
  exportQuesKnowAbility(examId).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '双向细目表.xls')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

function exportKnowResult() {
  exportPaperKnowledge(examId, scoreLevel.value).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '知识点分析结果.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}
function exportAbilityResult() {
  exportPaperAbility(examId, scoreLevel.value).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '能力点分析结果.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

function getKnowResult() {
  findResultBySubNameAndQue(examId, curSubId.value, scoreLevel.value).then((res: any) => {
    columnsData.value = [];
    const knowQueNoMap = res.knowQueNoMap;
    const classResultsList = res.classResultsList;
    const schoolResultsList = res.schoolResultsList;
    classNames = res.classNames;
    let allNames = [];
    allNames.push('全部');
    allNames.push(...classNames)
    for (const knowName in knowQueNoMap) {
      let column: any = {
        'knowName': '',
        'knowScore': 0,
        'knowQuesNos': '',
        data: []
      }
      const quesNos = knowQueNoMap[knowName]
      let ques = '';
      for (let q = 0; q < quesNos.length; q++) {
        if (q == quesNos.length - 1) {
          ques += quesNos[q]
        } else {
          ques += quesNos[q] + ','
        }
      }
      column.knowQuesNos = ques
      for (let s = 0; s < schoolResultsList.length; s++) {
        const schoolResult = schoolResultsList[s]
        //学校下的知识点
        if (schoolResult.knowName === knowName) {
          column.knowName = knowName
          column.knowScore = schoolResult.scoreTotal
          column['avgScore0'] = schoolResult.scoreAvg
          column['scoreRate0'] = schoolResult.scoreRate
        }
      }
      column.data = allNames
      for (let c = 0; c < classNames.length; c++) {
        for (let r = 0; r < classResultsList.length; r++) {
          const classResult = classResultsList[r]
          if (classResult.knowName === knowName && classNames[c] === classResult.className) {
            column['avgScore' + (c + 1)] = classResult.scoreAvg
            column['scoreRate' + (c + 1)] = classResult.scoreRate
          }
        }
      }
      columnsData.value.push(column);
    }
    if (columnsData.value.length > 0) {
      showKnowEmpty.value = false
      showKnowTable.value = true
    } else {
      showKnowEmpty.value = true
      showKnowTable.value = false
    }
  })
}

function getAbiResult() {
  findAbiResultBySubNameAndQue(examId, curSubId.value, scoreLevelAbi.value).then((res: any) => {
    columnsAbiData.value = [];
    const abilityQueNoMap = res.abilityQueNoMap;
    const classResultsList = res.classResultsList;
    const schoolResultsList = res.schoolResultsList;
    classNames = res.classNames;
    let allNames = [];
    allNames.push('全部');
    allNames.push(...classNames)
    for (const abilityName in abilityQueNoMap) {
      let column: any = {
        'abilityName': '',
        'abilityScore': 0,
        'abilityQuesNos': '',
        data: []
      }
      const quesNos = abilityQueNoMap[abilityName]
      let ques = '';
      for (let q = 0; q < quesNos.length; q++) {
        if (q == quesNos.length - 1) {
          ques += quesNos[q]
        } else {
          ques += quesNos[q] + ','
        }
      }
      column.abilityQuesNos = ques
      for (let s = 0; s < schoolResultsList.length; s++) {
        const schoolResult = schoolResultsList[s]
        //学校下的知识点
        if (schoolResult.abilityName === abilityName) {
          column.abilityName = abilityName
          column.abilityScore = schoolResult.scoreTotal
          column['avgScore0'] = schoolResult.scoreAvg
          column['scoreRate0'] = schoolResult.scoreRate
        }
      }
      column.data = allNames
      for (let c = 0; c < classNames.length; c++) {
        for (let r = 0; r < classResultsList.length; r++) {
          const classResult = classResultsList[r]
          if (classResult.abilityName === abilityName && classNames[c] === classResult.className) {
            column['avgScore' + (c + 1)] = classResult.scoreAvg
            column['scoreRate' + (c + 1)] = classResult.scoreRate
          }
        }
      }
      columnsAbiData.value.push(column);
    }
    if (columnsAbiData.value.length > 0) {
      showAbilityEmpty.value = false
      showAbilityTable.value = true
    } else {
      showAbilityEmpty.value = true
      showAbilityTable.value = false
    }
  })

}

const getAllKnowAndAbility = () => {
  getExamScoreTaskByIdApi({examId: examId}).then((res: any) => {
    if (res.success) {
      examInfo.value = res.data
      queryKnowByPeriodSubName()
      queryAbilityByPeriodSubName()
      getQuesKnowAbi()
      getKnowResult()
      getAbiResult()
    }
  })
}

const queryKnowByPeriodSubName = () => {
  queryKnowByPeriodSubNameApi({period: examInfo.value.period, subName: curSubName.value}).then((res: any) => {
    if (res.success) {
      treeData.value = treeDataTranslate(res.data.reviewKnowsList)
    } else {
      ElMessage.error('知识点获取失败！')
    }
  }).catch(() => {
    ElMessage.error('知识点获取失败！')
  })
}

const queryAbilityByPeriodSubName = () => {
  queryAbilityByPeriodSubNameApi({period: examInfo.value.period, subName: curSubName.value}).then((res: any) => {
    if (res.success) {
      abilityTreeData.value = res.data.examAbilities
    } else {
      ElMessage.error('知识点获取失败！')
    }
  }).catch(() => {
    ElMessage.error('知识点获取失败！')
  })
}

const dialogSelectVisible = (key: boolean) => {
  showKnow.value = key
}

const treeDataTranslate = (data: any, id = 'knowCode', pid = 'parentCode') => {
  let res: any = []
  let temp: any = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

const filterKnowNode = (value: any, data: any) => {
  if (!value) return true
  return data.knowName.indexOf(value) !== -1
}

const filterAbilityNode = (value: any, data: any) => {
  if (!value) return true
  return data.typeName.indexOf(value) !== -1
}

const check = (data: any) => {
  if (knowCodes.value.includes(data.knowCode)) {
    knowCodes.value.splice(knowCodes.value.findIndex((obj: any) => obj === data.knowCode), 1)
  } else {
    knowCodes.value.push(data.knowCode)
  }
  checkItemArr.value = knowCodes.value
  addQuesKnow()
}

const checkAbility = (data: any) => {
  if (abilityNames.value.includes(data.typeName)) {
    abilityNames.value.splice(abilityNames.value.findIndex((obj: any) => obj === data.typeName), 1)
  } else {
    abilityNames.value.push(data.typeName)
  }
  checkItemArr.value = abilityNames.value
  addQuesAbility()
}

/**
 * 添加知识点到试题中
 */
const addQuesKnow = () => {
  quesKnows.value = findCurKnowByCode(treeData.value, knowCodes.value)
}

/**
 * 移除指定的知识点
 * @param knowCode
 */
const removeQuesKnow = (knowCode: any) => {
  let findIndex = knowCodes.value.findIndex((k: any) => k === knowCode)
  if (findIndex >= 0) {
    knowCodes.value.splice(findIndex, 1)
  }
  quesKnows.value = findCurKnowByCode(treeData.value, knowCodes.value)
  treeKnowRef.value.setCheckedKeys(knowCodes.value)
  checkItemArr.value = knowCodes.value
}

/**
 * 清空选中知识点
 */
const clearQuesKnow = () => {
  knowCodes.value = []
  treeKnowRef.value.setCheckedKeys(knowCodes.value)
  quesKnows.value = []
  checkItemArr.value = knowCodes.value
}

/**
 * 保存试题知识点关系
 */
const saveQuesKnow = () => {
  saveQuesKnowParam.value.quesId = curQuesId.value
  saveQuesKnowParam.value.examId = examId
  saveQuesKnowParam.value.subjectId = curSubId.value
  saveQuesKnowParam.value.knowList = quesKnows.value
  saveQuesKnowRelationshipApi(saveQuesKnowParam.value).then((res: any) => {
    if (res.success) {
      getQuesKnowAbi()
      dialogSelectVisible(false)
      getKnowResult()
    }
  })
}

const dialogSelectAbilityVisible = (key: boolean) => {
  showAbility.value = key
}

const addQuesAbility = () => {
  quesAbilities.value = [...abilityNames.value]
}

const removeQuesAbility = (typeName: any) => {
  let findIndex = abilityNames.value.findIndex((k: any) => k === typeName)
  quesAbilities.value = []
  if (findIndex >= 0) {
    abilityNames.value.splice(findIndex, 1)
    quesAbilities.value = [...abilityNames.value]
    treeAbilityRef.value.setCheckedKeys(abilityNames.value)
    checkItemArr.value = abilityNames.value
  }
}

const clearQuesAbility = () => {
  abilityNames.value = []
  treeAbilityRef.value.setCheckedKeys(abilityNames.value)
  quesAbilities.value = []
  checkItemArr.value = abilityNames.value
}

const saveQuesAbility = () => {
  saveQuesKnowParam.value.quesId = curQuesId.value
  saveQuesKnowParam.value.examId = examId
  saveQuesKnowParam.value.subjectId = curSubId.value
  if (quesAbilities.value) {
    let saveAbilities: any = []
    abilityTreeData.value.forEach((a: any) => {
      if (quesAbilities.value.indexOf(a.typeName) >= 0) {
        saveAbilities.push({id: a.id, typeName: a.typeName})
      }
    })
    saveQuesKnowParam.value.abilities = saveAbilities
  }
  saveQuesAbilityRelationshipApi(saveQuesKnowParam.value).then((res: any) => {
    if (res.success) {
      getQuesKnowAbi()
      dialogSelectAbilityVisible(false)
      getAbiResult()
    }
  })
}
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
      width: 80px
    }

    .left1 {
      width: 1110px
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
    margin-right: 5px;
    background: url('@/assets/edit.png') 100% no-repeat;
    background-size: 100% 100%;
    line-height: 20px;
  }

  .complete-img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background: url('@/assets/complete.png') 100% no-repeat;
    background-size: 100% 100%;
    line-height: 20px;
  }

  .plus-img {
    display: inline-block;
    cursor: pointer;
    width: 20px;
    height: 20px !important;
    margin-left: 5px;
    background: url('@/assets/plus.png') 100% no-repeat;
    background-size: 100% 100%;
    line-height: 20px;
  }

  .edit-img-style {
    width: 20px;
    height: 20px;
    line-height: 20px;
  }

  .empty-img {
    display: inline-block;
    cursor: pointer;
    width: 150px;
    height: 150px !important;
    background: url('@/assets/empty@2x.png') 100% no-repeat;
    background-size: 100% 100%;
    line-height: 150px;
  }

  .empty-style {
    height: 22px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #808080;
    line-height: 22px;
  }

  .text-style {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #202020;
  }
}
</style>
