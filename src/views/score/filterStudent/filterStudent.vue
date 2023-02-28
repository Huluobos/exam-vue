<template>
  <div>
    <div slot="header">
      <!--<div slot="header" style="width: 600px; display: flex;">
        <div class="not-background-class">
          <span class="not-background-font-style">基础设置</span>
        </div>
        <div class="background-class">
          <span class="background-font-style">过滤学生</span>
        </div>
        <div class="not-background-class">
          <span class="not-background-font-style">赋分设置</span>
        </div>
        <div class="not-background-class" @click="toLevelSet()">
          <span class="not-background-font-style">等级设置</span>
        </div>
      </div>-->
      <div style="display: flex;justify-content: right">
        <span class="operate-btn" v-if="isShowButton">
          <!--<img class="img" src="../../../assets/toggle-icon.png" alt="">-->
          <el-button class="btn" @click="toUpdateExamNo">导入</el-button>
          <el-button class="btn" @click="addNewStudent()">添加</el-button>
          <!--<el-link :underline="false" class="text" @click="toUpdateExamNo">导入</el-link>-->
        </span>
       <!-- <span class="operate-btn">
          <img class="img" src="../../../assets/toggle-icon.png" alt="">
          <el-link :underline="false" class="text" @click="addNewStudent()">添加</el-link>
        </span>-->
      </div>

      <div>
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
          <el-table-column prop="studName" label="姓名"  fixed />
          <el-table-column prop="studNo" label="学号"  fixed />
          <el-table-column prop="examNo" label="考号"  fixed />
          <el-table-column prop="className" label="班级"  fixed  />
          <el-table-column prop="" label="操作" fixed="right" width="200px;">
            <template #default="scope">
              <el-button type="text" style="color: red" @click="deleteStu(scope.row)">删除</el-button>
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
      <!--添加过滤学生弹窗-->
      <Dialog
              :title="'添加过滤学生'"
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
                      v-model="addStudentForm.studentNo"
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
              <el-autocomplete
                      v-model="addStudentForm.examNo"
                      :fetch-suggestions="basicStudentTipsByExamNo"
                      clearable
                      style="width: 200px; height: 32px;"
                      placeholder="请输入考号"
                      @select="handleSelect"
              >
                <template #default="{ item }">
                  <div class="value">{{ item.studentName }}({{ item.studentNo }})</div>
                </template>
              </el-autocomplete>
            </el-form-item>

            <el-form-item label="学生姓名">
              <el-autocomplete
                      v-model="addStudentForm.studentName"
                      :fetch-suggestions="basicStudentTipsByStudentName"
                      clearable
                      style="width: 200px; height: 32px;"
                      placeholder="请输入姓名"
                      @select="handleSelect"
              >
                <template #default="{ item }">
                  <div class="value">{{ item.studentName }}({{ item.studentNo }})</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          <!--  <el-form-item label="学生学号::">
              <el-input v-model="addStudentForm.studentNo" placeholder="请输入" style="width: 200px;height: 32px"/>
            </el-form-item>-->
            <!--<el-form-item label="学生考号:">
              <el-input v-model="addStudentForm.examNo" placeholder="请输入" style="width: 200px;height: 32px"/>
            </el-form-item>-->
            <!--<el-form-item label="学生姓名:">
              <el-input v-model="addStudentForm.studentName" placeholder="请输入" style="width: 200px;height: 32px"/>
            </el-form-item>-->
          </el-form>
        </template>

        <template #footer>
          <span class="dialog-footer">
            <el-button style="width: 100px; height: 32px" type="primary"
                       @click="cacelAdd">取消</el-button>

              <el-button style="width: 100px; height: 32px" type="primary"
                         @click="addExamBasicStudent()">确定</el-button>
            </span>
        </template>
      </Dialog>

      <el-dialog
          v-if="studentExamNoDialogVisible"
          v-model="studentExamNoDialogVisible"
          title="导入过滤的学生信息"
          width="750px"
          height="500px;"
      >
        <div style="display:flex;justify-content:space-between">
          <div style="line-height: 32px;" class="flex-align-center">
            <span style="color: red;" class="flex-align-center">
              <!--<img src="../../../assets/hint-red.png" style="width: 20px;height: 20px" alt="">-->
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
        <!--<div class="mt-10">
          <img src="../../../assets/updateStudentNo.png" alt="">
        </div>-->
        <div class="mt-10">
          <div style="height: 48px;display: flex;align-items: flex-start;">
            <span style="color: orange;line-height: 24px;" class="flex-align-center">
              说明：
            </span>
            <span style="line-height: 24px;">
              导入将会删除旧数据!<br>
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
        <span style="color: red">确定删除该过滤学生？</span>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px" type="primary"
                         @click="deleteStuVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px" type="danger"
                         @click="toDelete">确定</el-button>
            </span>
        </template>
      </el-dialog>
    </div>
  </div>

</template>

<script setup lang="ts">
import {
   updateStuExamNo,} from '@/api/exam'
import { ElMessage } from 'element-plus'
import { ref, unref } from 'vue';
import { importFilterStudent } from '@/api/file'
import { useUserStoreWithOut } from '@/store/modules/user';
import router from '@/router';
import {studentTipsByStudNo, newBasicStudentTipsByExamNoApi, basicStudentTipsByStudentNameApi} from '@/api/subject'
import {findFilterStudent,addFilterStudent,deleteFilterStudent,downloadTemp} from '@/api/analysis'

