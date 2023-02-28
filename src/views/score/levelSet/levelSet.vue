<template>
    <div>
        <div slot="header">

            <div style="display: flex;justify-content: left; float: left;height: 52px;">
                <span class="fontwidth">科目</span>
                        <el-radio-group v-model="subjectId" @change="changeSub">
                            <el-radio v-for="item in subList" :key="item.id" :label="item.id">
                                <span style="font-size:12px">{{item.subName}}</span>
                            </el-radio>
                        </el-radio-group>

            </div>
            <div style="display: flex;justify-content: right">
                <span class="operate-btn" :style="{'margin-right': dataList.length === 0 ? '0' :'15px'}">
                    <el-button v-show="dataList.length === 0" class="btn" @click="toAddLevel('添加')">添加等级设置</el-button>
                </span>
                <span v-if="dataList.length > 0" class="operate-btn">
                    <el-button class="btn" @click="toAddAnotherSub()">同步其他科目</el-button>
                </span>
            </div>

            <div class="clearfix"  style="background-color: #F8FBFF;margin-top: -18px;">
                <span style="font-size: 14px; line-height: 60px;padding-left: 13px;" v-if="dataList.length !== 0">等级数：{{setNum}}</span>
                <span style="float: right;margin-top: 15px;" v-if=" dataList.length!== 0" >
                    <el-button @click="toUpdate('编辑')" round style="font-size: 13px;width:100px; margin-bottom: 10px;color:#4381E5 ; border-color:#4381E5;  ">编辑</el-button>
                </span>
                <div v-if=" dataList.length === 0">
                    <div style="text-align: center;margin-top: 50px;height: 700px;">
                        <img style="display: inline-block; position: relative; margin-top: 200px;" src="@/assets/nullStatus.png" alt=""><br>
                        <span style="height: 22px; font-size: 12px; color: #808080; line-height: 22px; text-align: center;">尚未设置等级</span>
                    </div>
                   <!-- <div style="height: 22px; font-size: 12px; color: #808080; line-height: 22px; text-align: center;">
                        尚未设置等级！
                    </div>-->
                </div>
                <el-table v-else :data="dataList" style="width: 100%;margin-left: 0;"
                    :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
                    :cell-style="{'text-align': 'center',}" stripe :border="dataList && dataList.length > 0"
                    default-expand-all>
                    <el-table-column prop="gradeName" label="等级名称" />
                    <el-table-column prop="scoreType" label="等级类型">
                        <template #default="scope">
                            <span v-if="scope.row.scoreType !== 0">分数</span>
                            <span v-else>比例</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="score" label="数值">
                        <template #default="scope">
                            <span v-if="scope.row.scoreType !== 0">{{scope.row.score}} 分</span>
                            <span v-else>{{scope.row.score}}%</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!--等级设置弹窗-->
            <Dialog :title="addLevelTitle" @commitBtn="addLevelVisible = false" :visible="addLevelVisible"
                :width="'800px'" :before-close="beforeClose">
                <template #content>
                    <el-form :model="leveltForm" :rules="rules" label-width="85px" :label-position="'left'">
                        <el-form-item label="选择科目">
                            <el-radio-group v-model="leveltForm.subjectId">
                                <el-radio v-for="item in subList" :key="item.id" :label="item.id">
                                    {{item.subName}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="等级数:">
                            <el-input v-model="leveltForm.gradeOrder" @input="changeNum"
                                oninput="if(value>100)value=100" placeholder="请输入" style="width: 200px;height: 32px" />
                        </el-form-item>

                        <el-form-item label="等级类型">
                            <el-radio-group v-model="typeRadio" @change="changeType()">
                                <el-radio label="0">比例</el-radio>
                                <el-radio label="1">分数</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-table :data="levelDataList" tyle="width: 100%"
                                :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
                                :cell-style="{'text-align': 'center',}" border stripe>
                                <el-table-column prop="gradeName" label="等级名称">
                                    <template #default="scope">
                                        {{scope.row.gradeName}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="scoreType" label="等级类型">
                                    <template #default="scope">
                                        <span v-if="~~typeRadio !== 0 ">分数</span>
                                        <span v-else>比例</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="score" label="数值">
                                    <template #default="scope">
                                        <el-input v-if="~~typeRadio !== 0 " v-model="scope.row.score" placeholder="请输入"
                                            style="width: 80px;">{{scope.row.score }}</el-input>
                                        <!--                                   -->
                                        <el-input v-else v-model="scope.row.score" placeholder="请输入"
                                            style="width: 80px;"></el-input>

                                        <span v-if="typeRadio=== 0 ||  typeRadio === '0' "> %</span>
                                        <span v-else> 分</span>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </el-form-item>

                    </el-form>
                </template>

                <template #footer>
                    <span class="dialog-footer">
                        <el-button style="width: 100px; height: 32px" type="primary" @click="addLevelVisible = false">取消
                        </el-button>

                        <el-button style="width: 100px; height: 32px" type="primary" @click="addLevelData()">确定
                        </el-button>
                    </span>
                </template>
            </Dialog>

            <!--同步其他科目-->
            <Dialog :title="'同步其他科目'" @commitBtn="anotherSubVisible = false"
                :visible="anotherSubVisible" :width="'600px'" :before-close="beforeCloseSub">
                <template #content>
                    <span style="float: left;">请选择将<span
                            style="color:#4381E5;">&nbsp;{{anotherSubTitle}}&nbsp;</span>学科等级规则同步到下列其他科目</span><br>
                    <el-form :model="anotherSubFrom" :rules="rules" label-width="85px" :label-position="'left'">
                        <el-checkbox :indeterminate="isIndeterSubject" v-model="checkAllSubject"
                            @change="handleCheckAllSubjectChange">全选
                        </el-checkbox>
                        <el-checkbox-group v-model="anotherSubFrom.anotherSubIds"
                            @change="handleCheckedCitiesSubjectChange">
                            <el-checkbox v-for="subject in subjects" v-show="anotherSubTitle !== subject.subName"
                                :label="subject.id" :key="subject.id">
                                <span> {{subject.subName}}</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form>
                </template>

                <template #footer>
                    <span class="dialog-footer">
                        <el-button style="width: 100px; height: 32px" type="primary" @click="anotherSubVisible = false">
                            取消</el-button>

                        <el-button style="width: 100px; height: 32px" :disabled="subjects.length === 1" type="primary" @click="addAnotherSubSet()">确定
                        </el-button>
                    </span>
                </template>
            </Dialog>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { findRepublicSubListByExamId } from "@/api/exam";
import { ElMessage } from 'element-plus'
import { gradeScoreJunior, saveGradeScoreJunior, saveAnotherSubSet } from "@/api/analysis";
import router from "@/router";
const route = useRoute()
const examId: any = route.query.examId
const dataList = ref([])
const typeRadio = ref<any>('')
const subjectId = ref<any>('')
const subList = ref<any[]>([])
const setNum = ref<any>('')
const subjectOptions = ref<any>([]);
const levelDataList = ref([])
const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
    'AAA', 'AAB', 'AAC', 'AAD', 'AAE', 'AAF', 'AAG', 'AAH', 'AAI', 'AAJ', 'AAK', 'AAL', 'AAM', 'AAN', 'AAO', 'AAP', 'AAQ', 'AAR', 'AAS', 'AAT', 'AAU', 'AAV', 'AAW', 'AAX', 'AAY', 'AAZ',
    'AAAA', 'AAAB', 'AAAC', 'AAAD', 'AAAE', 'AAAF', 'AAAG', 'AAAH', 'AAAI', 'AAAJ', 'AAAK', 'AAAL', 'AAAM', 'AAAN', 'AAAO', 'AAAP', 'AAAQ', 'AAAR', 'AAAS', 'AAAT', 'AAAU', 'AAAV', 'AAAW', 'AAAX', 'AAAY', 'AAAZ'];
const addLevelVisible = ref<boolean>(false)
const levelTitle = '等级设置'
const addLevelTitle = ref<string>('')
const anotherSubVisible = ref<boolean>(false)
const anotherSubTitle = ref<string>('')


class levelInfo {
    examId: any
    gradeName: any
    subjectId: any
    gradeOrder: any
    scoreType: any
    dataList: any
}

class anotherSubInfo {
    examId: any
    subjectId: any
    anotherSubIds: any
}

let funcom = (row: any) => {
    console.log(row);
    return row * 100
}


const data = reactive({
    queryParams: {
        examId: ref<any>(''),
        subId: ref<any>('')
    },
    leveltForm: new levelInfo(),
    routerStudentParam: {
        examId: ref<any>('')
    },
    isIndeterSubject: ref<boolean>(false),
    checkAllSubject: ref<boolean>(false),
    subjects: subjectOptions,

    anotherSubFrom: new anotherSubInfo()
})

const { queryParams, leveltForm, routerStudentParam, isIndeterSubject, checkAllSubject, subjects, anotherSubFrom } = toRefs(data)
onMounted(() => {
    queryParams.value.examId = examId
    listSubList()
})

function changeSub() {
    getJunior(queryParams.value)
}
/**
 * 查询列表
 * @param data
 */
function listSubList() {
    findRepublicSubListByExamId(examId).then((res: any) => {
        if (res.success) {
            let num = 0
            subList.value = res.data
            subjectOptions.value = res.data
            queryParams.value.examId = examId
            res.data.forEach((val: any) => {
                if (num <= 0) {
                    if (!subjectId.value) {
                        subjectId.value = val.id
                    }
                    queryParams.value.subId = subjectId
                }
                num++
            })
            getJunior(queryParams.value)
            //ElMessage.success('科目查询成功')
        } else {
            ElMessage.error(res.message)
        }
    })
}

function getJunior(query: any) {
    queryParams.value.examId = examId
    queryParams.value.subId = subjectId
    gradeScoreJunior(queryParams.value).then((res: any) => {
        if (res.success) {
            dataList.value = res.data.levelDtos
            if (res.data) {
                setNum.value = res.data.setNumber
                leveltForm.value.gradeOrder = res.data.setNumber
                leveltForm.value.subjectId = subjectId
                if (res.data.type === 0) {
                    typeRadio.value = '0'
                } else {
                    typeRadio.value = '1'
                }
                console.log(typeRadio.value)
                levelDataList.value = res.data.levelDtos
            }
            //ElMessage.success('获取数据成功')
        } else {
            ElMessage.error(res.message)
        }
    })
}

function toAddLevel(text: string) {
    addLevelTitle.value = text +levelTitle
    addLevelVisible.value = true
    typeRadio.value = '0'
    leveltForm.value.scoreType = '0'
    leveltForm.value.gradeOrder = 5
    leveltForm.value.subjectId = subjectId
    changeNum(5)
}


function changeNum(val: any) {
    const arr = new Array(parseInt(val)).fill('')
    const arr2: any = []
    let i = 0;
    arr.forEach((value: any) => {
        arr2.push({
            gradeName: names[i],
            scoreType: typeRadio,
            gradeOrder: i,
            score: ''
        })
        i++
    })
    levelDataList.value = arr2
}

function addLevelData() {
    let aa = 0;
    levelDataList.value.forEach((value: any) => {
        if (!value.gradeName) {
            aa += 1;
        }
        if (!value.score) {
            aa += 1;
        }
    })
    if (aa > 0) {
        ElMessage.warning('等级名称和等级值不能为空！')
        return;
    }

    if (typeRadio.value === '0') {
        let total = 0;
        levelDataList.value.forEach((value: any) => {
            total = total + parseInt(value.score)
        })
        console.log(total)
        if (total != 100) {
            ElMessage.warning('设置失败，比例数值不应低于或高于100')
            return
        }
    }

    leveltForm.value.examId = examId
    leveltForm.value.scoreType = typeRadio
    leveltForm.value.dataList = levelDataList
    saveGradeScoreJunior(leveltForm.value).then((res: any) => {
        if (res.success) {
            //ElMessage.success('获取数据成功')
            addLevelTitle.value = levelTitle
            addLevelVisible.value = false
            listSubList()
            getJunior(queryParams.value)
        } else {
            ElMessage.error(res.message)
        }
    })
}

function beforeClose() {
    addLevelTitle.value = levelTitle
    addLevelVisible.value = false
    checkAllSubject.value = false
    leveltForm.value = new levelInfo()
}

function beforeCloseSub() {
    anotherSubVisible.value = false
    anotherSubFrom.value = new anotherSubInfo()
}

function toUpdate(text: string) {
    addLevelTitle.value = text +levelTitle
    console.log(typeRadio.value)
    queryParams.value.examId = examId
    queryParams.value.subId = subjectId
    getJunior(queryParams.value)
    addLevelVisible.value = true
}

function changeType() {
    changeNum(leveltForm.value.gradeOrder)
}

function toFilterStudent() {
    routerStudentParam.value.examId = examId
    router.push({ path: '/score/filterStudent', query: routerStudentParam.value })
}

function toScoreSet() {
    routerStudentParam.value.examId = examId
    router.push({ path: '/score/scoreSet', query: routerStudentParam.value })
}

function handleCheckAllSubjectChange(val: boolean) {
    // anotherSubFrom.value.anotherSubIds = val ? subjectOptions.value.map((val: any) => { return val.id }) : [];
    // console.log(subjectOptions.value)
    // isIndeterSubject.value = false;

    anotherSubFrom.value.anotherSubIds = val ? subjectOptions.value.filter((val: any) => {
        return val.subName !== anotherSubTitle.value
    }).map((val: any) => {
        return val.id
    }) : [];
    console.log(anotherSubFrom.value.anotherSubIds)
    isIndeterSubject.value = false;

}

function handleCheckedCitiesSubjectChange(value: any) {
    let checkedSubjectCount = value.length;
    checkAllSubject.value = checkedSubjectCount === subjects.value.length-1;
    isIndeterSubject.value = checkedSubjectCount > 0 && checkedSubjectCount < subjects.value.length-1;
}

function toAddAnotherSub() {
    console.log(subjectId.value)
    const ins = subList.value.findIndex((res: any) => {
        return res.id === subjectId.value
    })
    if (ins > -1) {
        anotherSubTitle.value = subList.value[ins].subName
    }

    anotherSubVisible.value = true
    checkAllSubject.value = false;
    anotherSubFrom.value = new anotherSubInfo()

}

function addAnotherSubSet() {
    if (!anotherSubFrom.value.anotherSubIds) {
        ElMessage.warning('请勾选同步科目')
        return
    }
    anotherSubFrom.value.examId = examId
    anotherSubFrom.value.subjectId = subjectId
    saveAnotherSubSet(anotherSubFrom.value).then((res: any) => {
        if (res.success) {
            ElMessage.success('科目等级设置同步成功')
            anotherSubVisible.value = false
            listSubList()
            getJunior(queryParams.value)
        } else {
            ElMessage.error(res.message)
        }
    })
}
</script>

<style scoped lang="scss">
.fontwidth{
    font-size: 12px;
    color: #202020;
    padding-right: 10px;
    line-height: 52px;
}
:deep(.el-table) {
    thead.is-group tr:nth-child(2) .el-table__cell {
        left: 0 !important;
    }

}
:deep(.el-form-item__content){
    margin-left: 0 !important;
}
:deep(.el-dialog__body){
   .el-form-item--default:nth-last-child(1){
        margin-bottom: 0 !important;
    }
}


.card-title {
    margin-bottom: 16px;
    height: 22px;

    .title {
        font-size: 16px;
        font-weight: bold;
        color: #202020;
        line-height: 22px;
        margin-right: 20px;
    }
}

.operate-btn {
    line-height: 22px;
    display: flex;
    justify-content: right;
    align-items: center;
    margin-bottom: 12px;
    text-align: right;

    .text {
        font-size: 14px;
        color: #4381E5;
        line-height: 22px;
        margin-left: 5px;
    }

    .img {
        width: 20px;
        height: 20px;
    }
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
.btn {
    background-color: #4381E5;
    color: #FFFFFF;
    font-size: 12px;
    width: 100px;
}

.table-header {
    background: #D3E0F4;
    text-align: center;
}
</style>
