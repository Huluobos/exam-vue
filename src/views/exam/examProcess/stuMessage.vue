<template>
  <div>
    <div slot="header">
      <div class="card-title">
        <span class="title">
          {{ examName }}
        </span>
      </div>

      <div slot="header" style="width:100%; display: flex; border-bottom:1px solid #D3E0F4">
        <div class="not-background-class" @click="toProcess()">
          <span class="not-background-font-style">考试进程</span>
        </div>
        <div class="background-class" @click="toStudent()">
          <span class="background-font-style">考生信息</span>
        </div>
      </div>
      <div style=" margin-top: 15px;margin-bottom: 15px;height: 25px;">
         <div style="width:200px;float:left">
          <el-input placeholder="姓名/学号/考号" v-model="queryParams.search" @change="searchStudent()"></el-input>
        </div>
        <div style="float:right">
         <div style="display: flex;justify-content: right">
                  <span class="operate-btn" v-if="isShowButton" style="margin-right: 15px;">
                    <img class="img" src="../../../assets/toggle-icon.png" alt="">
                    <el-link :underline="false" class="text" @click="toUpdateExamNo">更新考号</el-link>
                  </span>

            <span class="operate-btn">
              <img class="img" src="../../../assets/add-something.png" alt="">
              <el-link :underline="false" class="text" @click="addNewStudent()">添加学生</el-link>
            </span>
      </div>
      </div>
      </div>



      <div class="clearfix">
        <el-table
            :data="dataList"
            style="width: 100%"
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
          <el-table-column prop="studentName" label="姓名"  fixed />
          <el-table-column prop="studentNo" label="学号"  fixed />
          <el-table-column prop="className" label="班级"  fixed  />
          <el-table-column prop="examNo" label="考号"  fixed />

          <el-table-column v-for="subName in subNameList" :key="subName" :label="subName">
            <template #default="scope">
              {{ scope.row[subName] ? scope.row[subName] : '-'}}
            </template>
          </el-table-column>


          <el-table-column prop="" label="操作" fixed="right" width="200px;">
            <template #default="scope">
              <el-button v-if="isShowButton" type="text" @click="changeExamNO(scope.row.examStuId)">修改考号</el-button>
              <el-button v-if=" maxStep < 6 " type="text" @click="changeClass(scope.row)">修改班级</el-button>
              <el-button v-if=" scope.row.uploadSuccessCount <= 0 " type="text" style="color: red" @click="deleteStu(scope.row.studentNo)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="Pagination-box mt-10">
        <Pagination
            v-show="total > 0"
            :total="total"
            :align="align"
            v-model:page="queryParams.page"
            v-model:limit="queryParams.limit"
            @pagination="getList"/>
      </div>
      <!--修改考号弹窗-->
      <el-dialog
              v-model="updateExamNOVisible"
              title="修改考号"
              width="600px"
              :before-close="closeupdateExamNO"
      >
        <el-form :model="updateExamNOFrom" ref="upExamNoFromData" :rules="rules">
          <el-form-item prop="updateExamNo" label="新考号:">
            <el-input v-model="updateExamNOFrom.updateExamNo" style=" width: 60%" required="required"
                      placeholder="请输入新考号"/>
          </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px" type="primary"
                         @click="updateExamNOVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px" type="danger" :validate-event="false"
                         @click="updateExamNo">确定</el-button>
            </span>
        </template>
      </el-dialog>
      <!--添加学生弹窗-->
      <Dialog
              :title="'添加学生'"
              @commitBtn="addStudentVisible = false"
              @dialogVisible="addStudentDialog"
              :visible="addStudentVisible"
              :width="'600px'"
              :before-close="beforeClose"
      >
        <template #content>
          <el-form
              ref="ruleStudentFrom"
              :model="addStudentForm"
              :rules="rules"
              label-width="85px"
              :label-position="'left'"
              :before-close="closeAddStudent"
          >
            <el-form-item label="学生学号">
              <el-autocomplete
                  v-model="inputStuNo"
                  :fetch-suggestions="basicStudentTips"
                  clearable
                  style="width: 200px; height: 32px;"
                  placeholder="请输入学号"
                  @select="handleSelect"
              >
                <template #default="{ item }">
                  <div class="value">{{ item.studentName }}({{ item.studentNo }})</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="学生考号">
              <el-input v-model="addStudentForm.examNo" placeholder="请输入" style="width: 200px;height: 32px"/>
            </el-form-item>
            <el-form-item label="学生姓名">
              <el-input v-model="addStudentForm.studentName" placeholder="请输入" style="width: 200px;height: 32px"/>
            </el-form-item>
            <el-form-item label="班级">
              <el-select v-model="addStudentForm.className" placeholder="请选择" style="width: 200px;height: 32px">
                <el-option
                    v-for="item in classNameList"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
            </el-form-item>
            <el-row class="tal">
              <el-col :span="24">考试科目</el-col>
            </el-row>

            <el-checkbox :indeterminate="isIndeterSubject" v-model="checkAllSubject"
                         @change="handleCheckAllSubjectChange">全选
            </el-checkbox>
            <el-checkbox-group v-model="addStudentForm.subIds" @change="handleCheckedCitiesSubjectChange">
              <el-checkbox v-for="subject in subNameList" :label="subject" :key="subject">{{subject}}</el-checkbox>
            </el-checkbox-group>
          </el-form>
        </template>

        <template #footer>
          <span style="float: left;color: red">此处添加学生只适用于该学生所有科目班级名称都一致的情况，</span><br>
          <span
              style="float: left;color: red">如该生有部分科目走班，请至单科考生信息处修改该学生该科目的教学班。</span><br>
          <span class="dialog-footer">
            <el-button style="width: 100px; height: 32px" type="primary"
                       @click="cacelAdd">取消</el-button>

              <el-button style="width: 100px; height: 32px" type="primary"
                         @click="addExamBasicStudent()">确定</el-button>
            </span>
        </template>
      </Dialog>

      <el-dialog

          v-model="studentExamNoDialogVisible"
          title="更新学生考号"
          width="750px"
          height="500px;"
      >
        <div style="display:flex;justify-content:space-between">
          <div style="line-height: 32px;" class="flex-align-center">
            <span style="color: red;" class="flex-align-center">
              <img src="../../../assets/hint-red.png" style="width: 20px;height: 20px" alt="">
              提示
            </span>
            <span style="color: #202020;"> 请下载模板，并按照模板格式填写后，再导入数据。</span>
          </div>
          <div style="display: flex">
            <el-button
                style="width: 95px;height: 32px;color: #202020;border: 1px solid #D5DAE5;margin-right: 10px"
                color="#ECF4FF"
                @click="exportTemplate">
              下载模板
            </el-button>
            <el-upload
                name="uploadFile"
                :action="uploadUrl"
                :limit="1"
                :headers="headers"
                :data="uploadData"
                :before-upload="beforeUploadFunction"
                :on-success="uploadBtnClick"
                accept=".xlsx,.xls"
                :show-file-list="false"
            >
              <el-button
              type="primary"
                  style="width: 95px;height: 32px;color: white" color="#4381E5"
              >导入数据
              </el-button>
            </el-upload>
          </div>
        </div>
        <div class="mt-10">
          <img src="../../../assets/updateStudentNo.png" alt="">
        </div>
        <div class="mt-10">
          <div style="height: 48px;display: flex;align-items: flex-start;">
            <span style="color: orange;line-height: 24px;" class="flex-align-center">
              <img src="../../../assets/explain-orange.png" style="width: 20px;height: 20px" alt="">
              说明：
            </span>
            <span style="line-height: 16px;">
              1.学号和考号不能为空;<br/>
              2.学号不可以重复;<br/>
              3.考号不可以重复;<br/>
              4.此处为所有科目的考号更新。
            </span>
            <br>
            <span>&nbsp;</span>
          </div>
        </div>
      </el-dialog>


      <el-dialog
          v-model="deleteStuVisible"
          title="删除确认"
          width="600px"
      >
        <span style="color: red">确定删除学生信息？</span>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px" type="primary"
                         @click="deleteStuVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px" type="danger"
                         @click="toDelete">确定</el-button>
            </span>
        </template>
      </el-dialog>

      <el-dialog
              v-model="updateClassVisible"
              title="修改班级"
              width="600px"
              @close="CloseIn"
              :before-close="closeupdateClass"
      >
        <span>新班级：
          <el-select v-model="updateClassFrom.className" placeholder="请选择" style="width: 200px;height: 32px">
                <el-option
                    v-for="item in classNameList"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
        </span><br>
        <el-row class="tal">
          <el-col class="bl-row" :offset="1" :span="25">
            <el-form-item style="margin-left: 10px;"  class="textSmall" label="同步科目教学班:">
              <el-row>
                <el-checkbox :indeterminate="isIndeterSubject" v-model="checkAllSubject"
                             @change="handleCheckAllSubjectChange">全选
                </el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox-group v-model="updateClassFrom.subName" @change="handleCheckedCitiesSubjectChange">
                  <el-checkbox v-for="subject in subNameList" :label="subject" :key="subject">{{ subject }}</el-checkbox>
                </el-checkbox-group>
              </el-row>
              <div style="margin: 15px 0;"></div>
            </el-form-item>
          </el-col>
        </el-row>
        <template #footer>
          <span style="float: left;color: red">注：此处修改班级只适用于修改行政班及不走班的科目班级,如该生有走班科目需</span><br>
          <span
              style="float: left;color: red">要修改班级名称，请至单科考生信息处修改该学生该科目的教学班。</span><br>
          <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px" type="primary"
                         @click="updateClassVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px" type="danger"
                         @click="toUpdateClass">确定</el-button>
            </span>
        </template>
      </el-dialog>

    </div>
  </div>

