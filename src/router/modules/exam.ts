const Layout = () => import('@/layout/index.vue');
const exam = {
  path: '/exam',
  name: 'examManagement',
  component: Layout,
  redirect: '/exam/',
  meta: {
    title: '考试管理',
    // icon: "home-filled",
    rule: [],
    nav: 'exam'
  },
  children: [
    {
      path: '',
      name: 'examManagementIndex',
      component: () => import('@/views/exam/index.vue'),
      meta: {
        title: '',
        nav: 'exam'
      }
    },
    {
      path: 'examAdd',
      name: 'examAdd',
      component: () => import('@/views/exam/addExam/addExam.vue'),
      meta: {
        title: '',
        nav: 'exam',
      }
    },
    {
      path: 'examUpdate',
      name: 'examUpdate',
      component: () => import('@/views/exam/addExam/updateExam.vue'),
      meta: {
        title: '',
        nav: 'exam',
        boxRight: true,//右侧面包屑
      }
    },
    {
      path: 'examProcess',
      name: 'examProcessIndex',
      component: () => import('views/exam/examProcess/index.vue'),
      meta: {
        title: '考试进程',
        nav: 'exam',
      },
      children: [
        {
          path: '',
          name: 'examProcess',
          component: () => import('views/exam/examProcess/examProcess.vue'),
          meta: {
            title: '',
            nav: 'exam',
            needField: ['id'],
          },
        },
        {
          path: 'subject',
          name: 'subjectIndex',
          component: () => import('views/exam/subject/index.vue'),
          meta: {
            title: '科目进程',
            nav: 'exam',
            boxRight: true,//右侧面包屑
          },
          children: [
            {
              path: '',
              name: 'subjectProcessIndex',
              component: () => import('views/exam/subject/process/process.vue'),
              meta: {
                title: '',
                nav: 'exam',
                needField: ['subName', 'grade'],
              }
            },
            {
              path: 'subjectStudent',
              name: 'subjectStudentManagement',
              component: () => import('views/exam/subject/student/management.vue'),
              meta: {
                title: '单科考生管理',
                nav: 'exam',
                boxRight: true,//右侧面包屑
              }
            },
            {
              path: 'objectiveItem',
              name: 'processObjectiveItem',
              component: () => import('views/exam/questionStructure/objectiveItem.vue'),
              meta: {
                title: '设置试卷题块结构',
                nav: 'exam',
                boxRight: true,//右侧面包屑
              }
            },
            {
              path: 'subjectiveItem',
              name: 'processSubjectiveItem',
              component: () => import('views/exam/questionStructure/subjectiveItem.vue'),
              meta: {
                title: '设置试卷题块结构',
                nav: 'exam',
                boxRight: true,//右侧面包屑
              }
            },
            {
              path: 'template',
              name: 'processTemplate',
              component: () => import('@/views/exam/template/index.vue'),
              meta: {
                title: '模板制作',
                nav: 'exam',
                boxRight: true,//右侧面包屑
              }
            },
            {
              path: 'scanMonitor',
              name: 'scanMonitor',
              component: () => import('@/views/exam/scanMonitor/index.vue'),
              meta: {
                title: '扫描监控',
                nav: 'exam',
                boxRight: true,//右侧面包屑
              }
            },
            {
              path: 'markPaper',
              name: 'markPaperIndex',
              component: () => import('views/exam/markPaper/index.vue'),
              meta: {
                title: '题块与阅卷任务分配',
                nav: 'exam',
                boxRight: true,//右侧面包屑
              },
              children: [
                {
                  path: '',
                  name: 'markPaper',
                  component: () => import('views/exam/markPaper/markPaper.vue'),
                  meta: {
                    title: '',
                    nav: 'exam',
                    needField: ['subName', 'subId', 'grade'],
                  }
                },
                {
                  path: 'subjectArea',
                  name: 'markSubjectArea',
                  component: () => import('@/views/exam/template/subjectArea.vue'),
                  meta: {
                    title: '题块框选',
                    nav: 'exam',
                  }
                },
              ]
            },
            {
              path: 'process',
              name: 'processProcess',
              component: () => import('@/views/exam/process/index.vue'),
              meta: {
                title: '阅卷进度监控',
                nav: 'exam'
              }
            },
            {
              path: 'subQuesDetail',
              name: 'processSubQuesDetail',
              component: () => import('@/views/exam/subQuesDetail/index.vue'),
              meta: {
                title: '阅卷结果',
                nav: 'exam',
                boxRight: true
              }
            },
            {
              path: 'markingDetail',
              name: 'processMarkingDetail',
              component: () => import('@/views/exam/markingDetail/index.vue'),
              meta: {
                title: '在阅任务监控',
                nav: 'exam',
                boxRight: true
              }
            },
            {
              path: 'arbiDetail',
              name: 'processArbiDetail',
              component: () => import('@/views/exam/arbiDetail/index.vue'),
              meta: {
                title: '仲裁详情',
                nav: 'exam',
                boxRight: true
              }
            },
            {
              path: 'markingQuality',
              name: 'processMarkingQuality',
              component: () => import('@/views/exam/markingQuality/index.vue'),
              meta: {
                title: '阅卷质量分析',
                nav: 'exam',
                boxRight: true
              }
            },
            {
              path: 'objectError',
              name: 'processObjectError',
              component: () => import('@/views/exam/objectError/index.vue'),
              meta: {
                title: '客观题异常处理',
                nav: 'exam'
              }
            },
            {
              path: 'selectQues',
              name: 'processSelectQues',
              component: () => import('@/views/exam/selectQues/index.vue'),
              meta: {
                title: '选做题校正',
                nav: 'exam'
              }
            },
            {
              path: 'overview',
              name: 'overviewIndex',
              component: () => import('@/views/exam/scoreManage/index.vue'),
              meta: {
                title: '成绩管理',
                nav: 'exam'
              },
              children: [
                {
                  path: '',
                  name: 'processOverview',
                  component: () => import('@/views/exam/scoreManage/overview.vue'),
                  meta: {
                    title: '',
                    nav: 'exam',
                    boxRight: true,//右侧面包屑
                  }
                },
                {
                  path: 'checkScore',
                  name: 'processCheckScore',
                  component: () => import('@/views/exam/scoreManage/checkScore.vue'),
                  meta: {
                    title: '',
                    nav: 'exam',
                    boxRight: true,//右侧面包屑
                  }
                },
                {
                  path: 'studentScore',
                  name: 'processStudentScore',
                  component: () => import('@/views/exam/scoreManage/studentScore.vue'),
                  meta: {
                    title: '',
                    nav: 'exam',
                    boxRight: true,//右侧面包屑
                  }
                },
                {
                  path: 'studentDetail',
                  name: 'processStudentDetail',
                  component: () => import('@/views/exam/scoreManage/studentDetail.vue'),
                  meta: {
                    title: '',
                    nav: 'exam',
                    boxRight: true,//右侧面包屑
                  }
                },
              ]
            },
          ]
        },
      ]
    },
    {
      path: 'stuMessage',
      name: 'stuMessage',
      component: () => import('views/exam/examProcess/stuMessage.vue'),
      meta: {
        title: '考生信息',
        nav: 'exam'
      }
    },
    {
      path: 'template',
      name: 'template',
      component: () => import('@/views/exam/template/index.vue'),
      meta: {
        title: '模板制作',
        nav: 'exam',
        boxRight: true
      }
    },
    {
      path: 'subjectArea',
      name: 'subjectArea',
      component: () => import('@/views/exam/template/subjectArea.vue'),
      meta: {
        title: '题块框选',
        nav: 'exam',
        boxRight: true
      }
    },
    {
      path: 'objectError',
      name: 'objectError',
      component: () => import('@/views/exam/objectError/index.vue'),
      meta: {
        title: '客观题异常处理',
        nav: 'exam',
        boxRight: true
      }
    },
    {
      path: 'selectQues',
      name: 'selectQues',
      component: () => import('@/views/exam/selectQues/index.vue'),
      meta: {
        title: '选做题校正',
        nav: 'exam',
        boxRight: true
      }
    },
    {
      path: 'process',
      name: 'process',
      component: () => import('@/views/exam/process/index.vue'),
      meta: {
        title: '阅卷进度监控',
        nav: 'exam',
        boxRight: true
      }
    },
    {
      path: 'subQuesDetail',
      name: 'subQuesDetail',
      component: () => import('@/views/exam/subQuesDetail/index.vue'),
      meta: {
        title: '阅卷结果',
        nav: 'exam',
        boxRight: true
      }
    },
    {
      path: 'markingDetail',
      name: 'markingDetail',
      component: () => import('@/views/exam/markingDetail/index.vue'),
      meta: {
        title: '在阅任务监控',
        nav: 'exam',
        boxRight: true
      }
    },
    {
      path: 'arbiDetail',
      name: 'arbiDetail',
      component: () => import('@/views/exam/arbiDetail/index.vue'),
      meta: {
        title: '仲裁详情',
        nav: 'exam',
        boxRight: true
      }
    },
    {
      path: 'markingQuality',
      name: 'markingQuality',
      component: () => import('@/views/exam/markingQuality/index.vue'),
      meta: {
        title: '阅卷质量分析',
        nav: 'exam',
        boxRight: true
      }
    },
    {
      path: 'template',
      name: 'template',
      component: () => import('@/views/exam/template/index.vue'),
      meta: {
        title: '模板制作',
        nav: 'exam',
        boxRight: true,//右侧面包屑
      }
    },
    {
      path: 'overview',
      name: 'overview',
      component: () => import('@/views/exam/scoreManage/index.vue'),
      meta: {
        title: '成绩总览',
        nav: 'exam',
        boxRight: true,//右侧面包屑
      }
    },
    {
      path: 'checkScore',
      name: 'checkScore',
      component: () => import('@/views/exam/scoreManage/checkScore.vue'),
      meta: {
        title: '数据检查',
        nav: 'exam',
        boxRight: true,//右侧面包屑
      }
    },
    {
      path: 'studentScore',
      name: 'studentScore',
      component: () => import('@/views/exam/scoreManage/studentScore.vue'),
      meta: {
        title: '考生成绩',
        nav: 'exam',
        boxRight: true,//右侧面包屑
      }
    },
    {
      path: 'studentDetail',
      name: 'studentDetail',
      component: () => import('@/views/exam/scoreManage/studentDetail.vue'),
      meta: {
        title: '考生小题明细',
        nav: 'exam',
        boxRight: true,//右侧面包屑
      }
    },
    {
      path: 'showStudImg',
      name: 'showStudImg',
      component: () => import('@/views/exam/scoreManage/showStudImg.vue'),
      meta: {
        title: '考生答题卡',
        nav: 'scoreManage'
      }
    },
    {
      path: 'objectiveItem',
      name: 'objectiveItem',
      component: () => import('views/exam/questionStructure/objectiveItem.vue'),
      meta: {
        title: '设置试卷题块结构',
        nav: 'exam',
        boxRight: true,//右侧面包屑
      }
    },
    {
      path: 'subjectiveItem',
      name: 'subjectiveItem',
      component: () => import('views/exam/questionStructure/subjectiveItem.vue'),
      meta: {
        title: '设置试卷题块结构',
        nav: 'exam',
        boxRight: true,//右侧面包屑
      }
    },
  ]
};

export default exam;
