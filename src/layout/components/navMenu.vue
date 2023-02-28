<template>
  <div class="menu-box">
    <div class="header-content-box">
      <el-menu :default-active="activeIndex" mode="horizontal" class="el-menu-demo" :collapse="isCollapse"
        @select="selectNav">
        <router-link key="collapse" class="sidebar-logo-link" to="/login">
          <img src="@/assets/logo.png" class="logo" alt="">
        </router-link>
        <el-menu-item index="/" route="/">
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item v-if="getUserInfo && getUserInfo.roleId === 1" index="/exam">
          <template #title>考试管理</template>
        </el-menu-item>
        <el-menu-item index="/teacherMark">
          <template #title>网上阅卷</template>
        </el-menu-item>
        <el-menu-item index="/score">
          <template #title>成绩分析</template>
        </el-menu-item>
        <el-menu-item index="/sheetCard">
          <template #title>答题卡制作</template>
        </el-menu-item>
      </el-menu>
      <div class="useMessage">
          您好, {{ getUserInfo.schoName }} &nbsp;
          <span class="blue-text"> {{ getUserInfo ? getUserInfo.name : '' }}</span>老师
        <el-dropdown style="left: 2px; top: 2px;">
          <el-icon class="el-icon--right hoverBtn">
            <arrow-down />
          </el-icon>
<!--          <el-icon>-->
<!--            <arrow-up />-->
<!--          </el-icon>-->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="updPwdInfo" class="blue-text">修改密码</el-dropdown-item>
              <el-dropdown-item v-if="getUserInfo && getUserInfo.otherRoles.split(',').length > 1" @click="changeRoleInfo" class="blue-text">切换身份</el-dropdown-item>
              <el-dropdown-item class="blue-text">
                <router-link target="_blank" to="/downloadCenter">下载中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item class="blue-text" v-if="getUserInfo && getUserInfo.roleId == 1">
                <router-link target="_blank" to="/baseData/teacherManage">学校管理</router-link>
              </el-dropdown-item>
              <el-dropdown-item class="blue-text" @click="logOutBtn">退出登录</el-dropdown-item>

            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-dialog v-model="updPassword.updPasswordFlag" title="修改密码" destroy-on-close width="320px">
      <el-form class="formPassword" :model="updPassword" ref="formRef" :rules="rules" style="text-align: left;">
        <el-form-item>
          <span class="labelName">姓名</span>
          <!-- <div style="width: 200px; height: 32px; background: #f5f5f5; border-radius: 4px;">
            <span style="margin-left: 10px;">{{ getUserInfo ? getUserInfo.name : '' }}</span>
          </div> -->
          <el-input disabled :value="getUserInfo ? getUserInfo.name : '' "></el-input>
        </el-form-item>
        <el-form-item prop="oldPwd">
          <span class="labelName">旧密码</span>
          <span class="redRequired">*</span>
          <el-input v-model="updPassword.oldPwd" type="password" placeholder="旧密码">

          </el-input>
        </el-form-item>
        <el-form-item prop="newPwd">
          <span class="labelName">新密码</span>
          <span class="redRequired">*</span>
          <el-input v-model="updPassword.newPwd" type="password"  placeholder="8-20个字符">

          </el-input>
        </el-form-item>
        <el-form-item type="password" prop="confirmPwd">
          <span class="labelName">确认密码</span>
          <span class="redRequired">*</span>
          <el-input v-model="updPassword.confirmPwd" type="password" placeholder="确认密码">

          </el-input>
        </el-form-item>
        <el-form-item prop="mobile">
          <span class="labelName">确认手机号</span>
          <span class="redRequired">*</span>
          <el-input v-model="updPassword.mobile" maxlength="11" placeholder="确认手机号">
          </el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="2">
          <img src="../../assets/warning.png" style="width: 20px; height: 20px;" alt="">
        </el-col>
        <el-col :span="3">
          <span style="width: 32px; height: 16px; font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #ff9015; line-height: 16px;">注意</span>
        </el-col>
      </el-row>
      <div style="width: 249px; height: 32px; font-size: 12px; font-family: MicrosoftYaHei, sans-serif; color: #f33; line-height: 16px;">
        手机号为找回密码所用， 密码请使用8-20位数字+字母+特殊符号组合。
      </div>
      <template #footer>
        <el-button type="primary" @click="submitBtn(1)">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="changeRole.changeRoleInfoFlag" title="切换角色" destroy-on-close width="320px">
      <el-form label-width="72px" style="text-align: left;">
        <el-form-item label="账号姓名">
          <div style="width: 200px; height: 32px; background: #f5f5f5; border-radius: 4px;">
            <span style="margin-left: 10px;">{{ getUserInfo ? getUserInfo.name : '' }}</span>
          </div>
        </el-form-item>
        <el-form-item label="当前角色">
          <div style="width: 200px; height: 32px; background: #f5f5f5; border-radius: 4px;">
            <span style="margin-left: 10px;">{{ roleInfo[getUserInfo.roleId] }}</span>
          </div>
        </el-form-item>
        <el-form-item label="选择角色">
          <el-radio-group v-model="changeRole.curRole">
            <el-radio v-for="item in changeRole.roleList" :key="item" :label="item">
              {{ roleInfo[item] }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitBtn(2)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStoreWithOut } from '@/store/modules/user'
