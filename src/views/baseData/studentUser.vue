<template>
  <div id="iframe-container">
    <base-data-nav active="3"></base-data-nav>
    <iframe id='linkedFrame'
            name="studentUser"
            :src=iframeSrc
            width="100%"
            :height=height></iframe>
  </div>
</template>

<script setup lang='ts'>

  import { useUserStoreWithOut } from '@/store/modules/user'
  import BaseDataNav from "views/baseData/components/baseDataNav.vue";
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

    data.iframeSrc = data.rootUrl + "/newexam/baseData/studentUser?token=" + data.token

    window.onmessage = function (e) {
      if (e.data.source === 'studentUser') {
        data.height = e.data.height
      }
    }
  })

</script>

<style scoped>

</style>
