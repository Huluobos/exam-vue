<template>
  <div>
    <div class="nav-box">
      <div class="nav" v-for="tab in tabs"
           :key="tab.id"
           :class="{active:curTab.id===tab.id}"
           @click="changeTab(tab)"
      >
        {{ tab.name }}
      </div>
    </div>
  </div>
  <div class="component-container">
    <Suspense>
      <template #default>
        <component :is="curTab.component"></component>
      </template>
      <template #fallback>
        <div style="width: 100%;height: 400px;" v-loading="true"></div>
      </template>
    </Suspense>

  </div>
</template>

<script setup lang="ts">
  // import FiveRate from "views/score/commonUse/fiveRate.vue"
  // import ScoreSegment from "views/score/commonUse/scoreSegment.vue"
  // import RankSegment from "views/score/commonUse/rankSegment.vue"
  // import PercentSegment from "views/score/commonUse/percentSegment.vue"

  const ScoreSegment = defineAsyncComponent(()=> import('@/views/score/commonUse/scoreSegment.vue'))
  const RankSegment = defineAsyncComponent(()=> import('@/views/score/commonUse/rankSegment.vue'))
  const PercentSegment = defineAsyncComponent(()=> import('@/views/score/commonUse/percentSegment.vue'))
  const FiveRate = defineAsyncComponent(()=> import('@/views/score/commonUse/fiveRate.vue'))
  const Distribution = defineAsyncComponent(()=> import('@/views/score/commonUse/distribution.vue'))
  const Critical = defineAsyncComponent(()=> import('@/views/score/commonUse/critical.vue'))
  const RateList = defineAsyncComponent(()=> import('views/score/commonUse/rateList.vue'))
  const GradeList = defineAsyncComponent(()=> import('views/score/commonUse/gradeList.vue'))
  const SPTable = defineAsyncComponent(()=> import('@/views/score/commonUse/spTable.vue'))

  const route = useRoute()
  const router = useRouter()

  const data = reactive({
    tabs: [
      {id: 'fiveRate', name: '一分五率', component: markRaw(FiveRate)},
      {id: 'scoreSegment', name: '分数段分析', component: markRaw(ScoreSegment)},
      {id: 'rankSegment', name: '名次段分析', component: markRaw(RankSegment)},
      {id: 'percentSegment', name: '百分比段分析', component: markRaw(PercentSegment)},
      {id: 'distribution', name: '上线分布', component: markRaw(Distribution)},
      {id: 'critical', name: '临界生分析', component: markRaw(Critical)},
      {id: 'gradeList', name: '等级分布', component: markRaw(GradeList)},
      {id: 'rateList', name: '赋分分布', component: markRaw(RateList)},
      {id: 'spTable', name: 'S-P表分析', component: markRaw(SPTable)},
    ],
    curTab: {id: 'fiveRate', name: '一分五率', component: markRaw(FiveRate)},
  })
  const {tabs, curTab} = toRefs(data)

  function changeTab(tab : any){
    curTab.value = tab
    router.push({name:'commonUseIndex', query:{
      tab:tab.id,examId:route.query.examId
    }})
  }

  onMounted(()=>{
    if (route.query.tab) {
      for (const tab of tabs.value) {
        if (route.query.tab === tab.id) {
          curTab.value = tab
          break
        }
      }
    }
  })

  watch(()=>route.query, (newValue, oldValue) => {
    if (route.name === 'commonUseIndex') {
      for (const tab of tabs.value) {
        if (newValue.tab === tab.id) {
          changeTab(tab)
          break
        }
      }
    }
  }, {deep:true})

</script>

<style lang="scss" scoped>
  .nav-box {
    display: inline-block;
    width: 100%;
    padding-top: 10px;
    font-weight: bold;
    color: #808080;
    border-bottom: 1px solid #D3E0F4;

    .nav {
      display: inline-block;
      cursor: pointer;

      &:hover {
        color: #4381E5;
      }

      min-width: 120px;
      height: 40px;
      line-height: 40px;
      text-align: center;

      &.active {
        color: #FFFFFF;
        background: #4381E5;
        border-radius: 10px 10px 0px 0px;
      }
    }
  }
  .component-container{
    padding-top: 10px;
  }
</style>
