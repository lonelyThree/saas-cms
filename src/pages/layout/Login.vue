<template>
  <div class="container">
    <div class="title">药企营销管理系统</div>
    <div class="main">
      <el-input
        class="input-box"
        placeholder="请输入账号"
        prefix-icon="el-icon-user"
        clearable
        v-model="account"
      >
      </el-input>
      <el-input
        show-password
        placeholder="请输入密码"
        prefix-icon="el-icon-lock"
        clearable
        v-model="password"
      >
      </el-input>
      <el-button
        class="login-btn"
        type="primary"
        :loading="loginLoading"
        @click="login"
        >登录</el-button
      >
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
// import { mapActions } from 'vuex'
export default {
  data() {
    return {
      account: '',
      password: '',
      loginLoading: false,
    }
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown, true); //开启监听键盘按下事件
  },
  methods: {
    handleKeyDown(e){
      let key = null;
      if (window.event === undefined) {
        key = e.keyCode;
      } else {
        key = window.event.keyCode;
      }
      if (key === 13) {
        //触发的事件
        this.login();
      }
    },
    login() {
      if (this.account == '') return this.$message.error('请填写用户名')
      if (this.password == '') return this.$message.error('请填写密码')
      this.loginLoading = true
      this.$http
        .post(API.login, {
          name: this.account,
          password: this.password,
        })
        .then(res => {
          console.log("GetMenuList", API.login, res)
          if (res.code == 200) {
            this.$storage.set('PE_USER_INFO', res.data)
            this.GetMenuList()
          } else {
            this.loginLoading = false
            this.$message.error(res.msg)
          }
        })
    },
    GetMenuList() {
      // console.log("GetMenuList", API.getMenuList)
      this.$http.get(API.getMenuList).then(res => {
        this.loginLoading = false
        if (res.code == 200) {
          this.$storage.concat('PE_USER_INFO', { menuList: res.data })
          this.$store.dispatch('setMenuList')
          this.$router.push({ name: 'Index' })
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 100%;
  .title {
    font-size: 30px;
    font-weight: 300;
    color: #000;
    text-align: center;
    padding-top: 130px;
    margin-bottom: 50px;
  }
  .main {
    width: 335px;
    margin: 30px auto;
    .input-box {
      margin-bottom: 10px;
    }
    .login-btn {
      width: 100%;
      margin-top: 20px;
    }
  }
  .bottom {
    position: absolute;
    bottom: 30px;
    width: 100%;
    text-align: center;
    color: rgba(0, 0, 0, 0.5);
  }
}
</style>
