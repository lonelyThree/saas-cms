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
      <el-form-item label="类型" prop="type" >
        <el-radio-group v-model=" popParams.type">
			<el-radio :label="1">背景颜色</el-radio>
			<el-radio :label="2">头部轮播</el-radio>
			<el-radio :label="3">小图标</el-radio>
			<el-radio :label="4">广告轮播</el-radio>
			<el-radio :label="5">热门活动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称：" prop="title">
        <el-input v-model="popParams.title" style="width:600px" placeholder="请输入名称"></el-input>
      </el-form-item>


      <el-form-item class="is-required" label="图片：" prop="img">
        <UploadSingleImg :initOssToken="true" uploadName="img" :imgUrl="popParams.img"
          :ossToken="aliyunOssToken" @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>


      <el-form-item label="跳转地址：" prop="link">
        <el-input v-model="popParams.link" style="width:600px" placeholder="请输入地址"></el-input>
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
        title: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],


        type: [
          { type: 'number', required: true, message: '请选择类型', trigger: 'change' },
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
    changeDate() {
      this.$forceUpdate()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid &&  !(this.popParams.img == '' && this.popParams.type != 1)) {


          this.$http.post(API.activityIndexSave, this.popParams).then(res => {
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
          if (!this.popParams.img) {
            this.$message.error('请先上传图片');
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
