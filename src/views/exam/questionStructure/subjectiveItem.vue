<template>
  <div>
    <div slot="header">
      <div class="card-title">
                <span class="title">
                设置试卷题块结构
                </span>
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div style="display: flex; justify-content: left;">
        <span>
          当前试卷满分&nbsp;<span style="color: red;">{{ totalScore }}</span>&nbsp;分，
          客观题&nbsp;<span style="color: red;"> {{ anotherScore }}</span>&nbsp;分，
          主观题&nbsp;<span style="color: red;"> {{ quesScore }}</span>&nbsp;分
        </span>
        </div>
        <div style="display: flex; justify-content: right;">
        <span class="operate-btn" style="margin-right: 15px;">
          <img class="img" v-if="subStep === 6" disabled src="../../../assets/objective-small.png" alt="">
          <img class="img" v-else src="../../../assets/objective-small.png" alt="">
          <el-link v-if="subStep === 6" disabled :underline="false" class="text"
                   @click="toAddSubjective">添加主观题</el-link>
          <el-link v-else :underline="false" class="text" @click="toAddSubjective">添加主观题</el-link>
        </span>
          <span class="operate-btn">
          <img class="img" v-if="subStep === 6" disabled src="../../../assets/answer-small.png" alt="">
          <img class="img" v-else disabled src="../../../assets/answer-small.png" alt="">
          <el-link v-if="subStep > 2 && subjectModel !== 3 " disabled :underline="false" class="text" @click="addOptional">添加选做题</el-link>
           <el-link v-else :underline="false" class="text" @click="addOptional">添加选做题</el-link>
        </span>
        </div>
      </div>
      <div slot="header" style="width: 560px; display: flex;">
        <div class="not-background-class" @click="toObjective()">
          <span class="not-background-font-style">客观题</span>
        </div>
        <div class="background-class" @click="tosubjective()">
          <span class="background-font-style">主观题</span>
        </div>
      </div>

      <div>
        <el-table
            :span-method="objectSpanMethod"
            :data="dataList"
            style="width: 100%;"
            :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
            :cell-style="{'text-align': 'center',}"
            row-key="quesId"
            stripe
            :border="dataList && dataList.length > 0"
            default-expand-all
        >
          <template #empty>
            <div style="text-align: center;margin-top: 50px">
              <img style="display: inline-block; position: relative;" src="@/assets/nullStatus.png" alt="">
            </div>
            <div style="height: 22px; font-size: 12px; color: #808080; line-height: 22px; text-align: center;">
              还没有设置题块结构！
            </div>
          </template>
          <el-table-column prop="quesNo" label="题号">
            <template #default="scope">
              <el-input v-if="!scope.row.quesParent" v-model="scope.row.quesNo" placeholder="请输入"
                        style="width: 80px;"></el-input>
              <el-input v-else v-model="scope.row.quesNo" placeholder="请输入"  style="width: 100px;">
                <template #prepend>{{ scope.row.parentQuesNo }}</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="序号">
            <template #default="scope">
              <el-input v-model="scope.row.orderNum" placeholder="请输入" style="text-align: center;">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="quesScore" label="分值">
            <template #default="scope">
              <el-input v-model="scope.row.quesScore" placeholder="请输入" style="width: 80px;"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="chooseType" label="是否选做"/>
          <el-table-column prop="subName" label="科目">
            <template #default="scope">
              <el-select v-if="subName === '文综'" v-model="scope.row.subName" placeholder="请选择" clearable>
                <el-option
                    v-for="eType in data.wenList"
                    :key="eType.value"
                    :label="eType.label"
                    :value="eType.value"
                />
              </el-select>
              <el-select v-if="subName === '理综'" v-model="scope.row.subName" placeholder="请选择" clearable>
                <el-option
                    v-for="eType in data.liList"
                    :key="eType.value"
                    :label="eType.label"
                    :value="eType.value"
                />
              </el-select>
              <el-input v-if="subName !== '理综' && subName !== '文综'" v-model="scope.row.subName"
                        placeholder="请输入" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="stuNo" label="操作">
            <template #default="scope">
              <el-button v-if="scope.row.chooseType ==='否' && !scope.row.quesParent && scope.row.isRead > 0 && scope.row.quesMerge ===1 " disabled
                         type="text"
                         @click="addSmall(scope.row)">+添加小题
              </el-button>
              <el-button v-if="scope.row.chooseType ==='否' && !scope.row.quesParent && scope.row.isRead <= 0 && scope.row.quesMerge ===0 " type="text"
                         @click="addSmall(scope.row)">+添加小题
              </el-button>
              <!--              <el-button v-if="scope.row.chooseType ==='否'" type="text" style="color: red;"-->
              <!--                         @click="deleteQues(scope.row)">删除-->
              <!--              </el-button>-->
              <el-button
                  :disabled="(scope.row.chooseType ==='否' && scope.row.isRead > 0 ) || (scope.row.chooseType !=='否' && scope.row.isRead > 0 )"
                  type="text"
                  :style="(scope.row.chooseType ==='否' && scope.row.isRead > 0 ) || (scope.row.chooseType !=='否' && scope.row.isRead > 0 )?'color: #C2C2C2;':'color: red;'"
                  @click="deleteQues(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--添加客观题-->
      <el-dialog
          v-model="addSubjectiveVisible"
          title="批量添加主观题"
          width="800px"
          :before-close="closeAddSub"
      >
        <div>
          从
          <el-input v-model="addFrom.startQuesNo" style="width: 50px;" placeholder=""/>
          到
          <el-input v-model="addFrom.endQuesNo" style="width: 50px;" placeholder=""/>
          题，每题
          <el-input v-model="addFrom.score" type="number" min="0" max="100" style="width: 80px;"
                    placeholder=""/>
          分，科目
          <el-input
              v-if="subName !=='文综' && subName !=='文科综合' && subName !=='理综' && subName !=='理科综合'"
              v-model="data.addFrom.quesSub" placeholder="请选择" style="width: 100px; height: 32px;"
              disabled
          ></el-input>
          <el-select v-else v-model="addFrom.quesSub" placeholder="请选择"
                     style="width: 100px; height: 32px;">
            <el-option
                v-for="item in quesSubList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px;" type="primary"
                         @click="addSubjectiveVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px;" type="danger"
                         @click="addQuestionKeGuan">保存</el-button>
            </span>
        </template>
      </el-dialog>


      <!--添加选做题-->
      <el-dialog
          v-model="addChooseQUesVisible"
          title="批量添加选做题"
          width="800px"
          :before-close="closeAddChoose"
      >
                <span>从&nbsp;&nbsp;<el-input v-model="chooseFrom.startQuesNo" style="width: 50px;"
                                              placeholder=""/>&nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;
                <el-input v-model="chooseFrom.endQuesNo" style="width: 50px;" placeholder=""/>&nbsp;&nbsp;&nbsp;题,&nbsp;每题&nbsp;&nbsp;
                <el-input v-model="chooseFrom.score" oninput="value=value.replace(/[^\d]/g,'')"
                          style="width: 50px;" placeholder=""/>&nbsp;&nbsp;&nbsp;分,选做类型&nbsp;
                <el-select v-model="chooseFrom.chooseType" placeholder="请选择" style="width: 100px; height: 32px;">
                <el-option
                    v-for="item in data.quesTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                />
              </el-select>
                &nbsp;科目
                    <el-input
                        v-if="subName !=='文综' && subName !=='文科综合' && subName !=='理综' && subName !=='理科综合'"
                        v-model="data.chooseFrom.quesSub" placeholder="请选择" style="width: 100px; height: 32px;"
                        disabled></el-input>
                    <el-select v-else v-model="data.chooseFrom.quesSub" placeholder="请选择"
                               style="width: 100px; height: 32px;">
                <el-option
                    v-for="item in data.quesSubList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
                </span>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px;" type="primary"
                         @click="addChooseQUesVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px;" type="danger"
                         @click="addChioceQuestion">确定</el-button>
            </span>
        </template>
      </el-dialog>


      <!--添加选做题-->
      <el-dialog
          v-model="addSmallQUesVisible"
          title="添加小题"
          width="800px"
      >
                <span>从&nbsp;&nbsp;<el-input v-model="data.smallQuesFrom.startQuesNo" style="width: 80px;"
                                              placeholder=""/>&nbsp;每题&nbsp;&nbsp;
                <el-input v-model="data.smallQuesFrom.score" oninput="value=value.replace(/[^\d]/g,'')"
                          style="width: 50px;" placeholder=""/>&nbsp;&nbsp;&nbsp;分,
                &nbsp;科目
                    <el-select v-model="data.smallQuesFrom.quesSub" placeholder="请选择"
                               style="width: 100px; height: 32px;">
                <el-option
                    v-for="item in data.quesSubList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
                </span>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px;" type="primary"
                         @click="addSmallQUesVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px;" type="danger"
                         @click="addSmallQuestion">确定</el-button>
            </span>
        </template>
      </el-dialog>


      <el-dialog
          v-model="deleteQuesVisible"
          title="删除确认"
          width="600px"
      >
        <span style="color: red;">确定删除第{{ quesNo }}题？</span>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px;" type="primary"
                         @click="deleteQuesVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px;" type="danger"
                         @click="toDelete">确定</el-button>
            </span>
        </template>
      </el-dialog>

      <div v-if="dataList.length > 0" style="display: flex; justify-content: right;">
        <span class="operate-btn" style="margin-top: 10px;">
            <el-button v-if="subStep === 6" disabled @click="toUpdateAll" type="primary">保存</el-button>
          <el-button v-else @click="toUpdateAll" type="primary">保存</el-button>
        </span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  queryKeGuan,
  adKeQuestion,
  deleteKeQuestion,
  addChooseQuestion,
  updateMarkAreaInfos,
  addsmallQuestionData
} from '@/api/exam'
import { ElMessage } from 'element-plus'
import router from '@/router'

