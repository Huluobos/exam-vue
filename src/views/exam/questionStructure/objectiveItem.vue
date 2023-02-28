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
                <span style="margin-left: 5px;">
                    <span style="float: left;">
                        当前试卷满分&nbsp;</span>
                    <span style="color: red;">{{ totalScore }}</span>
                    <span>&nbsp;分，客观题&nbsp;</span>
                    <span style="color: red;"> {{ quesScore }}</span>
                    &nbsp;分 主观题&nbsp;<span style="color: red;"> {{ anotherScore }}</span>
                    <span> &nbsp;分
                    </span>
                </span>
        </div>
        <div style="display: flex; justify-content: right;">
                <span class="operate-btn" style="margin-right: 15px;">
                    <img v-if="subStep === 6" disabled class="img" src="../../../assets/objective-small.png" alt="">
                    <img v-else class="img" src="../../../assets/objective-small.png" alt="">
                    <el-link v-if="subStep === 6" disabled :underline="false" class="text"
                             @click="toAdd">添加客观题</el-link>
                     <el-link v-else :underline="false" class="text" @click="toAdd">添加客观题</el-link>
                </span>
          <span class="operate-btn">
                    <img v-if="subStep === 6" disabled class="img" src="../../../assets/answer-small.png" alt="">
                    <img v-else class="img" src="../../../assets/answer-small.png" alt="">
                    <el-link v-if="subStep === 6" disabled :underline="false" class="text" @click="openAddMoreAnswer">批量设置客观题答案</el-link>
                   <el-link v-else :underline="false" class="text"
                            @click="openAddMoreAnswer">批量设置客观题答案</el-link>

        </span>
        </div>
      </div>
      <div slot="header" style="width: 560px; display: flex;">
        <div class="background-class">
          <span class="background-font-style">客观题</span>
        </div>
        <div class="not-background-class" @click="toSubjective()">
          <span class="not-background-font-style">主观题</span>
        </div>
      </div>
      <div>
        <el-table
            :data="dataList"
            style="width: 100%;"
            :header-cell-style="{ 'background': '#D3E0F4', 'text-align': 'center', 'color': '#202020', 'font-size': '14px' }"
            :cell-style="{ 'text-align': 'center', }"
            :border="dataList && dataList.length > 0"
            stripe
        >
          <el-table-column prop="quesNo" label="题号">
            <template #default="scope">
              <el-input v-model="scope.row.quesNo" placeholder="请输入" style="text-align: center;">
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
              <el-input v-model="scope.row.quesScore" placeholder="请输入"
                        style="width: 80px; text-align: center;"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="quesType" label="题型">
            <template #default="scope">
              <el-select v-model="scope.row.quesType" placeholder="请选择" clearable @change="quesTypeChange(scope.row.quesType,scope.row)">
                <el-option v-for="eType in data.quesTypeList" :key="eType.value" :label="eType.label"
                           :value="eType.label"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="quesAnswer" label="答案">
            <template #default="scope">
              <el-select v-if="scope.row.quesType === '单选题'" v-model="scope.row.quesAnswer"
                         placeholder="请选择" clearable>
                <el-option
                    v-for="(eType,index) in allAnswerList.slice(0,(scope.row.choiceNum ? scope.row.choiceNum : 4 ))"
                    :key="index+'A'" :label="eType"
                    :value="eType"/>

              </el-select>
              <!-- scope.row.choiceNum -->
              <el-select v-if="scope.row.quesType === '多选题'" v-model="scope.row.quesAnswer" multiple
                         placeholder="请选择" clearable>

                <el-option
                    v-for="(eType,index) in allAnswerList.slice(0,(scope.row.choiceNum ? scope.row.choiceNum : 4 ))"
                    :key="index+'b'"
                    :label="eType" :value="eType"/>


              </el-select>

              <el-select v-if="scope.row.quesType === '判断题'" v-model="scope.row.quesAnswer"
                         placeholder="请选择" clearable>
                <el-option v-for="eType in data.panduanList" :key="eType.label" :label="eType.label"
                           :value="eType.label"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="scoreDesc" label="评分标准">
            <template #default="scope">
              <el-button type="text"
                         v-if="scope.row.quesType === '多选题' && scope.row.isSetScore === 1 && subStep === 6" disabled
                         style="color:#4381E5 ;"
                         @click="toAddChooseSet(scope.row)">修改评分标准
              </el-button>
              <el-button type="text"
                         v-if="scope.row.quesType === '多选题' && scope.row.isSetScore === 1 && subStep !== 6"
                         style="color:#4381E5 ;"
                         @click="toAddChooseSet(scope.row)">修改评分标准
              </el-button>

              <el-button type="text"
                         v-if="scope.row.quesType === '多选题' && scope.row.isSetScore !== 1  && subStep === 6" disabled
                         style="color: #4381E5;"
                         @click="toAddChooseSet(scope.row)">设置评分标准
              </el-button>

              <el-button type="text"
                         v-if="scope.row.quesType === '多选题' && scope.row.isSetScore !== 1  && subStep !== 6"
                         style="color: #4381E5;"
                         @click="toAddChooseSet(scope.row)">设置评分标准
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="choiceNum" label="选项个数">
            <template #default="scope">
              <el-input :disabled="scope.row.quesType === '判断题'" v-model="scope.row.choiceNum" placeholder="请输入" @change="choiceNumChange(scope.row.choiceNum,scope.row)" oninput="if(value>7)value=7"
                        style="width: 80px; text-align: center;"></el-input>
            </template>
          </el-table-column>
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
              <el-button v-if="subStep === 6" disabled type="text" style="color: #C2C2C2;" @click="deleteQues(scope.row)">
                删除
              </el-button>
              <el-button v-else type="text" style="color: red;" @click="deleteQues(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <div style="text-align: center;margin-top: 50px">
              <img style="display: inline-block; position: relative;" src="@/assets/nullStatus.png" alt="">
            </div>
            <div style="height: 22px; font-size: 12px; color: #808080; line-height: 22px; text-align: center;">
              还没有设置题块结构！
            </div>
          </template>
        </el-table>
      </div>
      <el-dialog v-model="addKeGuanVisible" title="批量添加客观题" width="800px" :before-close="closeAddKeGuan">
        <div>从&nbsp;&nbsp;
          <el-input v-model="addFrom.startQuesNo" style="width: 50px;" placeholder=""/>
          &nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;
          <el-input v-model="addFrom.endQuesNo" style="width: 50px;" placeholder=""/>
          &nbsp;&nbsp;&nbsp;题,&nbsp;每题&nbsp;&nbsp;
          <el-input v-model="addFrom.score" oninput="value=value.replace(/[^\d]/g,'')" style="width: 50px;"
                    placeholder=""/>&nbsp;&nbsp;&nbsp;分,题型&nbsp;
          <el-select v-model="addFrom.quesType" placeholder="请选择" @change="changeType()"
                     style="width: 100px; height: 32px;">
            <el-option v-for="item in quesTypeList" :key="item.value" :label="item.label"
                       :value="item.label"/>
          </el-select>
          ,每题&nbsp;
          <el-input v-model="data.addFrom.quesOptions" oninput="if(value>7)value=7" style="width: 50px;"
                    placeholder=""/>
          &nbsp;&nbsp;&nbsp;个选项,科目
          <el-input
              v-if="subName !== '文综' && subName !== '文科综合' && subName !== '理综' && subName !== '理科综合'"
              v-model="data.addFrom.quesSub" placeholder="请选择" style="width: 100px; height: 32px;"
              disabled>
          </el-input>

          <el-select v-else v-model="data.addFrom.quesSub" placeholder="请选择"
                     style="width: 100px; height: 32px;">
            <el-option v-for="item in data.quesSubList" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </div>
        <template #footer>
                    <span class="dialog-footer">
                        <el-button style="width: 100px; height: 32px;" type="primary" @click="addKeGuanVisible = false">取消</el-button>
                        <el-button style="width: 100px; height: 32px;" type="danger" @click="addQuestionKeGuan">确定
                        </el-button>
                    </span>
        </template>
      </el-dialog>


      <el-dialog v-model="deleteQuesVisible" title="删除确认" width="600px">
        <span style="color: red;">确定删除第{{ quesNo }}题？</span>
        <template #footer>
                    <span class="dialog-footer">
                        <el-button style="width: 100px; height: 32px;" type="primary"
                                   @click="deleteQuesVisible = false">取消</el-button>
                        <el-button style="width: 100px; height: 32px;" type="danger" @click="toDelete">确定</el-button>
                    </span>
        </template>
      </el-dialog>


      <el-dialog v-model="addMoreQuesVisible" title="多选题评分设置" width="600px" :before-close="closeSet">
        <span class="inblock">有错误答案</span>&nbsp;&nbsp;
        <el-select v-model="chooseSetFrom.wrongType" placeholder="请选择" clearable style="width: 200px;">
          <el-option v-for="eType in data.getScoreList" :key="eType.value" :label="eType.label"
                     :value="eType.value"/>
        </el-select>
        <br>

        <br><span class="inblock">最大选择数</span>&nbsp;&nbsp;
        <el-select v-model="chooseSetFrom.maxNum" placeholder="请选择" clearable style="width: 200px;">
          <el-option v-for="eType in data.chooseList" :key="eType.value" :label="eType.label"
                     :value="eType.value"/>
        </el-select>
        <br>

        <br><span class="inblock">部分正确得分</span>&nbsp;&nbsp;
        <el-select v-model="chooseSetFrom.rightType" placeholder="请选择" clearable style="width: 200px;">
          <el-option v-for="eType in data.trueScoreeList" :key="eType.value" :label="eType.label"
                     :value="eType.value"/>
        </el-select>
        <br>
        <div v-if="chooseSetFrom.rightType === 0">
          <br><span class="inblock">得分标准</span>&nbsp;&nbsp;
          <el-input v-if="chooseSetFrom.rightType === 0" v-model="chooseSetFrom.unifScore" placeholder="0"
                    style="width: 200px;"></el-input>
        </div>
        <br>
        <div v-if="chooseSetFrom.rightType === 1">
          <span class="inblock">得分标准</span>&nbsp;&nbsp;<br><br>
          <span class="inblock">正确1个得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ1" placeholder="0" style="width: 200px;"></el-input>
          <br><br>
          <span class="inblock">正确2个得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ2" placeholder="0" style="width: 200px;"></el-input>
          <br><br>
          <span class="inblock">正确3个得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ3" placeholder="0" style="width: 200px;"></el-input>
          <br><br>
          <span class="inblock">正确4个得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ4" placeholder="0" style="width: 200px;"></el-input>
          <br>
          <br>
        </div>

        <div v-if="chooseSetFrom.rightType === 2">
          <span>得分标准</span>&nbsp;&nbsp;<br><br>
          <span>A得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ1" placeholder="0" style="width: 200px;"></el-input>
          <br><br>
          <span>B得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ2" placeholder="0" style="width: 200px;"></el-input>
          <br><br>
          <span>C得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ3" placeholder="0" style="width: 200px;"></el-input>
          <br><br>
          <span>D得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ4" placeholder="0" style="width: 200px;"></el-input>
          <br><br>
          <span>E得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ5" placeholder="0" style="width: 200px;"></el-input>
          <br><br>
          <span>F得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ6" placeholder="0" style="width: 200px;"></el-input>
          <br><br>
          <span>G得分</span>&nbsp;&nbsp;
          <el-input v-model="chooseSetFrom.righ7" placeholder="0" style="width: 200px;"></el-input>
          <br>
        </div>
        <br>
        <span style="color: red;">注：确定后点击页面下方“保存”按钮生效。</span><br>
        <el-checkbox v-model="chooseSetFrom.tongbu" label="1">同步到其他多选题</el-checkbox>
        <template #footer>
                    <span class="dialog-footer">
                        <el-button style="width: 100px; height: 32px;" type="primary"
                                   @click="addMoreQuesVisible = false">取消</el-button>
                        <el-button style="width: 100px; height: 32px;" type="danger" @click="toSaveChooseSet">确定
                        </el-button>
                    </span>
        </template>
      </el-dialog>


      <el-dialog v-model="addMoreAnswerVisible" title="批量设置客观题答案" width="800px" :before-close="closeAddAnswer">
        <div class="">
          <el-input v-model="textArea" @input="inputChange" rows="5" type="textarea" style="text-align: left"
                    placeholder="注：&#10;1.单选题答案可以连续输入，如ABCDEFABCDEF；也可以空格输入A B C D E F A B C D E F。&#10;2.多选题答案需要空格输入，如AB A C AC。&#10;3.大小写都可以"
          ></el-input>
        </div>
        <br>
        <span>预览</span><br>
        <div class="divcss6">
          {{ returnStr }}
        </div>

        <template #footer>
                    <span class="dialog-footer">
                         <el-button style="width: 100px; height: 32px;" type="danger"
                                    @click="toaddMoreAnswer">保存</el-button>
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
  updateMarkAreaInfos,
  chooseSet,
  chooseSetInfo,
  updQuesAnswerApi
} from '@/api/exam';
import { ElMessage } from 'element-plus'
import router from '@/router';

