<template>
  <div class="container">
    <div class="topbar-wrap">
      <div class="topbar-title">药企营销管理系统</div>
      <div class="topbar-account">
        <el-dropdown trigger="click">
          <span class="userinfo-inner">
            {{ nickname }} <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showModifyPasswordDialog = true">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <screenfull class="topbar-screenfull fr"></screenfull>
    </div>
    <div class="main">
      <!--左侧导航-->
      <aside :class="{ 'show-sidebar': !collapsed }">
        <div class="menu-toggle" @click="collapse">
          <i class="el-icon-s-unfold" v-if="collapsed"></i>
          <i class="el-icon-s-fold" v-else></i>
        </div>
        <!-- 最多支持两级菜单 -->
        <el-menu
          :default-active="$route.path"
          router
          :collapse="collapsed"
          unique-opened
          :default-openeds="openeds"
          
        >
          <template v-for="(el, index) in menuList">
            <el-menu-item
              class="leaf-menu-item"
              v-if="el.leaf"
              :key="index"
              :index="'/' + el.children[0].path"
            >
              <i :class="el.icon"></i>
              <span slot="title">{{ el.children[0].meta.title }}</span>
            </el-menu-item>
            <el-submenu v-else :index="el.path" :key="index">
              <template slot="title">
                <i :class="el.icon"></i>
                <span slot="title">{{ el.meta.title }}</span>
              </template>
              <template v-for="(child, childIndex) in el.children">
                <span :key="childIndex">
                  <el-menu-item :index="el.path + '/' + child.path">
                    {{ child.meta.title }}
                  </el-menu-item>
                </span>
              </template>
            </el-submenu>
          </template>
          <el-menu-item v-if="menuList.length == 0">
            没有权限请找管理员
          </el-menu-item>
        </el-menu>
      </aside>
      <!--右侧内容区-->
      <section class="content-container">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </section>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog
      :visible.sync="showModifyPasswordDialog"
      title="修改密码"
      width="600px"
      class="modify-password-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="cancelModifyPassword"
    >
      <el-form
        ref="modifyPassword"
        label-width="150px"
        :model="modifyPasswordForm"
        :rules="modifyPasswordFormRules"
      >
        <el-form-item label="旧密码" prop="old">
          <el-input
            class="input-box"
            v-model="modifyPasswordForm.old"
            placeholder="请输入旧密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new">
          <el-input
            class="input-box"
            v-model="modifyPasswordForm.new"
            placeholder="请输入新密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="repeatNew">
          <el-input
            class="input-box"
            v-model="modifyPasswordForm.repeatNew"
            placeholder="请重复新密码"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModifyPassword">取 消</el-button>
        <el-button
          type="primary"
          :loading="modifyPasswordDialogConfirmBtnLoading"
          @click="confirmModifyPassword"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Screenfull from '@/pages/layout/components/Screenfull'
import { mapGetters, mapActions } from 'vuex'

var passwordInputRule = {
  trigger: 'blur',
  message: '长度在 8 到 30 个字符，必须包含大小写，数字，特殊符号~!@#$%^&*()',
  pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*()])[a-zA-Z~!@#$%^&*()0-9]{3,18}$/g,
}

