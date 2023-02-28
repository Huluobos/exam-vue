<template>
  <div class="margin-top14 line">
    <el-row class="mb-4">
      <el-button type="primary" plain class="button-style">成绩总览</el-button>
      <el-button type="primary" plain class="button-style1" @click="goCheckScore">数据检查</el-button>
      <el-button type="primary" plain class="button-style1" @click="goStudentScore">考生成绩</el-button>
      <el-button type="primary" plain class="button-style1" @click="goStudentDetail">考生小题明细</el-button>
    </el-row>
  </div>
  <div class="height50 dis">
    <div class="title-style">{{subName}}成绩总览</div>
    <div class="height50">
      <el-row class="el-radio-group mb-4" style="margin-top: 9px;">
        <el-button v-if="subStep === 6" type="primary" class="release" @click="cancelRelease">
          <SvgIcon class-name="myIcon" icon-class="score-cancel"></SvgIcon>
          取消发布
        </el-button>
        <el-button v-else type="info" class="" disabled>成绩待发布</el-button>
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
    <div class="div-img">
      <el-row>
        <span class="div-img-text">本校实考</span>
      </el-row>
      <el-row>
        <span class="div-img-num">{{countData.examStudentNum}}人</span>
      </el-row>
    </div>
    <div class="div-img">
      <el-row>
        <span class="div-img-text">缺考</span>
      </el-row>
      <el-row>
        <span class="div-img-num">{{countData.missStudentNum}}人</span>
      </el-row>
    </div>
    <div class="div-img">
      <el-row>
        <span class="div-img-text">平均分</span>
      </el-row>
      <el-row>
        <span class="div-img-num">{{countData.avgScore}}分</span>
      </el-row>
    </div>
    <div class="div-img">
      <el-row>
        <span class="div-img-text">最高分</span>
      </el-row>
      <el-row>
        <span class="div-img-num">{{countData.maxScore}}分</span>
      </el-row>
    </div>
    <div class="div-img">
      <el-row>
        <span class="div-img-text">最低分</span>
      </el-row>
      <el-row>
        <span class="div-img-num">{{countData.minScore}}分</span>
      </el-row>
    </div>
    <div class="div-img">
      <el-row>
        <span class="div-img-text">客观题平均分</span>
      </el-row>
      <el-row>
        <span class="div-img-num">{{countData.avgObjScore}}分</span>
      </el-row>
    </div>
    <div class="div-img">
      <el-row>
        <span class="div-img-text">主观题平均分</span>
      </el-row>
      <el-row>
        <span class="div-img-num">{{countData.avgSubScore}}分</span>
      </el-row>
    </div>
  </div>
  <div class="margin-top14 batchTable">
    <el-table :data="tableList" border class="tableStyle">
      <el-table-column type="index" align="center" width="100" label="序号"/>
      <el-table-column prop="keyName" align="center" width="200" label="教学班级"/>
      <el-table-column prop="allNum" align="center" label="实考人数"/>
      <el-table-column prop="avgScore" align="center" label="平均分"/>
      <el-table-column prop="maxScore" align="center" label="最高分"/>
      <el-table-column prop="minScore" align="center" label="最低分"/>
      <el-table-column prop="avgObjScore" align="center" label="客观题平均分"/>
      <el-table-column prop="avgSubScore" align="center" label="主观题平均分"/>
    </el-table>
  </div>
</template>

<script setup lang="ts">


  import {cancelReleaseApi, scoreSchoolSurvey} from '@/api/scoreManage'
  import {getMergeSubBySub} from '@/api/scoreManage'
  import {ref} from "@vue/runtime-core";
  import {ElMessage} from 'element-plus'

  const route = useRoute()
  const router = useRouter()
  const subId = route.query.subId
  let margeSub = subId;
  const examId = route.query.examId
  const subName = route.query.subName
  const schoolId = route.query.schoolId
  // const subId = '803ccfb0-5a16-41c2-a74e-8b65b025081f'
  // const examId = '357470010169929728'
  // const subName = '英语'
  // const schoolId = '313391103166951424'
  const radio1 = ref(subId);
  const haveData = ref(false)
  const subStep = ref(6)
  const data = reactive({
    queryParams: {
      // examId: ref<any>(''),
      // subName: ref<any>(''),
      // schoolId: ref<any>('')
      examId: ref<any>(examId),
      subName: ref<any>(subName),
      subId: ref<any>(margeSub),
      schoolId: ref<any>(schoolId),
    }, routerParam: {
      examId: ref<any>(examId),
      subName: ref<any>(subName),
      gradeId: ref<any>(''),
      subId: ref<any>(subId),
      schoolId: ref<any>(schoolId),
    },
  })
  const {queryParams, routerParam} = toRefs(data);
  let countData = ref<any>({
    allStudentNum: 0,
    avgObjScore: 0,
    avgSubScore: 0,
    examStudentNum: 0,
    missStudentNum: 0,
    schScoresDTO: {},
    subStep:1,
    publicStatus:0
  });
  const tableList = ref<any>([]);
  const subList = ref<any>();

  function getList() {
    if (haveData) {
      margeSub = radio1.value;
    }
    queryParams.value.subId = margeSub;
    scoreSchoolSurvey(queryParams.value).then((res: any) => {
      countData.value = res;
      subStep.value =  countData.value.subStep;
      tableList.value = countData.value.scoreTotalClassAna;
    })
  }

  function getMergeSub() {
    getMergeSubBySub(queryParams.value).then((res: any) => {
      subList.value = res.subList;
      if (subList.value.length > 0) {
        haveData.value = true;
      }
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

  function cancelRelease() {
    cancelReleaseApi(subId).then((res: any) => {
      ElMessage.success('取消成功 !')
      subStep.value = 7;
    });
  }

  onMounted(() => {
    getList();
    getMergeSub();
  })
</script>

<style lang="scss" scoped>
  @import "./src/style/scanMonitor/scanMonitor.scss";
  @import "../../../style/scoreManage/scoreManage";
  .myIcon {
    color: #FFD557;
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
</style>
