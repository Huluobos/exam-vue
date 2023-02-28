<template>
  <div id="iframe-container">
    <iframe id='linkedFrame'
            name="addCard"
            :src=iframeSrc
            width="100%"
            :height=height></iframe>
  </div>
</template>

<script setup lang='ts'>

  import { useUserStoreWithOut } from '@/store/modules/user'
  import ProcessNav from "views/exam/components/processNav.vue";
  const {VITE_GLOB_API_URL} = process.env

  const route = useRoute()
  const router = useRouter()

  const data = reactive({
    token: useUserStoreWithOut().getToken,
    iframeSrc: '',
    rootUrl: VITE_GLOB_API_URL,
    height: 800,
    queryParam: route.query
  });

  const {iframeSrc, height} = toRefs(data)

  onMounted(() => {

    data.iframeSrc = data.rootUrl + "/newexam/sheetCard/addCard?token=" + data.token + "&cardId="
      + (data.queryParam.cardId?data.queryParam.cardId:'')
    window.onmessage = function (e) {
      if (e.data.source === 'addCard' && e.data.height) {
        data.height = e.data.height
      }else if (e.data.source === 'addCard' && e.data.goto){
        router.replace({path: e.data.goto, query:{
          ...e.data.param
        }})
      }
    }
  })
</script>

<style scoped>

</style>
