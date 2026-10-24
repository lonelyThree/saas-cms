<template>
    <div class="userForm-info">

        <el-form ref="userForm" :model="userForm" :rules="rules" label-width="150px">

             <el-form-item label="用户类型" prop="opType">
        <el-radio-group v-model="userForm.opType">
          <el-radio :label="1">用户</el-radio>
          <el-radio :label="2">业务员</el-radio>
          <el-radio :label="3">同步</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="openid：" prop="openid">
            <el-input v-model="userForm.openid" style="width:300px" placeholder="请输入openid"></el-input>
          </el-form-item>
           <el-form-item label="覆盖openid：" prop="sync_openid" v-if="userForm.opType === 3">
            <el-input v-model="userForm.sync_openid" style="width:300px" placeholder="请输入openid"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" align="right" class="dialog-footer">
            <el-button @click="cancelClick">
                取消
            </el-button>
            <el-button type="primary" :loading="submitLoading" @click="submitForm('userForm')">
                确定
            </el-button>
        </div>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            submitLoading: false,
            userForm: {
                opType: 1,
                openid: '',
            },
            rules: {
                    opType: [
                        { required: true, message: '请选择用户类型', trigger: 'change' }
                    ],
                openid: [
                    { required: true, required: true,message: '请输入openid',trigger: 'change'}
                ],
            }

        }
    },
    created() {
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.submitLoading = true
                    this.$http.post(API.userReset, this.userForm).then(res => {
                        const { code, msg } = res
                        if (code && code == 200) {
                            this.$message.success('重置成功')
                            this.cancelClick()
                        } else {
                            this.$message.error(msg)
                        }
                    }).finally(() => {
                        this.submitLoading = false
                    })

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

    .el-select,
    .el-input {
        width: 100%;
    }

    .item-tip {
        margin-bottom: 6px;
        color: #A9A9A9;
    }
}
</style>