interface StudentItem {
  studentName: string
  studentNo: string
  className: string
  examNo: string
  teachClassName: any
}
const route = useRoute()
const examId: any = route.query.examId
const total = ref<any>(0)
const dataList = ref([])

const inputStuNo = ref<string>('')

const updateClassVisible = ref<boolean>(false)

const addStudentVisible = ref<boolean>(false)

const deleteStuVisible = ref<boolean>(false)

const studentExamNoDialogVisible = ref<boolean>(false)

const token = useUserStoreWithOut().getToken

const {proxy} = getCurrentInstance();

const uploadUrl = importFilterStudent

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

const data = reactive({
  queryParams: {
    page: 1,
    limit: 20,
    offset: 0,
    examId: ref<any>('')
  },
  updateExamNo: ref<any>(''),
  updateExamNOFrom: {
    examStuId: ref<any>(''),
    newExamNO: ref<any>(''),
    updateExamNo: ref<any>('')
  },
  addStudentForm: new studentInfo(),

  exportTempFrom: {
    examId: ref<any>(''),
  },
  deleteFrom: {
    examId: ref<any>(''),
    examStudentNo: ref<any>(''),
    examGrade: ref<any>(''),
    filterId: ref<any>('')
  },
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
  queryParams, updateExamNOFrom, addStudentForm,headers, uploadData, deleteFrom, routerStudentParam,
 exportTempFrom
} = toRefs(data)


function addNewStudent() {
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




//显示隐藏回调 key是关闭或者打开的布尔值
const addStudentDialog = (key: boolean) => {
  addStudentVisible.value = key
  inputStuNo.value = ''
  addStudentForm.value.examId = ''
}

const beforeUploadFunction = () => {
  uploadData.value.examId = examId
}

  const uploadBtnClick = (response: any,) => {
    if (response.success) {
      studentExamNoDialogVisible.value = false
      listFilterStuMessage(queryParams.value)
      ElMessage.success(response.message)
    } else {
      studentExamNoDialogVisible.value = false
      ElMessage({message:response.message,type:'error',duration:3000})
      //location.reload()
    }
  }


function basicStudentTips(input: any, cb: any) {
  if (input && input.length > 0) {
    addStudentForm.value.studentNo = input
    let info = new studentInfo()
    info.studentNo = input
    info.examId = examId
    studentTipsByStudNo(info).then((res: any) => {
      if (res.success) {
        studentItems.value = res.data
        cb(studentItems.value)
      }
    })
  }
}


function basicStudentTipsByExamNo(input: any, cb: any) {
  if (input && input.length > 0) {
    addStudentForm.value.examNo = input
    newBasicStudentTipsByExamNoApi(addStudentForm.value).then((res: any) => {
      if (res.success) {
        studentItems.value = res.data
        cb(studentItems.value)
      }
    })
  }
}

function basicStudentTipsByStudentName(input: any, cb: any) {
  if (input && input.length > 0) {
    addStudentForm.value.studentName = input
    basicStudentTipsByStudentNameApi(addStudentForm.value).then((res: any) => {
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
  addStudentForm.value.examId = examId
  addFilterStudent(addStudentForm.value).then((res: any) => {
    if (res.success) {
      setTimeout(() => {
        addStudentForm.value = new studentInfo()
        addStudentVisible.value = false
      }, 10)
      ElMessage.success(res.message)
      listFilterStuMessage(queryParams.value)
    } else {
      ElMessage.error(res.message)
    }

  })
}

function toUpdateExamNo() {
  studentExamNoDialogVisible.value = true
}


function exportTemplate() {
  downloadTemp().then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '过滤考试分析学生信息模板.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
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
          listFilterStuMessage(queryParams.value)
        } else {
          ElMessage.error(res.message)
        }
      })
    } else {
      return false
    }

  })
}

function deleteStu(row: any) {
  deleteStuVisible.value = true
  deleteFrom.value.filterId = row.id
}

function toDelete() {
  deleteFilterStudent(deleteFrom.value).then((res: any) => {
    if (res.success) {
      deleteStuVisible.value = false
      listFilterStuMessage(queryParams.value)
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
function listFilterStuMessage(data: any) {
  findFilterStudent(data).then((res: any) => {
    total.value = res.total
    dataList.value = res.rows
  })
}


function getList() {
  if (queryParams.value.page < 0) {
    queryParams.value.page = 1
  }
  queryParams.value.offset = queryParams.value.limit * (queryParams.value.page - 1)
  listFilterStuMessage(queryParams.value)
}

onMounted(() => {

  queryParams.value.examId = examId
  listFilterStuMessage(queryParams.value)
})

function toLevelSet() {
  routerStudentParam.value.examId = examId
  router.push({path: '/score/levelSet', query: routerStudentParam.value})
  }
</script>
<style scoped lang="scss">
  :deep(.el-table) {
    thead.is-group tr:nth-child(2) .el-table__cell {
      left: 0 !important;
    }
  }
  :deep(.el-form-item__content){
    margin-left: 0 !important;
}
:deep(.el-dialog__body){
   .el-form-item--default:nth-last-child(1){
        margin-bottom: 0 !important;
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

  .table-header {
    background: #D3E0F4;
    text-align: center;
  }
  .btn {
    background-color: #4381E5;
    color: #FFFFFF;
    font-size: 12px;
    width: 100px;
  }
</style>
