<template>
  <div class="title">{{ queryParam.subName }}扫描明细</div>
  <div class="nav-box">
    <router-link :to="{name:'processObjectError', query:props.queryParam}">
      <div class="nav" :class="active==='0'?'active':''">客观题异常处理</div>
    </router-link>
    <router-link :to="{name:'processSelectQues', query:props.queryParam}">
      <div class="nav" :class="active==='1'?'active':''">选做题校正</div>
    </router-link>
  </div>
</template>

<script setup lang='ts'>
  const route = useRoute()
  const props = defineProps({
    active: {
      type: String,
      default: '0'
    },
    queryParam: {
      type: Object,
      default: {}
    }
  })

  onMounted(() => {
    console.log(props.queryParam)
  })
</script>

<style lang="scss" scoped>

  .nav-box {
    display: inline-block;
    width: 100%;
    float: left;
    padding-top: 10px;
    font-weight: bold;
    color: #808080;
    border-bottom: 1px solid #D3E0F4;

    .nav {
      display: inline-block;
      float: left;
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

    .split {
      width: 2px;
      border-left: 2px solid black;
      display: inline-block;
      float: left;
      margin-left: 5px;
      margin-right: 5px;
      height: 20px;
    }
  }

  .title {
    font-weight: bold;
    font-size: 16px;
  }

</style>
