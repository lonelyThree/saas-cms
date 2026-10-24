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
      <el-form-item label="活动名称：" prop="title">
        <el-input v-model="popParams.title" style="width:600px" placeholder="请输入活动名称"></el-input>
      </el-form-item>

      <!-- <el-form-item label="是否需要认证" prop="auth_type">
        <el-radio-group v-model="popParams.auth_type">
          <el-radio :label="1">认证</el-radio>
          <el-radio :label="2">不认证</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item label="活动简介：" prop="desc">
        <el-input type="textarea" v-model="popParams.desc" style="width:600px;" maxlength="500" placeholder='' rows="6"
          show-word-limit></el-input>
      </el-form-item>


      <el-form-item class="is-required"  label="轮播图片：" prop="imgs">
        <UploadMultiImg uploadName="imgs" style="width:800px" :fileList="popParams.imgs" :ossToken="aliyunOssToken"
          :limitNum="10" @updateOssToken="updateOssToken" @selectMultiImg="selectMultiImg" />
      </el-form-item>



      <el-form-item label="活动说明：" prop="content">
        <tinymce ref="tinymce" v-model="popParams.content" :width="700" :height="300" />
      </el-form-item>

      

      <el-form-item label="限制规则" prop="limit_type">
            <el-radio-group
                v-model="popParams.limit_type"
            >
                <el-radio :label="1">用户</el-radio>
                <el-radio :label="2">连锁</el-radio>
                <el-radio :label="3">地区</el-radio>
                <el-radio :label="4">无限制</el-radio>
            </el-radio-group>
        </el-form-item>




        <!-- <el-form-item label="限制行业类型" required>
          <el-checkbox v-model="popParams.limit_retail_type" name="limit_retail_type" :true-label="1" :false-label="2">零售</el-checkbox>
          <el-checkbox v-model="popParams.limit_business_type" name="limit_business_type" :true-label="1" :false-label="2">商业</el-checkbox>
          <el-checkbox v-model="popParams.limit_clinic_type" name="limit_clinic_type" :true-label="1" :false-label="2">诊所</el-checkbox>
        </el-form-item> -->

        
         <el-form-item label="奖励类型" prop="award_type" >
            <el-radio-group v-model=" popParams.award_type">
            <el-radio :label="1">红包</el-radio>
            <el-radio :label="2">积分</el-radio>
            <el-radio :label="3">星币</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="奖励发放" prop="send_type">
        <el-radio-group v-model="popParams.send_type">
          <el-radio :label="1">自动发放</el-radio>
          <el-radio :label="2">手动发放</el-radio>
        </el-radio-group>
      </el-form-item>



        <el-form-item label="单次打卡奖励(分)：" prop="money">
          <el-input-number v-model="popParams.money" :max="20000" :min="1" placeholder="10~20000"></el-input-number>
        </el-form-item>

        <el-form-item label="每日每门店打卡上限：" prop="store_limit">
          <el-input-number v-model="popParams.store_limit" :max="20000000" :min="1" placeholder="1~20000000"></el-input-number>
        </el-form-item>

        <el-form-item label="每日业务员打卡上限：" prop="daily_limit">
          <el-input-number v-model="popParams.daily_limit" :max="20000000" :min="1" placeholder="1~20000000"></el-input-number>
        </el-form-item>

         <el-form-item label="打卡距离上限：" prop="distance_limit">
          <el-input-number v-model="popParams.distance_limit" :max="20000000" :min="1" placeholder="1~20000000"></el-input-number>
        </el-form-item>

        <el-form-item label="打卡间隔时间：" prop="min_interval">
          <el-input-number v-model="popParams.min_interval" :max="20000000" :min="1" placeholder="1~20000000"></el-input-number>
        </el-form-item>



         
          <el-form-item label="活动总上限" prop="limit_money">
            <el-input-number v-model="popParams.limit_money" size="large" :max=" 20000000 " :min=" 1 " placeholder="10~20000000"></el-input-number>
          </el-form-item>

          <el-form-item label="参与人数：" prop="join">
        <el-input-number v-model="popParams.join" :max="200000" :min="0" placeholder="1~20000"></el-input-number>
      </el-form-item>

             <el-form-item label="参与递增人数：" prop="join_step">
        <el-input-number v-model="popParams.join_step" :max="200" :min="1" placeholder="1~20000"></el-input-number>
      </el-form-item>

      <el-form-item label="真实参与人数：" >
        <label class="el-form-item__label">{{popParams.real_join}}</label>
      </el-form-item>
    
      <el-form-item label="开始日期"
                      prop="start_date">
          <el-date-picker v-model="popParams.start_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyyMMdd"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期"
                      prop="end_date">
          <el-date-picker v-model="popParams.end_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyyMMdd"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      <el-form-item label="">
        <el-button @click="submitForm('form')" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
