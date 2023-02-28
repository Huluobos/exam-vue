<template>
  <div class="title-style">科目扫描监控</div>
  <div class="dis">
    <div class="charts-class">
      <Echarts :options="options" :width="'300px'" :height="'200px'"></Echarts>
    </div>
    <div class="charts-class margin-left20">
      <table class="chart-table" style="">
        <thead>
          <tr>
            <td width="120px" style="text-align: center">总计</td>
            <td width="100px">{{countData.allStudNum}}人</td>
          </tr>

        </thead>
        <tbody>
          <tr>
            <td class="chart-table-td">
              <div class="span1"></div>
              已上传
            </td>
            <td>{{countData.uploadNum}}人</td>
          </tr>
          <tr>
            <td class="chart-table-td">
              <div class="span2"></div>
              未上传
            </td>
            <td>{{countData.allStudNum-countData.uploadNum}}人</td>
          </tr>
          <tr>
            <td class="chart-table-td">
              <div class="span3"></div>
              违规缺考
            </td>
            <td>{{countData.countMissStudNum}}人</td>
          </tr>
          <tr>
            <td class="chart-table-td">
              <div class="span4"></div>
              异常
            </td>
            <td>{{countData.countWrongNum}}人</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="margin-top14 line" :style="showTableButton">
    <el-row class="mb-4" style="display: unset">
      <el-button type="primary" plain class="button-style" @click="changeButton1">按批次匹配</el-button>
      <el-button type="primary" plain class="button-style1" @click="changeButton2">按班级匹配</el-button>
      <el-button type="primary" class="release" @click="exportStudTemplate">下载缺考及未上传学生名单</el-button>
    </el-row>
  </div>
  <div class="margin-top14 line" :style="showClassTableButton">
    <el-row class="mb-4" style="display: unset">
      <el-button type="primary" plain class="button-style1" @click="changeButton1">按批次匹配</el-button>
      <el-button type="primary" plain class="button-style" @click="changeButton2">按班级匹配</el-button>
      <el-button type="primary" class="release" @click="exportStudTemplate">下载缺考及未上传学生名单</el-button>
    </el-row>
  </div>
  <div class="margin-top14 batchTable" :style="showTable">
    <div :style="showTableInfo">
      <el-table v-loading="loading" :data="tableList" border class="tableStyle">
        <el-table-column prop="subName" align="center" label="科目" />
        <el-table-column prop="batch" align="center" width="100" label="批次" />
        <el-table-column prop="scanNum" align="center" label="扫描张数" />
        <el-table-column prop="uploadNum" align="center" label="上传张数" />
        <el-table-column prop="excepNum" align="center" label="异常" />
        <el-table-column prop="warnNum" align="center" label="警告" />
        <el-table-column prop="createTime" align="center" label="扫描时间" />
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <a v-if="scope.row.excepNum > 0" @click="showAbnormalInfo(scope.row.id,scope.row.batch)">详情</a>
            <span class="disable-span" v-if="scope.row.excepNum === 0">详情</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-10">
        <Pagination v-show="total > 0" :total="total" v-model:page="data.queryParams.page"
          v-model:limit="data.queryParams.limit" @pagination="getList" />
      </div>

    </div>
    <div :style="showInfo">
      <div class="height30 dis float-right">
        <div class="callback-img callback-img-style">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div><a class="callback-text" @click="backTable">返回</a></div>
      </div>
      <el-table border class="tableStyle" :data="batchInfoTable">
        <el-table-column align="center" width="100" label="批次">
          {{batchNameStr}}
        </el-table-column>
        <el-table-column prop="picIndex" align="center" width="100" label="批次内序号" />
        <el-table-column prop="examNo" align="center" label="考号" />
        <el-table-column prop="errorType" align="center" label="异常描述">
          <template #default="scope">
            <span v-if="scope.row.errorType === 1">无此考号</span>
            <span v-if="scope.row.errorType === 2">考号重复</span>
            <span v-if="scope.row.errorType === 3">客观题没作答</span>
            <span v-if="scope.row.errorType === 4">上传失败</span>
            <span v-if="scope.row.errorType === 5">考号无法识别（客观题无作答）</span>
            <span v-if="scope.row.errorType === 6">考号无法识别（客观题有作答）</span>
            <span v-if="scope.row.errorType === 7">加载图片失败</span>
            <span v-if="scope.row.errorType === 8">客观题0分</span>
            <span v-if="scope.row.errorType === 9">图片校正失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" width="200" label="上传时间" />
        <el-table-column align="center" label="操作" width="100">
          <template #default="scope">
            <a @click="del(scope.row.examNo,scope.row.batchId,scope.row.localId)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="margin-top14 batchTable" :style="showClassTable">
    <el-table ref="spanTable" v-loading="loading" :data="tableClassList" show-summary :span-method="arraySpanMethod"
      border class="tableStyle">
      <el-table-column prop="subName" align="center" label="科目" />
      <el-table-column prop="className" align="center" width="100" label="班级" />
      <el-table-column prop="totalNum" align="center" label="学生数量" />
      <el-table-column prop="uploadNum" align="center" label="上传数量" />
      <el-table-column prop="disNum" align="center" label="违规缺考数量">
        <template #default="scope">
          <div>
            <a v-if="scope.row.disNum > 0" @click="getMissExamStuds(scope.row.className)">{{scope.row.disNum}}</a>
            <div v-if="scope.row.disNum === 0">{{scope.row.disNum}}</div>
            <a></a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="absentNum" align="center" label="未上传人数">
        <template #default="scope">
          <div>
            <a v-if="scope.row.absentNum > 0" @click="notUploadStuds(scope.row.className)">{{scope.row.absentNum}}</a>
            <div v-if="scope.row.absentNum === 0">{{scope.row.absentNum}}</div>
            <a></a>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="margin-top14 batchTable" :style="showNotUploadTable">
    <div class="height30 dis float-right">
      <div class="callback-img callback-img-style">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div><a class="callback-text" @click="backClassTable">返回</a></div>
    </div>
    <el-table :data="notUploadTableStuds" border class="tableStyle">
      <el-table-column type="index" width="100" align="center" label="序号" />
      <el-table-column prop="subName" align="center" label="科目" />
      <el-table-column prop="className" align="center" label="班级" />
      <el-table-column prop="studentName" align="center" label="姓名" />
      <el-table-column prop="examNo" align="center" label="考号" />
      <el-table-column prop="teachClassName" align="center" label="教学班" />
      <el-table-column align="center" label="类型">未上传答题卡</el-table-column>
    </el-table>
  </div>
  <div class="margin-top14 batchTable" :style="showMissExamStuds">
    <div class="height30 dis float-right">
      <div class="callback-img callback-img-style">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div><a class="callback-text" @click="backClassTable">返回</a></div>
    </div>
    <el-table :data="missExamStuds" border class="tableStyle">
      <el-table-column type="index" width="100" align="center" label="序号" />
      <el-table-column prop="subName" align="center" label="科目" />
      <el-table-column prop="className" align="center" label="班级" />
      <el-table-column prop="studentName" align="center" label="姓名" />
      <el-table-column prop="examNo" align="center" label="考号" />
      <el-table-column prop="teachClassName" align="center" label="教学班" />
      <el-table-column align="center" label="类型">
        <template #default="scope">
          <div v-if="scope.row.sign === 3">缺考</div>
          <div v-if="scope.row.sign === 4">违纪</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <div v-show="subStep">
            <a @click="showStudImg(scope.row.examNo)">原图</a>
            <a v-if="scope.row.sign === 3" class="margin-left25"
              style="color: #888888; pointer-events: none; cursor: default;">取消缺考</a>
            <a v-if="scope.row.sign === 4" class="margin-left25"
              style="color: #888888; pointer-events: none; cursor: default;">取消违纪</a>
          </div>
          <div v-show="!subStep">
            <a @click="showStudImg(scope.row.examNo)">原图</a>
            <a v-if="scope.row.sign === 3" class="margin-left25" @click="changeStatus(scope.row.examNo)">取消缺考</a>
            <a v-if="scope.row.sign === 4" class="margin-left25" @click="changeStatus(scope.row.examNo)">取消违纪</a>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <div class="mt-10">
      <Pagination v-show="missTotal > 0" :total="missTotal" v-model:page="data.missExamStudsParam.page"
        v-model:limit="data.missExamStudsParam.limit" @pagination="getMissStud" />
    </div>

  </div>
  <el-dialog v-model="delBatchInfo" title="是否删除" width="600px">
    <span>应该在扫描客户端执行此操作，您确认在此删除异常？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button style="width: 100px; height: 32px" type="primary" @click="delBatchInfo = false">取消</el-button>
        <el-button style="width: 100px; height: 32px" type="danger" @click="delBatchId">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="showStudImgs" title="查看学生答题卡原图">
    <div v-for="sImg in eExamMarkImagesList">
      <img :src="sImg.imgPath" alt="">
    </div>
  </el-dialog>
  <el-dialog v-model="showChangeStud" title="确认取消" width="600px">
    <span>确认修改当前学生答题卡状态为正常？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button style="width: 100px; height: 32px;" type="primary" @click="changeStudentStatus">确定</el-button>
        <el-button style="width: 100px; height: 32px;" type="danger" @click="showChangeStud = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  deleteErrorInfo,
  getBatchInfos,
  getExamStuImgsByType,
  getMissExamStudsApi,
  getNotUploadStuds,
  batchStatistics,
  getClassScanDetail,
  classScanDetail,
  errorInfos,
  studentDetailExport,
  changeStudImgStatus
} from '@/api/scanMonitor'
import { ref } from "@vue/runtime-core";

