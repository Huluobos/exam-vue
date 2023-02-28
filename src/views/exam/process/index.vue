<template>
  <div id="iframe-container">
    <process-nav active="0" :queryParam="data.queryParam"></process-nav>
    <iframe id='linkedFrame'
            name="process"
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

  const data = reactive({
    token: useUserStoreWithOut().getToken,
    iframeSrc: '',
    rootUrl: VITE_GLOB_API_URL,
    height: 700,
    queryParam: route.query
  });

  const {iframeSrc, height} = toRefs(data)

  onMounted(() => {

    data.iframeSrc = data.rootUrl + "/newexam/marking/process?token=" + data.token
      +"&examId=" + data.queryParam.examId + "&subId=" + data.queryParam.subId + "&subName="+data.queryParam.subName
    window.onmessage = function (e) {
      if (e.data.source === 'process') {
        data.height = e.data.height
      }
    }
  })
</script>

<style scoped>

</style>
