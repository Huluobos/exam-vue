<template>
  <div>
    <div class="page-content">
      <div style="height: 48px; display: flex; justify-content: space-between;">
        <div style="line-height: 32px;" class="flex-align-center">
            <span :style="{color: Model<3 ? 'red' : 'gray', cursor: Model<3 ? 'text' : 'no-drop' }" class="flex-align-center">
              <img :style="{filter: Model<3 ? 'none' : 'grayscale(100%)' }" src="../../../../assets/hint-red.png" style="width: 20px; height: 20px;" alt="">
              注意
            </span>
          <span class="ml-10" :style="{color: Model<3 ? '#202020' : 'gray',cursor: Model<3 ? 'text' : 'no-drop'  }">
              题块为阅卷题块，可将多个题放在一个题块里阅卷。选择添加题块按钮，按照顺序添加阅卷题块，如默认一题一块，可直接点击一题一块按钮。建立完题块后请完成题块框选。
          </span>
        </div>

        <el-button
        :disabled=" Model>2"
        :style="{filter: Model<3 ? 'none' : 'grayscale(100%)',width: '120px', height: '32px', marginTop: '8px', }"
         type="primary" @click="goTemplate">
          <svg-icon icon-class="go-template-icon"
                    style="color: yellow; margin-right: 15px;width: 20px;height: 20px"></svg-icon>
          题块框选
        </el-button>
      </div>
      <div style="width: 1280px; height: 30px; background: #f8fbff;">
        <span style="line-height: 30px;">
          共 <span class="blue-text">{{ quesCount }}</span> 道试题，已分配题块试题 <span
            class="blue-text">{{ assignedCount }}</span> 道，未分配题块试题
        <span class="blue-text">{{ quesCount - assignedCount > 0 ? quesCount - assignedCount : 0 }}</span> 道
        </span>
      </div>
      <div style="display: flex; justify-content: right;" class="mt-10" >
        <span v-if="!hasData" class="operate-btn" style="margin-right: 15px;">
          <img class="img" src="../../../../assets/ques-area-create.png" alt="">
          <el-link :underline="false" class="text" type="primary" @click="oneQuesOneAreaGenClick">一题一块</el-link>
        </span>
        <span v-if="!hasData" class="operate-btn">
          <img class="img" src="../../../../assets/delete-icon.png" alt="">
          <el-link :underline="false" class="text" @click="clearQuesAreaVisible = true"
                   style="color: red;">清空题块</el-link>
        </span>
      </div>
      <div>
        <el-table
            v-loading="loading"
            :data="quesAreaList"
            :cell-style="{'text-align': 'center',}"
            :header-cell-style="{'text-align': 'center', 'color': '#202020','font-size': '14px'}"
            border
        >
          <el-table-column prop="name" label="题块">
            <template #default="scope">
              <el-input v-model="scope.row.name" placeholder="请输入" style="width: 80px;"
                        @blur="changeAreaName(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="quesNos" label="包含题号">
            <template #default="scope">
              {{ includeNo(scope.row.includeNos) }}
            </template>
          </el-table-column>
          <el-table-column prop="scoreType" label="给分类型">
            <template #default="scope">
              <div v-if="!scope.row.selQuesArea">
                <span v-if="scope.row.includeIds.length >= 2"
                      :class="scope.row.hasData || (Model>2 && subStep === 6)?'un-click-text':['blue-text','op-btn']"
                      style="margin-right: 5px"
                      @click="scope.row.hasData || (Model>2 && subStep === 6)?'':mergeQuesToAreaDialog(scope.row)">合并打分</span>
                <span v-if="scope.row.hasMerge" :class="scope.row.hasData || (Model>2 && subStep === 6)?'un-click-text':['blue-text','op-btn']"
                      @click="scope.row.hasData || (Model>2 && subStep === 6)?'':unmergeQues(scope.row)">取消合并</span>
                <span v-if="!scope.row.hasMerge && scope.row.includeIds.length <= 1">-</span>
              </div>
              <div v-else>
                <span>-</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <div v-loading="handleLoading">
                <span v-if="!scope.row.selQuesArea" class=""
                      :class="scope.row.hasData || (Model>2 && subStep === 6)?'un-click-text':['blue-text','op-btn']"
                      @click="scope.row.hasData || (Model>2 && subStep === 6)?'':addQuesToArea(scope.row)">添加题号</span>
                <span v-if="!scope.row.selQuesArea" class="ml-10"
                      :class="scope.row.hasData || (Model>2 && subStep === 6)?'un-click-text':['red-text','op-btn']"
                      @click="scope.row.hasData || (Model>2 && subStep === 6)?'':deleteQuesArea(scope.row)">删除</span>
                <span v-if="scope.row.selQuesArea">-</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-link v-if="!statusParam.publicStatus" :underline="false" :type="statusParam.publicStatus?'':'primary'"
                 :class="statusParam.publicStatus?'text-disable':'text'" @click="addQuesArea"
                 :disabled="statusParam.publicStatus">+添加题块
        </el-link>
        <span v-else class="un-click-text">
            +添加题块
        </span>
      </div>
    </div>
    <Dialog
        :title="'题目选择'"
        :visible="addQuesVisible"
        @dialogVisible="dialogAddQuesVisible"
        :width="'600px'"
    >
      <template #content>
        <el-checkbox-group
            v-model="checkQues"
        >
          <el-row>
            <el-col
                v-for="ques in questions"
                :span="6"
            >
              <el-checkbox
                  :label="ques.quesId"
                  :disabled="ques.areaId && curAreaId !== ques.areaId"
                  @change="(val) => checkQuesToArea(val, ques)"
              >
                {{ ques.fullNo }}
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </template>
      <template #footer>
        <el-button @click="areaRelationQues">确定</el-button>
      </template>
    </Dialog>
    <Dialog
        :title="'题目选择'"
        :visible="mergeQuesVisible"
        @dialogVisible="dialogMergeQuesVisible"
        :width="'600px'"
    >
      <template #content>
        <div v-for="(merge, index) in mergeQues">
          <div style="margin-bottom: 25px;">
            <div style="display: table-cell; vertical-align: middle;">
              <div style=" width: 90px; display: inline-block; vertical-align: middle;">选择合并题目</div>
              <el-checkbox-group
                  style="display: inline-block; vertical-align: middle; width: calc(100% - 100px);"
                  v-model="merge.mergeGenIds"
              >
                <div style="display: flex; justify-content: flex-start; flex-wrap: wrap; width: 470px;">
                  <div
                      v-for="ques in curArea.eExamQuestionsVos"
                      style="width: 25%;"
                  >
                    <el-checkbox
                        :label="ques.gQIId"
                        @change="mergeAreaSel(index)"
                    >
                      {{ ques.quesNo }}
                    </el-checkbox>
                  </div>
                </div>
              </el-checkbox-group>
            </div>
          </div>
          <div style="margin-bottom: 5px;">
            <div style="display: table-cell; vertical-align: middle;">
              <div style="width: 90px; display: inline-block; vertical-align: middle; margin-right: 20px;">选择合并题目
              </div>
              <el-input v-model="merge.mergeName" style="width: 100px; height: 32px;"></el-input>
              <div
                  style="display: inline-block; margin-left: 6px; vertical-align: middle; cursor: pointer; margin-right: 6px;">
                <img style="width: 20px; height: 20px;" src="../../../../assets/icon-plus.png" alt=""
                     @click="addMergeQues"/>
              </div>
              <div v-if="index > 0"
                   style="display: inline-block; margin-left: 6px; vertical-align: middle; cursor: pointer; margin-right: 6px;">
                <img style="width: 20px; height: 20px;" src="../../../../assets/minus-sign.png" alt=""
                     @click="removeMergeQues(index)"/>
              </div>
            </div>
          </div>
          <div style="width: 561px; height: 1px; border: 1px solid #d5dae5;"></div>
        </div>
      </template>
      <template #footer>
        <el-button type="default" style="background-color: #ecf4ff;" @click="mergeQuesVisible = false">取消</el-button>
        <el-button type="primary" @click="mergeQuesToArea">确定</el-button>
      </template>
    </Dialog>
    <Dialog
        :title="'确认'"
        :visible="clearQuesAreaVisible"
        @dialogVisible="dialogClearQuesAreaVisible"
        :width="'600px'"
        :top="'35vh'"
    >
      <template #content>
        <div style="color: red;">
          请确认是否清空题块？
        </div>
      </template>
      <template #footer>
        <div style="text-align: right;">
          <el-button type="default" style="background-color: #ecf4ff; width: 100px; height: 32px;"
                     @click="clearQuesAreaVisible = false">取消
          </el-button>
          <el-button type="primary" style="width: 100px; height: 32px;" @click="clearQuesArea">确定</el-button>
        </div>
      </template>
    </Dialog>

    <Dialog
        :title="'确认'"
        :visible="addOneTOneBVisible"
        @dialogVisible="dialogAddOneTOneBVisible"
        :width="'600px'"
        :top="'35vh'"
    >
      <template #content>
        <div style="color: red;">
          <span class="flex-align-center">
              <img  src="../../../../assets/hint-red.png" style="width: 20px; height: 20px;" alt="">
                请确认是否需要一题一块？点击后建好的题块数据将被覆盖，切不可恢复！
            </span>

        </div>
      </template>
      <template #footer>
        <div style="text-align: right;">
          <el-button type="default" style="background-color: #ecf4ff; width: 100px; height: 32px;"
                     @click="addOneTOneBVisible = false">取消
          </el-button>
          <el-button type="primary" style="width: 100px; height: 32px;" @click="oneQuesOneAreaGen">确定</el-button>
        </div>
      </template>
    </Dialog>

    <Dialog
      :title="'确认'"
      :visible="noneSubjectQues"
      :width="'600px'"
      :top="'35vh'"
      :showClose="false"
    >
      <template #content>
        <div>
          <span class="flex-align-center">
              <img  src="../../../../assets/hint-red.png" style="width: 20px; height: 20px;" alt="">
            未添加主观题，前往<el-link type="primary" @click="toSubjective">添加主观题</el-link>；或者跳过该步骤直接<el-link type="primary" @click="setStep()">导入小题分</el-link>。
            </span>

        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {
  areaRelationQuesApi,
  getAllQuesAreaApi,
  deleteQuesAreaApi,
  mergeQuesScoreApi,
  unmergeQuesScoreApi,
  oneQuesOneAreaGenApi,
  addQuesAreaApi,
  changeQuesAreaNameApi,
  listByExamIdAndSubNameApi,
  checkSubjectQuesApi,
  setStepApi,
} from '@/api/exam'
import { ElMessage } from 'element-plus'

