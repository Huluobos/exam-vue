<template>
  <div>
    <div slot="header">
      <div class="card-title">
        <span class="title">
          考生维护-{{ subName }}
        </span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <div style="display: flex; margin-bottom: 12px;">
          <el-input v-model="queryParams.search" style="width: 200px; margin-right: 10px;"
                    placeholder="姓名/学号/考号"/>
          <el-button style="width: 100px; height: 32px;" type="primary" @click="getList">搜索</el-button>
        </div>
        <div style="display: flex;">
          <span v-if="subjectStep < 6" class="operate-btn" style="margin-right: 15px;">
            <img class="img" src="../../../../assets/toggle-icon.png" alt="">
            <el-link
              :underline="false"
              class="text"
              type="primary"
              @click="teachClassDialogVisible = true"
            >更新教学班
            </el-link>
          </span>
          <span class="operate-btn">
            <img class="img" src="../../../../assets/add-something.png" alt="">
            <el-link :underline="false" class="text" @click="addStudentVisible = true">添加学生</el-link>
          </span>
        </div>
      </div>
      <div>
        <el-table
            v-loading="loading"
            :data="dataList"
            style="width: 100%;"
            :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
            :cell-style="{'text-align': 'center',}"
            border
            stripe
        >
          <el-table-column type="index" label="序号" width="80"/>
          <el-table-column prop="studName" label="姓名" width="100"/>
          <el-table-column prop="studNo" label="学号" width="180"/>
          <el-table-column prop="className" label="班级" width="150"/>
          <el-table-column prop="examNo" label="考号" width="180"/>
          <el-table-column prop="teachClassName" label="教学班" width="150"/>
          <el-table-column prop="stuNo" label="操作">
            <template #default="scope">
              <el-button v-if="subjectStep < 6" type="text" @click="changeTeachClass(scope.row)">修改教学班
              </el-button>
              <el-button v-if="subjectStep < 6" type="text" @click="changeExamData(scope.row)">调整数据</el-button>
              <el-button v-if="subjectStep < 6" type="text" @click="changeStudentSign(scope.row.examNo, 1)">设置缺考
              </el-button>
              <el-button v-if="subjectStep < 6" type="text" @click="changeStudentSign(scope.row.examNo, 2)">设置违纪
              </el-button>
              <el-button v-if="!scope.row.hasData" type="text" style="color: red;"
                         @click="delStudentInfo(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align: right; margin-top: 10px;">
        <Pagination
            v-show="total > 0"
            :total="total"
            v-model:page="data.queryParams.page"
            v-model:limit="data.queryParams.limit"
            @pagination="getList"/>
      </div>
      <el-dialog
          v-if="teachClassDialogVisible"
          v-model="teachClassDialogVisible"
          :title="'更新教学班-' + subName"
          width="650px"
      >
        <div style="display: flex; justify-content: space-between;">
          <div style="line-height: 32px;" class="flex-align-center">
            <span style="color: red;" class="flex-align-center">
              <img src="../../../../assets/hint-red.png" style="width: 20px; height: 20px;" alt="">
              提示
            </span>
            <span style="color: #202020;"> 请下载模板，并按照模板格式填写后，再导入数据。</span>
          </div>
          <div style="display: flex;">
            <el-button
                style="width: 95px; height: 32px; color: #202020; border: 1px solid #d5dae5; margin-right: 10px;"
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
                  style="width: 95px; height: 32px; color: white;" color="#4381E5"
              >导入数据
              </el-button>
            </el-upload>
          </div>
        </div>
        <div class="mt-10">
          <img src="../../../../assets/student-info-schematic.png" alt="">
        </div>
        <div class="mt-10">
          <div style="height: 48px; display: flex; align-items: flex-start;">
            <span style="color: orange; line-height: 24px;" class="flex-align-center">
              <img src="../../../../assets/explain-orange.png" style="width: 20px; height: 20px;" alt="">
              说明：
            </span>
            <span style="line-height: 24px;">
              1.姓名和学号不能为空;<br/>
              2.此处为当前科目的教学班名称更新。
            </span>
          </div>
        </div>
      </el-dialog>
      <el-dialog
          v-model="changeTeachClassVisible"
          :title="'修改教学班-'+subName"
          width="600px"
      >
        <span style="margin-right: 30px;">新教学班</span>
        <el-select v-model="modifyStudentInfoData.teachClassName" placeholder="请选择" size="large">
          <el-option
              v-for="item in teachClassNameList"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px;" type="primary"
                         @click="modifyTeachClass">确定</el-button>
            </span>
        </template>
      </el-dialog>
      <el-dialog
          v-model="changeExamDataVisible"
          :title="'调整数据-'+subName"
          width="600px"
      >
        <span style="margin-right: 30px;">考号</span>
        <el-autocomplete
            v-model="modifyStudentInfoData.examNo"
            :fetch-suggestions="basicStudentTipsByExamNo"
            clearable
            style="width: 200px; height: 32px;"
            placeholder="请输入"
            @select="updateDataHandleSelect"
        >
          <template #default="{ item }">
            <div class="value">{{ item.studentName }}({{ item.examNo }})</div>
          </template>
        </el-autocomplete>
        <div style="margin-top: 18px;">
          <img src="../../../../assets/hint-red.png" style="width: 20px; height: 20px; float: left;" alt="">
          <span style="color: red;">该操作会把当前学生数据调整到新考号上；请确保新考号考生无该科考试数据。</span>
        </div>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px;" type="primary"
                         @click="modifyStudentExamNo">确定</el-button>
            </span>
        </template>
      </el-dialog>
      <el-dialog
          v-model="setSignVisible"
          :title="signTitle + subName"
          width="600px"
      >
        <span style="color: red;">{{ signContent }}</span>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px;" type="primary"
                         @click="setSignVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px;" type="danger"
                         @click="setSign">确定</el-button>
            </span>
        </template>
      </el-dialog>
      <el-dialog
          v-model="delStudentVisible"
          title="是否删除学生信息"
          width="600px"
      >
        <span style="color: red;">确定删除学生信息？</span>
        <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px;" type="primary"
                         @click="delStudentVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px;" type="danger"
                         @click="delStudent">确定</el-button>
            </span>
        </template>
      </el-dialog>
      <Dialog
          :title="'添加学生-'+subName"
          @commitBtn="addStudentVisible = false"
          @dialogVisible="addStudentDialog"
          :visible="addStudentVisible"
          :width="'600px'">
        <template #content>
          <el-form
              :model="addStudentForm"
              label-width="85px"
              :label-position="'left'"
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
              <el-input v-model="addStudentForm.examNo" placeholder="请输入" style="width: 200px; height: 32px;"/>
            </el-form-item>
            <el-form-item label="学生姓名">
              <el-input v-model="addStudentForm.studentName" placeholder="请输入" style="width: 200px; height: 32px;"/>
            </el-form-item>
            <el-form-item label="班级">
              <el-select v-model="addStudentForm.className" placeholder="请选择" style="width: 200px; height: 32px;">
                <el-option
                    v-for="item in classNameList"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="教学班">
              <el-select v-model="addStudentForm.teachClass" placeholder="请选择" style="width: 200px; height: 32px;">
                <el-option
                    v-for="item in teachClassNameList"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <span class="dialog-footer">
              <el-button
                  style="width: 100px; height: 32px;"
                  type="primary"
                  @click="addExamBasicStudent"
                  :loading="saveLoading"
              >保存</el-button>
            </span>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  listBasicStudentBySubIdApi,
  postResExcelDownloadApi,
  getTeachClassNameListApi,
  modifyTeachClassApi,
  updateExamNoApi,
  setSignApi,
  delStudentApi,
  basicStudentTipsApi,
  getClassNameListApi,
  addExamBasicStudentApi,
  basicStudentTipsByExamNoApi,
} from '@/api/subject'
import { ElMessage } from 'element-plus'
import { useUserStoreWithOut } from '@/store/modules/user'
import { updateTeachFileUpload } from '@/api/file'

