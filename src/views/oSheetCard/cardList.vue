<template>
  <div id="iframe-container">
    <iframe id='linkedFrame'
            name="cardList"
            :src=iframeSrc
            width="100%"
            :height=height></iframe>
  </div>
</template>

<script setup lang='ts'>

  import { useUserStoreWithOut } from '@/store/modules/user'
  const {VITE_GLOB_API_URL} = process.env

  const route = useRoute()
  const router = useRouter()

  const data = reactive({
    token: useUserStoreWithOut().getToken,
    iframeSrc: '',
    rootUrl: VITE_GLOB_API_URL,
    height: 700,
    queryParam: route.query
  });

  const {iframeSrc, height} = toRefs(data)

  onMounted(() => {

    data.iframeSrc = data.rootUrl + "/newexam/sheetCard/cardList?token=" + data.token
    window.onmessage = function (e) {
      if (e.data.source === 'cardList' && e.data.height) {
        data.height = e.data.height
      }else if (e.data.source === 'cardList' && e.data.goto){
        // router.push({path: e.data.goto, query:{
        //     ...e.data.param
        //   }})

        console.log(e.data.goto)
        const url = router.resolve({path: e.data.goto, query:{
            ...e.data.param
          }})
        window.open(url.href, '_blank');
      }
    }
  })
</script>

<style scoped>

</style>