const route = useRoute()
const subId = route.query.subId
const examId = route.query.examId
const subName = route.query.subName
const schoolId = route.query.schoolId
// const examId = '357470010169929728'
// const subName = '英语'
// const schoolId = '313391103166951424'

const total = ref<any>(0);
const loading = ref(true);
const resultData = ref({ count: 0, batchList: [], subStep: 0 });
let countData = ref<any>({ uploadNum: 0, allStudNum: 0, countMissStudNum: 0, countWrongNum: 0 });
const tableList = ref<any>([]);
const tableClassList = ref<any>([]);
const notUploadTableStuds = ref<any>([]);
const missExamStuds = ref<any>([]);
const showClassTableButton = ref<string>("display:none");
const showClassTable = ref<string>("display:none");
const showNotUploadTable = ref<string>("display:none");
const showMissExamStuds = ref<string>("display:none");
const showTable = ref<string>();
const showTableButton = ref<string>();
const showInfo = ref<string>("display:none");
const showTableInfo = ref<string>();
const batchNameStr = ref<string>("");
const batchInfoTable = ref<any>([]);
const eExamMarkImagesList = ref<any>([]);
const delBatchInfo = ref<boolean>(false);
const showStudImgs = ref<boolean>(false);
const showChangeStud = ref<boolean>(false);
const missTotal = ref<any>(0);
const subStep = ref<boolean>(false)
const data = reactive({
  queryParams: {
    page: 1,
    limit: 10,
    offset: 0,
    // examId: ref<any>(''),
    // subName: ref<any>(''),
    // schoolId: ref<any>('')
    examId: ref<any>(examId),
    subName: ref<any>(subName),
    schoolId: ref<any>(schoolId),
    className: ref<any>()
  },
  batchParams: {
    examId: ref<any>(examId),
    subName: ref<any>(subName),
    schoolId: ref<any>(schoolId),
    batchId: ref<any>("")
  }, batchDelParams: {
    examId: ref<any>(examId),
    subName: ref<any>(subName),
    examNo: ref<any>(),
    batchId: ref<any>(""),
    errorId: ref<any>(""),
  }, missExamStudsParam: {
    examId: ref<any>(examId),
    schoolId: ref<any>(schoolId),
    subName: ref<any>(subName),
    className: ref<any>(""),
    page: 1,
    limit: 10
  }, changeStudParam: {
    examId: ref<any>(examId),
    schoolId: ref<any>(schoolId),
    subName: ref<any>(subName),
    examNo: ref<any>("")
  }
})
const { queryParams } = toRefs(data);
const { batchParams } = toRefs(data);
const { batchDelParams } = toRefs(data);
const { missExamStudsParam } = toRefs(data);
const { changeStudParam } = toRefs(data);