const route = useRoute()
const examId = route.query.examId
const subId = route.query.subId
const subName = route.query.subName
const quesNo = ref<any>('')
const totalScore = ref<any>('');

const quesScore = ref<any>('');

const anotherScore = ref<any>('');

const subStep = ref<any>('');

const deleteQuesVisible = ref<boolean>(false)
const addKeGuanVisible = ref<boolean>(false)

const addMoreQuesVisible = ref<boolean>(false)
const addMoreAnswerVisible = ref<boolean>(false)
const dataList = ref([])

const updateAnswerList = ref<any>([])

const updateAnswerParam = {
  quesId: ref<any>(''),
  answer: ref<any>('')
}

class addObjective {
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


class addChooseSetInfo {
  maxNum: any
  righ1: any
  righ2: any
  righ3: any
  righ4: any
  righ5: any
  righ6: any
  righ7: any
  rightType: any
  unifScore: any
  wrongType: any
  paperId: any
  geneId: any
  quesId: any
  tongbu: any
  examId: any
  subName: any
}

const data = reactive({
  queryParams: {
    subId: ref<any>(''),
    examId: ref<any>(''),
    quesType: 1
  },

  addFrom: new addObjective(),
  quesTypeList: [{value: 1, label: '单选题'}, {value: 2, label: '多选题'}, {value: 3, label: '判断题'}],
  quesSubList: ref<any>([]),
  deleteParams: {
    quesId: ref<any>(''),
    gQIId: ref<any>(''),
    subjectId: ref<any>('')
  },
// oneList  //   :[{value: 1, label: 'A'}],
  //   twoList:[{value: 1, label: 'A'}, {value: 2, label: 'B'}],
  //   threeList:[{value: 1, label: 'A'}, {value: 2, label: 'B'},{value: 3, label: 'C'},],
  //   answerList: [{value: 1, label: 'A'}, {value: 2, label: 'B'}, {value: 3, label: 'C'}, {value: 4, label: 'D'}],
  //   fiveList:[{value: 1, label: 'A'}, {value: 2, label: 'B'}, {value: 3, label: 'C'}, {value: 4, label: 'D'}
  //       , {value: 5, label: 'E'}],
  //   sixList:[{value: 1, label: 'A'}, {value: 2, label: 'B'}, {value: 3, label: 'C'}, {value: 4, label: 'D'}
  //       , {value: 5, label: 'E'}, {value: 6, label: 'F'}],
  // moreChooseAnswerList: [{value: 1, label: 'A'}, {value: 2, label: 'B'}, {value: 3, label: 'C'}, {value: 3, label: 'D'}
  //   , {value: 3, label: 'E'}, {value: 3, label: 'F'}, {value: 3, label: 'G'}],
  allAnswerList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  panduanList: [{value: 1, label: 'T'}, {value: 2, label: 'F'}],
  wenList: [{value: '政治', label: '政治'}, {value: '历史', label: '历史'}, {value: '地理', label: '地理'}],
  liList: [{value: '物理', label: '物理'}, {value: '化学', label: '化学'}, {value: '生物', label: '生物'}],
  getScoreList: [{value: 0, label: '不得分'}, {value: 1, label: '得分'}],
  chooseList: [{value: 0, label: '不限制'}, {value: 1, label: '1个'}, {value: 2, label: '2个'}, {
    value: 3,
    label: '3个'
  },
    {value: 4, label: '4个'}],
  trueScoreeList: [{value: 0, label: '统一得分'}, {value: 1, label: '按正确选项数得分'}, {
    value: 2,
    label: '按选项得分'
  }],
  routerSubjectiveParam: {
    examId: ref<any>(''),
    subName: ref<any>(''),
    subId: ref<any>(''),
  },

  chooseSetFrom: new addChooseSetInfo(),

  upAnsParam: {
    subId: ref<any>(''),
    examId: ref<any>(examId),
    subName: ref<any>(subName),
    answerList: ref<any>([])
  },
  upAllQuesParam: {
    examId: ref<any>(''),
    subName: ref<any>(''),
    questionsList: ref<any>([])
  }
})

const {
  queryParams, addFrom, deleteParams, routerSubjectiveParam,
  quesSubList, quesTypeList, chooseSetFrom, upAnsParam, upAllQuesParam, allAnswerList,

} = toRefs(data)


function listKeGuan(data: any) {
  queryKeGuan(data).then((res: any) => {
    if (res.success) {
      dataList.value = res.data.questionsVos
      res.data.questionsVos.forEach((item: any) => {
        if (item.quesType === '多选题') {
          item.quesAnswer = [...item.quesAnswer]
        }
      })
      totalScore.value = res.data.totScore
      quesScore.value = res.data.quesScore
      anotherScore.value = res.data.anotherScore
      subStep.value = res.data.step
      console.log(subStep.value)
    } else {
      ElMessage.error(res.message)
    }

  })
}

function toAdd() {
  addKeGuanVisible.value = true
  addFrom.value = new addObjective()
  addFrom.value.quesSub = subName
  addFrom.value.createType = 1
  addFrom.value.subjObje = 1
}

function addQuestionKeGuan() {
  addFrom.value.subjectId = subId
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
  console.log(addFrom.value.score)
  if (addFrom.value.score <= 0) {
    ElMessage.warning('分值不能为0')
    return
  }
  if (!addFrom.value.quesType) {
    ElMessage.warning('题型不能为空')
    return
  }
  if (!addFrom.value.quesOptions) {
    ElMessage.warning('选项不能为空')
    return
  }
  adKeQuestion(addFrom.value).then((res: any) => {
    if (res.success) {
      setTimeout(() => {
        addFrom.value = new addObjective()
        addKeGuanVisible.value = false
      }, 100)
      listKeGuan(queryParams.value)
    } else {
      ElMessage.error(res.message)
    }

  })

}

function deleteQues(row: any) {
  deleteQuesVisible.value = true
  deleteParams.value.gQIId = row.gQIId
  deleteParams.value.quesId = row.quesId
  deleteParams.value.subjectId = subId
  quesNo.value = row.quesNo
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


function openAddMoreAnswer() {
  addMoreAnswerVisible.value = true
}

const textArea = ref<string>('')
const returnStr = ref<string>('')
const returnQuesStr = ref<string>('')

// 监听改变函数

function quesTypeChange(quesType:any,row:any){
  if(quesType === '判断题'){
    row.quesAnswer = ''
    row.choiceNum = 2
  }
  if(quesType === '单选题'){
    row.quesAnswer = ''
    row.choiceNum = 4
  }
  if(quesType === '多选题'){
     row.quesAnswer = ''
    row.choiceNum = 4
  }
}

function choiceNumChange(choiceNum:any,row:any){
  if(row.quesType === '判断题'){
    row.quesAnswer = ''
  }
  if(row.quesType === '单选题'){
    row.quesAnswer = ''
  }
  if(row.quesType === '多选题'){
     row.quesAnswer = ''
  }
}


function inputChange(str: string) {
  returnStr.value = ''
  returnQuesStr.value = ''
  const dataArr = dataList.value
  // 是否都是    const arr = dataList.value单选题
  const isType = dataArr.every((val: any) => val.quesType !== '多选题')
  if (isType) { //没有多选不要空格
    const str1 = str.replace(/\s*/g, '').toUpperCase()
    let errorMessage = ''
    let eachFlag = true
    Object.values(str1).map((vl: string, ins: number) => {
      if (eachFlag) {
        dataArr.map((vs: any, inq: number) => {
          if (ins === inq) {
            let flag = true
            if (vs.quesType === '单选题') {
              if (allAnswerList.value.slice(0, (vs.choiceNum ? vs.choiceNum : 4)).indexOf(vl) < 0) {
                eachFlag = false
                flag = false
                errorMessage = `第${ins+1}题答案必须是字母A-G`
              }
            } else {
              if (vl !== 'T' && vl !== 'F') {
                eachFlag = false
                flag = false
                errorMessage = `第${ins+1}题答案必须是字母T、F`
              }
            }
            if (flag) {
              const quesNo = vs.quesNo ? (' ' + vs.quesNo + ':') : ''
              const quesId = vs.quesId ? (' ' + vs.quesId + ':') : ''
              returnStr.value += quesNo
              returnStr.value += vl
              returnQuesStr.value += quesId
              returnQuesStr.value += vl
            }
          }
        })
      }
    })
    if (!eachFlag) {
      ElMessage.error(errorMessage)
    }
  } else { //有多选需要空格
    let str1 = str.toUpperCase().trim().split(/\s+/)
    let errorMessage = ''
    let eachFlag = true
    str1.forEach((vl: string, ins: number) => {
      if (eachFlag) {
        dataArr.forEach((vs: any, inq: number) => {
          if (ins === inq) {
            let flag = true
            let split = vl.split('')
            split.forEach((s: string) => {
              if (allAnswerList.value.slice(0, (vs.choiceNum ? vs.choiceNum : 4)).indexOf(s) < 0 && flag) {
                eachFlag = false
                flag = false
                errorMessage = `第${ins+1}题答案必须是字母A-G`
              }
            })
            if (flag) {
              const quesNo = vs.quesNo ? (' ' + vs.quesNo + ':') : ''
              const quesId = vs.quesId ? (' ' + vs.quesId + ':') : ''
              returnStr.value += quesNo
              returnStr.value += vl

              returnQuesStr.value += quesId
              returnQuesStr.value += vl

              updateAnswerParam.quesId = quesId
              updateAnswerParam.answer = vl
            }
          }

        });
      }
    })
    if (!eachFlag) {
      ElMessage.error(errorMessage)
    }
  }
  updateAnswerList.value = []
  updateAnswerList.value = returnQuesStr.value.split(' ')
}

function toUpdateAll() {
  const dataArr = dataList.value
  const isType = dataArr.every((val: any) => val.quesType !== '多选题')
  const checkScore = ref<any>(1)
  dataList.value.forEach((item: any, ins: number) => {
        if (item.quesType === '多选题') {
          item.quesAnswer = item.quesAnswer.toString().replaceAll(',', '')
        }

        if (item.quesScore <= 0) {
          console.log(item.quesScore)
          checkScore.value = 0
        }
      }
  )
  console.log(checkScore.value)
  if (checkScore.value !== 0) {
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
  } else {
    ElMessage.warning('分值不能为0!')
    listKeGuan(queryParams.value)
  }

}

function toSubjective() {
  routerSubjectiveParam.value.subName = subName
  routerSubjectiveParam.value.examId = examId
  routerSubjectiveParam.value.subId = subId
  router.push({name: 'processSubjectiveItem', query: routerSubjectiveParam.value})
}


function changeType() {
  if (addFrom.value.quesType === '单选题') {
    addFrom.value.quesOptions = 4
  } else if (addFrom.value.quesType === '多选题') {
    addFrom.value.quesOptions = 4
  } else {
    addFrom.value.quesOptions = 2
  }

}


function toAddChooseSet(row: any) {
  addMoreQuesVisible.value = true
  chooseSetFrom.value = new addChooseSetInfo()
  chooseSetFrom.value.maxNum = 0
  chooseSetFrom.value.righ1 = 0
  chooseSetFrom.value.righ2 = 0
  chooseSetFrom.value.righ3 = 0
  chooseSetFrom.value.righ4 = 0
  chooseSetFrom.value.righ5 = 0
  chooseSetFrom.value.righ6 = 0
  chooseSetFrom.value.righ7 = 0
  chooseSetFrom.value.rightType = 0
  chooseSetFrom.value.unifScore = 0
  chooseSetFrom.value.wrongType = 0
  chooseSetFrom.value.tongbu = false
  chooseSetFrom.value.paperId = row.paperId
  chooseSetFrom.value.geneId = row.gQIId
  chooseSetFrom.value.quesId = row.quesId
  chooseSetFrom.value.examId = examId
  chooseSetFrom.value.subName = subName
  getSetMessage();
}

function toSaveChooseSet() {
  chooseSet(chooseSetFrom.value).then((res: any) => {
    if (res.success) {
      setTimeout(() => {
        chooseSetFrom.value = new addChooseSetInfo()
        addMoreQuesVisible.value = false
      }, 10)
      ElMessage.success('评分标准设置成功!')
      listKeGuan(queryParams.value)
    } else {
      ElMessage.error(res.message)
    }

  })
}

function getSetMessage() {
  console.log(chooseSetFrom.value.tongbu)
  chooseSetInfo(chooseSetFrom.value).then((res: any) => {
    if (res.success) {
      if (res.data) {
        chooseSetFrom.value.maxNum = res.data.maxNum
        chooseSetFrom.value.righ1 = res.data.righ1
        chooseSetFrom.value.righ2 = res.data.righ2
        chooseSetFrom.value.righ3 = res.data.righ3
        chooseSetFrom.value.righ4 = res.data.righ4
        chooseSetFrom.value.righ5 = res.data.righ5
        chooseSetFrom.value.righ6 = res.data.righ6
        chooseSetFrom.value.righ7 = res.data.righ7
        chooseSetFrom.value.rightType = res.data.rightType
        chooseSetFrom.value.unifScore = res.data.unifScore
        chooseSetFrom.value.wrongType = res.data.wrongType
      }
    } else {
      ElMessage.error(res.message)
    }

  })
}

function toaddMoreAnswer() {
  upAnsParam.value.subId = subId
  if (updateAnswerList.value) {
    updateAnswerList.value.splice(0, 1)
  }
  upAnsParam.value.answerList = updateAnswerList.value
  updQuesAnswerApi(upAnsParam.value).then((res: any) => {
    if (res.success) {

      ElMessage.success(res.message)
      addMoreAnswerVisible.value = false
      textArea.value = ''
      returnStr.value = ''
      listKeGuan(queryParams.value)
    } else {
      ElMessage.error(res.message)
    }

  })
}

function closeAddKeGuan(done: any) {
  addFrom.value = new addObjective()
  setTimeout(() => {
    done()
  }, 10)
}

function cacelAddKeGuan() {
  addFrom.value = new addObjective()
}

function closeAddAnswer(done: any) {
  textArea.value = ''
  returnStr.value = ''
  setTimeout(() => {
    done()
  })
}

function closeSet(done: any) {
  chooseSetFrom.value = new addChooseSetInfo()
  setTimeout(() => {
    done()
  }, 100)
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
  queryParams.value.quesType = 1
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

// .divcss5 { width: 700px; height: 400px; border: 1px solid black; }
//
.divcss6 {
  width: 100%;
  height: 200px;
  background: #F8FBFF;
  font-size: 16px;
  color: #202020;
}

:deep(.el-input__inner) {
  text-align: center !important;
}

:deep(.el-table__inner-wrapper::before) {
  background-color: transparent !important;
}
.inblock{
  display: inline-block;
  width: 90px;
}
</style>
