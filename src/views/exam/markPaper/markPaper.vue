<template>
  <div>
    <div slot="header" style="width: 560px; display: flex;">
      <div :class="pageType === 'quesArea' ? 'background-class' : 'not-background-class'"
           @click="linkClickHandler('quesArea')">
        <span
            :class="pageType === 'quesArea' ? 'background-font-style' : 'not-background-font-style'">设置阅卷题块</span>
      </div>
      <div :class="pageType === 'markTask' ? 'background-class' : 'not-background-class'"
          :style="{ cursor: model<3 ? 'pointer' : 'no-drop' }"
           @click="model<3 && linkClickHandler('markTask')">
        <span
            :class="pageType === 'markTask' ? 'background-font-style' : 'not-background-font-style'">阅卷任务分配</span>
      </div>
    </div>
    <div style="width: 1280px; height: 1px; border: 1px solid #d3e0f4;"></div>
    <div v-if="pageType === 'quesArea'" class="page-content">
      <mark-ques-area :model="model"></mark-ques-area>
    </div>
    <div v-else class="page-content">
      <mark-task></mark-task>
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkTask from 'views/exam/markPaper/markTask/index.vue';
import MarkQuesArea from 'views/exam/markPaper/markQuesArea/markQuesArea.vue';
import { ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter()
let pageType = ref<string>('quesArea')

const linkClickHandler = (type: any) => {
  pageType.value = type
}

const model = computed(()=>{
  return Number(sessionStorage.getItem('model') ? sessionStorage.getItem('model') : 1 )
})
</script>

<style lang="scss" scoped>
.page-content {
  margin-top: 10px;
}


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
