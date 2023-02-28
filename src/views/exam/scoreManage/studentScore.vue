<template>
  <div class="margin-top14 line">
    <el-row class="mb-4">
      <el-button type="primary" plain class="button-style1" @click="goScoreManage">成绩总览</el-button>
      <el-button type="primary" plain class="button-style1" @click="goCheckScore">数据检查</el-button>
      <el-button type="primary" plain class="button-style">考生成绩</el-button>
      <el-button type="primary" plain class="button-style1" @click="goStudentDetail">考生小题明细</el-button>
    </el-row>
  </div>
  <div class="height50 dis">
    <div class="title-style">{{subName}}综合成绩</div>
    <div class="height50">
      <el-row class="mb-4" style="margin-top: 9px;">
        <el-button type="primary" class="release" @click="exportStudTemplate">导出</el-button>
      </el-row>
    </div>
  </div>
  <div v-if="haveData" class="height30 dis">
    <div v-if="subList.length > 1" class="middle">
      <el-radio-group v-model="radio1" @change="getList" class="ml-4">
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
      <el-button type="primary" class="search-button" @click="getList">搜索</el-button>
    </el-row>
  </div>
  <div class="margin-top14 batchTable">
    <el-table :data="tableList" border class="tableStyle">
      <el-table-column type="index" align="center" width="100" label="序号"/>
      <el-table-column prop="studName" align="center" label="姓名">
        <template #default="scorp">