</template>

<script setup lang="ts">
import {
  findExamStudent, updateStuExamNo, addExamStudentApi, findSubBySchoId,
  findClassBySchoId, downloadTemp, deleteStuInfo, updateStudentClass
} from '@/api/exam'
import { ElMessage } from 'element-plus'
import { ref, unref } from 'vue';
import { updateStusentExamNoUpload } from '@/api/file'
import { useUserStoreWithOut } from '@/store/modules/user';
import router from '@/router';
import {basicStudentTipsApi, getMarkSchedulesApi} from '@/api/subject'

interface StudentItem {
  studentName: string
  studentNo: string
  className: string
  examNo: string
  teachClassName: any
}

const classNameList = ref([])
const subjectOptions = ref([])
const route = useRoute()
const examId = route.query.examId
const total = ref<any>(0)
const dataList = ref([])
const subNameList = ref<any[]>([])

const examName = ref<any>('');
const gradeType = ref<any>('');

const inputStuNo = ref<string>('')

const updateExamNOVisible = ref<boolean>(false)

const updateClassVisible = ref<boolean>(false)

const addStudentVisible = ref<boolean>(false)

const deleteStuVisible = ref<boolean>(false)

const studentExamNoDialogVisible = ref<boolean>(false)

const token = useUserStoreWithOut().getToken

