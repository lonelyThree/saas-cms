<template>
  <div class="place-wrap">
    <el-page-header @back="backListClick" :content="popTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-form :model="popParams" :rules="rules" ref="form" label-width="150px">
      <el-form-item label="选择渠道：" prop="place_id" v-if="rollType == 1">
        <el-select style="width: 300px;" v-model="popParams.place_id" :disabled="editMode == 1" clearable filterable>
          <el-option v-for="item in incomePlaceList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师名称：" prop="name">
        <el-input v-model="popParams.name" style="width:600px" placeholder="请输入讲师名称"></el-input>
      </el-form-item>

      <el-form-item label="讲师职称：" prop="title">
        <el-input v-model="popParams.title" style="width:600px" placeholder="请输入讲师名称"></el-input>
      </el-form-item>

      <el-form-item class="is-required" label="讲师头像：" prop="avatar">
        <UploadSingleImg :initOssToken="true" uploadName="avatar" :imgUrl="popParams.avatar"
          :ossToken="aliyunOssToken" @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>

      <el-form-item label="讲师简介：" prop="desc">
          <el-input type="textarea" v-model="popParams.desc" style="width:600px;" maxlength="5000"
            placeholder='多个关键词地址用英文“;”隔开' rows="6" show-word-limit></el-input>
      </el-form-item>


      <el-form-item label="查看人数：" prop="view">
        <el-input-number v-model="popParams.view" :max="200000" :min="0" placeholder="1~20000"></el-input-number>
      </el-form-item>
      <el-form-item label="查看递增人数：" prop="view_step">
        <el-input-number v-model="popParams.view_step" :max="200" :min="1" placeholder="1~20000"></el-input-number>
      </el-form-item>

      <el-form-item label="真实查看人数：" >
        <label class="el-form-item__label">{{popParams.real_view}}</label>
      </el-form-item>

      <el-form-item label="课程数量：" prop="course_num">
        <el-input-number v-model="popParams.course_num" :max="200000" :min="0" placeholder="1~20000"></el-input-number>
      </el-form-item>


      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="popParams.sort" :max="200000" :min="1" placeholder="越大越靠前"></el-input-number>
      </el-form-item>


      <el-form-item label="">
        <el-button @click="submitForm('form')" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import UploadSingleImg from "../../../../components/UploadSingleImg/index.vue";

export default {
  props: {
    loading: Boolean,
    popParams: Object,
    incomePlaceList: Array,
    popTitle: String,
    editMode:Boolean,
  },
  components: { UploadSingleImg },
  data() {
    return {
      formLabelWidth: '80px',

      multiple: false,
      limit: 1,
      rules: {
        place_id: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],

        title: [
          { required: true, message: '请输入讲师职称', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入讲师简介', trigger: 'change' }
        ],
        view: [
          { required: true, message: '请选择查看人数', trigger: 'change' }
        ],
        course_num: [
          { required: true, message: '请输入课程数量', trigger: 'change' }
        ],
      },

      aliyunOssToken: {
        accessid: "",
        callback: "",
        dir: "",
        expire: 0,
        host: "",
        policy: ""
      },

      rollType:5,


    };
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType != 1 && this.rollType != 2) {
       this.$router.push({ name: 'Index' })
    }
    if (this.popParams.id) {
      this.editMode  = 1
    }
  },
  methods: {
    backListClick() {
      this.$emit('backList', this.ruleForm)
    },
    updateOssToken(obj) {
      this.aliyunOssToken = obj
    },
    selectImg(obj) {
      this.popParams[obj.name] = obj.url
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid &&  this.popParams.avatar != '') {


          this.$http.post(API.courseTeacherSave, this.popParams).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message.success('保存成功')
              setTimeout(() => {
                this.backListClick()
              }, 1000);
            } else {
              this.$message.error(res.msg ? res.msg : '保存失败')
            }
          })
            .catch(error => {
              this.$message.error('保存失败')

            });
          // console.log(this.ruleForm)
          //   this.$emit('submitForm',this.ruleForm)
        } else {
          if (!this.popParams.avatar) {
            this.$message.error('请先上传头像');
            return;
          }

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
<style lang='scss' scoped></style>