const route = useRoute()
const examId = route.query.examId
const subName = route.query.subName
const subId = route.query.subId
const total = ref<any>(0)
const dataList = ref([])
const teachClassDialogVisible = ref<boolean>(false)
const changeTeachClassVisible = ref<boolean>(false)
const changeExamDataVisible = ref<boolean>(false)
const setSignVisible = ref<boolean>(false)
const delStudentVisible = ref<boolean>(false)
const addStudentVisible = ref<boolean>(false)
const teachClassNameList = ref<any>([])
const classNameList = ref<any>([])
const signTitle = ref<string>('')
const signContent = ref<string>('')
const delStudentId = ref<string>('')
const inputStuNo = ref<string>('')
const token = useUserStoreWithOut().getToken
const uploadUrl = updateTeachFileUpload
const saveLoading = ref<boolean>(false)
const subjectStep = ref<any>()
const loading = ref<boolean>(false)

class ModifyStudentInfo {
  examId: any;
  subName: any;
  subId: any;
  examNo: any;
  teachClassName: any;
  studentId: any;
  sign: any;
}

class studentInfo {
  examId: any;
  subName: any;
  subId: any;
  examNo: any;
  teachClass: any;
  className: any;
  studentNo: any;
  studentName: any;
}

interface StudentItem {
  studentName: string
  studentNo: string
  className: string
  examNo: string
  teachClassName: any
}

