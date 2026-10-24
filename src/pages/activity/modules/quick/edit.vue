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
      <el-form-item label="是否需要认证" prop="auth_type" >
        <el-radio-group v-model=" popParams.auth_type">
        <el-radio :label="1">认证</el-radio>
        <el-radio :label="2">不认证</el-radio>
        </el-radio-group>
      </el-form-item>


      <el-form-item class="is-required" label="活动说明图片：" prop="desc_img">
        <UploadSingleImg :initOssToken="true" uploadName="desc_img" :imgUrl="popParams.desc_img"
          :ossToken="aliyunOssToken" @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>



      <el-form-item class="is-required" label="开始活动背景图：" prop="start_bg">
        <UploadSingleImg uploadName="start_bg" :imgUrl="popParams.start_bg" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />

      </el-form-item>
      <el-form-item class="is-required" label="活动说明背景图：" prop="desc_bg">
        <UploadSingleImg uploadName="desc_bg" :imgUrl="popParams.desc_bg" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>
      <el-form-item class="is-required" label="排行榜背景图：" prop="rank_bg">
        <UploadSingleImg uploadName="rank_bg" :imgUrl="popParams.rank_bg" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>
      <el-form-item class="is-required" label="答题背景图：" prop="ask_bg">
        <UploadSingleImg uploadName="ask_bg" :imgUrl="popParams.ask_bg" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>
      <el-form-item class="is-required" label="答题结果背景图：" prop="result_bg">
        <UploadSingleImg uploadName="result_bg" :imgUrl="popParams.result_bg" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>



      <el-form-item label="客服地址：" prop="cservice_url">
        <el-input v-model="popParams.cservice_url" style="width:600px" placeholder="请输入客服地址"></el-input>
      </el-form-item>


      <el-form-item label="答题超时时间(秒)：" prop="timeout">
        <el-input-number v-model="popParams.timeout" :max="255" :min="1" placeholder="1~255"></el-input-number>
      </el-form-item>

      <el-form-item label="答题总天数：" prop="day_num" >

          <el-input-number v-model="popParams.day_num" :max="1000" :min="1" placeholder="1~1000" v-if="popParams.status == 2 || popParams.status == 0"></el-input-number>
        <label v-else>{{ popParams.day_num }}</label>
      </el-form-item>
      <el-form-item label="每天答题总数：" prop="day_cnt">
        <el-input-number v-model="popParams.day_cnt" :max="1000" :min="1" placeholder="1~1000" v-if="popParams.status == 2 || popParams.status == 0"></el-input-number>
        <label v-else>{{ popParams.day_cnt }}</label>
      </el-form-item>

      <el-form-item label="排行榜显示人数：" prop="rank_cnt">
        <el-input-number v-model="popParams.rank_cnt" :max="10000" :min="1" placeholder="1~255"></el-input-number>
      </el-form-item>

      <el-form-item label="开始日期" prop="start_date">
        <el-date-picker v-model="popParams.start_date" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  @input="changeDate"
          placeholder="选择日期" v-if="popParams.status == 2 || popParams.status == 0" >
        </el-date-picker>
        <label v-else>{{ popParams.start_date }}</label>
      </el-form-item>
      <el-form-item label="结束日期" prop="end_date">
        <el-date-picker v-model="popParams.end_date" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @input="changeDate"
          placeholder="选择日期" v-if="popParams.status == 2 || popParams.status == 0">
        </el-date-picker>
        <label v-else>{{ popParams.end_date }}</label>
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
    editMode: Boolean,
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
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],


        day_cnt: [
          { type: 'number', required: true, message: '请输入每天答题总数, 必须为数字值', trigger: 'change' },
        ],
        rank_cnt: [
          { type: 'number', required: true, message: '请输入排行榜显示人数, 必须为数字值', trigger: 'change' },
        ],

        day_num: [
          { type: 'number', required: true, message: '请输入答题总天数, 必须为数字值', trigger: 'change' },
        ],

        timeout: [
          { type: 'number', required: true, message: '请输入答题超时时间, 必须为数字值', trigger: 'change' },
        ],

        start_date: [
          { required: true, message: '请选择活动开始日期', trigger: 'change' },
        ],
        end_date: [
          { required: true, message: '请选择活动结束日期', trigger: 'change' },
        ],

        auth_type: [
          { required: true, message: '请选择认证类型', trigger: 'change' }
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
        if (valid && this.popParams.desc_img && this.popParams.start_bg && this.popParams.desc_bg && this.popParams.rank_bg && this.popParams.ask_bg && this.popParams.result_bg  && this.popParams.start_date <= this.popParams.end_date) {


          this.$http.post(API.quickSave, this.popParams).then(res => {
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
          if (!this.popParams.desc_img) {
            this.$message.error('请先上传活动说明图片');
            return;
          }

          if (!this.popParams.start_bg) {
            this.$message.error('请先上传开始活动背景图');
            return;
          }

          if (!this.popParams.desc_bg) {
            this.$message.error('请先上传活动说明背景图');
            return;
          }
          if (!this.popParams.rank_bg) {
            this.$message.error('请先上传排行榜背景图');
            return;
          }
          if (!this.popParams.ask_bg) {
            this.$message.error('请先上传答题背景图');
            return;
          }


          if (!this.popParams.result_bg) {
            this.$message.error('请先上传答题结果背景图');
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
