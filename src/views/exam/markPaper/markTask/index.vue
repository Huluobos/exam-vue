<template>
  <div>
    <div style="height: 48px;">
      <el-row>
        <el-col :span="21" style="line-height: 50px;">
          <img src="../../../../assets/add-something.png" style="width: 20px; height: 20px; display: inline-block;" alt="">
          <span style="display: inline-block; font-size: 14px; font-family: MicrosoftYaHei, sans-serif; color: #202020; line-height: 22px; margin: 0 3px;">
            添加本科组长
          </span>
          <span v-for="item in subLeaderList" :key="item.id" style="text-align: center; padding: 0 10px; margin-right: 10px; line-height: 30px; display: inline-block; height: 30px; background: #ecf4ff; border-radius: 4px; border: 1px solid #d5dae5;">
            {{ item.name }}
          </span>
          <img src="../../../../assets/add.png" @click="onClick({},'subTeacher')" style="width: 20px; height: 20px; display: inline-block; cursor: pointer;" alt="">
        </el-col>
        <el-col :span="3" style="text-align: right;">
          <el-button :disabled="statusParam.publicStatus || !quesAreaList.some(obj => (obj.taskTeacher !== '' && obj.taskTeacher !== null))" v-if="!statusParam.markStatus"  class="btn-img" style="width: 100px; height: 32px; margin-top: 8px;" type="primary" @click="updateTaskPaper">
            <img class="img-pos" src="../../../../assets/paper-task-open.png" style="width: 20px; height: 20px; display: inline-block; cursor: pointer;" alt="">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开放阅卷
          </el-button>
          <el-button :disabled="statusParam.publicStatus" v-else class="btn-img" style="width: 100px; height: 32px; margin-top: 8px; background: #12b7a2; border: none;" type="primary" @click="updateTaskPaper">
            <img class="img-pos" src="../../../../assets/task-paper-down.png" style="width: 20px; height: 20px; display: inline-block; cursor: pointer;" alt="">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束阅卷
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
          :data="quesAreaList"
          :cell-style="{'text-align': 'center',}"
          :header-cell-style="{'text-align': 'center', 'color': '#202020','font-size': '14px','background': '#D3E0F4'}"
          border
      >