class mergeQuestion {
  mergeName: any
  mergeGenIds: any
  startNo: any
  endNo: any
}

class quesAreaClass {
  examId: any
  subName: any
  areaId: any
  needMergeGens: any
  areaName: any
}

const route = useRoute()
const router = useRouter()
const examId = route.query.examId
const subName = route.query.subName
const subId = route.query.subId
const quesAreaList = ref([])
const questions = ref<any[]>([])
const addQuesVisible = ref<boolean>(false)
const mergeQuesVisible = ref<boolean>(false)
const clearQuesAreaVisible = ref<boolean>(false)
const hasData = ref<boolean>(false)
const loading = ref<boolean>(false)
const handleLoading = ref<boolean>(false)
const checkQues = ref([])
const curAreaId = ref<string>('')
const curArea = ref<any>({})
const quesCount = ref<any>(0)
const assignedCount = ref<any>(0)
const mergeQues = ref<any>([]) // 用于存储需要合并的试题 可能会一次性合并多组 数据结构为 [{key:[id1, id2,]}]
const subStep = ref<any>()

const statusParam = ref<any>({
  markStatus: false,
  publicStatus: false // false 成绩未发布 true 成绩已发布
})

const data = reactive({
  quesAreaParam: {
    examId: ref<any>(''),
    subName: ref<any>(''),
  },
  relationQuesData: {
    areaId: ref<any>(''),
    genIds: ref<any>([]),
  },
  deleteQuesAreaData: {
    examId: ref<any>(''),
    subName: ref<any>(''),
    areaId: ref<any>(''),
  },
  changeQuesAreaData: new quesAreaClass
})

