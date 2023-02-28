<template>
  <div class="app-container">
    <el-form ref="addExamForm" :model="examForm" :rules="rules" label-width="90px" label-position="left">
      <div class="card-title mb-10">
        <span class="title">
          基础信息
        </span>
      </div>
      <el-row>
        <el-col :span="14">
          <el-form-item label="考试名称" prop="examName">
            <el-input style="width: 100%;" maxlength="50" v-model="examForm.examName" placeholder="请输入考试名称"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="考试时间" prop="examTime" required>
            <el-date-picker
                size="large"
                v-model="examForm.examTime"
                style="width: 100%; height: 32px;"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="clickTime"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="考试类型" prop="type">
            <el-select style="width: 100%;" v-model="examForm.type" placeholder="考试类型" clearable>
              <el-option
                  v-for="eType in examTypeList"
                  :key="eType.value"
                  :label="eType.label"
                  :value="eType.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="学段" prop="period">
            <el-select style="width: 100%;" v-model="examForm.period" placeholder="学段" @change="changePeriod()"
                       clearable>
              <el-option
                  v-for="pre in  examPeriodList"
                  :key="pre.value"
                  :label="pre.label"
                  :value="pre.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="年级" prop="grade">
            <el-select style="width: 100%;" v-model="examForm.grade" @change="changeGrade()" placeholder="年级"
                       clearable>
              <el-option
                  v-for="gra in examGradeList"
                  :key="gra.value"
                  :label="gra.label"
                  :value="gra.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="学期" prop="schoolTerm">
            <el-select style="width: 100%;" v-model="examForm.schoolTerm" placeholder="学期" clearable>
              <el-option
                  v-for="dict in examSemesterList"
                  :key="dict"
                  :label="dict"
                  :value="dict"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="tal">
        <el-col :span="24">
          <el-form-item label="考试范围">

          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="tal">
        <el-col class="bl-row" :offset="1" :span="23">
          <el-form-item class="textSmall" label="考试科目" prop="subNames">
            <el-row>
              <el-checkbox :indeterminate="isIndeterSubject" v-model="checkAllSubject"
                           @change="handleCheckAllSubjectChange">全选
              </el-checkbox>
            </el-row>
            <el-row>
              <el-checkbox-group v-model="examForm.subNames" @change="handleCheckedCitiesSubjectChange">
                <el-checkbox v-for="subject in subjects" :label="subject" :key="subject">{{ subject }}</el-checkbox>
                <el-button type="text" style="margin-left: 15px;" @click="addMoreSub">+添加自定义科目</el-button>
              </el-checkbox-group>
            </el-row>

            <div style="margin: 15px 0;"></div>

          </el-form-item>
          <el-form-item class="textSmall" label="参考班级" prop="classIds">
            <el-row>
              <el-checkbox :indeterminate="isIndeterClass" v-model="checkAllClass" @change="handleCheckAllClassChange">
                全选
              </el-checkbox>
            </el-row>
            <el-row>
              <el-checkbox-group v-model="examForm.classIds" @change="handleCheckedCitiesClassChange">
                <el-checkbox v-for="classes in classesList" :label="classes.id" :key="classes.id">
                  {{ classes.className }}
                </el-checkbox>
              </el-checkbox-group>
            </el-row>

          </el-form-item>
        </el-col>
      </el-row>


      <div class="card-title mt-20 mb-10">
        <span class="title">
          考试设置
        </span>
      </div>
      <el-row class="tal">
        <el-col :span="24">
          <el-form-item label="考试模式">
            <el-radio-group v-model="examForm.model">
              <el-radio label="1">先扫后阅</el-radio>
              <el-radio label="2" disabled>成绩导入</el-radio>
              <el-radio label="3">小题分导入</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="tal">
        <el-button style="width: 95px;height: 32px;background: #ECF4FF;color: #202020" :loading="loading"
                   @click="goBack()">取消
        </el-button>
        <el-button style="width: 100px;height: 32px;" :loading="loading" type="primary" @click="handleAdd()">创建</el-button>
      </el-row>
    </el-form>
  </div>

  <el-dialog
      v-model="addSubVisible"
      title="添加自定义科目"
      width="500px"
  >
    <span>科目名称:<el-input v-model.trim="addSub" style="width: 60%;" placeholder=""/></span>
    <template #footer>
            <span class="dialog-footer">
              <el-button style="width: 100px; height: 32px;" type="primary"
                         @click="addSubVisible = false">取消</el-button>
              <el-button style="width: 100px; height: 32px;" type="danger"
                         @click="toAddSub">确定</el-button>
            </span>
    </template>
  </el-dialog>

  <progress-notify
      v-model="dialogVisible"
      :notify-data="notifyData"
      :stroke-width="18"
      @visibleChange="dialogVisibleChange"
      @statusChange="statusChange"
  >

  </progress-notify>
