<template>
  <div class="card-title">
    <span class="title">
      网阅任务列表
    </span>
    <div class="qr-code-container">
      <div class="btn" @mouseover="mouseover" @mouseleave="mouseleave">
        <img class="icon" src="@/assets/scan.png"/>
        下载网阅客户端</div>
      <img :style="{display: data.visible?'block':'none'}" class="qr-code-img" src="@/assets/qrcode-app.jpg"/>
    </div>
  </div>
  <el-table
    :data="dataList"
    style="width: 100%"
    :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
    :cell-style="{'text-align': 'center',}"
    border
    stripe
  >
    <el-table-column prop="taskName" label="任务名称" width="480"/>
    <el-table-column prop="type" label="任务类型" width="250" >
      <template #default="scope">
        {{ scope.row.type===1?'考试':'测验' }}
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="300"/>
    <el-table-column prop="taskId" label="操作">
      <template #default="scope">
        <el-button type="text" @click="goTaskList(scope.row.taskId)">开始阅卷
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div style="text-align: right;margin-top: 10px">
    <el-pagination
      background
      v-show="total > 0"
      :total="total"
      layout="total, prev, pager, next"
      :current-page="queryParams.page"
      :page-size="queryParams.limit"
      @current-change="getAllMarkingList"
    />
  </div>
</template>

<script setup lang="ts">
  import { getAllMarkingListApi } from '@/api/teacherMark'

  const dataList = ref([])
  const total = ref<any>(0)
  const router = useRouter()

  const data = reactive({
    queryParams: {
      page: 1,
      limit: 10,
      offset: 0
    },
    visible: false
  })

  const {queryParams} = toRefs(data)

  function getAllMarkingList(curPage:any) {
    console.log(queryParams.value)
    if (curPage < 0) {
      curPage = 1
    }
    queryParams.value.page = curPage
    queryParams.value.offset = queryParams.value.limit * (queryParams.value.page - 1)

    getAllMarkingListApi(queryParams.value).then(res=>{
      console.log(res)
      total.value = res.total
      dataList.value = res.rows
    })
  }

  function mouseover() {
    data.visible = true
  }
  function mouseleave() {
    data.visible = false
  }
  function goTaskList(examId:string) {
    router.push({path:"teacherMark/taskList",
      query:{
        examId: examId
      }
    })
  }

  onMounted(() => {
    getAllMarkingList(1)
  })

</script>

<style lang="scss" scoped>
  .card-title {
    margin-bottom: 16px;
    height: 22px;
    position: relative;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #202020;
      line-height: 22px;
      margin-right: 20px;
    }
  }

  .qr-code-container{
    position:absolute;
    z-index:100;
    cursor: pointer;
    width:150px;
    text-align:right;
    right:10px;
    top: 5px;
    .btn {
      color: #4381E5;
    }
    .icon{
      width: 20px;
      height: 20px;
      display: inline-block;
    }
    .qr-code-img{
      width: 150px;
      height: 172px;
      display: none;
    }
  }
</style>