const {quesAreaParam, relationQuesData, deleteQuesAreaData, changeQuesAreaData} = toRefs(data)
const propsModel = defineProps({
  model: {
    type: Number,
    default: 1
  },
})
const Model = computed(()=>{
  return propsModel.model as Number
})
//生成一题一块提示框
const addOneTOneBVisible = ref<boolean>(false)
const dialogAddOneTOneBVisible = (key: boolean) => {
  addOneTOneBVisible.value = key
}

// 没有主观题
const noneSubjectQues = ref<boolean>(false)

const includeNo = computed(() => (fullNos: any) => {
  return fullNos.join('；')
})

// function area start

const getAllQuesAreaBySub = (data: any) => {
  getAllQuesAreaApi(data).then((res: any) => {
    quesAreaList.value = res.data.quesAreaVoList
    questions.value = res.data.questions
    checkQues.value = res.data.assignedIds
    quesCount.value = res.data.quesCount
    subStep.value = res.data.subStep
    hasData.value = res.data.hasData
    assignedCount.value = res.data.assignedCount
  })
}

const addQuesToArea = (area: any) => {
  addQuesVisible.value = true
  curAreaId.value = area.id
}

const dialogAddQuesVisible = (key: boolean) => {
  addQuesVisible.value = key
  if (!key) {
    getAllQuesAreaBySub(quesAreaParam.value)
  }
}

