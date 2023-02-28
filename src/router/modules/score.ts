const Layout = () => import('@/layout/index.vue')
const score = {
  path: '/score',
  name: 'scoreManagement',
  component: Layout,
  redirect: '/score/',
  meta: {
    title: '成绩分析',
    rule: [],
    nav: 'score'
  },
  children: [
    {
      path: '',
      name: 'scoreManagementIndex',
      component: () => import('@/views/score/index.vue'),
      meta: {
        title: '',
        nav: 'score'
      },
      children: [
        {
          path: '',
          name: 'scoreManagement',
          component: () => import('@/views/score/score/examScore.vue'),
          meta: {
            title: '',
            nav: 'score'
          },
          children: [],
        },
        {
          path: 'report',
          name: 'reportIndex',
          component: () => import('@/views/score/report/index.vue'),
          meta: {
            title: '成绩报告',
            nav: 'score'
          },
          children: [
            {
              path: '',
              name: 'scoreReport',
              component: () => import('@/views/score/report/report.vue'),
              meta: {
                title: '',
                nav: 'score'
              }
            },
            {
              path: 'studentScore',
              name: 'studentScoreIndex',
              component: () => import('@/views/score/studentScore/index.vue'),
              meta: {
                title: '学生成绩',
                nav: 'score'
              }
            },
            {
              path: 'studentQuesScore',
              name: 'studentQuesScoreIndex',
              component: () => import('@/views/score/studentScore/studentQuesScore/index.vue'),
              meta: {
                title: '学生小题分',
                nav: 'score'
              }
            },
            {
              path: 'sumScore',
              name: 'sumScoreIndex',
              component: () => import('@/views/score/studentScore/sumScore/index.vue'),
              meta: {
                title: '汇总成绩',
                nav: 'score'
              }
            },
            {
              path: 'commonUse',
              name: 'commonUseIndex',
              component: () => import('@/views/score/commonUse/index.vue'),
              meta: {
                title: '常用指标分析',
                nav: 'score'
              }
            },
            {
              path: 'paperAnalysis',
              name: 'paperAnalysisIndex',
              component: () => import('@/views/score/paperAnalysis/index.vue'),
              meta: {
                title: '试卷分析',
                nav: 'score'
              }
            },
            {
              path: 'setting',
              name: 'setting',
              component: () => import('@/views/score/examSetting/index.vue'),
              meta: {
                title: '',
                nav: 'score',
                boxRight: true,//右侧面包屑
              },
              children:[
                {
                  path: 'examSetting',
                  name: 'examSetting',
                  component: () => import('@/views/score/examSetting/basicsSet.vue'),
                  meta: {
                    title: '分析设置',
                    nav: 'score',
                    boxRight: true,//右侧面包屑
                  }
                },
                {
                  path: 'filterStudent',
                  name: 'filterStudent',
                  component: () => import('@/views/score/filterStudent/filterStudent.vue'),
                  meta: {
                    title: '分析设置',
                    nav: 'score',
                    boxRight: true,//右侧面包屑
                  }
                },
                {
                  path: "scoreSet",
                  name: "scoreSet",
                  component: () => import("@/views/score/scoreSet/scoreSet.vue"),
                  meta: {
                    title: '分析设置',
                    nav:'score',
                    boxRight: true,//右侧面包屑
                  }
                },
                {
                  path: "levelSet",
                  name: "levelSet",
                  component: () => import("@/views/score/levelSet/levelSet.vue"),
                  meta: {
                    title: '分析设置',
                    nav:'score',
                    boxRight: true,//右侧面包屑
                  }
                },
              ]
            },
          ],
        },
      ]
    },

    {
      path: 'basicSetting',
      name: 'basicSetting',
      component: () => import('@/views/score/basicSetting/index.vue'),
      meta: {
        title: '基础指标设置',
        nav: 'score'
      }
    },
  ]
}
export default score