const {proxy} = getCurrentInstance();

const uploadUrl = updateStusentExamNoUpload

const maxStep = ref<any>();

const studentItems = ref<StudentItem[]>([])

const isShowButton = ref<any>(true);

const rules = ref({
  updateExamNo: [{required: true, message: '请输入新考号!', trigger: 'blur'}]
});


class studentInfo {
  examId: any
  subName: any
  examNo: any
  className: any
  studentNo: any
  studentName: any
  subIds: any
}

class upClassInfo{
  examId: any
  subName: any
  examNo: any
  className:any
  examStuId:any
}
class markSchedule {
  examId: any
  subNames: any
  specType: any
}
const data = reactive({
  queryParams: {
    page: 1,
    limit: 20,
    offset: 0,
    examId: ref<any>(''),
    search: ''
  },
  updateExamNo: ref<any>(''),
  updateExamNOFrom: {
    examStuId: ref<any>(''),
    newExamNO: ref<any>(''),
    updateExamNo: ref<any>('')
  },
  addStudentForm: new studentInfo(),
  // updateClassFrom: {
  //   examId: ref<any>(''),
  //   subNames: ref<string[]>([]),
  //   examNo: ref<any>(''),
  //   className: ref<any>(''),
  //   examStuId: ref<any>(''),
  // },

  updateClassFrom:new upClassInfo(),
  exportTempFrom: {
    examId: ref<any>(''),
  },
  deleteFrom: {
    examId: ref<any>(''),
    examStudentNo: ref<any>(''),
    examGrade: ref<any>('')
  },
  // 科目复选框
  subjects: subjectOptions,
  isIndeterSubject: ref<boolean>(false),
  checkAllSubject: ref<boolean>(false),
  headers: {
    'Authorization': token
  },
  uploadData: {
    // 文件上传对象
    uploadData: {},
    examId: ref<any>('')
  },
  routerStudentParam: {
    examId: ref<any>('')
  },
})

