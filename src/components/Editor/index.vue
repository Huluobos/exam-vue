<template>
   <editor 
   :api-key="apiKey" 
   :inline="inline" 
   :disabled='disabled'
   :init="tinyMCEOptions" 
   :tag-name="tagName" 
   :initial-value="initialValue"
   >
   </editor>
 
</template>

<script lang="ts">
  
import Editor from "./ts/index"
import {imageUpload} from "@/api/file"
const {VITE_TINY_FILE_URL } = process.env
const apiKey = "wylzjj83tvk7hjj75rvm3403xmu04authvgiklukgt77aj5m" //Huluobos key 2551889267@qq.com 
 // apiKey: "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc", //官方demo 
export default defineComponent({
  components: {
    editor: Editor
  },
  data() {
    return{
      initialValue:'Huluobos-TinyMCE', //编辑器初始化内容
      disabled:false, //是否禁用
      inline:true, //是否设置为内联模式
      tagName:'div',
      apiKey,
      
      tinyMCEOptions: {
        width: '100%',
        height: '100%',
        menubar: false,
        plugins: 'advlist link image lists',
        toolbar: [
          'bold italic underline code strikethrough undo redo'+
          ' image'+
          ' fontsize forecolor backcolor selectTags' +
          ' alignleft aligncenter alignright alignjustify' +
          ' hr lineheight subscript superscript'
        ],
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        images_upload_url: VITE_TINY_FILE_URL + '/manager/cardImage/imageUpload?r=n',
        /* and here's our custom image picker*/
         // 图片上传回调
        images_upload_handler: (blobInfo: any, success: Function) => {
          // console.log(blobInfo)
          // console.log(blobInfo.blob())
          imageUpload({ upload: blobInfo.blob(),ckCsrfToken:'19gty1YHJaz1p3GwOdtEXY7MUH34FQfGBkJnByAW' }).then(res => {  //这里就是要上传base64  格式的图片的请求了 
              console.log(res)
              // if (res.code == 200) {
              //   let url = res.data.domain + res.data.path
              //   success(url)
              //   console.log(url);
              // }
            })
        },
        // content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
        // CONFIG: ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致， `table`和`img`的问题基本就靠这个来填坑了
        content_style: `
            *                         { padding:0; margin:0; }
            html, body                { height:100%; }
            img                       { max-width:100%; display:block;height:auto; }
            a                         { text-decoration: none; }
            iframe                    { width: 100%; }
            p                         { line-height:1.6; margin: 0px; }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,

        insert_button_items: 'image link ', 
       //| inserttable
        object_resizing: true, //此选项允许您打开/关闭图像、表格或媒体对象的大小调整手柄。默认打开
        // Image
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',

      }
    }
  } 
})

</script>
