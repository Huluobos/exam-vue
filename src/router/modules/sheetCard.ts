// 旧答题卡逻辑
const Layout = () => import("@/layout/index.vue");

const sheetCard = {
  path: "/sheetCard",
  name: "sheetCard",
  component: Layout,
  meta: {
    title: '答题卡制作',
    rule:[],
    nav:'sheetCard'
  },
  children: [
    {
      path: '',
      name: 'sheetCardIndex',
      component: () => import('@/views/oSheetCard/cardList.vue'),
      meta: {
        title: '答题卡列表',
        nav: 'sheetCard'
      }
    },
    {
      path: "/sheetCard/addCard",
      name: "addCard",
      component: () => import("@/views/oSheetCard/addCard.vue"),
      meta: {
        title: '添加答题卡',
        nav:'sheetCard'
      }
    }
  ]
};

export default sheetCard;