const {
  queryParams, updateExamNOFrom, addStudentForm, isIndeterSubject,
  checkAllSubject, subjects, headers, uploadData, deleteFrom, routerStudentParam,
  updateClassFrom, exportTempFrom
} = toRefs(data)


function addNewStudent(formEl: any) {
  addStudentVisible.value = true
  addStudentForm.value = new studentInfo()
  addStudentForm.value.examId = examId
}

  function beforeClose(done:any){
    addStudentForm.value = new studentInfo()
    setTimeout(()=>{
      done()
    },10)

  }

  function cacelAdd() {
    addStudentVisible.value = false
    addStudentForm.value = new studentInfo()
    location.reload()
  }

  function closeAddStudent(done:any) {
    addStudentForm.value = new studentInfo()
    addStudentVisible.value = false
    location.reload()
  }

  function closeupdateExamNO(done:any) {
    updateExamNOFrom.value.updateExamNo = ''
    setTimeout(()=>{
      done()
    })
  }

  function closeupdateClass(done:any) {
    updateClassFrom.value = new upClassInfo();
    setTimeout(()=>{
      done()
    })
  }



//显示隐藏回调 key是关闭或者打开的布尔值
const addStudentDialog = (key: boolean) => {
  addStudentVisible.value = key
  inputStuNo.value = ''
  addStudentForm.value.examId = examId
  isIndeterSubject.value = false;
  checkAllSubject.value = false;
  // getSubjectList()
  // getClassList()
}

const beforeUploadFunction = () => {
  uploadData.value.examId = examId
}

  const uploadBtnClick = (response: any,) => {
    if (response.success) {
      studentExamNoDialogVisible.value = false
      listStuMessage(queryParams.value)
      ElMessage.success(response.message)
    } else {
      studentExamNoDialogVisible.value = false
      ElMessage.error(response.message)
      location.reload()
    }
  }

  function changeClass(row :any) {
    checkAllSubject.value = false;
    isIndeterSubject.value = false
    updateClassVisible.value= true
    updateClassFrom.value = new upClassInfo()
    updateClassFrom.value.examId = examId
    updateClassFrom.value.examNo = row.examNo
    updateClassFrom.value.examStuId = row.examStuId
  }
  function toUpdateClass() {
    if (!updateClassFrom.value.className){
      ElMessage.warning('请选择班级!');
      return
    }
    // if (!updateClassFrom.value.subNames[0]){
    //   ElMessage.warning('请勾选教学班!');
    //   return
    // }
    updateStudentClass(updateClassFrom.value).then((res: any) => {
      if (res.success) {
        setTimeout(() => {
          updateClassFrom.value = new upClassInfo()
          updateClassVisible.value= false
        }, 100)
        ElMessage.success('班级修改成功 !')
        updateClassVisible.value= false
        listStuMessage(queryParams.value)
      } else {
        ElMessage.error('班级查询失败 !')
      }
    })
  }

  function getClassList() {
    findClassBySchoId(gradeType.value).then((res: any) => {
      if (res.success) {
        classNameList.value = res.data
      } else {
        ElMessage.error('班级查询失败 !')
      }
    })
  }

  function getSubjectList() {
    findSubBySchoId(gradeType.value).then((res: any) => {
      if (res.success) {
        subjectOptions.value = res.data
      } else {
        ElMessage.error('科目查询失败 !')
      }
    })
  }