class questionVo {
  id: any // 主键
  gQIId: any // 组卷id
  orderNum: any // 排序值
  paperId: any // 试卷id
  quesId: any // 试题id
  quesMold: any // 试题模式1：常规试题；2：只有内容，不带问的那种 0是题型说明
  quesNo: any // 试题题号
  fullNo: any // 完整题号
  quesParent: any // 父级题
  quesSub: any // 试题科目，主要用在综合科目类试卷
  quesScore: any // 分数
  subName: any // 科目
  subjObje: any //客观题主观题 0 主观题 1 客观题
  children?: questionVo[]
}

const route = useRoute()
const examId = route.query.examId
const subId = route.query.subId
const subName = route.query.subName

const deleteQuesVisible = ref<boolean>(false)
const addSubjectiveVisible = ref<boolean>(false)
const addChooseQUesVisible = ref<boolean>(false)
const addSmallQUesVisible = ref<boolean>(false)

const totalScore = ref<any>('')
const quesScore = ref<any>('')
const anotherScore = ref<any>('')
const quesNo = ref<any>('')
const dataList = ref<questionVo[]>([])

const subStep = ref<any>('');

const subjectModel = ref<any>('');

class addSubjectiveInfo {
  subjectId: any
  subName: any
  examId: any
  startQuesNo: any
  endQuesNo: any
  score: any
  quesType: any
  quesOptions: any
  quesSub: any
  createType: any
  subjObje: any
}

