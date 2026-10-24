<template>
  <div class="place-wrap">
    <el-page-header @back="backListClick" :content="popTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-form :model="popParams" :rules="rules" ref="form" label-width="150px">
      <el-form-item label="选择渠道：" prop="place_id" v-if="rollType == 1">
        <el-select style="width: 300px;" v-model="popParams.place_id" :disabled="editMode == 1" clearable filterable
          @change="changePlace">
          <el-option v-for="item in incomePlaceList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择药企：" prop="company_id" >
        <el-select style="width: 300px;" v-model="popParams.company_id" :disabled="editMode == 1" clearable filterable>
          <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="popParams.name" style="width:600px" placeholder="请输入名称"></el-input>
      </el-form-item>


      <el-form-item class="is-required" label="图片：" prop="img">
        <UploadSingleImg :initOssToken="true" uploadName="img" :imgUrl="popParams.img"
          :ossToken="aliyunOssToken" @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>

      <el-form-item label="限制规则" prop="limit_type">
        <el-radio-group v-model="popParams.limit_type">
          <el-radio :label="1">用户</el-radio>
          <el-radio :label="2">连锁</el-radio>
          <el-radio :label="3">地区</el-radio>
          <el-radio :label="4">无限制</el-radio>
        </el-radio-group>
      </el-form-item>

       <el-form-item label="活动类型" prop="type" :disabled="editMode == 1" >
        <el-radio-group v-model="popParams.type">
          <el-radio :label="1" :disabled="editMode == 1">活动</el-radio>
          <el-radio :label="2" :disabled="editMode == 1">药企大学</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="popParams.sort" :max="200000" :min="1" placeholder="越小越靠前"></el-input-number>
      </el-form-item>

      <el-form-item label="跳转地址：" prop="link">
        <el-input v-model="popParams.link" style="width:600px" placeholder="请输入地址"></el-input>
      </el-form-item>

       <el-form-item label="活动说明：" prop="desc">
            <tinymce
              ref="tinymce"
              v-model="popParams.desc"
              :width="700"
              :height="300"
            />
          </el-form-item>



      <el-form-item label="">
        <el-button @click="submitForm('form')" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import UploadSingleImg from "../../../../components/UploadSingleImg/index.vue";
import Tinymce from '../../../../components/Tinymce'

export default {
  props: {
    loading: Boolean,
    popParams: Object,
    incomePlaceList: Array,
    popTitle: String,
  },
  components: { UploadSingleImg, Tinymce },
  data() {
    return {
      formLabelWidth: '80px',

      multiple: false,
      limit: 1,
      rules: {
        place_id: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        company_id: [
          { required: true, message: '请选择药企', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
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
      companyList:[],
      editMode:0,


    };
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType != 1 && this.rollType != 2) {
       this.$router.push({ name: 'Index' })
    } else if (this.rollType == 2) {
      this.getCompanyList()
    } else if (this.popParams.place_id) {
      this.getCompanyList()
    }
    if (this.popParams.id) {
      this.editMode  = 1
    }

    // if (window.tinymce) {
    //   this.$refs.tinymce.hasChange = false
    //   this.popParams.desc = ' ' // 故意输入一个空格，触发timymce watch
    // }
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
    changePlace() {
      this.popParams.company_id = ''
      this.getCompanyList()
    },
    getCompanyList() {
      // console.log('getCompanyList', this.popParams.company_id)
      this.$http.get(API.companySearch, {
        placeId: this.popParams.place_id
      }).then(res => {
            if (res.code === 200) {
              this.companyList = res.data
            } else {
              this.$message.error(res.msg ? res.msg : '药企获取失败')
            }
          })
            .catch(error => {
              this.$message.error('药企获取失败')

            });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid &&  this.popParams.img != '') {


          this.$http.post(API.companyActivitySave, this.popParams).then(res => {
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
