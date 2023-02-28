<template>
  <div id="iframe-container">
    <iframe id='linkedFrame'
            name="showStudImg"
            :src=iframeSrc
            width="100%"
            height="700px"></iframe>
  </div>
</template>

<script setup lang='ts'>

  import { useUserStoreWithOut } from '@/store/modules/user'
  import ProcessNav from "views/exam/components/processNav.vue";
  import {ref} from "@vue/runtime-core";
  const {VITE_GLOB_API_URL} = process.env

  const route = useRoute()
  const data = reactive({
    token: useUserStoreWithOut().getToken,
    iframeSrc: '',
    rootUrl: VITE_GLOB_API_URL,
    queryParam: route.query
  });

  const {iframeSrc} = toRefs(data)

  onMounted(() => {
    console.log("调用查看学生答题卡");
    console.log(data.token);
    data.iframeSrc = data.rootUrl + "/newexam/scoreManage/showStudImg?token=" + data.token
      +"&examId=" + data.queryParam.examId + "&subId=" + data.queryParam.subId + "&subName="+data.queryParam.subName+ "&examNo="+data.queryParam.examNo
    window.onmessage = function (e) {
    }
  })

</script>

<style scoped>

</style>