</template>

<script setup lang='ts'>
import router from '@/router'
import { ElMessage } from 'element-plus'
import { saveOrUpdateExam, findSubBySchoId, findClassBySchoId } from '@/api/exam'
import ProgressNotify from 'components/ProgressNotify/index.vue';

const subjectOptions = ref(['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理']);
const classOptions = ref<any>([]);

const {proxy} = getCurrentInstance() as any

const addSubVisible = ref<boolean>(false)

const addSub = ref<any>()
const dialogVisible = ref<boolean>(false)
const notifyData = ref<any>({})

function dialogVisibleChange(f: any) {
  dialogVisible.value = f
}

function statusChange(f: any) {
  publishStatus.value = f
}

const data = reactive({
  rules: {
    examName: [{required: true, message: '请输入考试名称', trigger: 'blur'}],
    beginTime: [{required: true, message: '开始时间不能为空', trigger: 'change'}],
    endTime: [{required: true, message: '结束时间不能为空', trigger: 'change'}],
    type: [{required: true, message: '考试类型不能为空', trigger: 'change'}],
    period: [{required: true, message: '学段不能为空', trigger: 'change'}],
    grade: [{required: true, message: '年级不能为空', trigger: 'change'}],
    schoolTerm: [{required: true, message: '学期不能为空', trigger: 'change'}],
    subNames: [{required: true, message: '请选择考试科目', trigger: 'change'}],
    classIds: [{required: true, message: '请选择考试班级', trigger: 'change'}],
    // examTime: [{ required: true, message: "请选择考试时间", trigger: "blur" }],
    examTime: [{required: true, message: '请选择考试时间', trigger: 'change'},{required: true, message: '请选择考试时间', trigger: 'blur'}],
  },
  examForm: {
    examName: '',
    examStartTime: '',
    examEndTime: '',
    type: '',
    period: 2,
    grade: 1,
    schoolTerm: '',
    model: '1',
    subNames: ref<string[]>([]),
    classIds: ref([]),
    examTime: ref([]),
    addSubNames: ref<string[]>([]),
  },
  loading: false,
  synArray: [],
  topicArray: ['标准考试', '成绩导入', '小题分导入'],
  tags: [],
  examTypeList: [{value: 1, label: '月考'}, {value: 2, label: '模考'}, {value: 3, label: '期中'}, {
    value: 4,
    label: '期末'
  }],
  examPeriodList: [{value: 2, label: '高中'}, {value: 1, label: '初中'}, {value: 3, label: '小学'}],
  examGradeList: [{value: 1, label: '高一'}, {value: 2, label: '高二'}, {value: 3, label: '高三'}],
  examSemesterList: ['上学期', '下学期'],
  // 科目复选框

  subjects: subjectOptions,
  isIndeterSubject: ref<boolean>(false),
  checkAllSubject: ref<boolean>(false),

  // 班级复选框
  checkAllClass: ref<boolean>(false),
  classesList: classOptions,
  isIndeterClass: ref<boolean>(false),
  publishStatus: 0
});

let {
  rules, examForm, loading, examTypeList, examPeriodList,
  examGradeList, examSemesterList, checkAllSubject, subjects, isIndeterSubject,
  checkAllClass, classesList, isIndeterClass, publishStatus
} = toRefs(data);

function clickTime() {
  if (examForm.value.examTime) {
    data.examForm.examStartTime = formatDateValue(new Date(examForm.value.examTime[0]))
    data.examForm.examEndTime = formatDateValue(new Date(examForm.value.examTime[1]))
    if ((data.examForm.examStartTime).slice(6, 7) > '8') {
      data.examForm.schoolTerm = '上学期'
    } else {
      data.examForm.schoolTerm = '下学期'
    }
  } else {
    data.examForm.examStartTime = ''
    data.examForm.examEndTime = ''
  }
}

function handleCheckAllSubjectChange(val: boolean) {
  examForm.value.subNames = val ? subjectOptions.value : [];
  isIndeterSubject.value = false
}

function handleCheckedCitiesSubjectChange(value: any) {
  let checkedSubjectCount = value.length;
  checkAllSubject.value = checkedSubjectCount === subjects.value.length;
  isIndeterSubject.value = checkedSubjectCount > 0 && checkedSubjectCount < subjects.value.length;
}

function handleCheckAllClassChange(val: any) {
  examForm.value.classIds = val ? classesList.value.map((val: any) => {
    return val.id
  }) : [];
  isIndeterClass.value = false
}

