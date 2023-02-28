<template>
<!-- 
  使用方法：先将svg存入 assets/icon-svg  下面的  （icon-class === svg图片的文件名）
  <SvgIcon class-name="myIcon" icon-class="vue" ></SvgIcon>
 -->
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script>
export default defineComponent({
  props: {
    // svg文件名
    iconClass: {
      type: String,
      required: true
    },
    // 自定义样式类名
    className: {
      type: String,
      default: ''
    },
    // 颜色
    color: {
      type: String,
      default: ''
    },
  },
  setup(props) {
    return {
      iconName: computed(() => `#icon-${props.iconClass}`),
      svgClass: computed(() => {
        if (props.className) {
          return `svg-icon ${props.className}`
        }
        return 'svg-icon'
      })
    }
  }
})
</script>

<style scope lang="scss">
svg{
  display: inline-block;
}
.sub-el-icon,
.nav-icon {
  display: inline-block;
  font-size: 15px;
  margin-right: 12px;
  position: relative;
}

.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