class addChooseInfo {
  subjectId: any
  subName: any
  examId: any
  startQuesNo: any
  endQuesNo: any
  score: any
  quesType: any
  quesOptions: any
  quesSub: any
  createType: any
  subjObje: any
  chooseType:any
}


const data = reactive({
  queryParams: {
    subId: ref<any>(''),
    examId: ref<any>(''),
    quesType: 0
  },
  addFrom: new addSubjectiveInfo(),
  chooseFrom: new addChooseInfo(),
  smallQuesFrom: {
    subjectId: ref<any>(''),
    subName: ref<any>(''),
    examId: ref<any>(''),
    startQuesNo: ref<any>(''),
    endQuesNo: ref<any>(''),
    score: ref<any>(''),
    quesType: ref<any>(''),
    quesOptions: ref<any>(''),
    quesSub: subName,
    createType: 1,
    subjObje: 0
  },
  upAllQuesParam: {
    examId: ref<any>(''),
    subName: ref<any>(''),
    questionsList: ref<any>([])
  },
  quesTypeList: [{value: 1, label: '二选一'}, {value: 2, label: '三选一'}, {value: 3, label: '三选二'}],
  quesSubList: ref<any>([]), //不需要
  deleteParams: {
    quesNo: ref<any>(''),
    quesId: ref<any>(''),
    gQIId: ref<any>(''),
    subjectId: ref<any>(''),
  },
  wenList: [{value: '政治', label: '政治'}, {value: '历史', label: '历史'}, {value: '地理', label: '地理'}],
  liList: [{value: '物理', label: '物理'}, {value: '化学', label: '化学'}, {value: '生物', label: '生物'}],
  routerSubjectiveParam: {
    examId: ref<any>(''),
    subName: ref<any>(''),
    subId: ref<any>(''),
  },

})
const {
  queryParams,
  addFrom,
  deleteParams,
  chooseFrom,
  quesSubList,
  routerSubjectiveParam,
  smallQuesFrom,
  upAllQuesParam
} = toRefs(data)

