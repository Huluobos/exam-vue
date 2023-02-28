<template>
  <div>
    <div class="iframe-container">
      首页
    </div>
  </div>
</template>

<script lang='ts'>

  import { useUserStoreWithOut } from '@/store/modules/user'
  const {VITE_GLOB_API_URL} = process.env

  export default defineComponent({
    data() {
      return {
        token: useUserStoreWithOut().getToken,
        iframeSrc: '',
        rootUrl: VITE_GLOB_API_URL
      }
    },
    methods: {
    },
    mounted() {

    },


  })
</script>

<style scoped>
.iframe-container{
  height: calc(100vh - 150px);
}

</style>
