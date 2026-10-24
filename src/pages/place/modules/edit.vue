<template>
    <div class="place-wrap">
        <el-page-header @back="backListClick" :content="popTitle">
        </el-page-header>
        <el-divider></el-divider>
        <el-form :model="popParams" :rules="rules" ref="form" label-width="150px">
              <el-form-item label="渠道名称(公众号)：" prop="name">
                <el-input v-model="popParams.name" style="width:200px" placeholder="请输入渠道名称"></el-input>
              </el-form-item>
              <el-form-item label="APPID：" prop="appid">
                  <el-input v-model="popParams.appid" style="width:200px" placeholder="请输入APPID"></el-input>
              </el-form-item>
              <el-form-item label="渠道号：" prop="place">
                  <el-input-number v-model="popParams.place" :max="1000000" :min="1" placeholder="1~1000000"></el-input-number>
              </el-form-item>
              <el-form-item class="is-required" label="渠道LOGO：" prop="logo">
              <UploadSingleImg :initOssToken="true" uploadName="logo" :imgUrl="popParams.logo"
                :ossToken="aliyunOssToken" @updateOssToken="updateOssToken" @selectImg="selectImg" />
            </el-form-item>

          <el-form-item label="二步注册：" prop="reg_two" >
            <el-radio-group v-model="popParams.reg_two">

                <el-radio :label="2">关闭</el-radio>
                <el-radio :label="1">必填</el-radio>
                <!-- <el-radio :label="3">可跳过</el-radio> -->
                <el-radio :label="4">隐藏</el-radio>
                <el-radio :label="5">静默</el-radio>
            </el-radio-group>
          </el-form-item>

        <el-form-item label="行业类型：">
          <el-checkbox v-model="popParams.retail_type" name="retail_type" :true-label="1" :false-label="2">零售</el-checkbox>
          <el-checkbox v-model="popParams.business_type" name="business_type" :true-label="1" :false-label="2">商业</el-checkbox>
          <el-checkbox v-model="popParams.clinic_type" name="clinic_type" :true-label="1" :false-label="2">诊所</el-checkbox>
        </el-form-item>

          <el-form-item label="活动开启认证：" prop="auth_review" >
            <el-radio-group v-model="popParams.auth_review">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="通知openid：" prop="review_openids">
          <el-input type="textarea" v-model="popParams.review_openids" style="width:600px;" maxlength="1000"
            placeholder='店员提交后， 通知的用户openid， 多个以;隔开' rows="5" show-word-limit></el-input>
          </el-form-item>
              <el-form-item label="">
                   <el-button @click="submitForm('form')" type="primary" >确定</el-button>
              </el-form-item>
          </el-form>
    </div>
</template>
<script>
import UploadSingleImg from "../../../components/UploadSingleImg/index.vue";

export default {
    props: {
        editPopParams: Object,
        popTitle: String,
    },
    components: { UploadSingleImg },
    data() {
        return {
            formLabelWidth: '80px',

            multiple: false,
            limit: 1,
            
            rules: {
                name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' },],
                appid: [{ required: true, message: '请输入APPID', trigger: 'blur' },],
                place: [{ type: 'number', required: true, message: '请输入渠道号', trigger: 'blur' },],
            },
            aliyunOssToken: {
                accessid: "",
                callback: "",
                dir: "",
                expire: 0,
                host: "",
                policy: ""
            },
            
            popParams:{}


        };
    },
    created() {
        this.popParams = this.editPopParams
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
            if (this.popParams.business_type != 1 && this.popParams.retail_type != 1 && this.popParams.clinic_type != 1) {
                this.$message.error('请至少选择一个注册类型');
                return;
            }
            this.$refs[formName].validate((valid) => {
                if (valid && this.popParams.logo) {
                    this.$http.post(API.placeSave, { ...this.popParams }).then((res) => {
                        if (res.code === 200) {
                            
                            this.$message({
                                type: 'success',
                                message: '完成！'
                            })
                            this.backListClick();
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                } else {
                    if (!this.popParams.logo) {
                        this.$message.error('请先上传logo');
                        return;
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