function getList() {
  queryParams.value.offset = (queryParams.value.page - 1) * queryParams.value.limit
  getBatchInfos(queryParams.value).then((res: any) => {
    resultData.value = res.data;
    total.value = resultData.value.count;
    tableList.value = resultData.value.batchList;
    loading.value = false;
    if (resultData.value.subStep === 6) {
      subStep.value = true
    } else {
      subStep.value = false;
    }
  })
}

let chartDate = ref([]);
let options = ref<any>(null) //图表的数据对象
const spanTable = ref() //图表的数据对象

const arraySpanMethod = ({ row, column, rowIndex, columnIndex, }: any) => {
  const tds = spanTable.value.$el.querySelectorAll('.el-table__footer-wrapper .el-table__footer tr>td')
  tds[0].colSpan = 2
  tds[0].style.textAlign= 'center'
  tds[1].style.display= 'none'
}

function getCountNum() {
  batchStatistics(queryParams.value).then((res: any) => {
    countData.value = res.data;
    console.log(countData.value);
    chartDate.value =
      [{ 'value': countData.value.uploadNum, 'name': '已上传' },
      { 'value': countData.value.allStudNum - countData.value.uploadNum, 'name': '未上传' }]
    options.value = {
      title: {
        text: ''
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        top: '40%'
      },
      tooltip: {},
      series: [
        {
          name: '扫描监控',
          type: 'pie',
          right: '25%',
          radius: ['40%', '70%'],
          data: chartDate.value,
          color: ['#00C18F', '#C4E8DF', '#FA8D4E', '#FE3838'],
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  })
}

function getClassInfo() {
  getClassScanDetail(queryParams.value).then((res: any) => {
  })
}

function getClassAllInfo() {
  classScanDetail(queryParams.value).then((res: any) => {
    tableClassList.value = res.data;
  })
}

function changeButton1() {
  showClassTable.value = "display:none";
  showClassTableButton.value = "display:none";
  showNotUploadTable.value = "display:none";
  showMissExamStuds.value = "display:none";
  showTable.value = "";
  showTableButton.value = "";
}

function showAbnormalInfo(batchId: string, batchName: string) {
  showInfo.value = "";
  showTableInfo.value = "display:none";
  batchParams.value.batchId = batchId;
  batchNameStr.value = batchName;
  errorInfos(batchParams.value).then((res: any) => {
    batchInfoTable.value = res.data;
  })
}

function backTable() {
  showInfo.value = "display:none";
  showTableInfo.value = "";
}

function backClassTable() {
  showNotUploadTable.value = "display:none";
  showClassTable.value = "";
  showMissExamStuds.value = "display:none";
}

function changeButton2() {
  showClassTable.value = "";
  showClassTableButton.value = "";
  showTable.value = "display:none";
  showTableButton.value = "display:none";
  showNotUploadTable.value = "display:none";
  showMissExamStuds.value = "display:none";
}

function del(examNo: string, batchId: string, errorId: string) {
  delBatchInfo.value = true;
  batchDelParams.value.subName = queryParams.value.subName;
  batchDelParams.value.examId = queryParams.value.examId;
  batchDelParams.value.batchId = batchId;
  batchDelParams.value.examNo = examNo;
  batchDelParams.value.errorId = errorId;
}

function delBatchId() {
  delBatchInfo.value = false;
  deleteErrorInfo(batchDelParams.value).then((res: any) => {
    if (res.success) {
      showAbnormalInfo(batchParams.value.batchId, batchNameStr.value);
      ElMessage.success('删除成功')
      getList();
      getCountNum();
    } else {
      ElMessage.error('删除失败')
    }
  })
}

function exportStudTemplate() {
  studentDetailExport(queryParams.value).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '缺考及未上传学生名单.xls')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

function notUploadStuds(className: string) {
  const notUploadStudsParam = ref<any>({
    examId: examId,
    schoolId: schoolId,
    subName: subName,
    className: className,
  });
  getNotUploadStuds(notUploadStudsParam.value).then((res: any) => {
    notUploadTableStuds.value = res.data;
    showNotUploadTable.value = "";
    showMissExamStuds.value = "display:none";
    showClassTable.value = "display:none";
  })
}

function getMissExamStuds(className: string) {
  missExamStudsParam.value.className = className;
  getMissStud();
}

function getMissStud() {
  getMissExamStudsApi(missExamStudsParam.value).then((res: any) => {
    missExamStuds.value = res.eExamStudentVos;
    missTotal.value = res.countNum;
    showNotUploadTable.value = "display:none";
    showMissExamStuds.value = "";
    showClassTable.value = "display:none";
  })
}

function showStudImg(examNo: string) {
  const getImgParam = ref<any>({
    examId: examId,
    examNo: examNo,
    subName: subName,
    imgType: 3
  });
  getExamStuImgsByType(getImgParam.value).then((res: any) => {
    console.log(res);
    eExamMarkImagesList.value = res.eExamMarkImagesList;
    showStudImgs.value = true;
  });
}

function changeStudentStatus() {
  changeStudImgStatus(changeStudParam.value).then((res: any) => {
    showChangeStud.value = false;
    getMissExamStuds(missExamStudsParam.value.className);
    getClassAllInfo();
    getCountNum();
    if (res.success) {
      ElMessage.success('修改成功')
    } else {
      ElMessage.success('修改失败')
    }
  });
}

function changeStatus(examNo: string) {
  changeStudParam.value.examNo = examNo;
  showChangeStud.value = true;
}

onMounted(() => {
  getList();
  getCountNum();
  getClassAllInfo()
  getClassInfo();
})
</script>

<style lang="scss" scoped>
@import "./src/style/scanMonitor/scanMonitor";
</style>