const objectSpanMethod = ({row, column, rowIndex, columnIndex}: any) => {
  const arrChoose3 = dataList.value.filter((res: any) => {
    if (res.chooseType === '是(三选二)' || res.chooseType === '是(三选一)') {
      return res
    }
  })

  const arrChoose31 = arrChoose3.filter((res: any, index: number) => {
    // 1.4.7.10 位 index除以3 余1时才是
    const ss = (index + 1) % 3
    if (ss === 1) {
      return res
    }
  })
  const arrChoose2 = dataList.value.filter((res: any) => {
    if (res.chooseType === '是(二选一)') {
      return res
    }
  })
  const arrChoose21 = arrChoose2.filter((res: any, index: number) => {
    // 1.3.5.7 位 index除以2 余1时才是
    const ss = (index + 1) % 2
    if (ss === 1) {
      return res
    }
  })

  if (columnIndex === 2 || columnIndex === 4) {
    if (row.chooseType === '是(三选二)' || row.chooseType === '是(三选一)' || row.chooseType === '是(二选一)') {
      const bool3 = arrChoose31.some(res => res.quesId == row.quesId)
      const bool2 = arrChoose21.some(res => res.quesId == row.quesId)
      if (bool3) {
        return {
          rowspan: 3,
          colspan: 1,
        }
      } else if (bool2) {
        return {
          rowspan: 2,
          colspan: 1,
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        }
      }

    } else {
      return {
        rowspan: 1,
        colspan: 1,
      }
    }
  }

}

onActivated(() => {

})

function listKeGuan(data: any) {
  queryKeGuan(data).then((res: any) => {
    if (res.success) {
      dataList.value = res.data.questionsVos
      totalScore.value = res.data.totScore
      quesScore.value = res.data.quesScore
      anotherScore.value = res.data.anotherScore
      subStep.value = res.data.step
      subjectModel.value = res.data.subjectModel
    } else {
      ElMessage.error(res.message)
    }
  })
}

function toAddSubjective() {
  addSubjectiveVisible.value = true
  addFrom.value = new addSubjectiveInfo()
  addFrom.value.quesSub = subName
  addFrom.value.createType = 1
  addFrom.value.subjObje = 0
  addFrom.value.quesType = '解答题'

}

function addQuestionKeGuan() {
  addFrom.value.subjectId = subId
  addFrom.value.subName = subName
  addFrom.value.examId = examId
  if (!addFrom.value.startQuesNo) {
    ElMessage.warning('开始题号不能为空')
    return
  }
  if (!addFrom.value.endQuesNo) {
    ElMessage.warning('结束题号不能为空')
    return
  }
  if (!addFrom.value.score) {
    ElMessage.warning('分值不能为空')
    return
  }
  if (addFrom.value.score <= 0) {
    ElMessage.warning('分值不能为0')
    return
  }
  adKeQuestion(addFrom.value).then((res: any) => {
    if (res.success) {
      setTimeout(() => {
        addFrom.value = new addSubjectiveInfo()
        addSubjectiveVisible.value = false
      }, 10)
      listKeGuan(queryParams.value)
    } else {
      ElMessage.error(res.message)
    }
  })
}


function addOptional() {
  addChooseQUesVisible.value = true
  chooseFrom.value = new addChooseInfo()
  chooseFrom.value.quesSub = subName
  chooseFrom.value.createType = 1
  chooseFrom.value.subjObje = 0
  chooseFrom.value.quesType = '解答题'

}

function addChioceQuestion() {
  chooseFrom.value.subjectId = subId
  chooseFrom.value.subName = subName
  chooseFrom.value.examId = examId
  if (!chooseFrom.value.startQuesNo) {
    ElMessage.warning('开始题号不能为空')
    return
  }
  if (!chooseFrom.value.endQuesNo) {
    ElMessage.warning('结束题号不能为空')
    return
  }
  if (!chooseFrom.value.score) {
    ElMessage.warning('分值不能为空')
    return
  }
  if (chooseFrom.value.score <= 0) {
    ElMessage.warning('分值不能为0')
    return
  }
  if (!chooseFrom.value.quesType) {
    ElMessage.warning('题型不能为空')
    return
  }

  addChooseQuestion(chooseFrom.value).then((res: any) => {
    if (res.success) {
      setTimeout(() => {
        chooseFrom.value = new addChooseInfo()
        addChooseQUesVisible.value = false
      }, 10)
      listKeGuan(queryParams.value)
    } else {
      ElMessage.error(res.message)
    }

  })
}

