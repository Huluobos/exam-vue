<template>
  <div>
    <el-row class="mb-4">
      <el-col :span="12">
        <el-input v-model="queryParams.search" placeholder="班级/姓名/学号/考号" style="width: 200px; height: 32px; background: #fff; border-radius: 4px; font-size: 12px;"></el-input>
        <el-button type="primary" class="search-button" @click="getList">搜索</el-button>
      </el-col>
      <el-col :span="10">
        <div style="text-align: right;" class="hoverBox">
          <el-popover placement="bottom" trigger="hover" popper-class="popperBox180" :teleported="false">
            <template #reference>
              <el-button class="myIcon" type="text"></el-button>
            </template>
            <div>
              <el-checkbox-group v-model="selHead" @change="changeBox">
                <el-checkbox v-for="h in dynamicHead" style="width: 100%;" :label="h">
                  {{ h }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-popover>
        </div>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" class="release" @click="exportSumScore">导出</el-button>
      </el-col>
    </el-row>
    <el-table
        :data="tableList"
        v-loading="loading"
        style="width: 100%;"
        :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
        :cell-style="{'text-align': 'center',}"
        border
        stripe
        @sort-change="getListOrder"
    >
      <el-table-column type="index" v-if="selHead.indexOf('序号') >= 0" width="55" align="center" label="序号">
      </el-table-column>
      <el-table-column v-if="selHead.indexOf('姓名') >= 0" min-width="80" align="center" prop="studentName" label="姓名">
      </el-table-column>
      <el-table-column v-if="selHead.indexOf('学号') >= 0" sortable="custom"  align="center" min-width="180" prop="studentNo" label="学号">
      </el-table-column>
      <el-table-column v-if="selHead.indexOf('考号') >= 0" sortable="custom"  align="center" min-width="120" prop="examNo" label="考号">
      </el-table-column>
      <el-table-column v-if="selHead.indexOf('班级') >= 0" sortable="custom"  align="center" min-width="80" prop="className" label="班级">
      </el-table-column>
      <el-table-column v-for="(sub,index) in columnList" :min-width="computerWidth(sub)"  :key="index" :sortable="sub.value ==='教学班排名' ? false :'custom'" :label="sub.subName + sub.value" :prop="sub.subName ? (sub.subName  + (tableInfo.get(sub.value) || '')) : ''" align="center">
        <template #default="scope">
          <span v-if="sub.value === '得分率'">
            {{ (scope.row[sub.subName ? (sub.subName  + (tableInfo.get(sub.value) || '')) : ''] * 100).toFixed(2) + '%' }}
          </span>
<!--          <span v-else-if="sub.value === '教学班排名'">-->
<!--            {{ rankingOrder(scope.row, sub) }}-->
<!--          </span>-->
          <span v-else-if="tableInfo.get(sub.value) && tableInfo.get(sub.value).indexOf('_') > -1">
            {{ scope.row[sub.subName ? (sub.subName  + (tableInfo.get(sub.value) || '')) : ''] ? scope.row[sub.subName ? (sub.subName  + (tableInfo.get(sub.value) || '')) : ''] : '-' }}
          </span>
          <span v-else>
            {{ scoreFilter(scope.row[sub.subName ? (sub.subName  + (tableInfo.get(sub.value) || '')) : ''], scope.row[sub.subName + '_st'], sub.subName) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-10">
      <Pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.limit"
          @pagination="getList"/>
    </div>
    <el-dialog custom-class="dialogClass" v-model="exportParam.visible" title="导出" width="820px" destroy-on-close>
      <slot name="content"></slot>
      <div style="height: 20px; font-size: 14px; font-family: MicrosoftYaHei, sans-serif; color: #202020; line-height: 12px;"> 自定义下载数据，请选择需要下载的数据列 </div>
      <el-row>
        <el-col :span="2" style="width: 48px; height: 16px; font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #202020; line-height: 30px;">
          分数类型
        </el-col>
        <el-col :span="12">
          <el-radio-group v-model="exportParam.type" class="ml-4">
            <el-radio :label="0"><span style="width: 62px; height: 20px; font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #202020; line-height: 12px;">按常规导出</span></el-radio>
            <el-radio :label="1"><span style="width: 62px; height: 20px; font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #202020; line-height: 12px;">按系别导出</span></el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-table
          :data="dialogTable"
          style="width: 100%;"
          :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
          :cell-style="{'text-align': 'center',}"
          border
          stripe
          empty-text="数据加载中"
      >
        <el-table-column align="center" width="180" prop="name" label="指标">
          <template #default="scope">
            <el-checkbox-group
                v-model="scope.row.nameList"
                @change="(val) =>handleNameCheckChange(val, scope.row)"
            >
              <el-checkbox :label="scope.row.name"></el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="value" label="选择科目">
          <template #default="scope">
            <div style="display: flex; justify-content: flex-start;">
              <div v-if="scope.row.subList.length !== 0" style="margin-right: 30px;">
                <el-checkbox v-model="scope.row.checkAll" :indeterminate="scope.row.isIndeterminate" @change="(val) =>handleCheckAllChange(val, scope.row)">全选</el-checkbox>
              </div>
                <el-checkbox-group
                    v-model="scope.row.valueList"
                    @change="val => handleCheckedChange(val,scope.row)"
                >
                  <el-checkbox v-for="sub in scope.row.subList" :key="sub" :label="sub">
                    {{ sub }}
                  </el-checkbox>
                </el-checkbox-group>
            </div>
          </template>
        </el-table-column>
        </el-table>
      <template #footer>
        <el-button style="width: 100px; height: 32px;"
                   @click="exportParam.visible = false">取消</el-button>
        <el-button style="width: 100px; height: 32px;" type="primary"
                   @click="exportExcel">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import {
  getExamScoreTaskByIdApi,
  tableSearchApi,
  exportScoreClassTableApi,
  exportScoreTableApi
} from '@/api/scoreManage'
import {and} from "@vueuse/core";
import {useUserStoreWithOut} from "@/store/modules/user";
import {ElMessage} from "element-plus";
// import {ref} from "@vue/runtime-core";

const route = useRoute()
const router = useRouter()
const examId = route.query.examId
const subName = ref('')
const subId = ref('')
const schoolId = ref('')
const {VITE_GLOB_API_URL} = process.env
const exportParam = ref<any>({
  visible: false,
  type: 0
})
const subList = ref<any>();
const eExamSubjects = ref<any>()
const queryParams = ref<any>({
  offset: 0,
  page: 1,
  limit: 20,
  isAllSchool: 0,
  search: '',
  order: 'desc',
  sort: '总分'
})

const tableList = ref<any>([]);
const loading = ref<any>(false);
const total = ref<any>(0);
const selHead = ref<string[]>([
  '序号', '姓名', '考号', '班级','科目分数'
])
const dynamicHead = ref<any>([
  '序号','姓名', '学号', '考号', '班级',
  '科目分数', '标准分', '校排名', '行政班排名', '教学班排名',
  '校内系排名', '行政班系排名', '教学班系排名', '校内组合排名', '等级',
  '卷面分', '得分率'
])
const columnHead = ref<any>([
  '标准分', '校排名', '行政班排名', '教学班排名',
  '校内系排名', '行政班系排名', '教学班系排名', '校内组合排名', '等级',
  '卷面分', '得分率'
    ])
const dialogTable = ref<any>([
  {name: '原始分数',nameList: ['原始分数'],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '标准分',nameList: [],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '赋分/学考等级',nameList: [],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '教学班名称',nameList: [],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '校排名',nameList: ['校排名'],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '行政班排名',nameList: ['行政班排名'],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '教学班排名',nameList: [],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '校内系排名',nameList: [],valueList: [], subList: [], checkAll: true,isIndeterminate: false},
  {name: '行政班系排名',nameList: [],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '教学班系排名',nameList: [],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '等级',nameList: [],valueList: [], subList: [],checkAll: true, isIndeterminate: false},
  {name: '得分率',nameList: [],valueList: [], subList: [],checkAll: true, isIndeterminate: false}
])
const tableInfo =  new Map([
  ['标准分', '_sd'], ['校排名', '_s'], ['行政班排名', '_c'],['教学班名称', '_tn'],
  ['教学班排名', '_t'], ['校内系排名', '_xs'], ['行政班系排名', '_xc'],
  ['教学班系排名', '_xt'], ['校内组合排名', '_gs'], ['等级', '_grade'],
  ['卷面分', '_o'], ['得分率', '_rate']
]);

const columnList = ref<any>([])
function getList() {
  loading.value = true
  if (queryParams.value.page < 0) {
    queryParams.value.page = 0
  }
  queryParams.value.offset = (queryParams.value.page - 1) * queryParams.value.limit
  tableSearchApi(queryParams.value, examId).then((res: any) => {
    if (res.success) {
      tableList.value = res.data.rows
      total.value = res.data.total
    } else {
      ElMessage.error(res.message)
    }
    loading.value = false
  })
}

const handleNameCheckChange = (val: any, data: any) => {
  //赋分/学考等级需要判断科目的类型
  if (data.name === '赋分/学考等级') {
    const subInfo = <any>[]
    eExamSubjects.value.forEach((item: any) => {
      if (item.subType !== 1) {
        subInfo.push(item.subName)
      }
    })
    data.subList =  val.length > 0 ? subInfo : []
    data.valueList =  val.length > 0 ? subInfo : []
    return
  }
  data.subList = val.length > 0 ? subList.value : []
  data.valueList = val.length > 0 ? subList.value : []
}

const handleCheckAllChange = (val: boolean, data: any) => {
  data.valueList = val ? subList.value : []
  data.isIndeterminate = false
}
const handleCheckedChange = (val: boolean, data: any) => {
  const checkedCount = data.valueList.length
  data.checkAll = checkedCount === subList.value.length
  data.isIndeterminate = checkedCount > 0 && checkedCount < subList.value.length
}

const exportExcel =() => {
  const param = <any>[]
  console.log(dialogTable.value)
  dialogTable.value.forEach((item: any) => {
    if (item.valueList.length > 0) {
      item.valueList.forEach((obj: any) => {
        let name = item.name === '原始分数' ? '卷面分' : item.name
        name = item.name === '赋分/学考等级' ? obj : name
        const field = tableInfo.get(name)
        if (field) {
          const info = obj + field
          param.push(info)
        } else {
          param.push(name)
        }
      })
      exportParam.value.visible = false
    }
  })
  const paramStr = param.toString()
  //拼接参数
  if (exportParam.value.type === 0) {
    // 按常规导出
    exportScoreTableApi(examId,paramStr).then((res: any) => {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      const userInfo = useUserStoreWithOut().getUserInfo
      link.setAttribute('download', userInfo.schoName + '成绩总表.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  } else {
    //按系别导出
    exportScoreClassTableApi(examId,paramStr).then((res: any) => {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', '成绩总表-各班级总表.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
}

const getListOrder = (param: any) => {
  if (param.prop) {
    queryParams.value.sort = param.prop
    if (param.order === 'descending') {
      queryParams.value.order = 'desc'
    } else if (param.order === 'ascending') {
      queryParams.value.order = 'asc'
    } else {
      queryParams.value.order = 'asc'
    }
  } else {
    queryParams.value.order = 'desc'
    queryParams.value.sort = '总分'
  }
  queryParams.value.page = 1
  getList()
}

const exportSumScore = () => {
  exportParam.value.visible = true
    const subInfo = <any>[]
    eExamSubjects.value.forEach((item: any) => {
      if (item.subType !== 1) {
        subInfo.push(item.subName)
      }
    })
  if (subInfo.length > 0) {
    dialogTable.value.filter((item: any) => {
      if (item.name === '赋分/学考等级') {
        item.nameList = ['赋分/学考等级']
        handleNameCheckChange(['赋分/学考等级'],item)
      }
    })
  }
  dialogTable.value.forEach((item: any) => {
    if (item.nameList.length > 0 && item.name !== '赋分/学考等级') {
      item.valueList = subList.value
      item.subList = subList.value
    }
  })
}
const computerWidth = (sub: any) => {
  //1个字符的占位是40
  const value = 39
  let width = 0
  if (sub.subName && sub.value) {
    width = (sub.subName.length + sub.value.length) * value
  } else if (sub.subName && !sub.value) {
    width = sub.subName.length  * value
  } else if (!sub.subName && sub.value) {
    width = sub.value.length * value
  }
  width = width > 180 ? 180 : width
  return width
}

const scoreFilter = (score: any, status: any, subName: any) => {
  if (score || score === 0) {
    const subject = eExamSubjects.value.filter((item: any) => item.subName === subName)[0]
    if (subject && subject.subType === 1) {
      return score
    }
    if (score == -1) {
      return 'A'
    } else if (score == -2) {
      return 'B'
    } else if (score == -3) {
      return 'C'
    } else if (score == -4) {
      return 'D'
    } else if (score == -5) {
      return 'E'
    } else if (score == -6) {
      return 'F'
    } else if (score == -7) {
      return 'G'
    } else if (score == -8) {
      return 'H'
    } else {
      return score ? score : '-'
    }
  } else {
    if (status === 2) {
      return '未上传'
    } else if (status === 3) {
      return '缺考'
    } else if (status === 4) {
      return '违纪'
    } else {
      return '-'
    }
  }
}

// const rankingOrder = (data: any, sub: any) => {
//   // return data[sub.subName + tableInfo.get(sub.value)]
//   return data[sub.subName + tableInfo.get(sub.value)] ? data[sub.subName + tableInfo.get(sub.value)] : data[sub.subName + '_c'] ? data[sub.subName + '_c'] : scoreFilter(data[sub.subName ? (sub.subName  + (tableInfo.get(sub.value) || '')) : ''], data[sub.subName + '_st'])
// }

const changeBox = () => {
  columnList.value = []
  subList.value.forEach((item: any) => {
    const showList=columnHead.value.filter((info: string)=>{
      return selHead.value.includes(info)
    })
    let list: any[]
    if (selHead.value.indexOf('科目分数') > -1) {
      list = [item].concat(showList)
    } else {
      list = showList
    }
    const subTypeList = eExamSubjects.value.filter((info: any) => {
      return info.subType !== 1 && info.subName === item
    })
    list.forEach((obj: any) => {
      if (obj !== item) {
        const info = {subName: item,value: obj}
        if (selHead.value.indexOf('卷面分') > -1) {
          if (subTypeList.length !== 0) {
            columnList.value.push(info)
          }
        } else {
          columnList.value.push(info)
        }
      } else {
        const info = {subName: obj,value: ''}
        columnList.value.push(info)
      }
    })
  })
}

async function getExamScoreTaskById() {
  await getExamScoreTaskByIdApi({examId: examId}).then((res:any) => {
    if (res.success) {
      subList.value = res.data.subNames
      eExamSubjects.value = JSON.parse(res.data.eExamSubjects)
      const list = eExamSubjects.value.filter((item: any) => {
        return item.subType !== 1
      })

      if (list.length === 0) {
        dynamicHead.value.splice(dynamicHead.value.indexOf('卷面分'), 1)
      }
    }
  })
}

async function start(){
  await getExamScoreTaskById()
  getList();
  changeBox();
}
onMounted(() => {
  start()
})
</script>

<style scoped lang="scss">
:deep(.el-table) {
  thead.is-group tr:nth-child(2) .el-table__cell {
    left: 0 !important;
  }

  tr {
    height: 55px;
  }
}

:deep(.el-checkbox-group) {
  text-align: left;
}

.hoverBox {
  float: right;
}

.myIcon {
  width: 30px;
  height: 30px;
  background-image: url("@/assets/icon-svg/more_options.svg");
  background-size: 30px 30px;
  background-repeat: no-repeat;
}

.hoverBox:hover {
  .myIcon {
    width: 30px;
    height: 30px;
    background-image: url("@/assets/icon-svg/more_options_hover.svg");
    background-size: 29px 29px;
    background-repeat: no-repeat;
  }
}

</style>

<style lang="scss" scoped>
@import "../../../../style/scanMonitor/scanMonitor";
@import "../../../../style/scoreManage/scoreManage";
</style>
