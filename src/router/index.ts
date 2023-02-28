import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import NProgress from "nprogress" // progress bar
import 'nprogress/css/nprogress.css' // 进度条样式
import { getUserInfoApi } from '@/api/user'
import { ElMessage } from 'element-plus'
import { getCookieToken ,} from '@/util/auth'
import { useUserStoreWithOut } from '@/store/modules/user'

import Layout from '../layout/index.vue'


import sheetCard from './modules/sheetCard'// 答题卡
import exam from './modules/exam'// 考试管理
import score from './modules/score' // 成绩分析
import teacherMark from './modules/teacherMark'// 网上阅卷
import socket from '@/util/socket'

//全局进度条的配置
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 1000, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 更改启动时使用的最小百分比
  parent: 'body', //指定进度条的父容器
})
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    meta: {
      nav: '',
      title: ''
    },
    component: Layout,

    children: [
      {
        path: '',
        name: 'index-index',
        meta: {
          nav: '',
          title: '',
        },
        component: () => import('views/index/index.vue'),
      },
      {
        path: 'downloadCenter',
        name: 'downloadCenter-index',
        meta: {
          nav: 'no',
          title: '下载中心',
          noCrumb: true
        },
        component: () => import('views/downloadCenter/index.vue'),
      },
      {
        path: '/baseData/baseClass',
        name: 'baseClass',
        meta: {
          nav: 'no',
          title: '班级管理',
          noCrumb: true
        },
        component: () => import('views/baseData/baseClass.vue'),
      },
      {
        path: '/baseData/baseTeachClass',
        name: 'baseTeachClass',
        meta: {
          nav: 'no',
          title: '任课管理',
          noCrumb: true
        },
        component: () => import('views/baseData/baseTeachClass.vue'),
      },
      {
        path: '/baseData/classRoomManage',
        name: 'classRoomManage',
        meta: {
          nav: 'no',
          title: '教师管理',
          noCrumb: true
        },
        component: () => import('views/baseData/classRoomManage.vue'),
      },
      {
        path: '/baseData/studentManage',
        name: 'studentManage',
        meta: {
          nav: 'no',
          title: '学生管理',
          noCrumb: true
        },
        component: () => import('views/baseData/studentManage.vue'),
      },
      {
        path: '/baseData/studentUser',
        name: 'studentUser',
        meta: {
          nav: 'no',
          title: '学生用户',
          noCrumb: true
        },
        component: () => import('views/baseData/studentUser.vue'),
      },
      {
        path: '/baseData/teacherManage',
        name: 'teacherManage',
        meta: {
          nav: 'no',
          title: '教师管理',
          noCrumb: true
        },
        component: () => import('views/baseData/teacherManage.vue'),
      },
      {
        path: '/baseData/teacherUser',
        name: 'teacherUser',
        meta: {
          nav: 'no',
          title: '教师用户',
          noCrumb: true
        },
        component: () => import('views/baseData/teacherUser.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      nav: 'login',
    },
    component: () => import('views/login/index.vue'),
  },
  exam,
  teacherMark,
  score,
  {
    path: "/teacherMark/marking",
    name: "marking",
    component: () => import("views/teacherMark/marking.vue"),
    meta: {
      title: '网络阅卷',
      nav: 'teacherMark'
    }
  },
  {
    path: "/teacherMark/arbiMarking",
    name: "arbiMarking",
    component: () => import("views/teacherMark/arbiMarking.vue"),
    meta: {
      title: '仲裁阅卷',
      nav: 'teacherMark'
    }
  },
 
  sheetCard,
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
// 路由白名单
const whiteList = ["/login"];
// 前置导航
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  const token = getCookieToken()
  if (token) {
    if (to.path !== '/login'){
      socket.reconnect()

      getUserInfoApi({}).then((res:any)=>{
        const { data,success} = res
        if(success){
          const userStore = useUserStoreWithOut()
          userStore.setUserInfo(data)
          // next();
        }else{
          // next(`/login?redirect=${to.fullPath}`)
          // ElMessage({
          //   type:'warning',
          //   message:'获取用户信息失败,请重新登录'
          // })
        }
        next();
        // 如果失败那之前肯定还有用户信息，就先不动了用之前的（token至少没有失效）
      })
    }else{
      next({ path: '/' })
      next()
      NProgress.done()
    }
  }else{
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
        NProgress.done()
      }
  }
})
// 后置守卫
router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export default router
