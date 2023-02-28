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
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()
  const router = useRouter()

  const data = reactive({
    tabs: [
      {id: 'examSetting', name: '基础设置'},
      {id: 'filterStudent', name: '过滤学生'},
      {id: 'scoreSet', name: '赋分设置'},
      {id: 'levelSet', name: '等级设置'}
    ],
    curTab: {id: 'examSetting', name: '基础设置'},
  })
  const {tabs, curTab} = toRefs(data)

  function changeTab(tab: any) {
    curTab.value = tab
    router.push({
      name: tab.id, query: {
        tab: tab.id, examId: route.query.examId
      }
    })
  }

  onMounted(() => {
    if (route.query.tab) {
      for (const tab of tabs.value) {
        if (route.query.tab === tab.id) {
          curTab.value = tab
          break
        }
      }
    }
  })

  watch(() => route.query, (newValue, oldValue) => {
    if (route.name === 'examSetting') {
      for (const tab of tabs.value) {
        if (newValue.tab === tab.id) {
          changeTab(tab)
          break
        }
      }
    }
  }, {deep: true})

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

  .component-container {
    padding-top: 10px;
  }
</style>