function basicStudentTips(input: any, cb: any) {
  if (input && input.length > 0) {
    addStudentForm.value.studentNo = input
    let info = new studentInfo()
    info.studentNo = input
    info.examId = examId
    basicStudentTipsApi(info).then((res: any) => {
      if (res.success) {
        studentItems.value = res.data
        cb(studentItems.value)
      }
    })
  }
}

const handleSelect = (item: StudentItem) => {
  addStudentForm.value = new studentInfo()
  addStudentForm.value.studentNo = item.studentNo
  addStudentForm.value.studentName = item.studentName
  addStudentForm.value.className = item.className
  addStudentForm.value.examNo = item.examNo
  addStudentForm.value.examId = examId
  inputStuNo.value = item.studentNo
}

const addExamBasicStudent = (formEl: any) => {
  if (!addStudentForm.value.studentNo){
    ElMessage.warning('请输入学生学号!')
    return
  }
  if (!addStudentForm.value.examNo){
    ElMessage.warning('请输入学生考号!')
    return
  }
  if (!addStudentForm.value.studentName){
    ElMessage.warning('请输入学生姓名!')
    return
  }
  if (!addStudentForm.value.className){
    ElMessage.warning('请选择班级!')
    return
  }
  if (addStudentForm.value.subIds.length === 0){
    ElMessage.warning('请勾选科目!')
    return
  }
  addExamStudentApi(addStudentForm.value).then((res: any) => {
    if (res.success) {
      setTimeout(() => {
        addStudentForm.value = new studentInfo()
        addStudentVisible.value = false
      }, 10)
      ElMessage.success(res.message)
      listStuMessage(queryParams.value)
    } else {
      ElMessage.error(res.message)
    }

  })
}

function toUpdateExamNo() {
  studentExamNoDialogVisible.value = true
}


function handleCheckAllSubjectChange(val: boolean) {
  addStudentForm.value.subIds = val ? subjectOptions.value : [];
  console.log(subjectOptions.value)
  updateClassFrom.value.subName = val ? subjectOptions.value : [];
  console.log(updateClassFrom.value.subName)
  isIndeterSubject.value = false;
}

function handleCheckedCitiesSubjectChange(value: any) {
  let checkedSubjectCount = value.length;
  checkAllSubject.value = checkedSubjectCount === subjects.value.length;
  isIndeterSubject.value = checkedSubjectCount > 0 && checkedSubjectCount < subjects.value.length;
}

