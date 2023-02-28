<template>
  <div id="iframe-container">
    <iframe id='linkedFrame'
            name="teachMarking"
            :src=iframeSrc
            width="100%"
            style="height:calc(100vh)"></iframe>
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
    height: 950,
    queryParam: route.query
  });

  const {iframeSrc, height} = toRefs(data)

  onMounted(() => {

    data.iframeSrc = data.rootUrl + "/newexam/marking/teachMarking?token=" + data.token
      +"&examId=" + data.queryParam.examId +"&tconfid="+data.queryParam.tconfid
    // window.onmessage = function (e) {
    //   console.log(e.data)
    //   if (e.data.source === 'teachMarking') {
    //     data.height = e.data.height
    //   }
    // }
  })
</script>

<style scoped>

</style>
