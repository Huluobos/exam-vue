<template>
  <div>
    <div style="display: flex; justify-content: space-between;">
      <div class="report-card">
        <p style="margin-top: 35px;">共<span class="big-text">{{ reportInfo.subCount }}</span>个科目</p>
        <p>本次考试</p>
      </div>
      <div class="report-card">
        <p style="margin-top: 35px;"><span class="big-text">{{ reportInfo.examStudentNum }}</span>人</p>
        <p>实考</p>
      </div>
      <div class="report-card">
        <p style="margin-top: 35px;"><span class="big-text">{{ reportInfo.missStudentNum }}</span>人</p>
        <p>缺考</p>
      </div>
      <div class="report-card">
        <p style="margin-top: 35px;"><span class="big-text">{{ reportInfo.maxScore }}</span>分</p>
        <p>最高分</p>
      </div>
      <div class="report-card">
        <p style="margin-top: 35px;"><span class="big-text">{{ reportInfo.minScore }}</span>分</p>
        <p>最低分</p>
      </div>
      <div class="report-card">
        <p style="margin-top: 35px;"><span class="big-text">{{ reportInfo.avgScore }}</span>分</p>
        <p>平均分</p>
      </div>
    </div>
    <div>
      <div class="mt-20" style="display: flex; height: 50px;">
        <img :src="studentScoreIcon" alt="" style="width: 40px; height: 40px;">
        <span
            style="line-height: 40px; height: 40px; font-size: 14px; font-weight: bold; color: #202020; margin-left: 10px;">学生成绩</span>
      </div>
      <el-row :gutter="40">
        <el-col :span="8">
          <div class="student-score-card" @click="goToStudentScore('单科成绩')">
            <span>查看单科成绩</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="student-score-card" @click="goToSumScore('汇总成绩')">
            <span>查看汇总成绩</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="student-score-card" @click="goToStudentQuesScore('学生小题分')">
            <span>查看学生小题分</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="mt-20" style="display: flex; height: 50px;">
        <img :src="paperAnalysisIcon" alt="" style="width: 40px; height: 40px;">
        <span
            style="line-height: 40px; height: 40px; font-size: 14px; font-weight: bold; color: #202020; margin-left: 10px;">试卷分析</span>
      </div>
      <el-row :gutter="40">
        <el-col :span="8" style="margin-bottom: 10px;">
          <div class="paper-analysis-card" @click="goToPropositionAnalysis">
            <span>命题质量分析</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="paper-analysis-card" @click="goToRateAnalysis">
            <span>试题得分率分析</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="paper-analysis-card" @click="goToObjectQuesAnalysis">
            <span>客观题选项分布</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="paper-analysis-card" @click="goToKnowledgeAbility">
            <span>知识、能力点分析</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="paper-analysis-card" @click="goToQuesTypeAnalysis">
            <span>题型分析</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="paper-analysis-card" @click="goToPaperCommenting">
            <span>试卷讲评</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="mt-20" style="display: flex; height: 50px;">
        <img :src="indicatorsIcon" alt="" style="width: 40px; height: 40px;">
        <span
            style="line-height: 40px; height: 40px; font-size: 14px; font-weight: bold; color: #202020; margin-left: 10px;">常用指标分析</span>
      </div>
      <el-row :gutter="40">
        <el-col :span="8" style="margin-bottom: 10px;">
          <div class="indicators-card" @click="goToFiveRate">
            <span>一分五率</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="indicators-card" @click="goToScoreSegment">
            <span>分数段分析</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="indicators-card" @click="goToRankSegment">
            <span>名次段分析</span>
          </div>
        </el-col>
        <el-col :span="8" style="margin-bottom: 10px;" @click="goToPercentSegment">
          <div class="indicators-card">
            <span>百分比段分析</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="indicators-card" @click="goToDistribution">
            <span>上线分布</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="indicators-card" @click="goToCritical">
            <span>临界生分析</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="indicators-card" @click="goToGradeList">
            <span>等级分布</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="indicators-card" @click="goToRateList">
            <span>赋分分布</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="indicators-card" @click="goToSpTable">
            <span>S-P 表分析</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { scoreSchoolSurveyReportApi } from '@/api/scoreManage'
import indicatorsIcon from '../../../assets/score/indicators-icon.png'
import paperAnalysisIcon from '../../../assets/score/paper-analysis-icon.png'
import studentScoreIcon from '../../../assets/score/student-score-icon.png'
import {ElMessage} from "element-plus"

class reportData {
  subCount: any // 科目总数
  examStudentNum: any // 实考人数
  missStudentNum: any // 缺考人数
  maxScore: any // 最高分
  minScore: any // 最低分
  avgScore: any // 平均分
}