<!--          <a v-if="scorp.row.score !== null" @click="changeStudScore(scorp.row)">{{scorp.row.studName}}</a>-->
<!--          <div v-else>{{scorp.row.studName}}</div>-->
          <div>{{scorp.row.studName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="examNo" align="center" label="考号"/>
      <el-table-column prop="className" align="center" width="200" label="班级"/>
      <el-table-column prop="teachClassName" align="center" label="教学班"/>
      <el-table-column prop="score" align="center" label="卷面分">
        <template #default="scorp">
          <div v-if="scorp.row.score === null && scorp.row.status === null">未上传</div>
          <div v-if="scorp.row.score === null && scorp.row.status === 3">缺考</div>
          <div v-if="scorp.row.score === null && scorp.row.status === 4">违纪</div>
          <div v-if="scorp.row.score !== null">{{scorp.row.score}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="schoRanking" align="center" label="校内排名"/>
      <el-table-column prop="teachClassRanking" align="center" label="教学班排名"/>
      <el-table-column align="center" label="操作">
        <template #default="scorp">
          <a v-if="scorp.row.score === null && scorp.row.status !== 3 && scorp.row.status !== 4 && resultData.subStep !== 6" @click="changeStudScore(scorp.row)">添加成绩</a>
          <a v-if="scorp.row.score === null && scorp.row.status !== 3 && scorp.row.status !== 4 && resultData.subStep === 6"
             style="color: #888888;pointer-events:none;cursor:default" >添加成绩</a>
          <a v-if="scorp.row.status === 3 || scorp.row.status === 4" @click="showStudImgs(scorp.row.examNo)">查看答题卡</a>
          <a v-if="scorp.row.score !== null && scorp.row.status ===null" @click="showStudImgs(scorp.row.examNo)"></a>
          <a v-else-if="scorp.row.score !== null" @click="showStudImgs(scorp.row.examNo)">查看答题卡</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-10">
      <Pagination
            v-show="total > 0"
            :total="total"
            v-model:page="data.queryParams.page"
            v-model:limit="data.queryParams.limit"
            @pagination="getList"/>
    </div>

  </div>

  <el-dialog v-model="showStudImgB" title="查看学生答题卡原图">
    <div id="iframe-container">
      <iframe id='linkedFrame'
              name="showStudImg"
              :src=iframeSrc
              width="100%"
              height="700px"></iframe>
    </div>
  </el-dialog>
  <el-dialog v-model="changeScore" title="修改学生成绩" :width="'600px'">
    <el-row>
      <div class="div-title">考号</div>
      <div>
        <el-input v-model="changeScoreParam.changeExamNo" disabled class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="margin-top14">
      <div class="div-title">班级</div>
      <div>
        <el-input v-model="changeScoreParam.changeClassName" disabled class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="margin-top14">
      <div class="div-title">姓名</div>
      <div>
        <el-input v-model="changeScoreParam.changeStudName" disabled class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="margin-top14">
      <div class="div-title">分数</div>
      <div>
        <el-input v-model="changeScoreParam.changeStudentScore" class="studScore-input"></el-input>
      </div>
    </el-row>
    <el-row class="mb-4 margin-top14" style="padding-left:450px">
      <el-button type="primary" class="search-button" @click="saveChangeScore">保存</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">

  import {addStudScore, findNewExamScore, getMergeSubBySub, studentScoreExport} from '@/api/scoreManage'
  import {ref} from "@vue/runtime-core";
  import {useUserStoreWithOut} from "@/store/modules/user";

  const route = useRoute()
  const router = useRouter()
  const examId = route.query.examId
  const subName = route.query.subName
  const subId = route.query.subId
  const schoolId = route.query.schoolId
  const input = ref('')
  const haveData = ref(false)
  const radio1 = ref(subId);
  const subList = ref<any>();
  let margeSub = subId;
  const {VITE_GLOB_API_URL} = process.env
  const data = reactive({
    queryParams: {
      page: 1,
      limit: 10,
      // examId: ref<any>(''),
      // subName: ref<any>(''),
      // schoolId: ref<any>('')
      examId: ref<any>(examId),
      subName: ref<any>(subName),
      subId: ref<any>(margeSub),
      schoolId: ref<any>(schoolId),
      param: ref<any>(),
    }, routerParam: {
      examId: ref<any>(examId),
      subName: ref<any>(subName),
      subId: ref<any>(subId),
      schoolId: ref<any>(schoolId),
      examNo: ref<any>("")
    },
    token: useUserStoreWithOut().getToken,
    iframeSrc: '',
    rootUrl: VITE_GLOB_API_URL,
    queryStudImgParam: route.query,
    changeScoreParam: {
      changeExamNo : ref(''),
      changeClassName :ref(''),
      changeStudName : ref(''),
      changeStudentScore : ref(''),
      changeStudId : ref(''),
      examId: ref<any>(examId),
      subName: ref<any>(subName),
      subId: ref<any>(margeSub),
      schoolId: ref<any>(schoolId),
    }
  })
  const {queryParams,changeScoreParam} = toRefs(data);
  const tableList = ref<any>([]);
  const resultData = ref({count: 0, examScoreDtoList: [], subStep:1, publicStatus:0});
  const total = ref<any>(0);
  const showStudImgB = ref<boolean>(false);
  const changeScore = ref<boolean>(false);
  const {routerParam} = toRefs(data);
  function getList() {
    if (haveData) {
      margeSub = radio1.value;
    }
    queryParams.value.subId = margeSub;
    queryParams.value.param = input.value;
    findNewExamScore(queryParams.value).then((res: any) => {
      resultData.value = res.data;
      total.value = resultData.value.count;
      tableList.value = resultData.value.examScoreDtoList;
    })
  }

  const {iframeSrc} = toRefs(data)

  function getMergeSub() {
    getMergeSubBySub(queryParams.value).then((res: any) => {
      subList.value = res.subList;
      if (subList.value.length > 0) {
        haveData.value = true;
      }
    })
  }

  function showStudImgs(examNo: string) {
    showStudImgB.value = true;
    data.iframeSrc = data.rootUrl + "/newexam/scoreManage/showStudImg?token=" + data.token
      + "&examId=" + data.queryStudImgParam.examId + "&subId=" + data.queryStudImgParam.subId + "&subName=" + data.queryStudImgParam.subName + "&examNo=" + examNo
    window.onmessage = function (e) {
    }
    // window.open(VITE_GLOB_URL+'/exam/showStudImg'+"?examId=" +examId + "&subId=" + subId + "&subName="+subName+ "&examNo="+examNo)
    // router.push({path: '/exam/showStudImg', query: routerParam.value})
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
    studentScoreExport(queryParams.value).then((res: any) => {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', '考生成绩.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  function changeStudScore(row: any) {
    changeScore.value = true;
    changeScoreParam.value.changeExamNo = row.examNo;
    changeScoreParam.value.changeClassName = row.className;
    changeScoreParam.value.changeStudName = row.studName;
    changeScoreParam.value.changeStudentScore = row.score;
    changeScoreParam.value.changeStudId = row.studId;
  }

  function saveChangeScore() {
    addStudScore(changeScoreParam.value).then((res: any) => {
      if(res.success){
        changeScore.value = false;
        getList();
      }
    })
  }

  onMounted(() => {
    getMergeSub();
    getList();
  })
</script>

<style lang="scss" scoped>
  @import "../../../style/scanMonitor/scanMonitor.scss";
  @import "../../../style/scoreManage/scoreManage";
</style>