import { globalStoreWithOut } from '@/store/modules/global'
import { storeToRefs } from 'pinia'
import {changePassApi, loginAsApi, logoutApi} from "@/api/user";
import {ElMessage} from "element-plus";
const globalStore = globalStoreWithOut()
const {activeIndex} = storeToRefs(globalStore)
//
const router = useRouter()
const route = useRoute()
const getUserInfo = useUserStoreWithOut().getUserInfo
const updPassword = ref<any>({
  updPasswordFlag: false,
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
  mobile: ''
})
const changeRole = ref<any>({
  changeRoleInfoFlag: false,
  roleList: [],
  curRole: ''
})
const roleInfo =
    {
      "0": "系统管理员",
      "1": "管理员",
      "2": "任课教师",
      "3": "学生",
      "5": "班主任",
      "6": "家长",
      "8": "课表查看角色",
      "9": "校长",
      "12": "年级主任",
      "13": "备课组长",
      "14": "教研组长",
      "21": "省级管理",
      "22": "市级管理",
      "23": "省级管理",
      "90": "课程帮运营"
    }
const equalToPassword = (rule: any, value: any, callback: any) => {
  if (updPassword.value.newPwd !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const rules = ref({
  oldPwd: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
  newPwd: [{ required: true, message: "新密码不能为空", trigger: "blur" }, { min: 6, max: 20, message: "长度在 8 到 20 个字符", trigger: "blur" },
    { pattern: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/ , message: "请使用数字+字母+特殊符号", trigger: "blur" }],
  mobile: [{ required: true, message: "手机号码不能为空", trigger: "blur" },{ pattern: /^1[3456789][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }],
  confirmPwd: [{ required: true, message: "确认密码不能为空", trigger: "blur" }, { required: true, validator: equalToPassword, trigger: "blur" }]
});


const isCollapse = ref(false)
//选择菜单
const selectNav = (index: string) => {
  router.push(index)
}
const { proxy } = getCurrentInstance();
// 推出登录
const logOutBtn = () => {
  logoutApi().then((res: any) => {
    if (res.success) {
      useUserStoreWithOut().logout().then(() => {
        router.push('/login')
      })
    }
  })
}

const updPwdInfo = () => {
  updPassword.value = {
    updPasswordFlag: true,
    oldPwd: '',
    newPwd: '',
    confirmPwd: '',
    mobile: ''
  }
}

const changeRoleInfo = () => {
  changeRole.value = {
    changeRoleInfoFlag: true,
    roleList: getUserInfo.otherRoles.split(','),
    curRole: getUserInfo.roleId + ''
  }
}

const submitBtn = (type: number) => {
  if (type === 1) {
    proxy.$refs.formRef.validate((valid: any) => {
      if (valid) {
        const params = {
          oldpass: updPassword.value.oldPwd,
          password: updPassword.value.newPwd,
          mobile: updPassword.value.mobile,
        }
        changePassApi(params).then( (res: any) => {
          if (res.success) {
            logOutBtn()
          } else {
            ElMessage.error(res.message)
          }
        })
      } else {
        return false
      }
    })
  } else if (type === 2) {
    const params = {
      targetRoleId: changeRole.value.curRole
    }
    loginAsApi(params).then( (res: any) => {
      if (res.success) {
        router.go(0)
      }
    })
  }
}

watch(() => route, (newPath, oldPath) => {
  const nav: any = newPath.meta.nav ? newPath.meta.nav : ''
  globalStore.setActiveIndex( "/" + nav)
}, { deep: true, immediate: true})




</script>
<style scoped lang="scss">
  // 表单label样式
.formPassword{
    :deep(.el-form-item__content){
      flex-wrap: nowrap;
    }
    .labelName{
      display: inline-block;
      width: 110px;
      padding-right:10px;
      text-align: justify;
      text-align-last: justify;
    }
    .redRequired{
      top: 2px;
      left: 73px;
    }
  }
</style>
<style scoped lang="scss">
  
.menu-box {
  width: 100%;
}

.header-content-box {
  width: 1320px;
  margin: 0 auto;
  position: relative;
}

.logo {
  height: 62px;
  margin-top: 8px;
}

.el-menu--horizontal > .el-menu-item {
  height: 70px;
  color: #202020;
  font-size: 16px;
}
.el-menu--horizontal>.el-menu-item.is-active{
  border-bottom: 0px solid var(--el-menu-active-color);
  // border-radius: 5px 5px  0px 0px;
  font-weight: bold;
}
.el-menu--horizontal>.el-menu-item.is-active::after{
  content: "";
  width: 100%;
  height: 0px;
  border-top:4px solid var(--el-menu-active-color);
  border-radius: 4px 4px 0 0;
  background-color: var(--el-menu-active-color);
  position: absolute;
  bottom: 0;
  left: 0;
}

.useMessage {
  position: absolute;
  right: 0;
  top: 35px;
  margin-top: -10px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  color: #202020;
}

:deep(.el-dialog__body) {
  padding: 20px 20px 0 !important;
}

.el-dropdown-menu {
  min-width: 88px;
}

.el-dropdown-menu__item:hover {
  color: #4381e5;
  cursor: pointer;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
  background-color: #fff;
}

.hoverBtn:hover,
.hoverBtn:active,
el-dropdown__popper:hover,
el-dropdown__popper:active {
  transform: rotateZ(180deg);
}
</style>