function handleCheckedCitiesClassChange(value: any) {
  let checkedClassCount = value.length;
  checkAllClass.value = checkedClassCount === classesList.value.length;
  isIndeterClass.value = checkedClassCount > 0 && checkedClassCount < classesList.value.length;

  // let checkedClassCount = value.length;
  // checkAllClass.value = checkedClassCount === classesList.value.length;
  // isIndeterClass.value = checkedClassCount > 0 && checkedClassCount < classesList.value.length;
}

function handleAdd() {
  proxy.$refs.addExamForm.validate((valid: any) => {
    if (valid) {
      dialogVisible.value = true
      publishStatus.value = 0
      saveOrUpdateExam(examForm.value).then((res: any) => {
        if (res.success) {
          // ElMessage.success('添加成功 !')
          router.push('/exam')
        } else {
          ElMessage.error('添加失败 !')
        }
      })
    } else {
      return false
    }
  })
}

function goBack() {
  router.push('/exam')
}


function getSubjectList() {
  findSubBySchoId(examForm.value.grade).then((res: any) => {
    if (res.success) {
      subjectOptions.value = res.data
    } else {
      ElMessage.error('科目查询失败 !')
    }
  })
}

function getClassList() {
  findClassBySchoId(examForm.value.grade).then((res: any) => {
    if (res.success) {
      classOptions.value = []
      res.data.forEach((val: any) => {
        let temp = {
          id: val.id,
          className: val.className
        }
        classOptions.value.push(temp)
      })
    } else {
      ElMessage.error('班级查询失败 !')
    }
  })
}

function changePeriod() {
  if (examForm.value.period === 1) {
    examForm.value.grade = ref<any>('')
    examGradeList.value = [{value: 11, label: '初一'}, {value: 12, label: '初二'}, {value: 13, label: '初三'}];
  } else if (examForm.value.period === 2) {
    examForm.value.grade = ref<any>('')
    examGradeList.value = [{value: 1, label: '高一'}, {value: 2, label: '高二'}, {value: 3, label: '高三'}];
  } else {
    examForm.value.grade = ref<any>('')
    examGradeList.value = [{value: 21, label: '小学一年级'}, {value: 22, label: '小学二年级'}, {
      value: 23,
      label: '小学三年级'
    }
      , {value: 24, label: '小学四年级'}, {value: 25, label: '小学五年级'}, {value: 26, label: '小学六年级'}];
  }

}

function changeGrade() {
  getSubjectList()
  getClassList()
}

function addMoreSub() {
  addSub.value = ''
  addSubVisible.value = true
}

function toAddSub() {
  addSub.value = addSub.value.replace(/\s/g, '')
  if (!addSub.value) {
    ElMessage.warning('请输入自定义科目!')
    return
  }
  if (subjectOptions.value.lastIndexOf(addSub.value) != -1) {
    ElMessage.warning('添加科目不能重复!')
    return
  }
  examForm.value.addSubNames.push(addSub.value)
  addSubVisible.value = false
  subjectOptions.value.push(addSub.value)

}

onMounted(() => {
  getSubjectList()
  getClassList()
})


// 给后端发送日期格式
function formatDateValue(now: any) {
  const year = dateZero(now.getFullYear()); //取得4位数的年份
  const month = dateZero(now.getMonth() + 1); //取得日期中的月份，其中0表示1月，11表示12月
  const date = dateZero(now.getDate()); //返回日期月份中的天数（1到31）
  const hour = dateZero(now.getHours()); //返回日期中的小时数（0到23）
  const minute = dateZero(now.getMinutes()); //返回日期中的分钟数（0到59）
  const second = dateZero(now.getSeconds()); //返回日期中的秒数（0到59）
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}

// 日期前面加0
function dateZero(time: any) {
  if (time < 10) {
    time = '' + '0' + time;
  }
  return time;
}


watch(() => dialogVisible, (newVal) => {
  if (!newVal.value) {
    notifyData.value = {}
  }
})
proxy.$socket.off('notify').on('notify', (res: any) => {
  if (res && res.notifyId === 'createExam') {
    notifyData.value = res
  }
  if (res.percent === 100) {
    dialogVisible.value = false
    ElMessage.success('添加成功 !')
    router.push('/exam')
  }
});

</script>

<style scoped lang="scss">
.title {
  font-size: 16px;
  font-weight: bold;
  color: #202020;
  line-height: 22px;
  margin-right: 20px;
}

:deep(.el-form-item--default) {
  .el-form-item__label {
    font-size: 14px;
    color: #202020;
    font-weight: 500;
  }

  .textSmall {
    font-size: 12px;
  }
}

.bl-row {
  border-left: 2px solid #d5dae5;
}

:deep(.el-form-item__content) {
  display: block;
}

</style>
