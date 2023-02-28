<template>
  <div class="margin-top14 line">
    <el-row class="mb-4">
      <el-button type="primary" plain class="button-style1" @click="goScoreManage">成绩总览</el-button>
      <el-button type="primary" plain class="button-style1" @click="goCheckScore">数据检查</el-button>
      <el-button type="primary" plain class="button-style1" @click="goStudentScore">考生成绩</el-button>
      <el-button type="primary" plain class="button-style">考生小题明细</el-button>
    </el-row>
  </div>
  <div class="height50 dis">
    <div class="title-style">{{subName}}小题明细</div>
    <div class="height50">
      <el-row class="mb-4" style="margin-top: 9px;">
        <el-button type="primary" class="release" @click="exportStudTemplate">导出</el-button>
      </el-row>
    </div>
  </div>
  <div v-if="haveSubData" class="height30 dis">
    <div v-if="subList.length > 1" class="middle">
      <el-radio-group v-model="radio1" @change="changeSub" class="ml-4">
        <el-radio
                v-for="sub in subList"
                :key=sub.id
                :label=sub.id>{{ sub.subName }}
        </el-radio>
      </el-radio-group>
    </div>
  </div>
  <div class="dis">
    <el-input v-model="input" placeholder="请输入班级、姓名、学号、考号" class="studScore-input"></el-input>
    <el-row class="mb-4" style="">
      <el-button type="primary" class="search-button" @click="getStudScore">搜索</el-button>
    </el-row>
  </div>
  <div class="margin-top14 batchTable">
    <el-table v-if="haveData" :data="tableList" border class="tableStyle" style="width: 100%;" empty-text="数据加载中">
      <el-table-column fixed align="center" label="序号">
        <template #default="scope">
          <span>{{scope.$index +1}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="studName" align="center" label="姓名">
        <template #default="scorp">
          <a v-if="scorp.row.score !== null && scorp.row.status === 1 && resultData.subStep !== 6 " @click="showStudDetail(scorp.row.studId)">{{scorp.row.studName}}</a>
          <div v-else>{{scorp.row.studName}}</div>
        </template>
      </el-table-column>
      <el-table-column fixed prop="examNo" align="center" label="考号"/>
      <el-table-column fixed prop="className" align="center" label="班级"/>
      <el-table-column fixed prop="teachClassName" align="center" label="教学班"/>
      <el-table-column fixed prop="objScore" align="center" label="客观题总分"/>
      <el-table-column fixed prop="subScore" align="center" label="主观题总分"/>
      <el-table-column fixed prop="score" align="center" label="总分">
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
            v-model:limit="data.queryParams.size"
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

</template>

<script setup lang="ts">

  import {getQuestionBySubjectName, studentDetailExport, getStudentDetail, getMergeSubBySub} from '@/api/scoreManage'
  import {ref} from "@vue/runtime-core";
  import {useUserStoreWithOut} from "@/store/modules/user";

  const route = useRoute()
  const router = useRouter()
  const examId = route.query.examId
  const subName = route.query.subName
  const subId = route.query.subId
  const schoolId = route.query.schoolId
  const {VITE_GLOB_API_URL} = process.env
  const input = ref('')
  const haveData = ref(false)
  const showChangeStudDetail = ref(false)
  const haveSubData = ref(false)
  const radio1 = ref(subId);
  const subList = ref<any>();
  let margeSub = subId;
  const data = reactive({
    queryParams: {
      page: 1,
      // examId: ref<any>(''),
      // subName: ref<any>(''),
      // schoolId: ref<any>('')
      examId: ref<any>(examId),
      subName: ref<any>(subName),
      subId: ref<any>(margeSub),
      schoolId: ref<any>(schoolId),
      param: ref<any>(),
      size: 10
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

  function getList() {
    if (haveData) {
      margeSub = radio1.value;
    }
    queryParams.value.subId = margeSub;
    getQuestionBySubjectName(queryParams.value).then((res: any) => {
      quesList.value = res.data;
      getStudScore();
    })
  }

  function getMergeSub() {
    getMergeSubBySub(queryParams.value).then((res: any) => {
      subList.value = res.subList;
      if (subList.value.length > 0) {
        haveSubData.value = true;
      }
    })
  }
  const examScoreDtoList = ref<any>([]);
  function getStudScore() {
    queryParams.value.param = input.value;
    queryParams.value.subId = margeSub;
    examScoreDtoList.value = []
    getStudentDetail(queryParams.value).then((res: any) => {
      resultData.value = res.data;
      total.value = resultData.value.count;
      examScoreDtoList.value = resultData.value.examScoreDtoList;
      studPaperResMap.value = resultData.value.studPaperResultMap;
      for (let item of examScoreDtoList.value) {
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
      tableList.value = examScoreDtoList.value;
    })
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
    studentDetailExport(queryParams.value).then((res: any) => {
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


  const {iframeSrc} = toRefs(data)

  function showStudDetail(studentId: string) {
    showChangeStudDetail.value = true;
    data.iframeSrc = data.rootUrl + "/newexam/scoreManage/showStudDetail?token=" + data.token
      + "&examId=" + data.routerParam.examId + "&subId=" + data.routerParam.subId + "&studentId=" + studentId
    window.onmessage = function (e) {
      if (e.data.source === 'changeStudDetailScore') {
        getList();
      }
    }
    // window.open(VITE_GLOB_URL+'/exam/showStudImg'+"?examId=" +examId + "&subId=" + subId + "&subName="+subName+ "&examNo="+examNo)
    // router.push({path: '/exam/showStudImg', query: routerParam.value})
  }

  function changeSub(){
    getList ();

  }

  onMounted(() => {
    getList ();
    getMergeSub();
    setTimeout(() => {
      haveData.value = true
    }, 2000)
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
  @import "../../../style/scanMonitor/scanMonitor.scss";
  @import "../../../style/scoreManage/scoreManage.scss";
</style>