const data = reactive({
  queryParams: {
    page: 1,
    limit: 20,
    offset: 0,
    examId: ref<any>(''),
    subName: ref<any>(''),
    subId: ref<any>(''),
    search: ref<any>(''),
  },
  exportTemplateData: {
    subjectId: ref<any>(''),
    examId: ref<any>(''),
    isExamSchool: 1
  },
  modifyStudentInfoData: new ModifyStudentInfo(),
  addStudentForm: new studentInfo(),
  updateDataForm: new studentInfo(),
  headers: {
    'Authorization': token
  },
  uploadData: {
    // 文件上传对象
    uploadData: {},
    subjectId: ref<any>(''),
    examId: ref<any>(''),
    isExamSchool: 1
  },
})

const studentItems = ref<StudentItem[]>([])

const {
  queryParams,
  exportTemplateData,
  modifyStudentInfoData,
  addStudentForm,
  updateDataForm,
  headers,
  uploadData
} = toRefs(data)

/**
 * 根据科目id查询学生信息
 * @param data
 */
function listBasicStudentBySubId(data: any) {
  loading.value = true
  dataList.value = []
  listBasicStudentBySubIdApi(data).then((res: any) => {
    total.value = res.total
    dataList.value = res.rows
    subjectStep.value = res.subjectStep
    loading.value = false
  })
}

function getList() {
  if (queryParams.value.page < 0) {
    queryParams.value.page = 1
  }
  queryParams.value.offset = queryParams.value.limit * (queryParams.value.page - 1)
  listBasicStudentBySubId(queryParams.value)
}

