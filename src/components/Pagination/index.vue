<template>
  <!-- 使用：
    html----------------------------------------------------------
    <Pagination  
      v-show="total > 0"
      :total="total"
      :align="align"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"/>
    js:-----------------------------------------------------------
    const total = ref(200);
    const align = 'left';
    const data =  reactive({
      queryParams:{
        pageNum: 1,
        pageSize: 10,
      }
    })
    const getList = ()=>{
      //回调
      //  loading.value = true;
      console.log('点击')
      total.value = 200
      // loading.value = false;
    }
 -->
  <div :class="{ 'hidden': hidden }" class="pagination-container" :style="{ 'text-align': align }">
    <el-pagination :background="background" v-model:current-page="currentPage" v-model:page-size="pageSize"
      :layout="layout" :page-sizes="pageSizes" :pager-count="pagerCount" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script setup>
const props = defineProps({
  align: { //显示位置 
    type: String,
    default: 'right'
  },
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array,
    default () {
      return [10, 20, 30, 50]
    }
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  // 组件功能
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  // 是否有背景色
  background: {
    type: Boolean,
    default: true
  },
  // 是否隐藏
  hidden: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits();
const currentPage = computed({
  get () {
    return props.page
  },
  set (val) {
    emit('update:page', val)
  }
})
const pageSize = computed({
  get () {
    return props.limit
  },
  set (val) {
    emit('update:limit', val)
  }
})
function handleSizeChange (val) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })

}
function handleCurrentChange (val) {
  emit('pagination', { page: val, limit: pageSize.value })
}

</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 0;
}

.pagination-container.hidden {
  display: none;
}
:deep(.el-pagination__total) {
  float: left !important;
}
</style>
