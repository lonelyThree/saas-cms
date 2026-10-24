<template>
  <div
    class="userForm-info"
  >
  <el-page-header @back="cancelClick" >
            </el-page-header>
            <el-divider></el-divider>

    <el-form
      ref="userForm"
      :model="userForm"
      :rules="rules"
      label-width="150px"
    >
      <el-row :gutter="10">
        <el-col :span="22">
          <el-form-item
            label="邮箱"
            prop="email"
          >
            <el-input
              v-model="userForm.email"
              clearable
              :disabled="isEdit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input
              v-model="userForm.password"
              auto-complete="new-password"
              :type="'password'"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item
            label="确认密码"
            prop="confirmPassword"
          >
            <el-input
              v-model="userForm.confirmPassword"
              :type="'password'"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div
      slot="footer"
      align="right"
      class="dialog-footer"
    >
      <el-button @click="cancelClick">
        取消
      </el-button>
      <el-button
        type="primary"
        :loading="submitLoading"
        @click="submitForm('userForm')"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import { roleList } from "./ConstConfig";
import { validEmail, validatorFn, isValidPassword } from '@/utils/validate'

export default {
  components: {},
  props: {
    userInfo: {
      type: Object,
      required: false
    },
    pwdDialog: {
      type: Boolean
    },
    popTitle:{
      type: String,
    },

  },
  data() {
    return {
      isEdit: false,
      submitLoading: false,
      userForm: {
        profileId: '',
        password: '', // 密码
        email: '', // 电子邮件
        confirmPassword:'',
      },
      rules: {
        password: [ {
          required: true,
          trigger: 'blur',
          validator: validatorFn({
            required: true,
            nullMsg: '请输入密码',
            errorMsg: '密码必须8到30位，且不能出现空格,必须包含大小写，数组，特殊符号',
            validateFn: isValidPassword
          })
        } ],
        email: [
          { required: true, trigger: 'blur', validator: validEmail }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: this.validConfirmPassword }
        ],
      }

    }
  },
  created() {
    console.log(this.userInfo, "==userInfo=")
    this.onChange(this.userInfo)
  },
  watch: {
    pwdDialog(newValue) {
      if (newValue) {
        this.onChange(this.userInfo)
      }
    },
  },
  methods: {
    validConfirmPassword (rule, value, callback){
      const { password } = this.userForm
      if (!value) {
        callback(new Error('请输入确认密码'))
      } else if (value !== password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    },
    storeChange(val){
    },
    async onChange(userInfo) {
      console.log(userInfo, "==onChange=userInfo=", userInfo.profileId,  userInfo.id)
      if (userInfo.profileId && userInfo.profileId !== 0) {
        this.getEmail(userInfo.profileId)
        this.isEdit = true
        this.userForm.profileId = userInfo.profileId
      }
    },
    getEmail(profileId){
      this.$http.post(API.getUserEmail, { id: profileId }).then(res => {
        if (res.status == 200) {
          this.userForm.email = res.data.email
        } else {
          this.$message.error(res.message)
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid, object) => {
        if (valid) {
          this.submitLoading = true
          this.$http.post(API.setPwd, this.userForm).then(res => {
            const { status } = res
            if (status && status == 200) {
              this.$message.success('重置成功')
              this.$emit('loadData')
              this.cancelClick()
            } else {
              this.$message.error(res.message)
            }
          }).finally(() => {
            this.submitLoading = false
          })

        } else {
          for (var i in object) {
            this.$message.error(object[i][0].message)
            return false
          }
          return false;
        }
      })
    },
    cancelClick() {
      this.resetForm()
      this.$emit('closeDialog')
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs['userForm'].resetFields()
      })

    },
  }
}
</script>
<style lang="scss" scoped>
.userForm-info {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }

  .el-select, .el-input {
    width: 100%;
  }

  .item-tip {
    margin-bottom: 6px;
    color: #A9A9A9;
  }
}
</style>