import UploadSingleImg from "../../../../components/UploadSingleImg/index.vue";
import UploadMultiImg from "../../../../components/UploadMultiImg/index.vue";
import Tinymce from '../../../../components/Tinymce'

export default {
  props: {
    loading: Boolean,
    popParams: Object,
    incomePlaceList: Array,
    editMode: Boolean,
    popTitle: String,
    fileList: {
      type: Array,
      default: []
    },
  },
  components: { UploadSingleImg, UploadMultiImg, Tinymce },
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
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],

        desc: [
          { required: true, message: '请输入活动简介', trigger: 'change' }
        ],
        limit_type: [
          { required: true, message: '请选择限制规则', trigger: 'change' }
        ],

        content: [
          { required: true, message: '请选择活动说明', trigger: 'change' }
        ],

         money: [
          { type: 'number',required: true,message: '请输入奖励金额, 必须为数字值',trigger: 'change' },
        ],
        limit_money: [
          { type: 'number', required: true, message: '请输入奖励限额, 必须为数字值', trigger: 'change' },
        ],
          distance_limit: [
            { type: 'number', required: true, message: '请输入打卡距离上限, 必须为数字值', trigger: 'change' },
          ],
          store_limit: [
            { type: 'number', required: true, message: '请输入门店总打卡上限, 必须为数字值', trigger: 'change' },
          ],
          daily_limit: [
            { type: 'number', required: true, message: '请输入每日打卡上限, 必须为数字值', trigger: 'change' },
          ],

          Award_type: [
            { required: true, message: '请选择奖励类型', trigger: 'change' },
          ],
            send_type: [
              { required: true, message: '请选择奖励发放方式', trigger: 'change' },
            ],
            auth_type: [
              { required: true, message: '请选择认证类型', trigger: 'change' },
            ],


        start_date: [
          { required: true, message: '请选择活动开始日期', trigger: 'change' },
        ],
        end_date: [
          { required: true, message: '请选择活动结束日期', trigger: 'change' },
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
      rollType: 5,



    };
  },

  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType != 1 && this.rollType != 2) {
      this.$router.push({ name: 'Index' })
    }
    // if (window.tinymce) {
    //   this.$refs.tinymce.hasChange = false
    //   this.popParams.content = ' ' // 故意输入一个空格，触发timymce watch
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

    selectMultiImg(obj) {
      if (!this.popParams[obj.name]) {
        this.popParams[obj.name] = []
      }
      if (obj.urls) {
        this.popParams[obj.name] = obj.urls
      } else {
        this.popParams[obj.name].push(obj.url)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid  && this.popParams.imgs && this.popParams.start_date <= this.popParams.end_date) {

          this.$http.post(API.counterSave, this.popParams).then(res => {
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
          if (this.popParams.start_date > this.popParams.end_date) {
                this.$message.error('结束日期需要大于开始日期');
                return;
            }
          if (!this.popParams.imgs) {
            this.$message.error('请先上传轮播图片');
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
