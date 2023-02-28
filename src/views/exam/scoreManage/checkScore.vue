<template>
  <div class="margin-top14 line">
    <el-row class="mb-4">
      <el-button type="primary" plain class="button-style1" @click="goScoreManage">成绩总览</el-button>
      <el-button type="primary" plain class="button-style">数据检查</el-button>
      <el-button type="primary" plain class="button-style1" @click="goStudentScore">考生成绩</el-button>
      <el-button type="primary" plain class="button-style1" @click="goStudentDetail">考生小题明细</el-button>
    </el-row>
  </div>
  <div class="height50">
    <div class="title-style dis">{{subName}}成绩数据检查
      <div class="title-tips-img title-tips-img-style">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div class="title-tips">提示</div>
      <div class="title-tips-info">用于检查考生成绩异常数据</div>
    </div>
  </div>
  <div class="height30 dis">
    <div class="mb-2 flex items-center text-sm">
      <el-radio-group v-model="radio1" @change="getList" class="ml-4">
        <el-radio label="1" size="large">总分0分</el-radio>
        <el-radio label="2" size="large">客观题有分，主观题0分</el-radio>
        <el-radio label="3" size="large">客观题0分，主观题有分</el-radio>
        <el-radio label="4" size="large">总分低于5分</el-radio>
      </el-radio-group>
    </div>
  </div>
  <div class="margin-top14 batchTable">
    <el-table :data="tableList" border class="tableStyle">
      <el-table-column type="index" align="center" width="100" label="序号"/>
      <el-table-column prop="className" align="center" width="200" label="班级"/>
      <el-table-column prop="examNo" align="center" label="考号"/>
      <el-table-column prop="studName" align="center" label="姓名">
        <template #default="scorp">
          <a v-if="subStep !== 6 " @click="showStudDetail(scorp.row.studId)">{{scorp.row.studName}}</a>
          <div v-else>{{scorp.row.studName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="teachClassName" align="center" label="教学班"/>
      <el-table-column prop="scoreGet" align="center" label="总分"/>
      <el-table-column prop="subScore" align="center" label="客观题总分"/>
      <el-table-column prop="objScore" align="center" label="主观题总分"/>
      <el-table-column align="center" label="操作">
        <template #default="scorp">
          <a v-if="scorp.row.subScore !== null && scorp.row.objScore !== null" @click="showStudImgs(scorp.row.examNo)">查看答题卡</a>
        </template>
      </el-table-column>
    </el-table>
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


  <el-dialog v-model="showChangeStudDetail" title="修改答题明细">
    <div id="iframe-containerDetail">
      <iframe id='linkedFrameDetail'
              name="changeStudDetailScore"
              :src=iframeSrcDetail
              width="100%"
              height="450px"></iframe>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">

  import {checkScore} from '@/api/scoreManage'
  import {ref} from "@vue/runtime-core";
  import {useUserStoreWithOut} from "@/store/modules/user";
  const route = useRoute()
  const router = useRouter()
  const examId = route.query.examId
  const subName = route.query.subName
  const subId = route.query.subId
  const schoolId = route.query.schoolId
  const tableList = ref<any>([]);
  const {VITE_GLOB_API_URL} = process.env
  const radio1 = ref<string>('1')
  const subStep = ref<any>(1)
  //1总分0分 2客观题有分 3主观题有分 4总分低于5
  const data = reactive({
    queryParams: {
      // examId: ref<any>(''),
      // subName: ref<any>(''),
      // schoolId: ref<any>('')
      examId: ref<any>(examId),
      subName: ref<any>(subName),
      subId: ref<any>(subId),
      schoolId: ref<any>(schoolId),
      checkType: ref<string>('1')
    },routerParam: {
      examId: ref<any>(examId),
      subName: ref<any>(subName),
      gradeId: ref<any>(''),
      subId: ref<any>(subId),
      schoolId: ref<any>(schoolId),
    },
    token: useUserStoreWithOut().getToken,
    iframeSrc: '',
    iframeSrcDetail: '',
    rootUrl: VITE_GLOB_API_URL,
    queryStudImgParam: route.query
  })
  const {queryParams,routerParam} = toRefs(data);
  const showStudImgB = ref<boolean>(false);
  function getList() {
    queryParams.value.checkType = radio1;
    checkScore(queryParams.value).then((res: any) => {
      tableList.value = res.data.checkScoreVoList
      subStep.value = res.data.subStep
      console.log( subStep.value);
    })
  }

  const {iframeSrc} = toRefs(data)
  function showStudImgs(examNo:string){
    showStudImgB.value = true;
    data.iframeSrc = data.rootUrl + "/newexam/scoreManage/showStudImg?token=" + data.token
      +"&examId=" + data.queryStudImgParam.examId + "&subId=" + data.queryStudImgParam.subId + "&subName="+data.queryStudImgParam.subName+ "&examNo="+examNo
    window.onmessage = function (e) {
    }
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
        schoolId:routerParam.value.schoolId
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
        schoolId:routerParam.value.schoolId
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
        schoolId:routerParam.value.schoolId
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
        schoolId:routerParam.value.schoolId
      }
    })
  }


  const {iframeSrcDetail} = toRefs(data)
  const showChangeStudDetail = ref(false)
  function showStudDetail(studentId: string) {
    showChangeStudDetail.value = true;
    data.iframeSrcDetail = data.rootUrl + "/newexam/scoreManage/showStudDetail?token=" + data.token
      + "&examId=" + data.routerParam.examId + "&subId=" + data.routerParam.subId + "&studentId=" + studentId
    // window.open(VITE_GLOB_URL+'/exam/showStudImg'+"?examId=" +examId + "&subId=" + subId + "&subName="+subName+ "&examNo="+examNo)
    // router.push({path: '/exam/showStudImg', query: routerParam.value})
  }
  onMounted(() => {
    getList();
  })
</script>

<style lang="scss" scoped>
  @import "../../../style/scanMonitor/scanMonitor.scss";
  @import "../../../style/scoreManage/scoreManage";
</style>