// dataList 找出合并的数组，输出文字
function spanMethodToArr(row: any,key:string){
  const data = JSON.parse(JSON.stringify(dataList.value))
  if (row.chooseType === '是(三选二)' || row.chooseType === '是(三选一)') {
    const ins = data.findIndex((res:any) => res.quesId === row.quesId)
    const arr = data.splice(ins,3)
    const str = arr.map((res:any)=> {return res.quesNo}).join(key)
    return str
  }else if (row.chooseType === '是(二选一)') {
    const ins = data.findIndex((res:any) => res.quesId === row.quesId)
    const arr = data.splice(ins,2)
    const str = arr.map((res:any)=> {return res.quesNo}).join(key)
    return str
  }else{
    return ''
  }
}
function deleteQues(row: any) {
  const str = spanMethodToArr(row,'-')
  deleteQuesVisible.value = true
  deleteParams.value.gQIId = row.gQIId
  deleteParams.value.quesId = row.quesId
  if (row.chooseType === '是(三选二)' || row.chooseType === '是(三选一)' || row.chooseType === '是(二选一)'){
    quesNo.value = str
  }else{
    quesNo.value = row.fullNo
  }
  deleteParams.value.subjectId = subId
}

function toDelete() {
  deleteKeQuestion(deleteParams.value).then((res: any) => {
    if (res.success) {
      ElMessage.success('删除成功!')
      deleteQuesVisible.value = false
      listKeGuan(queryParams.value)
    } else {
      ElMessage.error(res.message)
    }
  })
}

function toObjective() {
  routerSubjectiveParam.value.subName = subName
  routerSubjectiveParam.value.examId = examId
  routerSubjectiveParam.value.subId = subId
  router.push({name: 'processObjectiveItem', query: routerSubjectiveParam.value})
}

function toUpdateAll() {
  const  checkScore = ref<any>(1)
  const darr = ref<any>([])
  dataList.value.forEach((item: any, ins: number) => {
            if (item.quesScore <= 0) {
              console.log(item.quesScore)
              checkScore.value = 0
            }
        darr.value = item.children
    if (darr.value){
      darr.value.forEach((ci: any, cins: number) => {
                if (ci.quesScore <= 0){
                  checkScore.value = 0
                }
              }
      )
    }

   }
  )
  if (checkScore.value !== 0){
    upAllQuesParam.value.examId = examId
    upAllQuesParam.value.subName = subName
    upAllQuesParam.value.questionsList = dataList.value
    updateMarkAreaInfos(upAllQuesParam.value).then((res: any) => {
      if (res.success) {
        ElMessage.success('保存成功!')
        listKeGuan(queryParams.value)
      } else {
        ElMessage.error(res.message)
      }

    })
  }else{
    ElMessage.warning('分值不能为0!')
    listKeGuan(queryParams.value)
  }

}

function addSmall(row: any) {
  smallQuesFrom.value.subjectId = subId
  smallQuesFrom.value.subName = subName
  smallQuesFrom.value.examId = examId
  smallQuesFrom.value.endQuesNo = row.quesId
  if (row.children) {
    smallQuesFrom.value.startQuesNo = row.children.length + 1
  } else {
    smallQuesFrom.value.startQuesNo = 1
  }
  smallQuesFrom.value.score = 0
  addSmallQuestion()
}

function addSmallQuestion() {
  addsmallQuestionData(smallQuesFrom.value).then((res: any) => {
    if (res.success) {
      ElMessage.success('保存成功!')
      addSmallQUesVisible.value = false
      listKeGuan(queryParams.value)
    } else {
      ElMessage.error(res.message)
    }

  })
}

function closeAddSub(done: any) {
  addFrom.value = new addSubjectiveInfo()
  setTimeout(() => {
    done()
  })
}

function closeAddChoose(done: any) {
  chooseFrom.value = new addChooseInfo()
  setTimeout(() => {
    done()
  })
}

onMounted(() => {
  if (subName === '理综' || subName === '理科综合') {
    quesSubList.value = [{value: '物理', label: '物理'}, {value: '化学', label: '化学'}, {value: '生物', label: '生物'}]
  }
  if (subName === '文综' || subName === '文科综合') {
    quesSubList.value = [{value: '政治', label: '政治'}, {value: '历史', label: '历史'}, {value: '地理', label: '地理'}]
  }
  queryParams.value.subId = subId
  queryParams.value.examId = examId
  queryParams.value.quesType = 0
  listKeGuan(queryParams.value)
})
</script>

<style lang="scss" scoped>
.operate-btn {
  line-height: 22px;
  display: flex;
  justify-content: right;
  align-items: center;
  margin-bottom: 12px;
  text-align: right;
}

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

:deep(.el-input__inner) {
  text-align: center !important;
}

:deep(.el-table__inner-wrapper::before) {
  background-color: transparent !important;
}
</style>
