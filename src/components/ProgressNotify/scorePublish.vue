<template>
  <el-dialog
    :title="notifyData.message"
    v-model="dialog"
    width="30%"
    :before-close="handleClose"
  >
    <el-progress
      :text-inside="true"
      :stroke-width="strokeWidth"
      :percentage="notifyData.percent ? notifyData.percent : 0"
      :status="status"
    ></el-progress>

    <div class="title">成绩数据校验</div>
    <div class="msg-container">
      <div class="left">1.客观题答案校验</div>
      <div class="middle">
        <img class="img" v-if="msg.objAnswer===null && msg.objAnswerNoScore===null" src="@/assets/publish/success.png">
        <img class="img" v-else src="@/assets/publish/fail.png">
      </div>
      <div class="right">
        <span v-if="msg.objAnswer===null && msg.objAnswerNoScore===null">校验完成</span>
        <span v-if="msg.objAnswer!==null || msg.objAnswerNoScore!==null">检测到 <span class="tip">{{ msg.objAnswer }} {{msg.objAnswerNoScore}}</span>，</span>
        <span v-if="msg.objAnswer!==null || msg.objAnswerNoScore!==null">请至 <span class="link" @click="goQuesSetting">试题结构</span> 处修改</span>
      </div>
    </div>
    <div class="msg-container">
      <div class="left">2.多选题评分标准校验</div>
      <div class="middle">
        <img class="img" v-if="msg.multiObjSet===null" src="@/assets/publish/success.png">
        <img class="img" v-else src="@/assets/publish/fail.png">
      </div>
      <div class="right">
        <span v-if="msg.multiObjSet===null">校验完成</span>
        <span v-if="msg.multiObjSet!==null">检测到 <span class="tip">{{ msg.multiObjSet }}</span>，</span>
        <span v-if="msg.multiObjSet!==null">请至 <span class="link" @click="goQuesSetting">试题结构</span> 处修改</span>
      </div>
    </div>
    <div class="msg-container">
      <div class="left">3.阅卷异常数据校验</div>
      <div class="middle">
        <img class="img" v-if="msg.imgError===null" src="@/assets/publish/success.png">
        <img class="img" v-else src="@/assets/publish/fail.png">
      </div>
      <div class="right">
        <span v-if="msg.imgError===null">校验完成</span>
        <span v-if="msg.imgError!==null">检测到有 <span class="tip">{{ msg.imgError }}</span>，</span>
        <span v-if="msg.imgError!==null">请至 <span class="link" @click="goQuesDetail">阅卷结果</span> 处修改</span>
      </div>
    </div>
    <div class="msg-container">
      <div class="left">4.小题分数量校验</div>
      <div class="middle">
        <img class="img" v-if="msg.quesNum===null" src="@/assets/publish/success.png">
        <img class="img" v-else src="@/assets/publish/fail.png">
      </div>
      <div class="right">
        <span v-if="msg.quesNum===null">校验完成</span>
        <span v-if="msg.quesNum!==null">检测到有 <span class="tip">{{ msg.quesNum }}</span>，</span>
        <span v-if="msg.quesNum!==null">，请联系管理员或系统工作人员处理</span>
      </div>
    </div>
    <div class="img-container">
      <img v-if="publishStatus===0" src="@/assets/publish/publishing.png" />
      <img v-else-if="publishStatus===1" src="@/assets/publish/publish-suc.png" />
      <img v-else-if="publishStatus===2" src="@/assets/publish/publish-fail.png" />
    </div>
<!--    <template #footer>-->
<!--      <span class="dialog-footer">-->
<!--        <el-button type="primary" @click="closeDialog">关 闭</el-button>-->
<!--      </span>-->
<!--    </template>-->
  </el-dialog>
</template>


<script setup lang="ts">
  import {ElMessageBox} from 'element-plus'

  const props = defineProps({
    strokeWidth: {
      type: Number,
      default: 20
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    notifyData: {
      type: Object,
      default() {
        return {}
      }
    },
    publishStatus: {
      type: Number,
      default: 0
    },
    msg: {
      type: Object,
      default() {
        return {
          objAnswer: null,
          objAnswerNoScore: null,
          multiObjSet: null,
          quesNum: null,
          imgError: null,
        }
      }
    },
    queryParam: {
      type: Object,
      default() {
        return {}
      }
    }
  })
  const data = reactive({
    dialog: props.dialogVisible,
    status: ref<any>(undefined)
  })
  const {strokeWidth, dialogVisible, notifyData, publishStatus, msg} = toRefs(props)
  const {dialog, status} = toRefs(data)
  const emit = defineEmits(['visibleChange','statusChange']);
  const router = useRouter()

  function handleClose(done: any) {
    if (props.notifyData.percent !== 100) {
      ElMessageBox.confirm('确认关闭？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        done()
        emit('visibleChange', false)
      }).catch(()=>{

      })
    }else{
      emit('visibleChange', false)
    }
  }

  function closeDialog() {
    if (props.notifyData.percent === 100) {
      emit('visibleChange', false)
    } else {
      ElMessageBox.confirm('确认关闭？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        emit('visibleChange', false)
      }).catch(()=>{

      })
    }
  }

  watch(() => props.dialogVisible, (newVal) => {
    if (!newVal) {
      dialog.value = newVal
    }
  })

  watch(() => props.notifyData, (newVal) => {
    if (newVal) {
      if (newVal.result) {
        if (newVal.percent && newVal.percent === 100) {
          status.value = 'success'
          /// 完成后，三秒后自动关闭
          // setTimeout(function() {
          //   self.$emit('change', false)
          // }, 5 * 1000)
          setTimeout(function () {
            if (publishStatus.value === 0) {
              emit('statusChange', 1)
            }
          }, 500)
        } else {
          status.value = undefined
        }
      } else {
        status.value = 'exception'
      }
    }
  }, {deep: true})

  function goQuesSetting(){
    const url = router.resolve({name: 'processObjectiveItem', query: props.queryParam})
    window.open(url.href, '_blank');
  }

  function goQuesDetail(){
    const url = router.resolve({name: 'processSubQuesDetail', query: props.queryParam})
    window.open(url.href, '_blank');
  }

</script>

<style lang="scss" scoped>
  .title{
    color: #202020;
    font-weight: bold;
    padding: 5px;
  }
  .msg-container{
    background: #F8FBFF;
    margin-bottom: 10px;
    padding: 5px;
    display: flex;
    .left{
      width: 150px;
    }
    .middle{
      width: 20px;
    }
    .right{
      padding-left: 10px;
      flex: 1;
      .link{
        color: #4381E5;
        cursor: pointer;
      }
      .tip{
        color: #FF3333;
      }
    }
  }
  .img-container{
    width: 100%;
    text-align: center;
    img{
      margin: 0 auto;
    }
  }
</style>