const mergeQuesToAreaDialog = (data: any) => {
  mergeQuesVisible.value = true
  curArea.value = data
  mergeQues.value = [new mergeQuestion()]
}

const addMergeQues = () => {
  mergeQues.value.push(new mergeQuestion())
}

const removeMergeQues = (index: any) => {
  mergeQues.value.splice(index, 1)
}

const changeAreaName = (data: any) => {
  changeQuesAreaData.value = new quesAreaClass()
  changeQuesAreaData.value.examId = examId
  changeQuesAreaData.value.subName = subName
  changeQuesAreaData.value.areaId = data.id
  changeQuesAreaData.value.areaName = data.name
  changeQuesAreaNameApi(changeQuesAreaData.value).then((res: any) => {
    if (res.success) {
      ElMessage.success(res.message)
    } else {
      ElMessage.success(res.message)
    }
  })
}

const mergeQuesToArea = () => {
  changeQuesAreaData.value = new quesAreaClass()
  changeQuesAreaData.value.examId = examId
  changeQuesAreaData.value.subName = subName
  changeQuesAreaData.value.areaId = curArea.value.id
  changeQuesAreaData.value.needMergeGens = mergeQues
  // 判断选择的合并试题有没有重复的
  let checkGen: any[] = []
  let checkPass = true
  let checkSizePass = true
  for (let i = 0; i < changeQuesAreaData.value.needMergeGens.length; i++) {
    let needMergeGen = changeQuesAreaData.value.needMergeGens[i]
    if (needMergeGen.mergeGenIds.length < 2) {
      checkSizePass = false
      break
    }
    for (let j = 0; j < needMergeGen.mergeGenIds.length; j++) {
      if (checkGen.indexOf(needMergeGen.mergeGenIds[j]) === -1) {
        checkGen.push(needMergeGen.mergeGenIds[j])
      } else {
        checkPass = false
        break
      }
    }
  }
  if (!checkSizePass) {
    ElMessage.error('合并打分试题选择最低两道，请重新选择')
    return false
  }
  if (!checkPass) {
    ElMessage.error('题号不允许重复添加')
    return false
  }
  mergeQuesScoreApi(changeQuesAreaData.value).then((res: any) => {
    if (res.success) {
      getAllQuesAreaBySub(quesAreaParam.value)
      mergeQuesVisible.value = false
      ElMessage.success('合并成功')
    } else {
      ElMessage.success('合并失败')
    }
  })
}

const unmergeQues = (area: any) => {
  changeQuesAreaData.value.examId = examId
  changeQuesAreaData.value.subName = subName
  changeQuesAreaData.value.areaId = area.id
  unmergeQuesScoreApi(changeQuesAreaData.value).then((res: any) => {
    getAllQuesAreaBySub(quesAreaParam.value)
  })
}

const dialogMergeQuesVisible = (key: boolean) => {
  mergeQuesVisible.value = key
}

const dialogClearQuesAreaVisible = (key: boolean) => {
  clearQuesAreaVisible.value = key
}

const listByExamIdAndSubName = () => {
  loading.value = true
  listByExamIdAndSubNameApi(quesAreaParam.value).then((res: any) => {
    if (res.success) {
      statusParam.value.markStatus = res.data.markStatus !== 0
      statusParam.value.publicStatus = res.data.publicStatus !== 0
    } else {
      ElMessage.error(res.message)
    }
    loading.value = false
  })
}

const checkQuesToArea = (event: any, data: any) => {
  questions.value.forEach(q => {
    if (q.quesId === data.quesId) {
      if (event) {
        q.areaId = curAreaId.value
      } else {
        q.areaId = null
      }
    }
  })
}

const mergeAreaSel = (index: any) => {
  let curMergeQues = mergeQues.value[index]
  curMergeQues.startNo = ''
  curMergeQues.endNo = ''
  for (let i = 0; i < curMergeQues.mergeGenIds.length; i++) {
    let filter = curArea.value.eExamQuestionsVos.filter((v: { gQIId: any; }) => curMergeQues.mergeGenIds[i] === v.gQIId)[0]
    if (!curMergeQues.startNo) {
      curMergeQues.startNo = filter.quesNo
    }
    curMergeQues.endNo = filter.quesNo
  }
  if (curMergeQues.mergeGenIds.length > 1) {
    curMergeQues.mergeName = curMergeQues.startNo + '-' + curMergeQues.endNo
  } else if (curMergeQues.mergeGenIds.length === 0) {
    curMergeQues.mergeName = ''
  } else {
    curMergeQues.mergeName = curMergeQues.startNo
  }
}

