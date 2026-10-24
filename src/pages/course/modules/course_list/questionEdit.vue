<template>
    <div class="place-wrap">
        <el-page-header @back="backListClick" :content="popTitle">
        </el-page-header>
        <el-divider></el-divider>
        <el-form :model="popParams" :rules="rules" ref="form" label-width="150px">
            
          <el-form-item label="试卷名称：" prop="name">
            <el-input v-model="popParams.name" style="width:600px" placeholder="请输入试卷名称"></el-input>
          </el-form-item>

          <el-form-item label="试卷难度：" prop="difficulty_type" >
            <el-radio-group v-model=" popParams.difficulty_type">
            <el-radio :label="1">易</el-radio>
            <el-radio :label="2">中</el-radio>
            <el-radio :label="3">难</el-radio>
            </el-radio-group>
          </el-form-item>

        <el-form-item label="试卷奖励(分)：" prop="money">
          <el-input-number v-model="popParams.money" :max="20000" :min="0" placeholder="0~20000"></el-input-number>
        </el-form-item>

         <el-form-item label="达标题数：" prop="standard_num">
          <el-input-number v-model="popParams.standard_num" :max="255" :min="1" placeholder="1~255"></el-input-number>
        </el-form-item>


        <el-form-item label="每次答题数量：" prop="each_num">
          <el-input-number v-model="popParams.each_num" :max="255" :min="1" placeholder="1~255"></el-input-number>
        </el-form-item>

        <el-form-item label="问卷题目数量：" prop="total_num">
          <el-input-number v-model="popParams.total_num" :max="1000" :min="1" placeholder="1~1000"></el-input-number>
        </el-form-item>

        <el-form-item label="答题等待时间(秒)：" prop="wait_times">
            <el-input-number v-model="popParams.wait_times" :max="2000000" :min="1" placeholder="1~2000000"></el-input-number>
        </el-form-item>

        <el-form-item label="答题超时时间(秒)：" prop="timeout">
            <el-input-number v-model="popParams.timeout" :max="255" :min="1" placeholder="1~255"></el-input-number>
        </el-form-item>

       
        <el-form-item label="可参与次数：" prop="join_num">
          <el-input-number v-model="popParams.join_num" :max="255" :min="1" placeholder="1~255"></el-input-number>
        </el-form-item>

        <el-form-item label="考试人次：" prop="exam_num">
        <el-input-number v-model="popParams.exam_num" :max="200000" :min="0" placeholder="0~20000"></el-input-number>
      </el-form-item>
      <el-form-item label="考试递增人数：" prop="exam_num_step">
        <el-input-number v-model="popParams.exam_num_step" :max="200" :min="1" placeholder="1~20000"></el-input-number>
      </el-form-item>

      <el-form-item label="真实考试人次：" >
        <label class="el-form-item__label">{{popParams.exam_real_num}}</label>
      </el-form-item>

      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="popParams.sort" :max="200000" :min="1" placeholder="越大越靠前"></el-input-number>
      </el-form-item>

    
          <el-form-item label="">
               <el-button @click="submitForm('form')" type="primary" >保存</el-button>
          </el-form-item>
      </el-form>
    </div>

</template>
<script>

export default {
  props: {
    loading: Boolean,
    popParams: Object,
    popTitle:String,
  },
  components:{  },
  data() {
    return {
      formLabelWidth: '80px',

      multiple:false,
      limit:1,
      rules: {
        name: [
          { required: true,message: '请输入试卷名称',trigger: 'change' }
        ],
        money: [
          { type: 'number',required: true,message: '请输入奖励金额, 必须为数字值',trigger: 'change' },
        ],

        standard_num: [
          { type: 'number', required: true, message: '请输入达标分值, 必须为数字值', trigger: 'change' },
        ],

        difficulty_type: [
          { required: true,message: '请选择试卷难度',trigger: 'change' }
        ],


        wait_times: [
          { type: 'number', required: true, message: '请输入答题等待时间, 必须为数字值', trigger: 'change' },
        ],

        timeout: [
          { type: 'number', required: true, message: '请输入答题超时时间, 必须为数字值', trigger: 'change' },
        ],
        join_num: [
          { type: 'number', required: true, message: '请输入参与次数, 必须为数字值', trigger: 'change' },
        ],

      },
      
    rollType:5,
    


    };
  },

  created() { 
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType != 1 && this.rollType != 2) {
      this.$router.push({ name: 'Index' })
    }
  },
  methods: {
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if(valid) {


            this.$http.post(API.courseQuestionSave, this.popParams).then(res => {
                console.log(res)
                if (res.code === 200) {
                    this.$message.success('保存成功')
                    setTimeout(() => {
                        this.backListClick()
                    }, 1000);
                } else {
                    this.$message.error(res.msg?res.msg:'保存失败')
                }
            })
            .catch(error => {
                this.$message.error('保存失败')

            });
          // console.log(this.ruleForm)
        //   this.$emit('submitForm',this.ruleForm)
        } else {
          // console.log(formName, valid, "object")
          for (var i in object) {
            // console.log(i, object[i], "for")
            this.$message.error(object[i][0].message)
            return false
          }
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
