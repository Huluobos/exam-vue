<template>
    <div>
        <div slot="header">
            <div style="display: flex; justify-content: left; float: left; height: 52px;">
                <span class="fontwidth">科目</span>
                <el-radio-group v-model="subjectId" @change="changeSub">
                    <el-radio v-for="item in subList" :key="item.id" :label="item.id" >
                       <span style="font-size: 12px;">{{item.subName}}</span>
                    </el-radio>
                </el-radio-group>

            </div>
            <div style="text-align: right;">
                <el-button v-show="dataList.length === 0" class="btn"  @click="toAddScoreSet('添加')">添加赋分设置</el-button>
                <!--<el-button class="btn" v-else @click="toAddScoreSet('添加')">添加赋分设置</el-button>-->
                <el-button v-show=" dataList.length > 0" class="btn" @click="toAddAnotherSub()">同步其他科目</el-button>
                <el-button style="margin-left: 10px;" class="btn" @click="toOpenScoreSet()">导入</el-button>
            </div>
            <div class="clearfix" style="background-color: #F8FBFF;margin-top: -18px;">
                <span v-if=" dataList.length > 0" style="font-size: 14px;line-height: 60px;padding-left: 13px;">
                   <span style="margin-right:40px ;font-size: 14px;font-weight: bold;">赋分设置:{{gradeType}}</span>
                   <span v-show="gradeType !=='学考等级'"  style="margin-right:40px ;font-size: 14px;" >赋分方式：{{scoreFangShi}}</span>
                   <span style="margin-right:40px ;font-size: 14px;" > 赋分类型:{{scoreType}}</span>
                </span>
                <span v-if="dataList.length > 0" style="float: right; margin-top: 15px; margin-right: 10px;">
                    <el-button @click="toUpdate('编辑')" round style="font-size: 13px; width: 100px; border-color: #4381e5; margin-bottom: 10px; color: #4381e5;">编辑</el-button>
                   <el-button @click="todelete()" round style="font-size: 13px; border-color: #4381e5; width: 100px; margin-bottom: 10px; color: red;">删除</el-button>

                </span>
                <div v-if="dataList.length === 0">
                    <div style="text-align: center; margin-top: 50px; height: 700px;">
                        <img style="display: inline-block; position: relative; margin-top: 200px;" src="@/assets/nullStatus.png" alt=""><br>
                        <span style="height: 22px; font-size: 12px; color: #808080; line-height: 22px; text-align: center;"> 尚未设置赋分等级</span>
                    </div>
                    <!--<div style="height: 22px; font-size: 12px; color: #808080; line-height: 22px; text-align: center;">
                        尚无赋分设置！
                    </div>-->
                </div>
                <el-table v-else :data="dataList" style="width: 100%;"
                          :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
                          :cell-style="{'text-align': 'center',}" stripe :border="dataList && dataList.length > 0"
                          default-expand-all>
                    <el-table-column prop="gradeName" label="等级名称" />
                    <el-table-column prop="gradeValue" label="数值">
                        <template #default="scope">
                            <span v-if="typeRadio=== 0 ||  typeRadio === 0 ">{{scope.row.gradeValue || ''}}%</span>
                            <span v-if="typeRadio=== 1 ||  typeRadio === 1 ">{{scope.row.gradeValue || ''}}分</span>
                            <span v-if="typeRadio=== 2 ||  typeRadio === 2 ">{{scope.row.gradeValue || ''}}人</span>

                            <!--<span v-if="typeRadio !== 0">{{scope.row.gradeValue || ''}}</span>
                            <span v-else>{{scope.row.gradeValue || ''}}%</span>-->
                        </template>
                    </el-table-column>

                    <el-table-column prop="assignMinValue" label="赋分分值">
                        <template #default="scope">
                            <span v-if="scope.row.assignMaxValue && scope.row.assignMinValue">
                                <el-input disabled placeholder="请输入" type="text" style="width: 80px;"
                                          v-model.number="scope.row.assignMinValue"></el-input>
                                -<el-input disabled placeholder="请输入" type="text" style="width: 80px;"
                                           v-model.number="scope.row.assignMaxValue"></el-input>
                            </span>
                            <span v-else>
                                <el-input v-if=" gradeType == '等级赋分' " disabled placeholder="" type="text" style="width: 80px;"
                                          v-model="scope.row.score">
                                </el-input>
                                <el-input v-if="scope.row.score == -1 && gradeType == '学考等级' " disabled placeholder="A" type="text" style="width: 80px;"
                                >
                                </el-input>
                                <el-input v-if="scope.row.score == -2 && gradeType == '学考等级' " disabled placeholder="B" type="text" style="width: 80px;"
                                >
                                </el-input>
                                <el-input v-if="scope.row.score == -3 && gradeType == '学考等级' " disabled placeholder="C" type="text" style="width: 80px;"
                                >
                                </el-input>
                                <el-input v-if="scope.row.score == -4 && gradeType == '学考等级' " disabled placeholder="D" type="text" style="width: 80px;"
                                >
                                </el-input>
                                <el-input v-if="scope.row.score == -5  && gradeType == '学考等级' " disabled placeholder="E" type="text" style="width: 80px;"
                                >
                                </el-input>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 赋分设置弹窗-->
            <Dialog :title="addLevelTitle" @commitBtn="addScoreSetVisible = false" :visible="addScoreSetVisible"
                    :width="'800px'" :before-close="beforeClose">
                <template #content>
                    <el-form :model="scoreSetForm" :rules="rules" label-width="85px" :label-position="'left'">
                        <el-form-item label="赋分设置">
                            <el-radio-group v-model="scoreSetForm.gradeType" @change="changeGradeType()">
                                <el-radio v-for="item in gradeTypeList" :key="item.value" :label="item.value">
                                    {{item.label}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="选择科目">
                            <el-radio-group v-model="scoreSetForm.subjectId" @change="changeAddSub">
                                <el-radio v-for="item in subList" :key="item.id" :label="item.id">
                                    {{item.subName}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-row class="mb-10">
                            <el-col :span="6" v-if="scoreSetForm.gradeType === 1">
                                <el-form-item prop="type">
                                    <el-select style="width: 100%;" v-model="scoreSetForm.chooseType"
                                               @change="changeChooseType()" placeholder="选择赋分方式" clearable>
                                        <el-option v-for="chType in chooseTypeList " :key="chType.value"
                                                   :label="chType.label" :value="chType.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="type">
                                    <el-select style="width: 100%;" v-model="typeRadio" placeholder="" clearable>
                                        <el-option v-for="scType in scoreTypeList" :key="scType.value"
                                                   :label="scType.label" :value="scType.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item>
                                    <el-button type="primary" style="margin-left: 20px;" @click="addEachBtn">添加</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-form-item>
                            <el-table :data="scoreSetDataList" height="250" style="width: 100%;"
                                      :header-cell-style="{'background': '#D3E0F4','text-align': 'center', 'color': '#202020','font-size': '14px'}"
                                      :cell-style="{'text-align': 'center',}" border stripe v-loading="loadingStatus"
                                      ref="table">
                                <el-table-column prop="gradeName" label="等级名称">
                                    <template #default="scope">
                                        <el-input v-if="gradeType == '学考等级'" v-model="scope.row.gradeName" placeholder="请输入" style="width: 80px;">
                                            {{scope.row.gradeName}}
                                        </el-input>

                                        <el-input v-else v-model="scope.row.gradeName" placeholder="请输入" style="width: 80px;">
                                            {{scope.row.gradeName}}
                                        </el-input>
                                        <!--{{scope.row.gradeName}}-->
                                    </template>
                                </el-table-column>

                                <el-table-column prop="score" label="数值">
                                    <template #default="scope">
                                        <el-input v-if="typeRadio !== 0 &&  typeRadio !== 0 "
                                                  v-model="scope.row.gradeValue" placeholder="请输入" style="width: 80px;">
                                            {{scope.row.gradeValue }}
                                        </el-input>

                                        <el-input v-if="typeRadio=== 0 ||  typeRadio ===0 "
                                                  v-model="scope.row.gradeValue" placeholder="请输入" style="width: 80px;">
                                            {{scope.row.gradeValue}}
                                        </el-input>
                                        <span v-if="typeRadio=== 0 ||  typeRadio === 0 ">%</span>
                                        <span v-if="typeRadio=== 1 ||  typeRadio === 1 ">分</span>
                                        <span v-if="typeRadio=== 2 ||  typeRadio === 2 ">人</span>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="assignMinValue" label="赋分分值" width="200px;">
                                    <template #default="scope">
                                      <span v-if="scoreSetForm.gradeType === 1 && (scoreSetForm.chooseType === 1 || scoreSetForm.chooseType === 2)">
                                            <el-input placeholder="请输入" type="text" style="width: 80px;"
                                                      v-model.number="scope.row.assignMinValue"></el-input>
                                            -<el-input placeholder="请输入" type="text" style="width: 80px;"
                                                       v-model.number="scope.row.assignMaxValue"></el-input>
                                        </span>
                                        <span v-else>
                                            <el-input v-if=" gradeType === '等级赋分' " placeholder="请输入" type="text" style="width: 80px;"
                                                      v-model="scope.row.score">
                                            </el-input>
                                            <span v-if="gradeType === '学考等级' " >
                                                <el-select style="width: 100px;" v-model="scope.row.score"  placeholder="" clearable>
                                                <el-option v-for="(type, i ) in gradeTypeEach" :key="i" :label="type.label"
                                                           :value="type.value" />
                                                </el-select>
                                            </span>
                                            <!--<el-input v-if="scope.row.score == -1 && gradeType == '学考等级' "  placeholder="" type="text" style="width: 80px;"
                                                      v-model="scope.row.scoreCopy ">
                                            >
                                             </el-input>
                                            <el-input v-if="scope.row.score == -2 && gradeType == '学考等级' "  placeholder="" type="text" style="width: 80px;"
                                                      v-model="scope.row.scoreCopy">
                                            >
                                            </el-input>
                                            <el-input v-if="scope.row.score == -3 && gradeType == '学考等级' "  placeholder="" type="text" style="width: 80px;"
                                                      v-model="scope.row.scoreCopy">
                                             >
                                            </el-input>
                                            <el-input v-if="scope.row.score == -4 && gradeType == '学考等级' "  placeholder="" type="text" style="width: 80px;"
                                                      v-model="scope.row.scoreCopy">
                                            >
                                            </el-input>
                                            <el-input v-if="scope.row.score == -5  && gradeType == '学考等级' "  placeholder="" type="text" style="width: 80px;"
                                                      v-model="scope.row.scoreCopy">
                                            >
                                            </el-input>-->
                                        </span>
                                    </template>
                                </el-table-column>

                                <el-table-column label="操作">
                                    <template #default="scope">
                                        <el-button type="text" style="color: red;" @click="deleteScoreSet(scope)">删除
                                        </el-button>

                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>

                    </el-form>
                </template>

                <template #footer>
                    <span class="dialog-footer">
                        <el-button style="width: 100px; height: 32px;" type="primary"
                                   @click="cacelSet()">取消</el-button>

                        <el-button style="width: 100px; height: 32px;" type="primary" @click="addScoreSetData()">确定
                        </el-button>
                    </span>
                </template>
            </Dialog>

<!--            <Dialog v-if="addEachVisible" :title="'添加赋分等级'" @commitBtn="addEachVisible = false"-->
<!--                    :visible="addEachVisible" width="500px" :before-close="beforeCloseEach">-->
<!--                <template #content>-->
<!--                    <el-form class="textJustify_form" :model="eachForm" label-width="120px" :label-position="'left'">-->
<!--                        <el-form-item label="等级名称">-->
<!--                            <el-input placeholder="请输入" style="width: 180px" v-model.number="eachForm.gradeName">-->
<!--                            </el-input>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="赋分类型">-->
<!--                            <el-radio-group v-model="eachForm.gradeValueType">-->
<!--                                <el-radio :label="'百分比'">百分比</el-radio>-->
<!--                                <el-radio :label="'分数'">分数</el-radio>-->
<!--                                <el-radio v-show="scoreSetForm.chooseType === 3 || scoreSetForm.chooseType === 4 " :label="'人数'">人数</el-radio>-->

<!--                            </el-radio-group>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="百分比/划线分值">-->
<!--                            <el-input placeholder="请输入" style="width: 180px;" v-model.number="eachForm.gradeValue">-->
<!--                            </el-input>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="赋值成绩">-->
<!--                            <span v-if="scoreSetForm.gradeType === 2 || scoreSetForm.gradeType === '2'">-->
<!--                                <el-select style="width:180px" v-model="eachForm.score" placeholder="" clearable>-->
<!--                                    <el-option v-for="type in gradeTypeEach" :key="type.value" :label="type.label"-->
<!--                                               :value="type.value" />-->
<!--                                </el-select>-->
<!--                            </span>-->
<!--                            <span v-else>-->
<!--                                <span v-if="isTwo">-->
<!--                                  <el-input v-if="isTwo" placeholder="请输入" style="width: 84px;"-->
<!--                                              v-model="eachForm.assignMinValue"></el-input>-->
<!--                                    - -->
<!--                                      <el-input v-if="isTwo" placeholder="请输入" style="width: 84px;"-->
<!--                                              v-model="eachForm.assignMaxValue"></el-input>-->
<!--                                </span>-->
<!--                                <span v-if="!isTwo">-->
<!--                                    <el-input placeholder="请输入" style="width: 180px;" v-model.number="eachForm.score">-->
<!--                                    </el-input>-->
<!--                                </span>-->
<!--                            </span>-->
<!--                        </el-form-item>-->

<!--                    </el-form>-->
<!--                </template>-->

<!--                <template #footer>-->
<!--                    <span class="dialog-footer">-->
<!--                        <el-button style="width: 100px; height: 32px" type="primary" @click="beforeCloseEach">取消-->
<!--                        </el-button>-->

<!--                        <el-button style="width: 100px; height: 32px" type="primary" @click="addEachSubmit">确定-->
<!--                        </el-button>-->
<!--                    </span>-->
<!--                </template>-->
<!--            </Dialog>-->


            <!--同步其他科目-->
            <Dialog :title="'同步其他科目'" @commitBtn="anotherSubVisible = false"
                    :visible="anotherSubVisible" :width="'600px'" :before-close="beforeCloseSub">
                <template #content>
                    <span style="float: left;">请选择将<span
                        style="color: #4381e5;">&nbsp;{{anotherSubTitle}}&nbsp;</span>学科等级规则同步到下列其他科目</span><br>
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
                        <el-button style="width: 100px; height: 32px;" type="primary" @click="anotherSubVisible = false">
                            取消</el-button>

                        <el-button style="width: 100px; height: 32px;" :disabled="subjects.length === 1" type="primary" @click="addAnotherSubSet()">确定
                        </el-button>
                    </span>
                </template>
            </Dialog>


            <el-dialog v-if="scoreSetDialogVisible" v-model="scoreSetDialogVisible" title="导入赋分等级" width="750px"
                       height="500px;">
                <div style="display: flex; justify-content: space-between;">
                    <div style="line-height: 32px;" class="flex-align-center">
                        <span style="color: red;" class="flex-align-center">
                            <!--<img src="../../../assets/hint-red.png" style="width: 20px;height: 20px" alt="">-->
                            提示
                        </span>
                        <span style="color: #202020;"> 请下载模板，并按照模板格式填写后，再导入数据。</span>
                    </div>
                    <div style="display: flex;">
                        <el-button
                            style="width: 95px; height: 32px; color: #202020; border: 1px solid #d5dae5; margin-right: 10px;"
                            color="#ECF4FF" @click="exportScoreSetTemplate">
                            下载模板
                        </el-button>
                        <el-upload name="uploadFile" :action="uploadUrl" :limit="1" :headers="headers"
                                   :data="uploadData" :before-upload="beforeUploadFunction" :on-success="uploadBtnClick"
                                   accept=".xlsx,.xls" :show-file-list="false">
                            <el-button type="primary" style="width: 95px; height: 32px; color: white;" color="#4381E5">导入数据
                            </el-button>
                        </el-upload>
                    </div>
                </div>
                <!--<div class="mt-10">
				  <img src="../../../assets/updateStudentNo.png" alt="">
				</div>-->
                <div class="mt-10">
                    <div style="height: 48px; display: flex; align-items: flex-start;">
                        <span style="color: orange; line-height: 24px;" class="flex-align-center">
                            说明：
                        </span>
                        <span>
                            <span style="line-height: 24px;">1.导入将会删除旧数据!</span><br />
                            <span>2.等级名称、赋分类型、数值、赋分分值都不能为空</span>
                        </span>
                    </div>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script setup lang="ts">
    import { ref, triggerRef } from "vue";
    import { ElMessage } from 'element-plus'
    import { findnotTotalSubListByExamId, getExamMessageById } from "@/api/exam";
    import {
        deleteSubScoreSet,
        downloadScoreSetTemp,
        gradeScoreJunior,
        queryGradeScoreSet, saveAnotherSubScoreSet,
        saveAnotherSubSet,
        saveGradeScoreSet,
        saveGradeScoreSetXue
    } from "@/api/analysis";
    import { importFilterStudent, importScoreSet } from "@/api/file";
    import { useUserStoreWithOut } from "@/store/modules/user";

    class anotherSubInfo {
        examId: any
        subjectId: any
        anotherSubIds: any
    }

    class eachType {
        gradeName: any
        gradeValueType: any
        gradeValue: any
        assignMaxValue: any
        assignMinValue: any
        score: any
    }
    const levelTitle = '赋分设置'
    const addLevelTitle = ref<string>('')

    const uploadUrl = importScoreSet
    const scoreSetDialogVisible = ref<boolean>(false)
    const route = useRoute()
    const examId: any = route.query.examId
    const gradeType = ref<any>('')
    const scoreFangShi = ref<any>('')
    const examMode = ref<any>('')
    const scoreType = ref<any>('')
    const subjectId = ref<any>('')
    const choose = ref<any>('')
    const dataList = ref([])
    const subList = ref<any[]>([])
    const subjectOptions = ref<any>([]);
    const table = ref<any>(); //表标
    const scoreSetDataList = ref<any[]>([])
    const token = useUserStoreWithOut().getToken
    //3+1+2
    const options1 = ['A', 'B', 'C', 'D', 'E']
    const proportion1 = ['15', '35', '35', '13', '2']
    const max1 = ['100', '85', '70', '55', '40']
    const min1 = ['86', '71', '56', '41', '30']
    //6选3 区间
    const options2 = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E']
    const proportion2 = ['3', '7', '16', '24', '24', '16', '7', '3']
    const min2 = ['91', '81', '71', '61', '51', '41', '31', '21']
    const max2= ['100', '90', '80', '70', '60', '50', '40', '30']
    const addScoreSetVisible = ref<boolean>(false)

    const anotherSubVisible = ref<boolean>(false)

    const proportionZheJiang = ['1', '2', '3', '4', '5', '6', '7', '8', '7', '7', '7', '7', '7', '7', '6', '5', '4', '3', '2', '1', '1']

    const score3 = ['100', '97', '94', '91', '88', '85', '82', '79', '76', '73', '70', '67', '64', '61', '58', '55', '52', '49', '46', '43', '40']

    const naneZheJiang = ['A5', 'A4', 'A3', 'A2', 'A', 'B5', 'B4', 'B3', 'B2', 'B', 'C5', 'C4', 'C3', 'C2', 'C', 'D5', 'D4', 'D3', 'D2', 'D', 'E']
    const proportionTianJin = ['2', '3', '4', '5', '6', '7', '7', '7', '7', '7', '6', '6', '6', '6', '6', '5', '4', '3', '1', '1', '1']

    const options4 = ['A', 'B', 'C', 'D', 'E']

    const proportion4 = ['15', '30', '30', '20', '5']

    const score4 = [-1, -2, -3, -4, -5]


    const gradeTypeEach = [
        { value: -1, label: 'A' },
        { value: -2, label: 'B' },
        { value: -3, label: 'C' },
        { value: -4, label: 'D' },
        { value: -5, label: 'E' }
    ]
    const rules = reactive({})

    const typeRadio = ref<any>('')
    const anotherSubTitle = ref<string>('')

    class scoreSetInfo {
        examId: any
        gradeType: any
        subjectId: any
        chooseType: any
        scoreType: any
        dataList: any
    }


    const data = reactive({
        queryParams: {
            examId: ref<any>(''),
            subId: ref<any>('')
        },
        chooseTypeList: [{ value: 1, label: '3+1+2' }, { value: 2, label: '6选3(区间)' }, { value: 3, label: '6选3(分值)' },
            { value: 4, label: '7选3' }],
        scoreTypeList: [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }, { value: 2, label: '人数' }],
        gradeTypeList: [{ value: 1, label: '等级赋分' }, { value: 2, label: '学考等级' }],

        scoreSetForm: new scoreSetInfo(),

        anotherSubFrom: new anotherSubInfo(),
        subjects: subjectOptions,
        isIndeterSubject: ref<boolean>(false),
        checkAllSubject: ref<boolean>(false),
        loadingStatus: false,
        headers: {
            'Authorization': token
        },
        uploadData: {
            // 文件上传对象
            uploadData: {},
            subId: ref<any>(''),
            examId: ref<any>(''),
        },
    })

    const {
        queryParams, gradeTypeList, headers, chooseTypeList, scoreTypeList, scoreSetForm, anotherSubFrom, subjects,
        isIndeterSubject, checkAllSubject, uploadData
    } = toRefs(data)


    const beforeUploadFunction = () => {
        uploadData.value.subId = subjectId
        uploadData.value.examId = examId
    }

    const uploadBtnClick = (response: any,) => {
        if (response.success) {
            scoreSetDialogVisible.value = false
            getScoreSet(queryParams.value)
            ElMessage.success(response.message)
        } else {
            scoreSetDialogVisible.value = false
            ElMessage({ message: response.message, type: 'error', duration: 3000 })
            //location.reload()
        }
    }

    onMounted(() => {
        queryParams.value.examId = examId
        listSubList()
        getExamById()
    })

    function getExamById() {
        getExamMessageById(examId).then((res: any) => {
            if (res.success) {
                if (res.data) {
                    //scoreFangShi.value = res.data.chooseType
                    if (res.data.examMode === 1) {
                        chooseTypeList.value = []
                        ElMessage.error("传统模式不支持赋分设置")
                    } else if (res.data.examMode === 2) {
                        choose.value = 4
                        chooseTypeList.value = [{ value: 4, label: '7选3' }]
                        //scoreFangShi.value = '7选3'
                        examMode.value = 2
                    } else if (res.data.examMode === 3) {
                        choose.value = 2
                        chooseTypeList.value = [{ value: 2, label: '6选3(区间)' }, { value: 3, label: '6选3(分值)' }]
                        //scoreFangShi.value = '6选3(区间)'
                        examMode.value = 3
                    } else {
                        examMode.value = 4
                        choose.value = 1
                        chooseTypeList.value = [{ value: 1, label: '3+1+2' }]
                        //scoreFangShi.value = '3+1+2'
                    }
                }
            } else {
                ElMessage.error(res.message)
            }
        })
    }

    /**
     * 查询列表
     * @param data
     */
    function listSubList() {
        findnotTotalSubListByExamId(examId).then((res: any) => {
            if (res.success) {
                let num = 0
                subList.value = res.data
                subjectOptions.value = res.data
                queryParams.value.examId = examId
                res.data.forEach((val: any) => {
                    if (num <= 0) {
                        queryParams.value.subId = val.id
                        if (!subjectId.value) {
                            subjectId.value = val.id
                        }
                        //subjectId.value = val.id
                    }
                    num++
                })
                getScoreSet(queryParams.value)
                //ElMessage.success('科目查询成功')
            } else {
                ElMessage.error(res.message)
            }
        })
    }

    function toAddScoreSet(text: string) {
        scoreSetDataList.value = []
        addLevelTitle.value =  text+ levelTitle
        addScoreSetVisible.value = true
       // scoreSetForm.value.subjectId = subjectId
        //scoreSetForm.value.gradeType = 1
        scoreSetForm.value.scoreType = 0
        if (typeRadio.value){
            typeRadio.value = typeRadio.value
        }else{
            typeRadio.value = 0
        }
        scoreSetForm.value.chooseType = choose.value
        scoreSetForm.value.subjectId = subjectId.value
        gradeType.value = '等级赋分'
        changeChooseType()
    }

    function changeChooseType() {
        if (scoreSetForm.value.chooseType === 0){
            if(typeRadio.value === 1){
                changeNoScoreNum5(5)
            }
            changeNum5(5)
            scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }]
            gradeTypeList.value =  [{ value: 1, label: '等级赋分' }]
        }
        else if (scoreSetForm.value.chooseType === 1) {
            changeNum5(5)
            scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }]
            gradeTypeList.value =  [{ value: 1, label: '等级赋分' }]
            scoreSetForm.value.scoreType = 0
        } else if (scoreSetForm.value.chooseType === 2) {
            choose.value = 2
            typeRadio.value = 0
            scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }]
            gradeTypeList.value =  [{ value: 1, label: '等级赋分' }]
            changeNum8(8)
        } else if (scoreSetForm.value.chooseType === 3) {
            if (scoreSetForm.value.gradeType === 1){
                gradeType.value = '等级赋分'
                scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }, { value: 2, label: '人数' }]
                gradeTypeList.value = [{ value: 1, label: '等级赋分' }, { value: 2, label: '学考等级' }]
                typeRadio.value = 0
                choose.value = 3
                changeNumtianjin(21)
            }else{
                gradeType.value = '学考等级'
                changeNumXue(5)
                scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }]
            }
        } else if(scoreSetForm.value.chooseType === 4){
            if (scoreSetForm.value.gradeType === 1){
                gradeType.value = '等级赋分'
                scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }, { value: 2, label: '人数' }]
                changeNumZheJiang(21)
            }else{
                gradeType.value = '学考等级'
                changeNumXue(5)
                scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }]
            }

        }

    }

    function changeGradeType() {
        if (scoreSetForm.value.gradeType === 1) {
            gradeType.value = '等级赋分'
            scoreSetForm.value.chooseType = choose.value
            if (examMode.value === 2){
                changeNumZheJiang(21)
                scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }, { value: 2, label: '人数' }]
            }
            if (examMode.value === 3 && choose.value === 2){
                gradeTypeList.value = [{ value: 1, label: '等级赋分' }]
                changeNum8(8)
            }
            if (examMode.value === 3 && choose.value === 3){
                changeNumtianjin(21)
                scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }, { value: 2, label: '人数' }]
            }
            if(examMode.value === 4){
                scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }, { value: 2, label: '人数' }]
                changeNum5(5)
            }

            //scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }]
        }
        if (scoreSetForm.value.gradeType === 2) {
            typeRadio.value = 0
            gradeType.value = '学考等级'
            changeNumXue(5)
            if (scoreSetForm.value.chooseType === 1 || scoreSetForm.value.chooseType === 2){
                scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }]
            }else{
                scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }]
            }
        }
    }

    function changeNum5(val: any) {
        const arr = new Array(parseInt(val)).fill('')
        const arr2: any = []
        let i = 0;
        arr.forEach((value: any) => {
            arr2.push({
                gradeName: options1[i],
                scoreType: typeRadio,
                gradeOrder: i,
                gradeValue: proportion1[i],
                assignMaxValue: max1[i],
                assignMinValue: min1[i]
            })
            i++
        })
        scoreSetDataList.value = arr2
    }

    function changeNoScoreNum5(val: any) {
        const arr = new Array(parseInt(val)).fill('')
        const arr2: any = []
        let i = 0;
        arr.forEach((value: any) => {
            arr2.push({
                gradeName: options1[i],
                scoreType: typeRadio,
                gradeOrder: i,
                gradeValue: '',
                assignMaxValue: '',
                assignMinValue: ''
            })
            i++
        })
        scoreSetDataList.value = arr2
    }

    function changeNum8(val: any) {
        const arr = new Array(parseInt(val)).fill('')
        const arr2: any = []
        let i = 0;
        arr.forEach((value: any) => {
            arr2.push({
                gradeName: options2[i],
                scoreType: typeRadio,
                gradeOrder: i,
                gradeValue: proportion2[i],
                assignMaxValue: max2[i],
                assignMinValue: min2[i]
            })
            i++
        })
        scoreSetDataList.value = arr2
    }

    function changeNumtianjin(val: any) {
        const arr = new Array(parseInt(val)).fill('')
        const arr2: any = []
        let i = 0;
        let n = 1;
        arr.forEach((value: any) => {
            arr2.push({
                gradeName: naneZheJiang[i],
                scoreType: typeRadio,
                gradeOrder: i,
                gradeValue: proportionTianJin[i],
                score: score3[i],
                /*assignMaxValue:max2[i],
				assignMinValue:min2[i]*/
            })
            i++
            n++
        })
        scoreSetDataList.value = arr2
    }

    function changeNumZheJiang(val: any) {
        const arr = new Array(parseInt(val)).fill('')
        const arr2: any = []
        let i = 0;
        let n = 1;
        arr.forEach((value: any) => {
            arr2.push({
                gradeName: n,
                scoreType: typeRadio,
                gradeOrder: i,
                gradeValue: proportionZheJiang[i],
                score: score3[i],
                /*assignMaxValue:max2[i],
				assignMinValue:min2[i]*/
            })
            i++
            n++
        })
        scoreSetDataList.value = arr2
    }

    function changeNumXue(val: any) {
        const arr = new Array(parseInt(val)).fill('')
        const arr2: any = []
        let i = 0;
        arr.forEach((value: any) => {
            arr2.push({
                gradeName: options4[i],
                scoreType: typeRadio,
                gradeOrder: i,
                gradeValue: proportion4[i],
                score: score4[i]
            })
            i++
        })
        scoreSetDataList.value = arr2
    }

    function addScoreSetData() {
        scoreSetForm.value.examId = examId
        scoreSetForm.value.scoreType = typeRadio.value
        scoreSetForm.value.dataList = scoreSetDataList
        scoreSetForm.value.chooseType = choose.value
        // 判断是否学考
        if (scoreSetForm.value.gradeType === 2) {
          const boolean = scoreSetForm.value.dataList.every((obj: { gradeName: any; gradeValue: any; score: any;}) => {
            return obj.gradeName && obj.gradeValue && obj.score
          })
          if (!boolean) {
            ElMessage.warning("尚有数据未补充")
            return
          }
            saveGradeScoreSetXue(scoreSetForm.value).then((res: any) => {
                if (res.success) {
                    addLevelTitle.value = levelTitle
                    ElMessage.success('学考等级设置成功')
                    addScoreSetVisible.value = false
                    listSubList()
                } else {
                    ElMessage.error(res.message)
                    addScoreSetVisible.value = false
                    listSubList()
                }
            })
        }
        if (scoreSetForm.value.gradeType === 1 && (scoreSetForm.value.chooseType === 1 || scoreSetForm.value.chooseType === 2)) {
          //过滤数据
          const boolean = scoreSetForm.value.dataList.every((obj: { gradeName: any; assignMaxValue: any; gradeValue: any; assignMinValue: any; }) => {
            return obj.gradeName && obj.gradeValue && obj.assignMaxValue && obj.assignMinValue
          })
          if (!boolean) {
            ElMessage.warning("尚有数据未补充")
            return
          }
            saveGradeScoreSet(scoreSetForm.value).then((res: any) => {
                if (res.success) {
                    addLevelTitle.value = levelTitle
                    ElMessage.success('等级赋分设置成功')
                    addScoreSetVisible.value = false
                    listSubList()
                } else {
                    ElMessage.error(res.message)
                    addScoreSetVisible.value = false
                    listSubList()
                }
            })
        }
        if (scoreSetForm.value.gradeType === 1 && (scoreSetForm.value.chooseType === 3 || scoreSetForm.value.chooseType === 4)) {
          const boolean = scoreSetForm.value.dataList.every((obj: { gradeName: any; gradeValue: any; score: any; }) => {
            return obj.gradeName && obj.gradeValue && obj.score
          })
          if (!boolean) {
            ElMessage.warning("尚有数据未补充")
            return
          }
          saveGradeScoreSetXue(scoreSetForm.value).then((res: any) => {
                if (res.success) {
                    addLevelTitle.value = levelTitle
                    ElMessage.success('等级赋分设置成功')
                    addScoreSetVisible.value = false
                    listSubList()
                } else {
                    ElMessage.error(res.message)
                    addScoreSetVisible.value = false
                    listSubList()
                }
            })
        }

    }


    function getAddScoreSet(query: any) {
        queryParams.value.examId = examId
        queryParams.value.subId = scoreSetForm.value.subjectId
        subjectId.value = scoreSetForm.value.subjectId
        queryGradeScoreSet(queryParams.value).then((res: any) => {
            if (res.success) {
                if (res.data.dataList.length > 0) {
                    scoreSetForm.value.subjectId = subjectId.value
                    /*typeRadio.value = res.data.type*/
                    scoreSetDataList.value = res.data.dataList
                    const list = ['A','B+','B','C+','C','D+','D','E']
                    dataList.value = res.data.dataList
                    // dataList.value.sort(function (a: any,b:any) {
                    //     if (list.indexOf(a.gradeName) > -1 && list.indexOf(b.gradeName) > -1) {
                    //         return list.indexOf(a.gradeName) - list.indexOf(b.gradeName)
                    //     } else if (list.indexOf(a.gradeName)> -1 && !(list.indexOf(b.gradeName) > -1)) {
                    //         return 2
                    //     } else {
                    //         return 1
                    //     }
                    // })
                    if (res.data.gradeType === 1) {
                        gradeType.value = '等级赋分'
                    } else if (res.data.gradeType === 2) {
                        gradeType.value = '学考等级'
                    } else {
                        gradeType.value = ''

                    }
                    if (res.data.scoreType === 0) {
                        scoreType.value = '百分比'
                    } else if (res.data.scoreType === 1) {
                        scoreType.value = '分数'
                    } else if (res.data.scoreType === 2) {
                        scoreType.value = '人数'
                    } else {
                        scoreType.value = ''
                    }
                    if (!res.data.gradeType) {
                        scoreSetForm.value.gradeType = 1
                    } else {
                        scoreSetForm.value.gradeType = res.data.gradeType
                    }
                    if(scoreSetForm.value.gradeType === 2){
                        scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }]
                    }
                    scoreSetForm.value.scoreType = res.data.scoreType
                    typeRadio.value = res.data.scoreType
                    scoreFangShi.value = res.data.chooseType
                    if (scoreFangShi.value === '3+1+2'){
                        scoreSetForm.value.chooseType = 1
                    }
                    if (scoreFangShi.value === '6选3(区间)'){
                        scoreSetForm.value.chooseType = 2
                    }
                    if (scoreFangShi.value === '6选3(分值)'){
                        scoreSetForm.value.chooseType = 3
                    }
                    if (scoreFangShi.value === '7选3' && scoreSetForm.value.gradeType === 1){
                        scoreTypeList.value = [{ value: 0, label: '百分比' }, { value: 1, label: '分数' }, { value: 2, label: '人数' }]
                        scoreSetForm.value.chooseType = 4
                    }
                }else{
                    toAddScoreSet('添加')
                }

                //ElMessage.success('获取数据成功')
            } else {
                ElMessage.error(res.message)
            }
        })
    }

    function getScoreSet(query: any) {
        queryParams.value.examId = examId
        queryParams.value.subId = subjectId.value
        queryGradeScoreSet(queryParams.value).then((res: any) => {
            if (res.success) {
                if (res.data) {
                    scoreSetForm.value.subjectId = subjectId.value
                    /*typeRadio.value = res.data.type*/
                    scoreSetDataList.value = res.data.dataList
                    const list = ['A','B+','B','C+','C','D+','D','E']
                    dataList.value = res.data.dataList
                    // dataList.value.sort(function (a: any,b:any) {
                    //     if (list.indexOf(a.gradeName) > -1 && list.indexOf(b.gradeName) > -1) {
                    //         return list.indexOf(a.gradeName) - list.indexOf(b.gradeName)
                    //     } else if (list.indexOf(a.gradeName)> -1 && !(list.indexOf(b.gradeName) > -1)) {
                    //         return 2
                    //     } else {
                    //         return 1
                    //     }
                    // })
                    if (res.data.gradeType === 1) {
                        gradeType.value = '等级赋分'
                    } else if (res.data.gradeType === 2) {
                        gradeType.value = '学考等级'
                    } else {
                        gradeType.value = ''

                    }
                    if (res.data.scoreType === 0) {
                        scoreType.value = '百分比'
                    } else if (res.data.scoreType === 1) {
                        scoreType.value = '分数'
                    } else if (res.data.scoreType === 2) {
                        scoreType.value = '人数'
                    } else {
                        scoreType.value = ''
                    }
                    if (!res.data.gradeType) {
                        scoreSetForm.value.gradeType = 1
                    } else {
                        scoreSetForm.value.gradeType = res.data.gradeType
                    }
                    scoreSetForm.value.scoreType = res.data.scoreType
                    typeRadio.value = res.data.scoreType
                    scoreFangShi.value = res.data.chooseType
                    if (scoreFangShi.value === '3+1+2'){
                        scoreSetForm.value.chooseType = 1
                    }
                    if (scoreFangShi.value === '6选3(区间)'){
                        scoreSetForm.value.chooseType = 2
                    }
                    if (scoreFangShi.value === '6选3(分值)'){
                        scoreSetForm.value.chooseType = 3
                    }
                    if (scoreFangShi.value === '7选3'){
                        scoreSetForm.value.chooseType = 4
                    }
                }

                //ElMessage.success('获取数据成功')
            } else {
                ElMessage.error(res.message)
            }
        })
    }

    function changeSub() {
        getScoreSet(queryParams.value)
    }

    function cacelSet() {
        addScoreSetVisible.value = false
        location.reload()
    }

    function changeAddSub() {
        //scoreSetForm.value.gradeType = 1
        getAddScoreSet(queryParams.value)
    }

    function toUpdate(text: string) {
        addLevelTitle.value = text +levelTitle
        queryParams.value.examId = examId
        queryParams.value.subId = subjectId.value
        getScoreSet(queryParams.value)
        addScoreSetVisible.value = true
        //scoreSetForm.value.chooseType = choose.value
        queryParams.value.subId = subjectId.value
        changeChooseType()
    }

    function todelete() {
        deleteSubScoreSet(queryParams.value).then((res: any) => {
            if (res.success) {
                location.reload()
            }

        })
    }

    function beforeClose() {
        addLevelTitle.value = levelTitle
        addScoreSetVisible.value = false
        //checkAllSubject.value = false
        scoreSetForm.value = new scoreSetInfo()
        location.reload()
    }

    function beforeCloseSub() {
        anotherSubVisible.value = false
        anotherSubFrom.value = new anotherSubInfo()
    }

    function handleCheckAllSubjectChange(val: boolean) {
        anotherSubFrom.value.anotherSubIds = val ? subjectOptions.value.filter((val: any) => {
            return val.subName !== anotherSubTitle.value
        }).map((val: any) => {
          return val.id
        }) : [];
        isIndeterSubject.value = false;
    }
    function handleCheckedCitiesSubjectChange(value: any) {
        let checkedSubjectCount = value.length;
        checkAllSubject.value = checkedSubjectCount === (subjects.value.length -1);
        isIndeterSubject.value = checkedSubjectCount > 0 && checkedSubjectCount < subjects.value.length -1;
    }

    function toAddAnotherSub() {
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
        saveAnotherSubScoreSet(anotherSubFrom.value).then((res: any) => {
            if (res.success) {
                ElMessage.success('同步成功')
                anotherSubVisible.value = false
                listSubList()
                getScoreSet(queryParams.value)
            } else {
                ElMessage.error(res.message)
            }
        })
    }

    // 设置赋分等级 删除----------------------------------------------------------------
    function deleteScoreSet(scope: any) {
        const index = scope.$index
        scoreSetDataList.value.splice(index, 1)
    }

    // 添加赋分等级 ----------------------------------- ------------------
    const addEachVisible = ref<boolean>(false) //添加弹窗展示
    const eachForm = ref<eachType>(new eachType()) //添加表单对象
    const isTwo = ref<boolean>(false) //代表两个框还是一个

    // 关闭前回调
    function beforeCloseEach() {
        addEachVisible.value = false
        isTwo.value = false
    }

    // 添加按钮》显示弹窗
    function addEachBtn() {
      scoreSetDataList.value.push({})
        setTimeout(() => {
          const tableBody = table.value.$refs.bodyWrapper
          tableBody.scrollTop = 50 * scoreSetDataList.value.length;
        }, 10)
    }

    // 添加弹窗按钮》成功后关闭弹窗
    function addEachSubmit() {
        scoreSetDataList.value = [...scoreSetDataList.value, eachForm.value]
        setTimeout(() => {
            addEachVisible.value = false
        }, 10)
    }

    function toOpenScoreSet() {
        scoreSetDialogVisible.value = true
    }

    function exportScoreSetTemplate() {
        downloadScoreSetTemp().then((res: any) => {
            const link = document.createElement('a')
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.setAttribute('download', '赋分设置信息模板.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
    }

</script>

<style scoped lang="scss">
  .fontwidth {
    font-size: 12px;
    color: #202020;
    padding-right: 10px;
    line-height: 52px;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }

  :deep(.el-dialog__body) {
    .el-form-item--default:nth-last-child(1) {
      margin-bottom: 0 !important;
    }
  }

  .dialogClass {
    :deep(.el-form-item__label) {
      text-align: justify;
      text-align-last: justify;
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
      color: #4381e5;
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

  .table-header {
    background: #d3e0f4;
    text-align: center;
  }

  .btn {
    background-color: #4381e5;
    color: #fff;
    font-size: 12px;
    width: 100px;
  }

  :deep(.el-input.is-disabled .el-input__inner) {
    text-align: center !important;
  }

  :deep(.el-input__inner) {
    text-align: center !important;
  }
</style>
