<template>
  <div>
    <div slot="header" style="display: flex; border-bottom: 1px solid #d3e0f4; width: 1280px;">
      <div
          v-for="(item,index) in tabData"
          :key="index + 'comp'"
          :class="pageType === item.name ? 'background-class' : 'not-background-class'"
          @click="changeComponentId(item)"
      >
        <span :class="pageType === item.name ? 'background-font-style' : 'not-background-font-style'">
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="mt-10">
      <component :is="componentId.col"></component>
    </div>
  </div>
</template>

<script setup lang="ts">

const subjectScore =  defineAsyncComponent(()=> import('@/views/score/studentScore/subjectScore/subjectScore.vue'))
const sumScore =  defineAsyncComponent(()=> import('@/views/score/studentScore/sumScore/index.vue'))
const studentQuesScore =  defineAsyncComponent(()=> import('@/views/score/studentScore/studentQuesScore/index.vue'))

type Tab = {
  name: string,
  col: any
}
type Comp = Pick<Tab, 'col'>

const route = useRoute()
const router = useRouter()
const targetPage = route.query.targetPage
let examId = route.query.examId
const pageType = ref<any>('')
const tabData = reactive<Tab[]>([
  {name: '单科成绩', col: markRaw(subjectScore)},
  {name: '汇总成绩', col: markRaw(sumScore)},
  {name: '学生小题分', col: markRaw(studentQuesScore)},
])
const info = tabData.filter((obj: { "name": any; }) => obj.name === targetPage)[0]
let componentId = reactive<Comp>({col: markRaw(info.col)})
let changeComponentId = (item: Tab) => {
  componentId.col = item.col
  pageType.value = item.name
  router.push({name: 'studentScoreIndex', query: {'targetPage': item.name, 'examId': examId}})
}

onMounted(() => {
  targetPage?pageType.value = targetPage:pageType.value = '单科成绩'
  tabData.forEach(t => {
    if (t.name === pageType.value) {
      changeComponentId(t)
      return
    }
  })
})

watch(() => route.query, (newVal:any) => {
  if (route.name === router.currentRoute.value.name) {
    tabData.forEach(t => {
      if (t.name === newVal.targetPage) {
        pageType.value = newVal.targetPage
        examId = newVal.examId
        changeComponentId(t)
        return
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.background-class {
  width: 120px;
  height: 40px;
  background: #4381e5;
  border-radius: 10px 10px 0 0;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}

.not-background-class {
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
}

.background-font-style {
  width: 90px;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei, sans-serif;
  font-weight: bold;
  color: #fff;
  line-height: 22px;
  align-items: center;
  display: inline-block;
}

.not-background-font-style {
  width: 90px;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei, sans-serif;
  font-weight: bold;
  color: #808080;
  line-height: 22px;
  align-items: center;
  display: inline-block;
}
</style>
