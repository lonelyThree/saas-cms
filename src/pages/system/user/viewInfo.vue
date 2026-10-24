<template>
  <div
    class="userForm-info"
  >
  <el-page-header @back="backListClick" :content="popTitle">
          </el-page-header>
          <el-divider></el-divider>
    <el-form :model="popParams" :rules="rules" ref="form" label-width="150px">

          <el-form-item
            label="邮箱"
            prop="account"
          >
            <el-input
              v-model="popParams.account"
              clearable
              :disabled="isEdit"
              style="width:200px" 
            />
          </el-form-item>



          <el-form-item
            v-if="!isEdit"
            label="密码"
            prop="password"
          >
            <el-input
              v-model="popParams.password"
              auto-complete="new-password"
              :type="'password'"
              clearable
              style="width:200px" 
            />
          </el-form-item>
          
          <el-form-item
            v-if="!isEdit"
            label="确认密码"
            prop="confirmPassword"
          >
            <el-input
              v-model="popParams.confirmPassword"
              :type="'password'"
              clearable
              style="width:200px" 
            />
          </el-form-item>
          
          <el-form-item
            label="角色"
            prop="type"
          >
            <el-select v-model="popParams.type" clearable filterable placeholder="请选择角色" 
                  style="width:200px" >
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="渠道"
            prop="place_id"
            v-if="popParams.type == 2 || popParams.type == 5"
          >
            <el-select v-model="popParams.place_id" filterable clearable placeholder="请选择渠道" 
                  style="width:200px" >
              <el-option
                v-for="item in placeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="popParams.remark"
              clearable
              :disabled="isEdit"
              style="width:600px" 
            />
          </el-form-item>



          <el-form-item label="">
                     <el-button @click="submitForm('form')" type="primary" >确定</el-button>
                </el-form-item>


    </el-form>
  </div>
</template>

<script>
import { roleList } from "./ConstConfig";
import { validEmail, validatorFn, isValidPassword } from '../../../utils/validate'

export default {
  components: {},
  props: {
    editPopParams: {
      type: Object,
      required: false
    },

    popTitle:{
      type: String,
    },


    placeList: {
      type: Array,
      required: false
    },
  },
  data() {
    return {
      apiFn: '',
      roleList: roleList,
      // placeList:[],
      storeList: [],
      chainList: [],
      isEdit: false,
      submitLoading: false,
      popParams: {
        password: '', // 密码
        confirmPassword: '',
        account: '', // 电子邮件
        type: 0,
        place_id: 0,
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
        account: [
          { required: true, trigger: 'blur', validator: validEmail }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: this.validConfirmPassword }
        ],
        type: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        place_id: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
      }

    }
  },
  created() {
    this.popParams = this.editPopParams
    var rollType = this.$storage.get('PE_USER_INFO').type
    rollType != 1 ? this.roleList.shift() : ''
    // console.log(this.placeList, "placeList==placeList")
    // self.getPlaceListList()

  },
  mounted() {
  },
  methods: {
    backListClick() {
      this.$emit('backList', this.ruleForm)
    },
    getPlaceListList() {
      this.$http.get(API.getAllPlace).then(res => {
        const { status, data } = res
        if (status && status == 200) {
          this.placeList = data && Array.isArray(data) ? data: []
        } else {
          this.$message.error(res.message)
        }
      })
    },
    
    validConfirmPassword (rule, value, callback){
      const { password } = this.popParams
      if (!value) {
        callback(new Error('请输入确认密码'))
      } else if (value !== password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.$http.post(API.userSave, this.popParams).then(res => {
            const { code } = res
            if (code && code == 200) {
              this.$message.success('修改成功')
              this.backListClick()
            } else {
              this.$message.error(res.message)
            }
          }).finally(() => {
            this.submitLoading = false
          })

        }
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

