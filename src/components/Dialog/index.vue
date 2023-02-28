<template>
  <!-- 使用：
    html----------------------------------------------------------
      <Dialog :title="'Huluobos弹窗'" @commitBtn="successCallback" @dialogVisible="dialogVisible" :visible="visible" :top="'1vh'" :width="'200px'">
        <template #content>
          <h1>Huojhonsppsjajsasajdisa</h1>
        </template>
      </Dialog>
    js:-----------------------------------------------------------
    const visible = ref<boolean>(false) //显隐参数
     //显示隐藏回调 key是关闭或者打开的布尔值
    const dialogVisible = (key:boolean)=>{
      visible.value= key
    }
    //确认按钮的事件
    const successCallback = ()=>{

    }
 -->
  <el-dialog custom-class="dialogClass" v-model="visibleProps" :title="title"  :close-on-click-modal="false" destroy-on-close :width="width" :top="top" @open="open" @close="close" >
    <slot name="content"></slot>
    <template #footer>
      <span class="dialog-footer">
        <slot name="footer"></slot>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { CircleCloseFilled } from '@element-plus/icons-vue'
const props = defineProps({

  title: {
    required: true,
    type: String
  },

  visible: {
    type: Boolean,
    default: false
  },

  width: {
    type: String,
    default:'700px'
  },

  top: {
    type: String,
    default:'15vh'
  },
})
const visibleProps = computed(()=>{
  return props.visible
})


const emit = defineEmits(['dialogVisible']);
const open = ()=>{
   emit('dialogVisible', true)
}
const close = ()=>{
  emit('dialogVisible', false)
}

</script>

<style scoped lang="scss">
.my-header{
  height: 60px;

  border-radius: 4px 4px 0px 0px;
}


</style>
