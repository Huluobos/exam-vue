<template>
  <div id="iframe-container">
    <iframe id='linkedFrame'
            name="objectQuesDetail"
            :src=iframeSrc
            width="100%"
            :height=height></iframe>
  </div>
</template>

<script setup lang="ts">

  import {ref} from "@vue/runtime-core";
  import {useUserStoreWithOut} from "@/store/modules/user";

  const route = useRoute()
  const examId: any = route.query.examId
  const curSubId = ref<string>('')
  const {VITE_GLOB_API_URL} = process.env
  const data = reactive({
    routerParam: {
      examId: ref<any>(examId),
      gradeId: ref<any>(''),
      subId: ref<any>(curSubId),
    }, token: useUserStoreWithOut().getToken,
    iframeSrc: '',
    height:700,
    rootUrl: VITE_GLOB_API_URL,
  })
  const {iframeSrc,height} = toRefs(data)
  function objectQuesDetail() {
    data.iframeSrc = data.rootUrl + "/newexam/situation/objectQuesDetail?token=" + data.token
      + "&examId=" + data.routerParam.examId
     window.onmessage = function (e) {
       if (e.data.source === 'objectQuesDetail') {
         data.height = e.data.height
       }
     }
    // window.open(VITE_GLOB_URL+'/exam/showStudImg'+"?examId=" +examId + "&subId=" + subId + "&subName="+subName+ "&examNo="+examNo)
    // router.push({path: '/exam/showStudImg', query: routerParam.value})
  }

  onMounted(() => {
    objectQuesDetail()

  })
</script>

<style scoped>

</style>