const areaRelationQues = () => {
  relationQuesData.value.genIds = questions.value.filter(q => (checkQues.value as Array<any>).includes(q.quesId) && q.areaId === curAreaId.value).map(ques => ques.gQIId)
  relationQuesData.value.areaId = curAreaId.value
  areaRelationQuesApi(relationQuesData.value).then(res => {
    getAllQuesAreaBySub(quesAreaParam.value)
    addQuesVisible.value = false
  })
}

const deleteQuesArea = (area: any) => {
  handleLoading.value = true
  deleteQuesAreaData.value.examId = examId
  deleteQuesAreaData.value.subName = subName
  deleteQuesAreaData.value.areaId = area.id
  deleteQuesAreaApi(deleteQuesAreaData.value).then((res: any) => {
    if (res.success) {
      getAllQuesAreaBySub(quesAreaParam.value)
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
    handleLoading.value = false
  })
}

const clearQuesArea = () => {
  quesAreaParam.value.examId = examId
  quesAreaParam.value.subName = subName
  deleteQuesAreaData.value.examId = examId
  deleteQuesAreaData.value.subName = subName
  deleteQuesAreaData.value.areaId = ''
  deleteQuesAreaApi(deleteQuesAreaData.value).then((res: any) => {
    if (res.success) {
      getAllQuesAreaBySub(quesAreaParam.value)
      clearQuesAreaVisible.value = false
      ElMessage.success('清空题块成功')
    } else {
      ElMessage.error(res.message)
    }
  })
}

const addQuesArea = () => {
  quesAreaParam.value.examId = examId
  quesAreaParam.value.subName = subName
  loading.value = true
  addQuesAreaApi(quesAreaParam.value).then((res: any) => {
    getAllQuesAreaBySub(quesAreaParam.value)
    loading.value = false
  })
}

const oneQuesOneAreaGenClick = () => {
  quesAreaParam.value.subName = subName
  quesAreaParam.value.examId = examId

  addOneTOneBVisible.value = true
}
const oneQuesOneAreaGen = () => {
  loading.value = true
  oneQuesOneAreaGenApi(quesAreaParam.value).then((res: any) => {
    if (res.success) {
      getAllQuesAreaBySub(quesAreaParam.value)
      ElMessage.success('生成成功！')

    } else {
      ElMessage.error(res.message)
    }
    loading.value = false
    addOneTOneBVisible.value = false
  })
}


/* 跳转题块框选 */
function goTemplate() {
  router.push({
    name: 'markSubjectArea', query: {
      examId: examId,
      subId: subId
    }
  })
}

/* 跳转试题结构建立 */
function toSubjective() {
  const routerSubjectiveParam = {
    subName: subName,
    examId: examId,
    subId: subId
  }

  router.push({name: 'processSubjectiveItem', query: routerSubjectiveParam})
}

/* 跳转试题结构建立 */
function toProcess() {
  const routerSubjectiveParam = {
    subName: subName,
    examId: examId,
    subId: subId
  }

  router.push({name: 'subjectProcessIndex', query: routerSubjectiveParam})
}

function setStep() {
  const param = {
    subjectId: subId,
    step: 4,
    canBeBack: false
  }
  setStepApi(param).then((res:any)=>{
    toProcess()
  }).catch(e=>{
    console.error(e)
    ElMessage.error('请求异常，请重试')
  })
}

// function area end

onMounted(() => {
  quesAreaParam.value.examId = examId
  quesAreaParam.value.subName = subName
  getAllQuesAreaBySub(quesAreaParam.value)
  listByExamIdAndSubName()

  if (Model.value === 3) {
    checkSubjectQuesApi(quesAreaParam.value).then((res: any) => {
      noneSubjectQues.value = !res.success
    }).catch(e => {
      console.error(e)
    })
  }
})

</script>

<style lang="scss" scoped>
.page-content {
  margin-top: 10px;
}

.op-btn:hover {
  opacity: 0.7;
}

.flex-align-center {
  display: flex;
  align-items: center;
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
    color: #4381e5;
    line-height: 22px;
    margin-left: 5px;
  }

  .text-disable {
    font-size: 14px;
    color: #C2C2C2;
    line-height: 22px;
    margin-left: 5px;
  }

  .img {
    width: 20px;
    height: 20px;
  }
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

:deep(.el-input__inner) {
  text-align: center !important;
}

.un-click-text {
  color: #C2C2C2;
  cursor: not-allowed;
}

.red-text {
  color: red;
  cursor: pointer;
}
</style>
