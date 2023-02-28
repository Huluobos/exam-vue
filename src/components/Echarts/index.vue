<!--Echarts组件
  html:
	  <Echarts :options="options" :width="'300px'" :height="'300px'"></Echarts>
  ts:

      let options = ref<any>(null) //图表的数据对象
      onMounted(() => {
        options.value = {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [
            {
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }
          ]
        }
      })
      // 更新图标函数
      const update = () => {
        options.value = {
          title: {
            text: '数据改变'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [
            {
              name: '销量',
              type: 'bar',
              data: [5, 20]
            }
          ]
        }
      }

-->

<template>
  <div ref="main" class="main" :style="{ width: width, height: height }"/>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts'
  import {ECBasicOption, EChartsType} from 'echarts/types/dist/shared'

  let instance: EChartsType = null as unknown as EChartsType
  const props = defineProps({options: Object, width: String, height: String})
  const main = ref(null) //拿dom
  // 初始化图表
  const initEcharts = () => {
    if (props.options == null) return
    instance = echarts.init(
      main.value as unknown as HTMLElement,
    ) as unknown as EChartsType
    instance.setOption(props.options as ECBasicOption,true)
    instance.on('click', handlerClick)
    window.onresize = handlerSize
  }

  function handlerSize() {
    instance.resize()
  }

  function handlerClick(params: any) {
    // 点击函数
    console.log(params)
  }

  onMounted(() => {
    //  initEcharts() //重新构建init
  })
  onBeforeUnmount(() => {
    if (instance && instance.id) {
      instance.dispose()
    }
    window.removeEventListener('onresize', handlerSize)
  })
  // 监听数据变化
  watch(props, () => {
    initEcharts() //重新构建init
    // instance.setOption(props.options as ECBasicOption) //重新赋值
  }, {deep: true})
  //
</script>

<style scoped lang="scss">

</style>