function exportTemplate() {
  exportTemplateData.value.subjectId = subId
  exportTemplateData.value.examId = examId
  postResExcelDownloadApi(exportTemplateData.value).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '更新教学班.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

const beforeUploadFunction = () => {
  uploadData.value.subjectId = subId
  uploadData.value.examId = examId
}

const uploadBtnClick = (response: any,) => {
  if (response.success) {
    teachClassDialogVisible.value = false
    listBasicStudentBySubId(queryParams.value)
    ElMessage.success("导入成功")
  } else {
    teachClassDialogVisible.value = false
    ElMessage.error("导入失败")
  }
}

function changeTeachClass(studentInfo: any) {
  modifyStudentInfoData.value = new ModifyStudentInfo()
  modifyStudentInfoData.value.examId = examId
  modifyStudentInfoData.value.subName = subName
  modifyStudentInfoData.value.subId = subId
  modifyStudentInfoData.value.teachClassName = studentInfo.teachClassName
  modifyStudentInfoData.value.examNo = studentInfo.examNo
  getTeachClassNameList()
  changeTeachClassVisible.value = true
}

function getTeachClassNameList() {
  getTeachClassNameListApi(queryParams.value).then((res: any) => {
    if (res.success) {
      teachClassNameList.value = res.data
    } else {
      ElMessage.error('查询失败')
    }
  })
}

function getClassNameList() {
  getClassNameListApi(queryParams.value).then((res: any) => {
    if (res.success) {
      classNameList.value = res.data
    } else {
      ElMessage.error('查询失败')
    }
  })
}

function modifyTeachClass() {
  modifyTeachClassApi(modifyStudentInfoData.value).then((res: any) => {
    if (res.success) {
      changeTeachClassVisible.value = false
      ElMessage.success(res.message)
      listBasicStudentBySubId(queryParams.value)
    } else {
      changeTeachClassVisible.value = false
      ElMessage.error(res.message)
    }
  })
}

function changeExamData(studentInfo: any) {
  modifyStudentInfoData.value = new ModifyStudentInfo()
  modifyStudentInfoData.value.studentId = studentInfo.id
  changeExamDataVisible.value = true
  updateDataForm.value.examId = examId
}

function modifyStudentExamNo() {
  if (!modifyStudentInfoData.value.examNo || modifyStudentInfoData.value.examNo.length <= 0) {
    ElMessage.error('考号不能为空')
    return false
  }
  updateExamNoApi(modifyStudentInfoData.value).then((res: any) => {
    if (res.success) {
      changeExamDataVisible.value = false
      listBasicStudentBySubId(queryParams.value)
      ElMessage.success(res.message)
    } else {
      changeExamDataVisible.value = false
      ElMessage.error(res.message)
    }
  })
}

function changeStudentSign(examNo: any, sign: any) {
  modifyStudentInfoData.value = new ModifyStudentInfo()
  modifyStudentInfoData.value.examNo = examNo
  modifyStudentInfoData.value.sign = sign
  modifyStudentInfoData.value.subId = subId
  sign === 1 ? signTitle.value = '设置缺考-' : signTitle.value = '设置违纪-'
  sign === 1 ? signContent.value = '该操作会删除学生该科成绩数据，确认设置缺考？' : signContent.value = '该操作会删除学生该科成绩数据，确认设置违纪？'
  setSignVisible.value = true
}

function setSign() {
  setSignApi(modifyStudentInfoData.value).then((res: any) => {
    if (res.success) {
      setSignVisible.value = false
      listBasicStudentBySubId(queryParams.value)
      ElMessage.success(res.message)
    } else {
      ElMessage.error(res.message)
    }
  })
}

function delStudentInfo(studentId: any) {
  delStudentVisible.value = true
  delStudentId.value = studentId
}

function delStudent() {
  delStudentApi(delStudentId.value).then((res: any) => {
    if (res.success) {
      delStudentVisible.value = false
      queryParams.value.page = 1
      listBasicStudentBySubId(queryParams.value)
      ElMessage.success(res.message)
    } else {
      ElMessage.error(res.message)
    }
  })
}

//显示隐藏回调 key是关闭或者打开的布尔值
const addStudentDialog = (key: boolean) => {
  addStudentVisible.value = key
  inputStuNo.value = ''
  addStudentForm.value = new studentInfo()
  addStudentForm.value.examId = examId
  getClassNameList()
  getTeachClassNameList()
}

const addExamBasicStudent = () => {
  saveLoading.value = true
  if (!addStudentForm.value.studentNo) {
    ElMessage.error('学号不能为空')
    saveLoading.value = false
    return
  }
  if (!addStudentForm.value.examNo) {
    ElMessage.error('考号不能为空')
    saveLoading.value = false
    return
  }
  if (!addStudentForm.value.studentName) {
    ElMessage.error('姓名不能为空')
    saveLoading.value = false
    return
  }
  if (!addStudentForm.value.className) {
    ElMessage.error('班级不能为空')
    saveLoading.value = false
    return
  }
  if (!addStudentForm.value.teachClass) {
    ElMessage.error('教学班不能为空')
    saveLoading.value = false
    return
  }
  addExamBasicStudentApi(addStudentForm.value, subId).then((res: any) => {
    if (res.success) {
      addStudentVisible.value = false
      saveLoading.value = false
      ElMessage.success(res.message)
    } else {
      saveLoading.value = false
      ElMessage.error(res.message)
    }
    getList()
  })
}

//确认按钮的事件
const successCallback = () => {

}

function basicStudentTips(input: any, cb: any) {
  if (input && input.length > 0) {
    addStudentForm.value.studentNo = input
    addStudentForm.value.subName = subName
    basicStudentTipsApi(addStudentForm.value).then((res: any) => {
      if (res.success) {
        studentItems.value = res.data
        cb(studentItems.value)
      }
    })
  }
}

function basicStudentTipsByExamNo(input: any, cb: any) {
  if (input && input.length > 0) {
    updateDataForm.value.examNo = input
    basicStudentTipsByExamNoApi(updateDataForm.value).then((res: any) => {
      if (res.success) {
        studentItems.value = res.data
        cb(studentItems.value)
      }
    })
  }
}

const handleSelect = (item: StudentItem) => {
  addStudentForm.value.studentNo = item.studentNo
  addStudentForm.value.studentName = item.studentName
  addStudentForm.value.className = item.className
  addStudentForm.value.examNo = item.examNo
  addStudentForm.value.teachClass = item.teachClassName
  if (teachClassNameList.value.indexOf(item.teachClassName) === -1) {
    addStudentForm.value.teachClass = ''
  }
  inputStuNo.value = item.studentNo
}

const updateDataHandleSelect = (item: StudentItem) => {
  modifyStudentInfoData.value.examNo = item.examNo
}

onMounted(() => {
  queryParams.value.subName = subName
  queryParams.value.examId = examId
  queryParams.value.subId = subId
  listBasicStudentBySubId(queryParams.value)
})

</script>

<style lang="scss" scoped>
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
    color: #4381e5;
    line-height: 22px;
    margin-left: 5px;
  }

  .img {
    width: 20px;
    height: 20px;
  }
}

.table-header {
  background: #d3e0f4;
  text-align: center;
}

.flex-align-center {
  display: flex;
  align-items: center;
}
</style>
