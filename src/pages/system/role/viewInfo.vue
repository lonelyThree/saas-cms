<template>
  <div
    class="roleForm-info"
  >
    <el-form
      ref="roleForm"
      :model="roleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-row :gutter="10">
        <el-col :span="22">
          <el-form-item
            label="角色编码"
            prop="code"
          >
            <el-input
              v-model="roleForm.code"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item
            label="角色名称"
            prop="name"
          >
            <el-input
              v-model="roleForm.name"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item
            label="角色状态"
            prop="flag"
          >
            <el-radio-group v-model="roleForm.flag">
              <el-radio
                v-for="item in flagList"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
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
        @click="submitForm('roleForm')"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    roleInfo: {
      type: Object,
      required: false
    },
    showDialog: {
      type: Boolean
    },
  },
  data() {
    return {
      apiFn: '',
      flagList: [
        { label: '正常', value: 0 },
        { label: '禁用', value: 1 }
      ],
      isEdit: false,
      submitLoading: false,
      roleForm: {
        code: '',
        name: '',
        flag: 0
      },
      rules: {
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.onChange(this.roleInfo)
  },
  watch: {
    showDialog(newValue) {
      if (newValue) {
        this.onChange(this.roleInfo)
      }
    },
  },
  methods: {
    async onChange(roleInfo) {
      if (roleInfo.id && roleInfo.id !== 0) {
        this.isEdit = true
        const { id, code, name, flag } = roleInfo
        this.roleForm =  { id, code, name, flag }
      } else {
        this.isEdit = false
        this.roleForm.code = ''
        this.roleForm.name = ''
        this.roleForm.flag = 0
      }
    },
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          if(this.isEdit) {
            this.$http.post(API.editRole, this.roleForm).then(res => {
              const { status } = res
              if (status && status == 200) {
                this.$message.success('修改成功')
                _this.$emit('loadData')
                _this.cancelClick()
                _this.resetForm()
              } else {
                this.$message.error(res.message)
              }
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            this.$http.post(API.addRole, this.roleForm).then(res => {
              const { status } = res
              if (status && status == 200) {
                this.$message.success('创建成功')
                _this.$emit('loadData')
                _this.cancelClick()
              } else {
                this.$message.error(res.message)
              }
            }).finally(() => {
              this.submitLoading = false
            })
          }

        }
      })
    },
    cancelClick() {
      this.resetForm()
      this.$emit('closeDialog')
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs['roleForm'].resetFields()
      })

    },
  }
}
</script>
<style lang="scss" scoped>
.roleForm-info {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  .el-select, .el-input {
    width: 100%;
  }
}
</style>

