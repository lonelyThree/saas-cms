<template>
  <div class="container">
    <a class="cms-skip-link" href="#cms-main-content">跳到主内容</a>
    <div class="topbar-wrap">
      <div class="topbar-brand">
        <span class="topbar-logo">{{ avatarChar }}</span>
        <span class="topbar-title">药企营销管理系统</span>
      </div>
      <div class="topbar-actions">
        <el-badge is-dot class="topbar-notice">
          <i class="el-icon-bell topbar-icon" title="消息通知"></i>
        </el-badge>
        <span class="topbar-divider"></span>
        <screenfull class="topbar-screenfull"></screenfull>
        <span class="topbar-divider"></span>
        <el-dropdown trigger="click">
          <span class="userinfo-inner">
            <span class="user-avatar">{{ avatarChar }}</span>
            <span class="user-name">{{ nickname }}</span>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showModifyPasswordDialog = true">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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
              :key="'menu-' + index"
              :index="'/' + el.children[0].path"
            >
              <i :class="el.icon"></i>
              <span slot="title">{{ el.children[0].meta.title }}</span>
            </el-menu-item>
            <el-submenu v-else :index="el.path" :key="'submenu-' + index">
              <template slot="title">
                <i :class="el.icon"></i>
                <span slot="title">{{ el.meta.title }}</span>
              </template>
              <el-menu-item
                v-for="(child, childIndex) in el.children"
                :key="childIndex"
                :index="el.path + '/' + child.path"
              >
                {{ child.meta.title }}
              </el-menu-item>
            </el-submenu>
          </template>
          <el-menu-item v-if="menuList.length == 0">
            没有权限请找管理员
          </el-menu-item>
        </el-menu>
      </aside>
      <!--右侧内容区-->
      <section id="cms-main-content" class="content-container" tabindex="-1">
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
    avatarChar() {
      return (this.nickname || '?').charAt(0).toUpperCase()
    },
  },
  components: {
    Screenfull,
  },
  data() {
    return {
      nickname: (((this.$storage.get('PE_USER_INFO') || {}).info || {}).currentLoginName) || '',
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
      logoutTimer: null,
    }
  },

  created() {
    // console.log(this.$store.state.menu.menu)
  },
  beforeDestroy() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer)
      this.logoutTimer = null
    }
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
          return this.$http
            .get(API.logout)
            .then(res => {
              if (res.code !== 200) {
                this.$message.error(res.msg || res.message || '退出失败')
                return
              }
              this.$message.success('退出登录成功')
            })
            .catch(() => {
              this.$message.warning('退出请求失败，已清除本地登录状态')
            })
            .then(() => {
              this.$storage.remove('PE_USER_INFO')
              this.clearMenuList()
              const navigation = this.$router.push({ name: 'Login' })
              if (navigation && typeof navigation.catch === 'function') {
                navigation.catch(() => {})
              }
              loadingInstance.close()
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
                if (this.logoutTimer) clearTimeout(this.logoutTimer)
                this.logoutTimer = setTimeout(() => {
                  this.logoutTimer = null
                  this.$storage.remove('PE_USER_INFO')
                  this.clearMenuList()
                  const navigation = this.$router.push({ name: 'Login' })
                  if (navigation && typeof navigation.catch === 'function') {
                    navigation.catch(() => {})
                  }
                }, 500)
              } else {
                this.$message.error(res.msg || res.message || '修改密码失败')
              }
            })
            .catch(() => {
              this.modifyPasswordDialogConfirmBtnLoading = false
              this.$message.error('修改密码请求失败，请稍后重试')
            })
        } else {
          this.$message.error('请检查表单填写是否正确')
          return false
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
    height: 56px;
    background: var(--cms-topbar-bg);
    border-bottom: 1px solid var(--cms-sidebar-line);
    display: flex;
    align-items: center;
    padding: 0 20px;

    .topbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .topbar-logo {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: var(--cms-primary);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .topbar-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--cms-text-main);
      white-space: nowrap;
    }

    .topbar-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 16px;
      height: 100%;
    }

    .topbar-icon {
      font-size: 18px;
      color: var(--cms-text-sub);
      cursor: pointer;
      vertical-align: middle;
    }

    .topbar-divider {
      width: 1px;
      height: 18px;
      background: var(--cms-sidebar-line);
      flex-shrink: 0;
    }

    .topbar-screenfull {
      color: var(--cms-text-sub);
      display: flex;
      align-items: center;
    }

    .userinfo-inner {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--cms-text-main);
    }

    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--cms-primary);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .user-name {
      font-size: 13px;
      font-weight: 500;
    }
  }
  .main {
    position: absolute;
    top: 56px;
    bottom: 0px;
    display: flex;
    width: 100%;
    overflow: hidden;
  }
  aside {
    min-width: 50px;
    background: var(--cms-bg-panel);
    border-right: 1px solid var(--cms-sidebar-line);
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

      // 一级菜单文字：深色，激活绿色
      > .el-menu-item,
      > .el-submenu > .el-submenu__title {
        color: var(--cms-text-main);

        i {
          color: var(--cms-text-sub);
          font-size: 16px;
          margin-right: 4px;
        }
      }

      // 二级菜单容器：浅灰底形成层级
      .el-submenu .el-menu {
        background-color: #f7f9fc !important;
      }

      // 二级菜单文字：灰、缩进更深
      .el-submenu .el-menu-item {
        color: var(--cms-text-sub);
        padding-left: 56px !important;

        &.is-active {
          color: var(--cms-primary);
          font-weight: 600;
        }
      }

      .el-submenu .el-menu-item.is-active,
      .el-menu-item.is-active,
      .el-submenu .el-menu-item.is-active:hover,
      .el-menu-item.is-active:hover {
        position: relative;
        background-color: var(--cms-primary-light);
        color: var(--cms-primary);

        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--cms-primary);
        }
      }

      .leaf-menu-item.el-menu-item.is-active,
      .el-submenu.is-active .el-submenu__title span,
      .el-submenu.is-active .el-submenu__title i {
        color: var(--cms-primary);
        background-color: transparent;
      }

      // 激活的一级菜单图标高亮
      > .el-menu-item.is-active i,
      > .el-submenu.is-active > .el-submenu__title i {
        color: var(--cms-primary);
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
      height: 42px;
      line-height: 42px;
      // padding-left: 55px !important;
    }
  }

  .menu-toggle {
    background: transparent;
    text-align: center;
    color: var(--cms-text-sub);
    height: 26px;
    line-height: 30px;
    cursor: pointer;
  }

  .content-container {
    background: var(--cms-bg-page);
    flex: 1;
    overflow-y: auto;
    padding: 14px 6px 1px;
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