function exportTemplate() {
  exportTempFrom.value.examId = examId
  downloadTemp(examId).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '更新学生考号模板.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}


/**
 * 修改学号
 * @param examStuId
 */
function changeExamNO(examStuId: any) {
  updateExamNOFrom.value.updateExamNo = ''
  updateExamNOVisible.value = true
  updateExamNOFrom.value.examStuId = examStuId;
}

function updateExamNo() {
  proxy.$refs.upExamNoFromData.validate((valid: any) => {
    if (valid) {
      const params = {
        examStuId: updateExamNOFrom.value.examStuId,
        newExamNO: updateExamNOFrom.value.updateExamNo
      }
      updateStuExamNo(params).then((res: any) => {
        if (res.success) {
          ElMessage.success(res.message)
          updateExamNOVisible.value = false
          listStuMessage(queryParams.value)
        } else {
          ElMessage.error(res.message)
        }
      })
    } else {
      return false
    }

  })
}

function deleteStu(examStuNo: any) {
  deleteStuVisible.value = true
  deleteFrom.value.examStudentNo = examStuNo
}

function toDelete() {
  deleteFrom.value.examId = examId
  deleteFrom.value.examGrade = gradeType
  deleteStuInfo(deleteFrom.value).then((res: any) => {
    if (res.success) {
      deleteStuVisible.value = false
      listStuMessage(queryParams.value)
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(res.message)
    }
  })
}

/**
 * 查询列表
 * @param data
 */
function listStuMessage(data: any) {
  findExamStudent(data).then((res: any) => {
    total.value = res.data.total
    dataList.value = res.data.rows
    subNameList.value = res.data.subNameList
    examName.value = res.data.examName
    gradeType.value = res.data.gradeType
    maxStep.value = res.data.maxStep
    classNameList.value = res.data.classNameList
    subjectOptions.value = res.data.subNameList
    getMarkSchedules()
  })
}

function getMarkSchedules() {
  const allSubNames  = []
  let markScheduleData = new markSchedule()
  markScheduleData.specType = 0
  markScheduleData.examId = examId
  for (let i = 0; i < subNameList.value.length; i++) {
    allSubNames.push(subNameList.value[i])
  }
  markScheduleData.subNames = allSubNames
  getMarkSchedulesApi(markScheduleData).then((res: any) => {
    if (res.success) {
      for (let i = 0; i < subNameList.value.length; i++) {
        let sub = subNameList.value[i]
        if (res[sub]) {
          let totalNumVos = res[sub].totalNumVos
          if (totalNumVos.length > 0) {
            let subTotalGiven = 0 //55
            let totalLeaveNum = 0//0
            for (let i = 0; i < totalNumVos.length; i++) {
              subTotalGiven += totalNumVos[i].paperTotalNum
              totalLeaveNum += totalNumVos[i].lostNum
            }
            const subTotalDone = subTotalGiven - totalLeaveNum
            const totalNum = subTotalDone + totalLeaveNum

            if (subTotalDone * 100 / totalNum > 0){
              isShowButton.value = false
              console.log(isShowButton.value)
            }
          }
        }else{
          isShowButton.value = true
        }
      }
    }
  })
}

function getList() {
  if (queryParams.value.page < 0) {
    queryParams.value.page = 1
  }
  queryParams.value.offset = queryParams.value.limit * (queryParams.value.page - 1)
  listStuMessage(queryParams.value)
}

function searchStudent() {
  listStuMessage(queryParams.value)
}

onMounted(() => {
  queryParams.value.examId = examId
  listStuMessage(queryParams.value)
})

function toProcess() {
  routerStudentParam.value.examId = examId
  router.push({path: '/exam/examProcess', query: routerStudentParam.value})
  }

  function CloseIn(){
    updateClassFrom.value = new upClassInfo()
    updateClassVisible.value= false
    console.log("关闭");
  }
</script>
<style scoped lang="scss">
  :deep(.el-table) {
    thead.is-group tr:nth-child(2) .el-table__cell {
      left: 0 !important;
    }
  }
</style>
<style scoped lang="scss">
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

.operate-btn {
  line-height: 22px;
  display: flex;
  justify-content: right;
  align-items: center;
  margin-bottom: 12px;
  text-align: right;

  .text {
    font-size: 14px;
    color: #4381E5;
    line-height: 22px;
    margin-left: 5px;
  }

  .img {
    width: 20px;
    height: 20px;
  }
}

.table-header {
  background: #D3E0F4;
  text-align: center;
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

.el-checkbox-group {
  font-size: 0;
  margin-left: 30px;
  margin-top: 10px;
}

.el-form-item--default .el-form-item__label {
  line-height: 32px;
  margin-top: 10px;
}

.flex-align-center {
  display: flex;
  align-items: center;
}
</style>
