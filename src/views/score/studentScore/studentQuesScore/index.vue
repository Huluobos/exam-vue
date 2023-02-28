<template>
  <div>
    <div class="height30 dis" style="margin: 10px 0 10px 0;">
      <div class="middle" style="display: flex;">
        <div style="width: 60px; height: 20px; margin-right: 10px; line-height: 30px; font-size: 14px; color: #202020; font-family: MicrosoftYaHei, sans-serif;">
          科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目
        </div>
        <el-radio-group v-model="subId" @change="changeSub" class="ml-4">
          <el-radio
              v-for="(key,sub) in subList"
              :key=key
              :label=key> {{ sub }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-row class="mb-4">
      <el-col :span="12">
        <el-input v-model="input" placeholder="班级/姓名/学号/考号" class="studScore-input"></el-input>
        <el-button type="primary" class="search-button" @click="getStudScore">搜索</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" class="release" style="margin-left: 20px;" @click="exportStudTemplate">导出</el-button>
        <el-button type="primary" class="release" @click="exportStudTemplateInfo">导出小条</el-button>
      </el-col>
    </el-row>
    <div class="margin-top14 batchTable">
      <el-table v-if="haveData" :data="tableList" border class="tableStyle" style="width: 100%;" @sort-change="getStudScoreOrder" empty-text="数据加载中">
        <el-table-column :resizable="false" fixed align="center" label="序号">
          <template #default="scope">
            <span>{{scope.$index +1}}</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" fixed prop="studName" align="center" label="姓名">
          <template #default="scorp">
            <a v-if="scorp.row.score !== null && scorp.row.status === 1 && resultData.subStep !== 6 " @click="showStudDetail(scorp.row.studId)">{{scorp.row.studName}}</a>
            <div v-else>{{scorp.row.studName}}</div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" fixed prop="examNo" sortable="custom" align="center" label="考号"/>
        <el-table-column :resizable="false" fixed prop="className" sortable="custom" align="center" label="班级"/>
        <el-table-column :resizable="false" fixed prop="teachClassName" align="center" label="教学班"/>
        <el-table-column :resizable="false" fixed prop="objScore" align="center" label="客观题"/>
        <el-table-column :resizable="false" fixed prop="subScore" align="center" label="主观题"/>
        <el-table-column :resizable="false" fixed prop="score" align="center" sortable="custom" label="总分">
          <template #default="scorp">
            <div v-if="scorp.row.score === null && scorp.row.status === null">未上传</div>
            <div v-if="scorp.row.score === null && scorp.row.status === 3">缺考</div>
            <div v-if="scorp.row.score === null && scorp.row.status === 4">违纪</div>
            <div v-if="scorp.row.score !== null">{{scorp.row.score}}</div>
          </template>
        </el-table-column>
        <el-table-column v-for="(ques,ins) in quesList" :key="ins+'ss'" align="center" :label="ques.fullNo">
          <el-table-column v-if="ques.subjObje === 1" align="center" label="选项" :prop="ques.quesId"/>
          <el-table-column label="得分" align="center" :prop="ques.gQIId"/>
        </el-table-column>
      </el-table>
      <div class="mt-10">
        <Pagination
            v-show="total > 0"
            :total="total"
            v-model:page="data.queryParams.page"
            v-model:limit="data.queryParams.limit"
            @pagination="getStudScore"/>
      </div>

    </div>
    <el-dialog v-model="showChangeStudDetail" title="修改答题明细">
      <div id="iframe-container">
        <iframe id='linkedFrame'
                name="changeStudDetailScore"
                :src=iframeSrc
                width="100%"
                height="450px"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import {
  getQuestionBySubjectName,
  studentMoreDetailExport,
  getStudentDetail,
  getExamScoreTaskByIdApi, studentDetailInfo
} from '@/api/scoreManage'
import {ref} from "@vue/runtime-core";
import {useUserStoreWithOut} from "@/store/modules/user";

const route = useRoute()
const router = useRouter()
const examId = route.query.examId
const subName = ref('')
const subId = ref('')
const schoolId = ref('')
const {VITE_GLOB_API_URL} = process.env
const input = ref('')
const haveData = ref(false)
const showChangeStudDetail = ref(false)
const subList = ref<any>();
const data = reactive({
  queryParams: {
    page: 1,
    limit: 20,
    // examId: ref<any>(''),
    // subName: ref<any>(''),
    // schoolId: ref<any>('')
    examId: ref<any>(examId),
    subName: ref<any>(subName),
    subId: ref<any>(subId.value),
    schoolId: ref<any>(schoolId),
    param: ref<any>(),
    order: ref<any>(''),
    field: ref<any>(''),
    size: 10,
  }, routerParam: {
    examId: ref<any>(examId),
    subName: ref<any>(subName),
    gradeId: ref<any>(''),
    subId: ref<any>(subId),
    schoolId: ref<any>(schoolId),
  }, token: useUserStoreWithOut().getToken,
  iframeSrc: '',
  rootUrl: VITE_GLOB_API_URL,
})
const {queryParams, routerParam} = toRefs(data);

const tableList = ref<any>([]);
const studPaperResMap = ref<any>([]);
const resultData = ref({
  count: 0, examScoreDtoList: [], studPaperResultMap: [], subStep: 1,
  publicStatus: 0
});
const total = ref<any>(0);
const quesList = ref<any>();
const examInfo = ref<any>()
function getList() {
  queryParams.value.subId = subId.value;
  getQuestionBySubjectName(queryParams.value).then((res: any) => {
    if (res.success) {
      quesList.value = res.data;
    }
  })
}

async function getExamScoreTaskById() {
  await getExamScoreTaskByIdApi({examId: examId}).then((res:any) => {
    if (res.success) {
      examInfo.value = res.data
      subList.value = {}
      for (const obj in res.data.subject) {
        if (obj !== '总分') {
          subList.value[obj] = res.data.subject[obj]
        }
      }
      for (const subInfo in subList.value) {
        if (subInfo) {
          subName.value = subInfo
          subId.value = subList.value[subInfo]
          return
        }
      }
    }
  })
}

function getStudScore() {
  queryParams.value.param = input.value;
  queryParams.value.subId = subId.value;
  queryParams.value.size = queryParams.value.limit
  getStudentDetail(queryParams.value).then((res: any) => {
    resultData.value = res.data;
    total.value = resultData.value.count;
    tableList.value = resultData.value.examScoreDtoList;
    studPaperResMap.value = resultData.value.studPaperResultMap;

    for (let item of tableList.value) {
      if (item.examNo in studPaperResMap.value) {
        let resultList = studPaperResMap.value[item.examNo];
        for (let ques of resultList) {
          item[ques.genId] = ques.score;
          item[ques.quesId] = ques.answer;
        }
      } else {
        for (let ques of quesList.value) {
          item[ques.gQIId] = '-';
          item[ques.quesId] = '-';
        }
      }
      // for (let examNo in studPaperResMap.value) {
      //
      // }
    }
  })
}

const getStudScoreOrder = (param: any) => {
  if (param.prop) {
    queryParams.value.field = param.prop
  } else {
    queryParams.value.field = 'score'
  }
  if (param.order === 'descending') {
    queryParams.value.order = 'desc'
  } else if (param.order === 'ascending') {
    queryParams.value.order = 'asc'
  } else {
    queryParams.value.order = 'desc'
  }
  console.log(queryParams.value)
  getStudScore()
}

/* 成绩页面 */
function goScoreManage() {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subId
  router.push({
    name: 'processOverview', query: {
      examId: routerParam.value.examId,
      subId: routerParam.value.subId,
      subName: routerParam.value.subName,
      schoolId: routerParam.value.schoolId
    }
  })
}

/* 数据检查 */
function goCheckScore() {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subId
  router.push({
    name: 'processCheckScore', query: {
      examId: routerParam.value.examId,
      subId: routerParam.value.subId,
      subName: routerParam.value.subName,
      schoolId: routerParam.value.schoolId
    }
  })
}

/* 考生成绩 */
function goStudentScore() {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subId
  router.push({
    name: 'processStudentScore', query: {
      examId: routerParam.value.examId,
      subId: routerParam.value.subId,
      subName: routerParam.value.subName,
      schoolId: routerParam.value.schoolId
    }
  })
}

/* 考生小题明细 */
function goStudentDetail() {
  routerParam.value.examId = examId
  routerParam.value.subName = subName
  routerParam.value.subId = subId
  router.push({
    name: 'processStudentDetail', query: {
      examId: routerParam.value.examId,
      subId: routerParam.value.subId,
      subName: routerParam.value.subName,
      schoolId: routerParam.value.schoolId
    }
  })
}


function exportStudTemplate() {
  studentMoreDetailExport(queryParams.value).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '考生小题明细.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

function exportStudTemplateInfo() {
  studentDetailInfo(examId).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '学生得分明细小条.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}


const {iframeSrc} = toRefs(data)

function showStudDetail(studentId: string) {
  showChangeStudDetail.value = true;
  data.iframeSrc = data.rootUrl + "/newexam/scoreManage/showStudDetail?token=" + data.token
      + "&examId=" + data.routerParam.examId + "&subId=" + data.routerParam.subId + "&studentId=" + studentId
  window.onmessage = function (e) {
    if (e.data.source === 'changeStudDetailScore') {
      getList();
      getStudScore();
    }
  }
  // window.open(VITE_GLOB_URL+'/exam/showStudImg'+"?examId=" +examId + "&subId=" + subId + "&subName="+subName+ "&examNo="+examNo)
  // router.push({path: '/exam/showStudImg', query: routerParam.value})
}

function changeSub(){
  getList ();
  getStudScore();
}
async function start(){
  await getExamScoreTaskById()
  getList();
  getStudScore();
  setTimeout(() => {
    haveData.value = true
  }, 2000)
}
onMounted(() => {
  start()
})
</script>

<style scoped lang="scss">
:deep(.el-table) {
  thead.is-group tr:nth-child(2) .el-table__cell {
    left: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
@import "../../../../style/scanMonitor/scanMonitor";
@import "../../../../style/scoreManage/scoreManage";
</style>