export default {
  computed: {
    ...mapGetters(['menuList']),
  },
  components: {
    Screenfull,
  },
  data() {
    return {
      nickname: this.$storage.get('PE_USER_INFO').info.currentLoginName || '',
      collapsed: false,
      showModifyPasswordDialog: false,
      openeds:['/activity', '/system'],
      modifyPasswordForm: { old: '', new: '', repeatNew: '' },
      modifyPasswordFormRules: {
        old: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        new: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          passwordInputRule,
        ],
        repeatNew: [
          { required: true, message: '请重复新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value != this.modifyPasswordForm.new) {
                callback(new Error('两次密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      modifyPasswordDialogConfirmBtnLoading: false,
    }
  },

  created() {
    // console.log(this.$store.state.menu.menu)
    console.log(this.menuList, this.$route.path)
  },

  methods: {
    ...mapActions(['clearMenuList']),
    collapse() {
      this.collapsed = !this.collapsed
    },
    logout() {
      this.$confirm('确定退出吗?', '提示', {
        confirmButtonClass: 'el-button--warning',
      })
        .then(() => {
          var loadingInstance = this.$loading({ fullscreen: true })
          this.$http.get(API.logout).then(res => {
            loadingInstance.close()
            if (res.code == 200) {
              this.$storage.clear()
              this.clearMenuList()
              this.$router.push({ name: 'Login' })
              this.$message.success('退出登录成功')
            } else {
              this.$message.error(res.mag)
            }
          })
        })
        .catch(() => {})
    },
    cancelModifyPassword() {
      this.showModifyPasswordDialog = false
      this.$refs.modifyPassword.resetFields()
    },
    confirmModifyPassword() {
      this.$refs.modifyPassword.validate(valid => {
        if (valid) {
          this.modifyPasswordDialogConfirmBtnLoading = true
          this.$http
            .post(API.updatepwd, {
              old: this.modifyPasswordForm.old,
              password: this.modifyPasswordForm.new,
            })
            .then(res => {
              this.modifyPasswordDialogConfirmBtnLoading = false
              if (res.code == 200) {
                this.$message.success('修改密码成功， 请重新登录')
                this.cancelModifyPassword()
                setTimeout(() => {
                  this.$storage.clear()
                  this.clearMenuList()
                  this.$router.push({ name: 'Login' })
                }, 500);
              } else {
                this.$message.error(res.msg)
              }
            })
        } else {
          for (var i in object) {
            // console.log(i, object[i], "for")
            this.$message.error(object[i][0].message)
            return false
          }
          return false;
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
  .topbar-wrap {
    height: 50px;
    line-height: 50px;
    background: linear-gradient(45deg, #1278f6, #00b4aa 50%, #1278f6);
    padding: 0;
    .topbar-title {
      float: left;
      text-align: left;
      width: 200px;
      font-size: 18px;
      color: #fff;
      padding-left: 30px;
    }
    .topbar-account {
      float: right;
      padding-right: 12px;
    }
    .topbar-screenfull {
      padding: 14px;
    }
    .userinfo-inner {
      cursor: pointer;
      color: #fff;
      padding-left: 10px;
    }
  }
  .main {
    position: absolute;
    top: 50px;
    bottom: 0px;
    display: flex;
    width: 100%;
    overflow: hidden;
  }
  aside {
    min-width: 50px;
    background: #090723;
    padding-bottom: 30px;
    &::-webkit-scrollbar {
      display: none;
    }
    &.show-sidebar {
      overflow-x: hidden;
      overflow-y: auto;
    }
    /deep/ .el-menu {
      width: 180px;
      background-color: transparent;
      border-radius: 0;
      border-right: 0;
      .el-submenu .el-menu-item.is-active,
      .el-menu-item.is-active,
      .el-submenu .el-menu-item.is-active:hover,
      .el-menu-item.is-active:hover {
        background-color: #00c1de;
        color: #fff;
      }

      .leaf-menu-item.el-menu-item.is-active,
      .el-submenu.is-active .el-submenu__title span,
      .el-submenu.is-active .el-submenu__title i {
        color: #00c1de;
        background-color: transparent;
      }
    }

    .el-submenu .el-menu-item {
      min-width: 60px;
    }

    .el-menu--collapse {
      width: 60px;
    }

    .el-menu .el-menu-item,
    .el-submenu .el-submenu__title {
      height: 46px;
      line-height: 46px;
      // padding-left: 55px !important;
    }

    //   .el-menu-item:hover,
    //   .el-submenu .el-menu-item:hover,
    //   .el-submenu__title:hover {
    //     // background-color: #7ed2df;
    //   }
  }

  .menu-toggle {
    background: transparent;
    text-align: center;
    color: white;
    height: 26px;
    line-height: 30px;
    cursor: pointer;
  }

  .content-container {
    background: #fff;
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    padding-bottom: 1px;
    .content-wrapper {
      background-color: #fff;
      box-sizing: border-box;
    }
  }

  .modify-password-dialog {
    .input-box {
      width: 200px;
    }
  }
}
</style>