const route = useRoute()
const router = useRouter()
const examId = route.query.examId
const reportInfo = ref<reportData>(new reportData())

const scoreSchoolSurveyReport = () => {
  scoreSchoolSurveyReportApi({examId: examId}).then((res: any) => {
    if (res.success) {
      reportInfo.value = res.data
    } else {
      reportInfo.value = new reportData()
      ElMessage.error('数据异常，请联系管理员')
    }
  })
}

const goToStudentScore = (page:any) => {
  router.push({name: 'studentScoreIndex', query: {'targetPage': page, 'examId': examId}})
}
const goToStudentQuesScore = (page:any) => {
  router.push({name: 'studentScoreIndex', query: {'targetPage': page, 'examId': examId}})
}
const goToFiveRate = (page:any) => {
  router.push({name: 'commonUseIndex', query: {'tab': 'fiveRate', 'examId': examId}})
}
const goToScoreSegment = (page:any) => {
  router.push({name: 'commonUseIndex', query: {'tab': 'scoreSegment', 'examId': examId}})
}
const goToRankSegment = (page:any) => {
  router.push({name: 'commonUseIndex', query: {'tab': 'rankSegment', 'examId': examId}})
}
const goToPercentSegment = (page:any) => {
  router.push({name: 'commonUseIndex', query: {'tab': 'percentSegment', 'examId': examId}})
}
const goToRateAnalysis = (page:any) => {
  router.push({name: 'paperAnalysisIndex', query: {'tab': 'rateAnalysis', 'examId': examId}})
}
const goToPropositionAnalysis = (page:any) =>{
  router.push({name: 'paperAnalysisIndex', query: {'tab': 'propositionAnalysis', 'examId': examId}})
}
const goToObjectQuesAnalysis = (page:any) => {
  router.push({name: 'paperAnalysisIndex', query: {'tab': 'objectQuesAnalysis', 'examId': examId}})
}
const goToKnowledgeAbility= (page:any) => {
  router.push({name: 'paperAnalysisIndex', query: {'tab': 'knowledgeAbility', 'examId': examId}})
}
const goToQuesTypeAnalysis = (page:any) => {
  router.push({name: 'paperAnalysisIndex', query: {'tab': 'quesTypeAnalysis', 'examId': examId}})
}
const goToPaperCommenting = (page:any) => {
  router.push({name: 'paperAnalysisIndex', query: {'tab': 'paperCommenting', 'examId': examId}})
}
const goToSumScore = (page:any) => {
  router.push({name: 'studentScoreIndex', query: {'targetPage': page, 'examId': examId}})
}
const goToDistribution= (page:any) =>{
  router.push({name: 'commonUseIndex', query: {'tab': 'distribution', 'examId': examId}})
}
const goToCritical= (page:any) =>{
  router.push({name: 'commonUseIndex', query: {'tab': 'critical', 'examId': examId}})
}
const goToRateList= (page:any) =>{
  router.push({name: 'commonUseIndex', query: {'tab': 'rateList', 'examId': examId}})
}
const goToGradeList= (page:any) =>{
  router.push({name: 'commonUseIndex', query: {'tab': 'gradeList', 'examId': examId}})
}
const goToSpTable= (page:any) =>{
  router.push({name: 'commonUseIndex', query: {'tab': 'spTable', 'examId': examId}})
}

onMounted(() => {
  scoreSchoolSurveyReport()
})
</script>

<style lang="scss" scoped>
.report-card {
  width: 200px;
  height: 150px;
  background: url("@/assets/score/report-card.png") no-repeat;
  background-size: 100% 100%;
  text-align: center;
}

.big-text {
  font-size: 35px;
  color: #202020;
}

.student-score-card {
  width: 400px;
  height: 100px;
  background: url("@/assets/score/student-score.png") no-repeat;
  background-size: 100% 100%;
  display: table-cell;
  font-size: 15px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  transition: all 0.5s;
}

.student-score-card:hover {
  transform: scale(1.1);
}

.paper-analysis-card {
  width: 400px;
  height: 100px;
  background: url("@/assets/score/paper-analysis.png") no-repeat;
  background-size: 100% 100%;
  display: table-cell;
  font-size: 15px;
  text-align: center;
  vertical-align: middle;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.5s;
}

.paper-analysis-card:hover {
  transform: scale(1.1);
}

.indicators-card {
  width: 400px;
  height: 100px;
  background: url("@/assets/score/indicators.png") no-repeat;
  background-size: 100% 100%;
  display: table-cell;
  font-size: 15px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  transition: all 0.5s;
}

.indicators-card:hover {
  transform: scale(1.1);
}
</style>
