<template>
  <div class="code-box">
    <div class="header-box">
      <navMenu></navMenu>
    </div>

    <div class="body-content">
      <div class="body-content-box">
        <div v-if="show" class="body-content-breadcrumb">
          <!-- 面包屑 -->
          <el-breadcrumb v-if="matched.length > 1" separator="/">
            <el-breadcrumb-item :key="index+'route'" v-for="(item,index) in matched">
              <span v-if="index < (matched.length - 1)" class="cursor" :class="item.path === path?'blackText':'gray'"
                    @click="goToPage(item)">{{ item.meta.title }}</span>
              <span v-else class="blackText cursor">{{ item.meta.title }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="body-content-card" id="bodyContentCard">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import navMenu from './components/navMenu.vue'
import router from '../router/index';
import { LocationQueryValue } from 'vue-router'
import exam from '@/router/modules/exam'

let route = useRoute()
let path = ref<any | undefined>(undefined) //可能是
let matched = ref<any>([])
let show = ref<boolean>(false)
let examId: LocationQueryValue | LocationQueryValue[] = ''

router.beforeEach((to, from, next) => {
  let queryObject = ref<any>({})
  let needField = to.meta.needField
  examId = to.query.examId
  if (needField && examId && !to.query.once) {
    let examInfo = sessionStorage.getItem(examId as string)
    if (examInfo) {
      let parseInfo = JSON.parse(examInfo);
      (needField as string[]).forEach((f: any) => {
        queryObject.value[f] = parseInfo[f]
      })
      queryObject.value.examId = examId
      queryObject.value.once = true
      // next({path: to.path, query: queryObject.value})
      if(to.name === 'examManagementIndex') {
        next()
      } else {
        next({path: to.path, query: queryObject.value, replace: true})
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

watch(() => route, (newVal, oldVal) => {
  path.value = newVal.path
  matched.value = newVal.matched.filter((m: any) => m.meta.title && m.meta.title.length > 0)
  matched.value.forEach((m: any, index: number) => {
    if (m.name === 'examProcessIndex') {
      let examInfo = sessionStorage.getItem(newVal.query.examId as string)
      if (examInfo) {
        let parse = JSON.parse(examInfo);
        m.meta.title = parse.examName
      }
    } else if (m.name === 'subjectIndex') {
      let examInfo = sessionStorage.getItem(newVal.query.examId as string)
      if (examInfo) {
        let parse = JSON.parse(examInfo);
        m.meta.title = parse.subName + '科目进程'
      }
    } else if (m.name === 'reportIndex') {
      let examInfo = sessionStorage.getItem('score:'+ newVal.query.examId as string)
      if (examInfo) {
        let parse = JSON.parse(examInfo);
        m.meta.title = parse.examName
      }
    }
  })
  //是否显示面包屑
  show.value = !newVal.meta.noCrumb
}, {deep: true, immediate: true})

function goToPage(item: any) {
  router.push({path: item.path, query: {examId: route.query.examId}})
}

</script>


<style scoped lang="scss">
.examBox_right {
  float: right;

  .examBox-box {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    margin-top: -35px;
    border-radius: 14px;
    border: 1px solid #D5DAE5;
    color: #808080;
    text-align: center;
    padding: 0 13px;
    cursor: pointer;
    user-select: none;
  }

  .examBox-box:hover {
    border: 1px solid #4381E5;
    color: #4381E5;
  }
}

.code {
  background-color: #eee;
}

.header-box {
  width: 100%;
  height: 70px;
  position: fixed;
  top: 0;
  z-index: 2;
  box-shadow: 0px 6px 15px 0px rgba(68, 129, 229, 0.1500);
  background-color: #fff;
}

.body-content {
  padding-top: 70px;
  width: 100%;
  background: #ECF3FD;
  min-width: 1356px;
}

.body-content-box {
  margin: 0 auto 20px;
  width: 1320px;
  min-height: calc(100vh - 70px);
  padding-bottom: 40px;
}

.body-content-breadcrumb {
  height: 40px;
  line-height: 40px;
}

.body-content-card {
  width: 100%;
  min-height: calc(100vh - 150px);
  background: #FFFFFF;
  box-shadow: 0px 6px 15px 0px rgba(68, 129, 229, 0.1500);
  border-radius: 8px;
  padding: 20px;
  color: #202020;
}

.el-breadcrumb {
  line-height: 40px;
}

.gray {
  color: #888888;

}

.blackText {
  color: #202020;
}

.cursor {
  cursor: pointer;
  user-select: none;
}

</style>