<!--        <el-table-column label="题块" fixed width="400">-->
<!--          <el-table-column v-for="(item,index) of quesAreaList" :prop="item.key" :label="item.name"-->
<!--                           :min-width="400" :key="index" >-->
<!--          </el-table-column>-->
<!--        </el-table-column>-->
        <el-table-column prop="name" label="题块" width="100px"></el-table-column>
        <el-table-column prop="includeNos" label="包含题号"></el-table-column>
        <el-table-column width="140px" prop="markType" label="评分设置">
          <template #default="scope">
            <span :style="!statusParam.publicStatus ? 'cursor: pointer;' : 'color: #c2c2c2'" class="font-class" @click="onClick(scope.row, 'markType')" >{{ scope.row.markType === 0 ? '单评' : scope.row.markType === 1 ? '双评 ( ≥ ' + scope.row.arbiScore + ' )' : '三评 ( ≥ ' + scope.row.arbiScore + ' )' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="阅卷限制时长" width="110px">
          <template #default="scope">
            <span :style="!statusParam.publicStatus ? 'cursor: pointer;' : 'color: #c2c2c2'" class="font-class" @click="onClick(scope.row, 'limitTime')" >{{ scope.row.limitTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="阅卷老师" width="400px">
          <template #default="scope">
            <span>
              {{ scope.row.taskTeacherName}}
            </span>
            <img v-if="scope.row.allocatType !== 4" src="../../../../assets/add.png" @click="onClick(scope.row, 'taskTeacher')" style="width: 20px; height: 20px; display: inline-block; cursor: pointer;" alt="">
          </template>
        </el-table-column>
        <el-table-column label="分配方式" width="120px">
          <template #default="scope">
            <span :style="!statusParam.publicStatus ? 'cursor: pointer;' : 'color: #c2c2c2'" class="font-class" @click="onClick(scope.row, 'allocatType')" >{{ scope.row.allocatType === 0 ? '效率优先' : scope.row.allocatType === 2 ? '定量分配' : scope.row.allocatType === 4 ? '按班级分配' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仲裁老师">
          <template #default="scope">
            <span>{{ scope.row.arbiTeacherName }}</span>
            <img v-if="scope.row.markType === 1" src="../../../../assets/add.png" @click="onClick(scope.row, 'arbiTeacher')" style="width: 20px; height: 20px; display: inline-block; cursor: pointer;" alt="">
          </template>
        </el-table-column>
        <el-table-column width="60px" label="操作">
          <template #default="scope">
            <span :style="!statusParam.publicStatus ? 'cursor: pointer;' : 'color: #c2c2c2'" class="font-class" @click="onClick(scope.row, 'synQuesArea')">同步</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    评分设置-->
    <el-dialog v-model="evalScoreTemp.markTypeFlag" :title="title" width="500px" destroy-on-close>
        <el-radio-group v-model="evalScoreTemp.markType">
          <el-radio :label="0">单评</el-radio>
          <el-radio :label="1">双评</el-radio>
          <el-radio :label="2">三评</el-radio>
        </el-radio-group>
      <div v-if="evalScoreTemp.markType === 1" style="display: flex; margin-top: 10px;">
        <span style="display: flex; align-items: center; margin-right: 5px;">
          当双评分差大于等于
        </span>
        <span style="display: inline-block; width: 50px;"><el-input @input="limitInput(evalScoreTemp.arbiScore, 'makeType')" style="width: 100%;" v-model="evalScoreTemp.arbiScore"></el-input></span>
        <span style="display: flex; align-items: center; margin-left: 5px;">
          需要仲裁
        </span>
      </div>
      <div v-if="evalScoreTemp.markType === 2">
        <el-row style="margin-top: 10px;">
            <span style="display: flex; align-items: center; margin-right: 5px;">
              当双评分差大于等于
            </span>
            <span style="display: inline-block; width: 50px;"><el-input style="width: 100%;" @input="limitInput(evalScoreTemp.arbiScore, 'makeType')" v-model="evalScoreTemp.arbiScore"></el-input></span>
            <span style="display: flex; align-items: center; margin-left: 5px;">
              时，则需要第三人再对其阅卷，最终成绩
            </span>
        </el-row>
        <span style="display: flex; align-items: center;">
             取最接近两个人的成绩取平均值，如果中间分与其他两个评分分差一样，则取高分的两个的平均分。
        </span>
      </div>
      <template #footer>
        <div style="text-align: center;">
          <el-button @click="evalScoreTemp.markTypeFlag = false">取 消</el-button>
          <el-button type="primary" @click="updateQuesMarkTypeAndTeacher">确 定</el-button>
        </div>
      </template>
    </el-dialog>
<!--    配置最小阅卷时长-->
    <el-dialog v-model="shortTimeData.shortTimeFlag" title="阅卷分配设置" width="500px" destroy-on-close>
      <el-form label-width="80px">
        <span style="font-size: 14px; font-family: MicrosoftYaHei-Bold, MicrosoftYaHei, sans-serif; font-weight: bold; color: #202020; line-height: 12px;">
          {{ rowData.name }}
        </span>
        <el-row style="margin-top: 10px;">
          <el-col :span="21">
            <el-form-item style="font-size: 14px;" label="限制(秒)：">
              <el-input class="limit-input"
                  v-model="shortTimeData.limitTime"
                  @input="limitInput(shortTimeData.limitTime, 'limitTime')"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <img src="../../../../assets/tips-img.png" style="width: 20px; height: 20px; display: inline-block; cursor: pointer;" alt="">
            <span style="font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #f33; line-height: 24px; margin-right: 10px;">注意</span>
            <span style="width: 267px; height: 24px; font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #202020; line-height: 24px;">注：0表示不限制，大于0数值表示最小阅卷时长。</span>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button @click="shortTimeData.shortTimeFlag = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('limitTime')">确 定</el-button>
        </div>
      </template>
    </el-dialog>
<!--    添加阅卷老师或添加仲裁老师和本科组长-->
    <el-dialog v-model="teacherData.addTeacherFlag" :title="teacherData.teacherTitle" width="700px" destroy-on-close>
      <div style="display: flex; justify-content: flex-end;">
        <div style="flex: auto; border-right: 2px solid #d5dae5; margin-right: 30px; padding-right: 30px;">
          <el-row style="font-size: 14px; font-family: MicrosoftYaHei-Bold, MicrosoftYaHei, sans-serif; font-weight: bold; color: #202020; line-height: 22px; margin-bottom: 10px;">
            {{ teacherData.dialogTitle }}
          </el-row>
          <el-table
              style="flex: 1;"
              :data="teacherData.newDataList"
              :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
              :cell-style="{'text-align': 'center',}"
              border
              stripe
          >
            <el-table-column prop="name" min-width="20px" label="姓名"></el-table-column>
            <el-table-column label="操作" min-width="20px">
              <template #default="scope">
                <span v-if="scope.row.compNumber === 0" style="color: red; display: inline-block; cursor: pointer;" @click="delTeacher(scope.row)">删除</span>
                <span v-else style="color: #c2c2c2; display: inline-block; cursor: pointer;">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width: 373px;">
          <el-row style="font-size: 14px; font-family: MicrosoftYaHei-Bold, MicrosoftYaHei, sans-serif; font-weight: bold; color: #202020; line-height: 22px;">
            待选老师列表
          </el-row>
            <el-row style="text-align: left; margin: 10px 0;">
              <el-col :span="12" >
                <!-- size="small" -->
                  <el-select  style="width: 90%;" v-model="params.subName" placeholder="科目" clearable  @change="getSchoolTeachers">
                    <el-option label="全部" value="" />
                    <el-option v-for="item in subNameOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
              </el-col>
              <el-col :span="12">
                <!-- size="small" -->
                <el-select  style="width: 90%;" v-model="params.gradeType" placeholder="年级" clearable @change="getSchoolTeachers">
                  <el-option label="全部" value="" />
                  <el-option v-for="grade in examGradeList" :key="grade.value" :label="grade.label"
                             :value="grade.value" />
              </el-select>
              </el-col>
            </el-row>
          <el-row style="margin-bottom: 10px;">
            <el-col :span="12">
              <!-- size="small" -->
              <el-input
                  v-model="params.searchName"
                  
                  style="width: 168px;"
                  clearable
                  @change="getSchoolTeachers"
                  placeholder="按姓名搜索"
              >
              </el-input>
            </el-col>
            <el-col :span="12" style="display: flex; align-items: center; justify-content: end; padding-right: 15px;">
              <el-button style="height: 32px;" type="primary" slot="append" @click="getSchoolTeachers">查询</el-button>
            </el-col>
          </el-row>
          <el-table
              style="flex: 1;"
              :data="dataList"
              :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
              :cell-style="{'text-align': 'center',}"
              border
              stripe
          >
            <el-table-column prop="teacherName" min-width="20px" label="姓名"></el-table-column>
            <el-table-column label="操作" min-width="20px">
              <template #default="scope">
                <span v-if="teacherData.newDataList.filter(item => item.id === scope.row.id).length > 0" style="color: #c2c2c2; cursor: pointer;">添加</span>
                <span v-else style="color: #4381e5; cursor: pointer;" @click="addTeacher(scope.row)">添加</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="Pagination-box mt-10">
            <Pagination
                style="margin-top: 5px;"
                v-show="total > 0"
                :total="total"
                v-model:page="page"
                :pager-count="5"
                v-model:limit="params.limit"
                layout='total, prev, pager'
                @pagination="getSchoolTeachers"/>
          </div>
        </div>
      </div>
    </el-dialog>
<!--    分配方式-->
    <el-dialog v-model="distributeData.distributeFlag" title="阅卷分配方式" width="600px">
      <div style="width: 560px; display: flex;">
        <div :class="distributeData.allocatType === 0 ? 'background-class' : 'not-background-class'" @click="distributeData.allocatType = 0">
          <span :class="distributeData.allocatType === 0 ? 'background-font-style' : 'not-background-font-style'">效率优先</span>
        </div>
        <div :class="distributeData.allocatType === 2 ? 'background-class' : 'not-background-class'" @click="distributeData.allocatType = 2">
          <span :class="distributeData.allocatType === 2 ? 'background-font-style' : 'not-background-font-style'">定量分配</span>
        </div>
        <div :class="distributeData.allocatType === 4 ? 'background-class' : 'not-background-class'" @click="distributeData.allocatType = 4">
          <span :class="distributeData.allocatType === 4 ? 'background-font-style' : 'not-background-font-style'">按班级分配</span>
        </div>
      </div>
      <div v-if="distributeData.allocatType === 0" style="width: 560px; background: #f8fbff; line-height: 40px;">
        <img src="../../../../assets/explain.png" style="width: 20px; margin-bottom: 3px; height: 20px; display: inline-block;" alt="">
        <span style="display: inline-block; width: 434px; height: 22px; font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #202020;">
          说明：每个阅卷老师不设置任务上限，直到所有的试卷被阅完为止。
        </span>
      </div>
      <div v-else-if="distributeData.allocatType === 2" style="width: 560px; background: #f8fbff; line-height: 40px;">
        <img src="../../../../assets/explain.png" style="width: 20px; margin-bottom: 3px; height: 20px; display: inline-block;" alt="">
        <span style="display: inline-block; width: 434px; height: 22px; font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #202020;">
          说明：每个老师设置固定的任务量。
        </span>
      </div>
      <div v-else style="width: 560px; height: 40px; background: #f8fbff; line-height: 40px;">
        <img src="../../../../assets/explain.png" style="width: 20px; margin-bottom: 3px; height: 20px; display: inline-block;" alt="">
        <span style="display: inline-block; width: 434px; height: 22px; font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #202020;">
          说明：按照教学班级分配阅卷老师。
        </span>
      </div>
      <el-row v-if="distributeData.allocatType === 2">
        <el-col :span="3" style="font-size: 12px; line-height: 30px;">
          分配总数
        </el-col>
        <el-col :span="15" style="margin-top: 2px;">
          <el-radio-group size="small" v-model="distributeData.baseNumType" @change="initBaseNumType">
            <el-radio :label="0">按考生报名人数</el-radio>
            <el-radio :label="1">按上传试卷份数</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="6" style="font-size: 12px; line-height: 30px; text-align: right;">
          <img src="../../../../assets/avg.png" style="width: 20px; margin-bottom: 3px; height: 20px; display: inline-block; cursor: pointer;" alt="">
          <span
              style="display: inline-block; font-size: 14px; font-family: MicrosoftYaHei, sans-serif; cursor: pointer; color: #4381e5; line-height: 22px; margin-left: 5px; margin-top: 5px;"
              @click="avgData"
          >
            一键平均分配
          </span>
        </el-col>
      </el-row>
      <el-row v-if="distributeData.allocatType === 2">
        <el-col :span="3" style="font-size: 12px; line-height: 40px;">
          分配数量
        </el-col>
        <el-col v-for="(item, index) in distributeData.teacherList" :key="item.id" :span="index !== 0 && index % 3 === 0 ? 10 : 7" style="margin-top: 2px; font-size: 12px;">
          <div style="display: flex;" :style="index !== 0 && index%3 === 0 ? 'margin-left: 70px' : ''">
            <span style="display: flex; align-items: center; width: 36px; margin-right: 10px;">
              {{ item.name }}
            </span>
            <span style="display: inline-block; width: 50px;"><el-input style="width: 100%;" v-model="item.number"></el-input></span>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="distributeData.allocatType === 4">
        <el-table
            style="flex: 1;"
            :data="distributeData.classDataList"
            :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
            :cell-style="{'text-align': 'center',}"
            border
            stripe
        >
          <el-table-column prop="className" min-width="20px" label="教学班级"></el-table-column>
          <el-table-column prop="studentCount" min-width="30px" label="参考学生数量"></el-table-column>
          <el-table-column prop="teacherName" label="分配阅卷老师"></el-table-column>
        </el-table>
      </el-row>
      <template #footer>
        <div>
          <el-button @click="distributeData.distributeFlag = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('allocatType')">确 定</el-button>
        </div>
      </template>
    </el-dialog>
<!--    同步题块-->
    <el-dialog v-model="synQuesAreaData.synDialogFlag" title="同步题块阅卷设置" width="600px" destroy-on-close>
      <div style="font-size: 14px; font-family: MicrosoftYaHei, sans-serif; color: #202020; line-height: 16px; margin: 10px 0;">
        <span>请选择将</span>
        <span style="color: red;">{{ rowData.name }}</span>
        <span>的阅卷设置同步到下面题块</span>
      </div>
      <div style="margin-left: 10px;">
        <el-checkbox v-model="synQuesAreaData.checkAll" :indeterminate="synQuesAreaData.isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group
            v-model="synQuesAreaData.checkedList"
            @change="handleCheckedChange">
          <el-checkbox v-for="item in synQuesAreaData.quesAreaListTemp" :key="item" :label="item.id">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <div>
          <el-button @click="synQuesAreaData.synDialogFlag = false">取 消</el-button>
          <el-button type="primary" @click="synQuesAreaInfo">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import {
  findClassTeacherListApi,
  findMarkTaskListApi, findSubLeaderApi, getDetailStatisticsApi,
  getSchoolTeachersApi, listByExamIdAndSubNameApi, saveSubLeaderApi,
  updateQuesAreaTaskTeacherApi,
  updateQuesMarkTypeAndTeacherApi, updOpenTaskPaperApi,
  updQuesAreaInfoApi,
  updQuesAreaListApi
} from '@/api/exam'
import {ElMessage} from "element-plus";
type subType  = {
  value:string,
  label:string,
}
const subNameOptions:subType[]= [
  {value:'语文',label:'语文'},
  {value:'数学',label:'数学'},
  {value:'英语',label:'英语'},
  {value:'物理',label:'物理'},
  {value:'化学',label:'化学'},
  {value:'生物',label:'生物'},
  {value:'政治',label:'政治'},
  {value:'历史',label:'历史'},
  {value:'地理',label:'地理'},
  {value:'技术',label:'技术'},
  {value:'文科综合',label:'文科综合'},
  {value:'理科综合',label:'理科综合'},
]

//路由参数
const route = useRoute()
const param = ref<any>({
  examId: route.query.examId,
  subName: route.query.subName
})
//变量声明
const rowData = ref<any>([])
const title = ref('')
const dataList = ref([])
const total = ref(0)
const page = ref(1)
const taskTeacher = ref<any>([])
const quesAreaList = ref<any>([])
const subLeaderList = ref<any>([])
const examGradeList = [{value: '1', label: '高一'}, {value: '2', label: '高二'}, {value: '3', label: '高三'},
  {value: '11', label: '初一'}, {value: '12', label: '初二'}, {value: '13', label: '初三'},
  {value: 26, label: '六年级'}, {value: 25, label: '五年级'}, {value: 24, label: '四年级'},
  { value: '23', label: '三年级' }, { value: '22', label: '二年级' }, { value: '21', label: '一年级' }
  ]

const params = ref({
  subName: param.value.subName,
  gradeType: route.query.grade,
  searchName: '',
  limit: 10,
  offset: 0
})
const teacherData = ref({
  teacherTitle: '',
  dialogTitle: '',
  dialogType: 0, //0阅卷,1仲裁 2学科组长
  addTeacherFlag: false,
  newDataList: <any>[]
}) //教师弹窗
const shortTimeData = ref({
  shortTimeFlag: false,
  limitTime: 0
}) //阅卷限制时长
const evalScoreTemp = ref({
  markTypeFlag: false,
  markType: '',
  arbiScore: 0
}) //评分设置
const distributeData = ref<any>({
  distributeFlag: false,
  allocatType: 0,
  baseNumType: 1,
  teacherList: [],
  classDataList: [],
  studentNumber: 0,
  uploadPaperNumber: 0
}) //分配方式
const synQuesAreaData = ref<any>({
  synDialogFlag: false,
  checkAll: false,
  isIndeterminate: false,
  quesAreaListTemp: [],
  checkedList: []
}) //题块同步
const statusParam = ref<any>({
  markStatus: false,
  publicStatus: false // false 成绩未发布 true 成绩已发布
}) //状态管理

const handleCheckAllChange = () => {
  if (synQuesAreaData.value.checkAll) {
    synQuesAreaData.value.quesAreaListTemp.forEach((item: { id: any; }) => {
      synQuesAreaData.value.checkedList.push(item.id)
    })
  } else {
    synQuesAreaData.value.checkedList = []
  }
  synQuesAreaData.value.isIndeterminate = false
}

const handleCheckedChange = (value: string[]) => {
  const checkedCount = value.length
  synQuesAreaData.value.checkAll = checkedCount === synQuesAreaData.value.quesAreaListTemp.length
  synQuesAreaData.value.isIndeterminate = checkedCount > 0 && checkedCount < synQuesAreaData.value.quesAreaListTemp.length
}

//同步题块
const synQuesAreaInfo = () => {
  const list = <any>[]
  quesAreaList.value.forEach((obj: {
      includeNos: any;
      name: any; id: any;
  },ins:number) => {
    synQuesAreaData.value.checkedList.forEach((item: any) => {
      if (obj.id === item) {
        const id = obj.id
        const name = obj.name
        const includeNos = obj.includeNos
        obj = Object.assign({},rowData.value)
        obj.id = id
        obj.name = name
        obj.includeNos = includeNos
        list.push(obj)
        // quesAreaList.value.splice(ins, 1, obj)
      }
    })
  })
  synQuesAreaData.value.synDialogFlag = false
  //批量更新操作
  const dataList = <any>[]
  list.forEach((item: {
      markType: any;
      arbiScore: any;
      taskTeacher: any; id: any; allocatType: any; baseNumType: any; limitTime: any;arbiTeacher: any;
  }) => {
    const taskTeacherList = getTeacherIdList(item.taskTeacher) //阅卷老师集合
    const arbiTeacherList = getTeacherIdList(item.arbiTeacher) //仲裁老师集合
    const teacherInfos = getTeacherInfoList(item.taskTeacher) //仲裁老师集合
    const data = <any>{
      teacherQuesAreaParam: {
        areaId: item.id,
        allocatType: item.allocatType,
        baseNumType: item.baseNumType,
        limitTime: item.limitTime,
        type: 2,
        teacherInfos: teacherInfos
      },
      taskTeacherParam: {
        areaId: item.id,
        arbiTeacType: 0, //阅卷老师
        idList: taskTeacherList
      },
      arbiTeacherParam: {
        areaId: item.id,
        arbiTeacType: 1, //仲裁老师
        idList: arbiTeacherList
      },
      eExamMarkQuesAreaVo: {
        arbiScore: item.arbiScore,
        id: item.id,
        markType: item.markType
      }
    }
    dataList.push(data)
  })
  updQuesAreaListApi(dataList,param.value).then((res: any) => {
    if (res.success) {
      findMarkTaskList()
    } else {
      ElMessage.error(res.message)
    }
  })
}

const getTeacherIdList = (teacherString: string) => {
  const teacherList = <any>[]
  if (teacherString) {
    const list = teacherString.split(',')
    list.forEach((item: string) => {
      const infoList = item.split('-')
      if (infoList && infoList.length === 2) {
        const id = infoList[1]
        teacherList.push(id)
      }
    })
  }
  return teacherList
}

const getTeacherInfoList = (teacherString: string) => {
  const teacherList = <any>[]
  if (teacherString) {
    const list = teacherString.split(',')
    list.forEach((item: string) => {
      const infoList = item.split('-')
      if (infoList && infoList.length === 2) {
        const number = infoList[0].match(/((?<=(\()).*?(?=(\))))/g)
        const compNumber = infoList[0].match(/((?<=(\[)).*?(?=(])))/g)
        const name = infoList[0].replace(/\([\s\S]+?\)|\[[\s\S]+?]/g, '')
        const id = infoList[1]
        const info = {name: name, teacherId: id,number:  number && number[0] ? number[0] : 0,compNumber: compNumber && compNumber[0] ? compNumber[0] : 0}
        teacherList.push(info)
      }
    })
  }
  return teacherList
}


const initTeacherList = (data: any) => {
  //组装数据
  distributeData.value.teacherList = []
  if (data.taskTeacherName) {
    const list = data.taskTeacher.split(',')
    list.forEach((item: string) => {
      const infoList = item.split('-')
      if (infoList && infoList.length === 2) {
        const number = infoList[0].match(/((?<=(\()).*?(?=(\))))/g)
        const compNumber = infoList[0].match(/((?<=(\[)).*?(?=(])))/g)
        const name = infoList[0].replace(/\([\s\S]+?\)|\[[\s\S]+?]/g, '')
        const id = infoList[1]
        const info = {name: name, teacherId: id,number:  number && number[0] ? number[0] : 0,compNumber: compNumber && compNumber[0] ? compNumber[0] : 0}
        distributeData.value.teacherList.push(info)
      }
    })
  }
}


//弹窗点击时间
const onClick = (data: any, type: String) => {
  if (statusParam.value.publicStatus) {
    //成绩已发布
    return
  }
  if (data) {
    rowData.value = data
  }
  if (type === 'markType') {
    evalScoreTemp.value.markTypeFlag = true
    evalScoreTemp.value.markType = rowData.value.markType
    evalScoreTemp.value.arbiScore = rowData.value.arbiScore
    title.value = data.name + '评分设置'
  } else if (type === 'limitTime') {
    shortTimeData.value.shortTimeFlag = true
    shortTimeData.value.limitTime = rowData.value.limitTime
  } else if (type === 'allocatType') {
    listAllClassName()
    getDetailStatistics()
    distributeData.value.distributeFlag = true
    //数据赋参
    distributeData.value.allocatType = rowData.value.allocatType
    distributeData.value.baseNumType = rowData.value.baseNumType
    //初始化教师数量信息
    initTeacherList(data)
  } else if (type === 'taskTeacher') {
    teacherData.value.newDataList = []
    getSchoolTeachers()
    teacherData.value.addTeacherFlag = true
    teacherData.value.dialogTitle = '已选阅卷老师'
    teacherData.value.teacherTitle = '添加阅卷老师'
    teacherData.value.dialogType = 0
    if (data.taskTeacherName) {
      const list = data.taskTeacher.split(',')
      list.forEach((item: string) => {
        const infoList = item.split('-')
        if (infoList && infoList.length === 2) {
          const name = infoList[0].replace(/\([\s\S]+?\)|\[[\s\S]+?]/g, '')
          let compNumberList = infoList[0].match(/((?<=(\[)).*?(?=(])))/g)
          const id = infoList[1]
          let compNumber = compNumberList && compNumberList[0] ? parseInt(compNumberList[0]) : 0
          const teacherInfo = data.taskInfo.filter((obj: { "teacherId": any; }) => obj.teacherId === id)[0]
          if (teacherInfo) {
            compNumber = compNumber + teacherInfo.taskCount
          }
          const info = {name: name, id: id, compNumber: compNumber}
          teacherData.value.newDataList.push(info)
        }
      })
    }
  } else if (type === 'arbiTeacher') {
    teacherData.value.newDataList = []
    getSchoolTeachers()
    teacherData.value.addTeacherFlag = true
    teacherData.value.dialogTitle = '已选仲裁老师'
    teacherData.value.teacherTitle = '添加仲裁老师'
    teacherData.value.dialogType = 1
    if (data.arbiTeacherName) {
      const list = data.arbiTeacher.split(',')
      list.forEach((item: string) => {
        const infoList = item.split('-')
        if (infoList && infoList.length === 2) {
          const name = infoList[0].replace(/\([\s\S]+?\)|\[[\s\S]+?]/g, '')
          const id = infoList[1]
          const info = {name: name, id: id, compNumber: 0}
          teacherData.value.newDataList.push(info)
        }
      })
    }
  } else if (type === 'subTeacher') {
    teacherData.value.newDataList = subLeaderList.value
    teacherData.value.newDataList.forEach((item: { compNumber: number; }) => {
      item.compNumber = 0
    })
    getSchoolTeachers()
    teacherData.value.addTeacherFlag = true
    teacherData.value.dialogTitle = '已选本科组长'
    teacherData.value.teacherTitle = '添加本科组长'
    teacherData.value.dialogType = 2
  } else if (type === 'synQuesArea') {
    synQuesAreaData.value.synDialogFlag = true
    synQuesAreaData.value.checkedList = []
    synQuesAreaData.value.checkAll = false
    //数据重新赋值
    synQuesAreaData.value.quesAreaListTemp = Object.assign([], quesAreaList.value)
    //移除rowData数据
    synQuesAreaData.value.quesAreaListTemp.forEach((obj: { id: any; }, index: any, arr: any[]) => {
      if (obj.id === rowData.value.id) {
        arr.splice(index,1)
        return
      }
    })
  }
}

const initBaseNumType = () => {
  if (distributeData.value.baseNumType === rowData.value.baseNumType) {
    initTeacherList(rowData.value)
  } else {
    distributeData.value.teacherList.forEach((item : any) => {
      item.number = 0
    })
  }
}

const addTeacher = (data: any) => {
  let breakFlag = false
  teacherData.value.newDataList.forEach((item: { id: any; }) => {
    if (item.id === data.id) {
      breakFlag = true
      return
    }
  })
  if (breakFlag) {
    ElMessage.warning('已存在')
    return
  }
  const item = {
    name: data.teacherName,
    id: data.id,
    compNumber: 0
  }
  teacherData.value.newDataList.push(item)

  //判断阅卷老师和仲裁老师走一个接口，学科组长走一个接口
  if (teacherData.value.dialogType === 2) {
    updSubLeader()
  } else {
    //后台更新数据
    updateRowData(teacherData.value.newDataList)
  }
}

const updSubLeader = () => {
  const idList = <any>[]
  teacherData.value.newDataList.forEach((item: any) => {
    idList.push(item.id)
  })
  saveSubLeaderApi(idList, param.value).then((res: any) => {
    if (res.success) {

    } else {
      ElMessage.error(res.message)
    }
  })
}

const findSubLeader = () => {
  findSubLeaderApi(param.value).then((res: any) => {
    if (res.success) {
      subLeaderList.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
}

const delTeacher = (data: {}) => {
  if (!(teacherData.value.newDataList.indexOf(data) > -1)) {
    ElMessage.success('不存在')
    return
  }
  const index = teacherData.value.newDataList.indexOf(data)
  teacherData.value.newDataList.splice(index,1)
  if (teacherData.value.dialogType === 2) {
    updSubLeader()
  } else {
    //后台更新数据
    updateRowData(teacherData.value.newDataList)
  }
}
//一键平均分配
const avgData = () => {
  //初始化教师题块数量
  initTeacherList(rowData.value)
  const size = distributeData.value.teacherList.length
  let count = 0
  if (distributeData.value.baseNumType === 1) {
    count = distributeData.value.uploadPaperNumber
  } else if (distributeData.value.baseNumType === 0) {
    count = distributeData.value.studentNumber
  } else {
    ElMessage.error('数据错误，请关闭后重试')
    return
  }
  let sum = 0
  const avg = Math.floor(count/size)
  for (let i = 0; i < size; i++) {
    const obj = distributeData.value.teacherList[i]
    if (size > i+1) {
      obj.number = avg
      sum = sum + avg
    } else {
      obj.number = count - sum
    }
  }
}
const submitForm = (type: string) => {
  let params = <any>{}
  if (type === 'limitTime') {//分配设置
    params = {
      areaId: rowData.value.id,
      limitTime: shortTimeData.value.limitTime,
      type: 0
    }
  } else if (type === 'allocatType') { //分配方式
    params = {
      areaId: rowData.value.id,
      allocatType: distributeData.value.allocatType,
      teacherInfos: distributeData.value.allocatType === 0 || distributeData.value.allocatType === 4 ? [] : distributeData.value.teacherList,
      type: 1
    }
    if (distributeData.value.allocatType === 2) {
      params.baseNumType = distributeData.value.baseNumType
    }
    //校验一下最终数量是否符合限制条件
    const teacherList = getTeacherInfoList(rowData.value.taskTeacher)
    let flag = false
    params.teacherInfos.forEach((item: { teacherId: any; number: any }) => {
      if (flag) {
        return;
      }
      let minNumber = 0
      const teacherInfo = teacherList.filter((obj: { "teacherId": any; }) => obj.teacherId === item.teacherId)[0]
      //先判断是否有阅卷中的任务
      // const taskInfo = rowData.value.taskInfo.filter((obj: { "teacherId": any; }) => obj.teacherId === item.teacherId)[0]
      // if (taskInfo) {
      //   minNumber = taskInfo.taskCount
      // }
      minNumber = minNumber + parseInt(teacherInfo.compNumber) //加上已完成数量
      if (item.number < minNumber) {
        ElMessage.warning(teacherInfo.name + '老师的数量不能小于' + minNumber )
        flag = true
        return
      }
    })
    if (flag) {
      return
    }
  }
  //后台更新数据
  updQuesAreaInfoApi(params).then((res: any) => {
    if (res.success) {
      shortTimeData.value.shortTimeFlag = false
      distributeData.value.distributeFlag = false
      findMarkTaskList()
    } else {
      ElMessage.error(res.message)
    }
  })
}

const limitInput = (value: any, type: string) => {
  let temp = value.toString()
  temp = temp.replace(/^0{1,10}/g, '')
  temp = temp.replace(/[^\d.]/g, '') //清除"数字"和"."以外的字符
  const size = temp.indexOf('.') > -1 ? temp.indexOf('.') : temp.length
  temp = temp.substring(0, size)
  const size1 = temp.indexOf('-') > -1 ? temp.indexOf('.') : temp.length
  temp = temp.substring(0, size1)
  if (temp > 100) {
    temp = 100
  }
  if (!temp) {
    temp = 0
  }
  if (type === 'makeType') {
    evalScoreTemp.value.arbiScore = temp
  } else if (type === 'limitTime') {
    shortTimeData.value.limitTime = temp
  }
}

const updateTaskPaper = () => {
  const params = {
    examId: param.value.examId,
    subName: param.value.subName,
    markStatus: statusParam.value.markStatus ? 0 : 1
  }
  updOpenTaskPaperApi(params).then((res: any) => {
    if (res.success) {
      listByExamIdAndSubName()
    } else {
      ElMessage.error(res.message)
    }
  })
}

const getSchoolTeachers = () => {
  const limit = 10
  params.value.offset = (page.value -1) * limit
  getSchoolTeachersApi(params.value).then((res: any) => {
    if (res.success) {
      dataList.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message)
    }
  })
}
const findMarkTaskList = () => {
  findMarkTaskListApi(param.value).then((res: any) => {
    if (res.success) {
      quesAreaList.value = res.data
      //数据处理
      quesAreaList.value.forEach((item: { taskTeacher: string; taskTeacherName: string; arbiTeacher: string; arbiTeacherName: string; }) => {
        if (item.taskTeacher) {
          const info = item.taskTeacher.split(',')
          const teacherList: string[] = []
          info.forEach((obj: string) => {
            const teacher = obj.split('-')
            if (teacher.length === 2) {
              const teacherName = teacher[0].replace(/\[[\s\S]+?]/g, '')
              teacherList.push(teacherName)
            }
          })
          item.taskTeacherName = teacherList.toString()
        }
        if (item.arbiTeacher) {
          const info = item.arbiTeacher.split(',')
          const teacherList: string[] = []
          info.forEach((obj: string) => {
            const teacher = obj.split('-')
            if (teacher.length === 2) {
              const name = teacher[0].replace(/\([\s\S]+?\)|\[[\s\S]+?]/g, '')
              teacherList.push(name)
            }
          })
          item.arbiTeacherName = teacherList.toString()
        }
      })
    } else {
      ElMessage.error(res.message)
    }
  })
}

const listByExamIdAndSubName = () => {
  listByExamIdAndSubNameApi(param.value).then((res: any) => {
    if (res.success) {
      statusParam.value.markStatus = res.data.markStatus !== 0
      statusParam.value.publicStatus = res.data.publicStatus !== 0
    } else {
      ElMessage.error(res.message)
    }
  })
}

//更新单条信息
const updateRowData = (list: any) => {
  //更新单条数据
  const idList: any[] = []
  list.forEach((item: { id: any; }) => {
    idList.push(item.id)
  })
  updateQuesAreaTaskTeacherApi(rowData.value.id, teacherData.value.dialogType, idList).then((res: any) => {
    if (res.success) {
      findMarkTaskList()
    } else {
      ElMessage.error(res.message)
    }
  })
}

const listAllClassName = () => {
  findClassTeacherListApi(param.value).then((res: any) => {
    if (res.success) {
      res.data.forEach((obj: { teacherName: any; }) => {
        const nameList: any[] = []
        obj.teacherName.split(',').forEach((item: any) => {
          const info = item.split('-')[0]
          nameList.push(info)
        })
        obj.teacherName = nameList.toString()
      })
      distributeData.value.classDataList = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
}

const getDetailStatistics = () => {
  getDetailStatisticsApi(param.value).then((res: any) => {
    if (res.success) {
      distributeData.value.studentNumber = res.data.allStudNum
      distributeData.value.uploadPaperNumber = res.data.uploadNum
    } else {
      ElMessage.error(res.message)
    }
  })
}

const updateQuesMarkTypeAndTeacher = () => {
  if (parseInt(evalScoreTemp.value.markType) === 0) {
    evalScoreTemp.value.arbiScore = 0
  }
  rowData.value.markType = evalScoreTemp.value.markType
  rowData.value.arbiScore = evalScoreTemp.value.arbiScore
  evalScoreTemp.value.markTypeFlag = false
  const params = {
    arbiScore: evalScoreTemp.value.arbiScore,
    id: rowData.value.id,
    markType: evalScoreTemp.value.markType
  }
  updateQuesMarkTypeAndTeacherApi(param.value.examId, params).then((res: any) => {
    if (res.success) {
      findMarkTaskList()
    }
  })
}
findMarkTaskList()
listByExamIdAndSubName()
findSubLeader()
</script>

<style lang="scss" scoped>
.btn-img {
  position: relative;

  .img-pos {
    position: absolute;
    top: 5px;
    left: 7px;
  }
}

.page-content {
  margin-top: 10px;
}

.op-btn:hover {
  opacity: 0.7;
}

.font-class {
  width: 95px;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei, sans-serif;
  color: #4381e5;
  line-height: 22px;
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
  width: 75px;
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
  width: 75px;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei, sans-serif;
  font-weight: bold;
  color: #808080;
  line-height: 22px;
  align-items: center;
  display: inline-block;
}

.limit-input {
  width: 100px;
  height: 32px !important;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #d5dae5;
}

.el-input--small .el-input__inner {
  height: 32px;
  line-height: 24px;
  padding: 0 7px;
}
</style>
