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
<!--    <component :is="curTab.component"></component>-->
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
  // import RateAnalysis from "views/score/paperAnalysis/rateAnalysis.vue"
  // import ObjectQuesAnalysis from "views/score/paperAnalysis/objectQuesAnalysis.vue"
  const PropositionAnalysis = defineAsyncComponent(()=> import('@/views/score/paperAnalysis/propositionAnalysis.vue'))
  const RateAnalysis = defineAsyncComponent(()=> import('@/views/score/paperAnalysis/rateAnalysis.vue'))
  const ObjectQuesAnalysis = defineAsyncComponent(()=> import('@/views/score/paperAnalysis/objectQuesAnalysis.vue'))
  const knowledgeAbility = defineAsyncComponent(()=> import('@/views/score/paperAnalysis/knowAbility.vue'))
  const quesTypeAnalysis = defineAsyncComponent(()=> import('@/views/score/paperAnalysis/quesTypeAnalysis.vue'))
  const paperCommenting = defineAsyncComponent(()=> import('@/views/score/paperAnalysis/paperCommenting.vue'))

  const route = useRoute()
  const router = useRouter()

  const data = reactive({
    tabs: [
      {id: 'propositionAnalysis', name: '命题质量分析',component: markRaw(PropositionAnalysis)},
      {id: 'rateAnalysis', name: '试题得分率分析', component: markRaw(RateAnalysis)},
      {id: 'objectQuesAnalysis', name: '客观题选项分布', component: markRaw(ObjectQuesAnalysis)},
      {id: 'knowledgeAbility', name: '知识、能力点分析', component: markRaw(knowledgeAbility)},
      {id: 'quesTypeAnalysis', name: '题型分析', component: markRaw(quesTypeAnalysis)},
      {id: 'paperCommenting', name: '试卷讲评', component: markRaw(paperCommenting)},
    ],
    curTab: {id: 'propositionAnalysis', name: '命题质量分析', component: markRaw(PropositionAnalysis)},
  })
  const {tabs, curTab} = toRefs(data)

  function changeTab(tab : any){
    curTab.value = tab
    router.push({name:'paperAnalysisIndex', query:{
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
    if (route.name === 'paperAnalysisIndex') {
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
