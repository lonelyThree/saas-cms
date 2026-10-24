<template>
  <el-dialog width="50%"
             :title="dialogState =='eidt'? '编辑':'新建'"
             :visible="dialogFormVisible"
             @close="resetForm('ruleForm')">
    <el-form :model="ruleForm"
             :rules="rules"
             ref="ruleForm">
      <el-form-item label="选择渠道"
                    :label-width="formLabelWidth"
                    prop="place_id">
        <el-select v-model="ruleForm.place_id"
                   filterable
                   :disabled="ruleForm.place_id && dialogState =='eidt'?true:false"
                   placeholder="请选择选择渠道">
          <el-option v-for="item in statusArr"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择类型"
                    :label-width="formLabelWidth"
                    prop="type">
        <el-select v-model="ruleForm.type"
        filterable
                   placeholder="请选择选择类型">
          <el-option v-for="item in typeArr"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板ID"
                    :label-width="formLabelWidth"
                    prop="temp">
        <el-input v-model="ruleForm.temp"
                  autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">取 消</el-button>
      <el-button type="primary"
                 @click="submitForm('ruleForm')"
                 :loading="loading">确 定</el-button>
    </div>
  </el-dialog>

</template>
<script>
export default {
  props: {
    dialogFormVisible: Boolean,
    statusArr: Array,
    typeArr: Array,
    loading: Boolean,
    ruleForm: Object,
    dialogState: String
  },
  data() {
    return {
      disBoole: false,
      formLabelWidth: '80px',
      rules: {
        place_id: [
          { required: true,message: '请选择渠道',trigger: 'change' }
        ],
        type: [
          { required: true,message: '请选择渠道',trigger: 'change' }
        ],
        temp: [
          { required: true,message: '请输入模板ID',trigger: 'blur' },
        ],
      },


    };
  },
  created() { },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          console.log(this.ruleForm)
          this.$emit('submitForm',this.ruleForm)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit('resetForm')
    }
  },
}
</script>
<style lang='scss' scoped>
</style>
