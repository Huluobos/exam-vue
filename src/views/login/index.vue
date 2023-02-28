<template>
  <div class="login-wrapper">
    <div class="header-box">
      <div class="header">
        <div class="logo">
          <img src="@/assets/logo.png"/>
        </div>
      </div>
    </div>
    <div class="login-container">
      <div class="login-background"></div>
      <div class="login-bg">
        <div class="login-img"></div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          class="login-form"
          auto-complete="on"
          label-position="left"
          @keyup.enter.native="doLogin"
        >
          <div class="title">
            登&nbsp;&nbsp;&nbsp;&nbsp;录
          </div>
          <el-form-item prop="loginText">
            <el-input
              ref="loginText"
              v-model="loginForm.loginText"
              placeholder="请输入账号"
              name="loginText"
              type="text"
              tabindex="1"
              maxlength="20"
              auto-complete="off"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item prop="loginPass">
            <el-input
              ref="password"
              v-model="loginForm.loginPass"
              type="password"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              maxlength="20"
              auto-complete="off"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="login-btn"
            @click.native.prevent="doLogin"
          >
            登&nbsp;&nbsp;&nbsp;&nbsp;录
          </el-button>
        </el-form>
        <div class="footer">
          <div class="footer-container">
            <p style="font-size: 14px;margin: 20px 0 10px 0;">总部地址：北京市朝阳区东土城路8号林达大厦A座14层
              &nbsp;&nbsp;&nbsp;&nbsp;邮箱：support@dinsmooth.com
              &nbsp;&nbsp;&nbsp;&nbsp;客服电话：4008-565-868</p>
            <p style="font-size: 12px;margin: 15px 0 10px 0;">©2015-2022 All Right Reserved. 北京课程帮科技有限公司
              and
              Privace Policy
              &nbsp;&nbsp;&nbsp; <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">京ICP备2021010961号</a>
              &nbsp;&nbsp;&nbsp;<img src="@/assets/jinghui.png" alt="报备">
              <a target="_blank" rel="noopener noreferrer" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502032774">京公网安备11010502032774号</a>
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang='ts'>
  import {encrypt} from '@/util/aesUtil'
  // FormRules
  import { ElMessage,FormInstance  } from 'element-plus'
  import { useUserStoreWithOut } from '@/store/modules/user'
  import { User,Lock } from '@element-plus/icons-vue'

  const loginFormRef = ref<FormInstance>()
  const router = useRouter()
  const loading = ref<boolean>(false)
  const loginForm = reactive({
    loginText: '',
    loginPass: ''
  })

  function doLogin() {
    loading.value = true
    const userStore = useUserStoreWithOut()
    if (!loginForm.loginText || !loginForm.loginPass){
      ElMessage({
        message: '请输入账号密码',
        type: 'warning',
      })
      loading.value = false
      return
    }

    userStore.login({
      userName: encrypt(loginForm.loginText),
      password: encrypt(loginForm.loginPass)
    }).then((res) => {
      console.log(res)
      const {success, message} = res
      if (success) {
        router.push('/')
      } else {
        ElMessage({
          message: message,
          type: 'warning',
        })
      }
      loading.value = false
    }).catch((e)=>{
      loading.value = false
      ElMessage({
        message: '请求异常，请检查网络',
        type: 'warning',
      })
    })
  }

  const rules = reactive<FormRules>({
    loginText: [
      { required: true, message: '请输入账号', trigger: 'blur' }
    ],loginPass: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ],
  })


</script>

<style lang="scss" scoped>

  .login-wrapper{
    width: 100%;
    height: 100%;
    min-width: 1320px;
    background: linear-gradient(180deg, #309AFF 0%, #1C6AD9 100%);
    .header-box {
      background: #FFFFFF;
      width: 100%;
      box-shadow: 0px 6px 15px 0px rgba(68,129,229,0.15);
      .header {
        width: 1320px;
        margin: 0 auto;
        height: 70px;
        .logo {
          height: 70px;
          width: 271px;
          padding-top: 10px;
        }
      }
    }
    .login-container {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      min-height: 600px;
      position: relative;
      top: 0px;
      .login-background{
        background-image: url("@/assets/login/login-bg.png");
        background-repeat: no-repeat;
        background-size: 100%;
        // height: 1898px;
        height: calc(100vh - 75px);
        width: 100%;
        position: absolute;
        left: 0px;
      }
      .login-bg {
        width: 1320px;
        margin: 0 auto;
        // height: 1898px;
        min-height: 700px;
        height: calc(100vh - 75px);
        position: relative;
        .login-img{
          position: absolute;
          overflow: hidden;
          top: 0;
          width: 1320px;
          min-height: 650px;
          height: calc(100vh - 275px);
          background-image: url("@/assets/login/login-img.png");
          background-repeat:no-repeat;
          background-position-y: -70px;
        }
        .login-form {
          position: absolute;
          right: 100px;
          top: 150px;
          width: 430px;
          padding: 0 40px;
          background: #fff;
          -webkit-box-shadow: 0px 7px 11px 0px rgba(131, 157, 238, 0.3);
          box-shadow: 0px 7px 11px 0px rgba(131, 157, 238, 0.3);
          border-radius: 8px;

          .title {
            font-size: 18px;
            color: #202020;
            text-align: center;
            line-height: 22px;
            font-weight: 700;
            margin-top: 28px;
            margin-bottom: 28px;
          }

          .login-btn {
            width: 100%;
            height: 40px;
            background: linear-gradient(270deg, #5BA6FE 0%, #4381E5 100%);
            border-radius: 4px;
            margin-bottom: 66px;
            margin-top: 10px;
          }

          .login-btn:active {
            background: linear-gradient(270deg, #0D6DDD 0%, #2259B2 100%);
          }
        }
      }
      .footer{
        width: 1320px;
        background-color: transparent;
        color: #FFFFFF;
        height: 100px;
        position: absolute;
        // top: 800px;
        bottom: 0px;
        .footer-container{
          margin: 0 auto;
          width: 1320px;
          text-align: center;
          img{
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
    }
  }


</style>
