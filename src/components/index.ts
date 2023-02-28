declare module '@vue/runtime-core' {
  // 全局的组件声明，使用时直接写标签即可
  // 局部引入也可以 需要手动导咯
  export interface GlobalComponents {
    Pagination: typeof import('./Pagination/index.vue')['default']
    SvgIcon: typeof import('./SvgIcon/index.vue')['default']
    Dialog: typeof import('./Dialog/index.vue')['default']
    Echarts: typeof import('./Echarts/index.vue')['default']
    ckEditor: typeof import('./ckEditor/index.vue')['default']
  }
}

export { }
