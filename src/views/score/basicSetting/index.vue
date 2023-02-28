<template>
  <div>
    <div class="title">指标参数设置</div>
    <div class="subject-container">
      <el-select v-model="curGrade"
                 placeholder="年级"
                 @change="changeGrade">
        <el-option v-for="grade in grades"
                   :key="grade.id"
                   :label="grade.name"
                   :value="grade.id"/>
      </el-select>
      <span class="sub-title" style="padding-left: 10px">此处设置的指标项为同一年级统一指标，如单个任务分析指标设置不一致，请至单个任务指标处修改。</span>
    </div>
    <div class="line-title">
      <div class="icon"><img src="@/assets/basicSetting/fiveRate.png" /></div>
      <div class="content">
        <div class="title">五率（高分率、优秀率、良好率、及格率、低分率）</div>
        <div class="sub-title">设置规则为试卷满分的比例，表示为试卷满分*XX%的分数以上学生为优秀，如150分的试卷，127.5分的为优秀，则85%的为优秀，可设置85的比例；低分则为试卷满分*XX%的分数以下学生为低分。</div>
      </div>
    </div>
    <div class="line-content">
      <el-form :inline="true" :model="fiveRateForm" class="demo-form-inline">
        <el-form-item class="item" >
          <span class="label">高分</span>
          <el-input style="width: 120px;" v-model="fiveRateForm.highScore" placeholder="高分" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #suffix>%</template>
          </el-input>
        </el-form-item>
        <el-form-item class="item">
          <span class="label">优秀</span>
          <el-input style="width: 120px;" v-model="fiveRateForm.goodScore" placeholder="优秀" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #suffix>%</template>
          </el-input>
        </el-form-item>
        <el-form-item class="item">
          <span class="label">良好</span>
          <el-input style="width: 120px;" v-model="fiveRateForm.fineScore" placeholder="良好" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #suffix>%</template>
          </el-input>
        </el-form-item>
        <el-form-item class="item">
          <span class="label">及格</span>
          <el-input style="width: 120px;" v-model="fiveRateForm.passScore" placeholder="及格" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #suffix>%</template>
          </el-input>
        </el-form-item>
        <el-form-item class="item">
          <span class="label">低分</span>
          <el-input style="width: 120px;" v-model="fiveRateForm.lowScore" placeholder="低分" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #suffix>%</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="line"></div>
    <div class="line-title">
      <div class="icon"><img src="@/assets/basicSetting/score.png" /></div>
      <div class="content">
        <div class="title">分数段</div>
        <div class="sub-title">根据试卷满分，按照分数区间来分为若干段。</div>
      </div>
    </div>
    <div class="line-content">
      <el-form :inline="true" :model="scoreSegmentForm" class="demo-form-inline">
        <el-form-item>
          <span class="label">单科（&le;150）</span>
          <el-input class="item" v-model="scoreSegmentForm.lessEqualsThan150" placeholder="单科（<=150）" oninput="value=value.replace(/[^0-9.]/g,'')" />
          <span class="label">分区间</span>
        </el-form-item>
        <el-form-item>
          <span class="label">单科（&gt;150）</span>
          <el-input class="item" v-model="scoreSegmentForm.biggerThan150" placeholder="单科（＞150）" oninput="value=value.replace(/[^0-9.]/g,'')" />
          <span class="label">分区间</span>
        </el-form-item>
        <el-form-item>
          <span class="label">总分</span>
          <el-input class="item" v-model="scoreSegmentForm.totalScore" placeholder="总分" oninput="value=value.replace(/[^0-9.]/g,'')" />
          <span class="label">分区间</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="line"></div>
    <div class="line-title">
      <div class="icon"><img src="@/assets/basicSetting/rank.png" /></div>
      <div class="content" style="padding-top: 5px;">
        <div class="title">名次段</div>
      </div>
    </div>
    <div class="line-content">
      <el-form :inline="true" :model="rankSegmentForm" class="demo-form-inline">
        <el-form-item v-for="(rank,index) in rankSegmentForm.rankSegment" :key="index" >
          <span class="label">前</span>
          <el-input style="width: 80px;" v-model="rankSegmentForm.rankSegment[index]" oninput="value=value.replace(/[^0-9]/g,'')"/>
          <span class="label">名</span>
          <a class="del" @click="delRank(index)">删除</a>
        </el-form-item>
      </el-form>
      <el-link type="primary"
               :icon="Plus"
               :underline="false"
               style="padding-bottom: 10px;"
               @click="addRank">添加
      </el-link>
    </div>
    <div class="line"></div>
    <div class="line-title">
      <div class="icon"><img src="@/assets/basicSetting/percent.png" /></div>
      <div class="content" style="padding-top: 5px;">
        <div class="title">百分比段</div>
      </div>
    </div>
    <div class="line-content">
      <el-form :inline="true" :model="percentSegmentForm" class="demo-form-inline">
        <el-form-item>
          <span class="label">可以设置</span>
          <el-input style="width: 80px;" v-model="percentSegmentForm.percent" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #suffix>%</template>
          </el-input>
          <span class="label">为一个百分比段</span>
        </el-form-item>
      </el-form>
    </div>

    <div style="text-align: right;margin-top: 10px;">
      <el-button class="btn" type="primary" @click="saveSetting">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">

  import {getCurrentOrDefaultSettingApi,saveSettingApi} from "@/api/basicSetting"
  import { Plus, View as IconView } from '@element-plus/icons-vue'
  import {ElMessage,ElLoading} from "element-plus/es"
  import {compareString} from "@/util/compare"


  const grades = ref<any>([
    {id:'1', name:'高一'},
    {id:'2', name:'高二'},
    {id:'3', name:'高三'},
    {id:'11', name:'初一'},
    {id:'12', name:'初二'},
    {id:'13', name:'初三'},
  ])
  const curGrade = ref<string>('1')

  const fiveRateForm = ref({
    highScore:90,
    goodScore:85,
    fineScore:75,
    passScore:60,
    lowScore:40,
  })

  const scoreSegmentForm = ref({
    lessEqualsThan150:10,
    biggerThan150:30,
    totalScore:50,
  })

  const rankSegmentForm = ref({
    rankSegment:[10,20,30,40,50]
  })

  const percentSegmentForm = ref({
    percent:10
  })

  const id = ref<string>('')

  function getCurrentOrDefaultSetting() {
    const loading = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(255, 255, 255, 0.8)',
    })
    getCurrentOrDefaultSettingApi(curGrade.value).then((res:any)=>{
      if (res) {
        const fiveRate = JSON.parse(res.fiveRate)
        const scoreSegment = JSON.parse(res.scoreSegment)
        const rankSegment = JSON.parse(res.rankSegment)
        const percentSegment = JSON.parse(res.percentSegment)
        fiveRateForm.value = fiveRate
        scoreSegmentForm.value = scoreSegment
        rankSegmentForm.value = rankSegment
        percentSegmentForm.value = percentSegment
        id.value = res.id
        console.log(fiveRateForm)
      }
      loading.close()
    }).catch((e)=>{
      loading.close()
      console.error(e)
    })
  }

  function changeGrade(){
    getCurrentOrDefaultSetting()
  }

  function addRank(){
    rankSegmentForm.value.rankSegment.push(0)
  }

  function delRank(index:number){
    rankSegmentForm.value.rankSegment.splice(index, 1)
  }

  function saveSetting() {
    if (Array.from(new Set(rankSegmentForm.value.rankSegment)).length
        < rankSegmentForm.value.rankSegment.length){
      ElMessage.error('名次段有重复值')
      return
    }
    rankSegmentForm.value.rankSegment.sort((l,r)=>compareString(l+'',r+''))
    const data = {
      id: id.value,
      grade: curGrade.value,
      fiveRate: JSON.stringify(fiveRateForm.value),
      scoreSegment: JSON.stringify(scoreSegmentForm.value),
      rankSegment: JSON.stringify(rankSegmentForm.value),
      percentSegment: JSON.stringify(percentSegmentForm.value),
    }
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(255, 255, 255, 0.8)',
    })
    saveSettingApi(data).then((res:any)=>{
      console.log(res)
      if (res.success) {
        ElMessage.success('保存成功')
      }else{
        ElMessage.error(res.message)
      }
      loading.close()
    }).catch((e)=>{
      console.error(e)
      ElMessage.error('保存失败，请求异常')
      loading.close()
    })
  }

  onMounted(()=>{
    getCurrentOrDefaultSetting()
  })

</script>

<style lang="scss" scoped>
  .title{
    color: #202020;
    font-size: 16px;
    font-weight: bold;
  }
  .sub-title{
    color: #808080;
    font-size: 12px;
  }
  .subject-container{
    padding: 10px 0px 20px;
  }
  .line-title{
    display: flex;
    margin-bottom: 10px;
    .icon{
      width: 30px;
    }
    .content{
      flex: 1;
      padding-left: 10px;
    }
  }
  .line-content {
    background: #F8FBFF;
    border-radius: 0px 0px 4px 4px;
    min-height: 60px;
    padding-left: 20px;
    padding-top: 20px;
  }
  .line{
    border-top: 1px solid #D5DAE5;
    margin: 10px 0px;
  }
  .btn{
    width: 100px;
  }
  .item {
    width: 160px;
  }
  .del{
    padding-left: 10px;
    color: #FF3333;
  }
  .label{
    padding-left:5px;
    padding-right:5px;
    color: #202020;
  }
</style>
