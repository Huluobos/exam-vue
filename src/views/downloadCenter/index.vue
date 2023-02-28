<template>
  <div id="iframe-container">
    <iframe id='linkedFrame'
            name="downloadCenter"
            :src=iframeSrc
            width="100%"
            :height=height></iframe>
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
        rootUrl: VITE_GLOB_API_URL,
        height: 700
      }
    },
    setup() {
     
    },
    methods: {

    },
    created() {
      this.iframeSrc = this.rootUrl + "/newexam/homePage/downloadCenter"
    },
    mounted() {
      const that = this;
      window.onmessage = function(e) {
        console.log(e.data)
        if (e.data.source === 'downloadCenter') {
          that.height = e.data.height
        }
      }
      
      const bodyContentCard:any =  document.getElementById('bodyContentCard')
      bodyContentCard.style.borderRadius="0px 0px 8px 8px";
    },
    beforeUnmount() {
      const bodyContentCard:any =  document.getElementById('bodyContentCard')
      bodyContentCard.style="";
    },


  })
</script>


<style scoped>
/* .body-content-card{
  border-radius: 0 !important;
} */
</style>
