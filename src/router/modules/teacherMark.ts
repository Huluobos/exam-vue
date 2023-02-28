const Layout = () => import("@/layout/index.vue");
const teacherMark = {
  path: "/teacherMark",
  name: "teacherMark",
  component: Layout,
  redirect: '/teacherMark/',
  meta: {
    title: '网上阅卷',
    // icon: "home-filled",
    rule: [],
    nav: 'teacherMark'
  },
  children: [
    {
      path: "",
      name: "teacherMark",
      component: () => import("@/views/teacherMark/index.vue"),
      meta: {
        title: '阅卷任务列表',
        nav: 'teacherMark'
      }
    },
    {
      path: "taskList",
      name: "taskList",
      component: () => import("@/views/teacherMark/taskList.vue"),
      meta: {
        title: '阅卷任务详情',
        nav: 'teacherMark'
      }
    }
  ]
};

export default teacherMark;
