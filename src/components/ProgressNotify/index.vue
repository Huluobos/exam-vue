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
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="closeDialog">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import {ElMessageBox} from 'element-plus'

  const props = defineProps({
    strokeWidth: {
      type: Number,
      default: 26
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
    }
  })
  const data = reactive({
    dialog: props.dialogVisible,
    status: ref<any>(undefined)
  })
  const {strokeWidth, dialogVisible, notifyData} = toRefs(props)
  const {dialog, status} = toRefs(data)
  const emit = defineEmits(['visibelChange']);

  function handleClose(done: any) {
    ElMessageBox.confirm('确认关闭？', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }).then(() => {
      done()
      emit('visibelChange', false)
    })
  }

  function closeDialog() {
    if (props.notifyData.percent === 100) {
      emit('visibelChange', false)
    } else {
      ElMessageBox.confirm('确认关闭？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        emit('visibelChange', false)
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
        } else {
          status.value = undefined
        }
      } else {
        status.value = 'exception'
      }
    }
  }, {deep: true})

</script>

<style lang="scss" scoped>

</style>
