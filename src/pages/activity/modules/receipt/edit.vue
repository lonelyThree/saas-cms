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

      <el-form-item class="is-required" label="活动图片：" prop="img">
        <UploadSingleImg uploadName="img" :imgUrl="popParams.img" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />

      </el-form-item>
      <el-form-item class="is-required" label="提示图片：" prop="tip_img">
        <UploadSingleImg uploadName="tip_img" :imgUrl="popParams.tip_img" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>
      <el-form-item class="is-required" label="规则图片：" prop="rule_img">
        <UploadSingleImg uploadName="rule_img" :imgUrl="popParams.rule_img" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>

      <el-form-item class="is-required" label="拍照说明图片：" prop="desc_img">
        <UploadSingleImg uploadName="desc_img" :imgUrl="popParams.desc_img" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>

      <el-form-item label="客服地址：" prop="cservice_url">
        <el-input v-model="popParams.cservice_url" style="width:600px" placeholder="请输入客服地址"></el-input>
      </el-form-item>

      <el-form-item class="is-required"  label="活动说明地址：" prop="desc_url">
        <el-input v-model="popParams.desc_url" style="width:600px" placeholder="请输入活动说明地址"></el-input>
      </el-form-item>


      <el-form-item label="限制规则" prop="limit_type">
        <el-radio-group v-model="popParams.limit_type">
          <el-radio :label="1">用户</el-radio>
          <el-radio :label="2">连锁</el-radio>
          <el-radio :label="3">地区</el-radio>
          <el-radio :label="4">无限制</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="奖励发放" prop="send_type">
        <el-radio-group v-model="popParams.send_type">
          <el-radio :label="1">自动发放</el-radio>
          <el-radio :label="2">手动发放</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="奖品开启状态" prop="rank_status" >
        <el-radio-group v-model=" popParams.rank_status">
        <el-radio :label="1">开启</el-radio>
        <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="活动类型" prop="type" >
        <el-radio-group v-model=" popParams.type">
        <el-radio :label="1">小票</el-radio>
        <el-radio :label="2">入库单</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="奖励类型" prop="award_type" >
        <el-radio-group v-model=" popParams.award_type">
        <el-radio :label="1">红包</el-radio>
        <el-radio :label="2">积分</el-radio>
        <el-radio :label="3">星币</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选择入库单：" prop="warehouse_id" v-if="popParams.type == 1">
        <el-select style="width: 300px;" v-model="popParams.warehouse_id" clearable filterable>
          <el-option v-for="item in warehouseList" :key="item.id" :label="item.title" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="人工审核上限：" prop="limit_manual">
        <el-input-number v-model="popParams.limit_manual" :max="200" :min="1" placeholder="1~200"></el-input-number>
      </el-form-item>

      <el-form-item label="错误上限：" prop="limit_error">
        <el-input-number v-model="popParams.limit_error" :max="200" :min="1" placeholder="1~200"></el-input-number>
      </el-form-item>

      <el-form-item label="每个小票上限(分)：" prop="limit_money_each">
        <el-input-number v-model="popParams.limit_money_each" :max="20000000" :min="1"
          placeholder="1~20000000"></el-input-number>
      </el-form-item>

      <el-form-item label="每个人上限(分)：" prop="limit_money_person">
        <el-input-number v-model="popParams.limit_money_person" :max="20000000" :min="1"
          placeholder="1~20000000"></el-input-number>
      </el-form-item>


      <el-form-item label="活动总上限(分)" prop="limit_money">
        <el-input-number v-model="popParams.limit_money" size="large" :max=" 200000000 " :min=" 1 "
          placeholder="1~2000000000"></el-input-number>
      </el-form-item>
      <el-form-item label="限制上传小票天数：" prop="limit_pre_day">
        <el-input-number v-model="popParams.limit_pre_day" :max="20000" :min="0" placeholder="0为不限制"></el-input-number>
      </el-form-item>

      <el-form-item label="每天警告上限：" prop="warn_num">
        <el-input-number v-model="popParams.warn_num" :max="200" :min="1" placeholder="1~200"></el-input-number>
      </el-form-item>

      <el-form-item label="每天禁止上限：" prop="ban_num">
        <el-input-number v-model="popParams.ban_num" :max="200" :min="1" placeholder="1~200"></el-input-number>
      </el-form-item>

      <el-form-item label="开始日期" prop="start_date">
        <el-date-picker v-model="popParams.start_date" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="end_date">
        <el-date-picker v-model="popParams.end_date" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="弹窗内容：" prop="pop_info" >
          <el-input type="textarea" v-model="popParams.pop_info" style="width:600px;" maxlength="250"
            placeholder='弹窗内容' rows="5" show-word-limit></el-input>
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
    editMode:Boolean,
    popTitle:String,
    fileList: {
      type: Array,
      default: []
    },
    fileTipList: {
      type: Array,
      default: []
    }
  },
  components: { UploadSingleImg },
  data() {
    return {
      formLabelWidth: '80px',

      multiple:false,
      limit:1,
      rules: {
        place_id: [
          { required: true,message: '请选择渠道',trigger: 'change' }
        ],
        title: [
          { required: true,message: '请输入活动名称',trigger: 'change' }
        ],
        limit_type: [
          { required: true,message: '请选择限制规则',trigger: 'change' }
        ],
        send_type: [
          { required: true, message: '请选择奖励发放规则', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        auth_type: [
          { required: true, message: '请选择认证类型', trigger: 'change' }
        ],
        money: [
          { type: 'number',required: true,message: '请输入奖励金额, 必须为数字值',trigger: 'change' },
        ],
        limit_manual: [
          { type: 'number', required: true, message: '请输入人工审核限制, 必须为数字值', trigger: 'change' },
        ],
        limit_error: [
          { type: 'number', required: true, message: '请输入错误上限, 必须为数字值', trigger: 'change' },
        ],
        limit_money_each: [
          { type: 'number', required: true, message: '请输入每个小票的限额, 必须为数字值', trigger: 'change' },
        ],
        limit_money_person: [
          { type: 'number', required: true, message: '请输入每个人的限额, 必须为数字值', trigger: 'change' },
        ],
        limit_money: [
          { type: 'number', required: true, message: '请输入奖励限额, 必须为数字值', trigger: 'change' },
        ],
        start_date: [
          {required: true,message: '请选择活动开始日期',trigger: 'change' },
        ],
        end_date: [
          { required: true,message: '请选择活动结束日期',trigger: 'change' },
        ],

        award_type: [
          { required: true,message: '请选择奖励类型',trigger: 'change' },
        ],
      },
      
      aliyunOssToken:{
        accessid: "",
        callback: "",
        dir: "",
        expire: 0,
        host: "",
        policy: ""
    },
    rollType:5,

    warehouseList:[],


    };
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType != 1 && this.rollType != 2) {
      this.$router.push({ name: 'Index' })
    }
    this.getReceiptWarehouse()

    if (this.popParams.warehouse_id < 0) {
      this.popParams.warehouse_id  = 0
    }
  },
  methods: {
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    getReceiptWarehouse() {
      let parmas = {
        id:this.popParams.id
      }
      this.$http.get(API.receiptWarehouse, parmas).then(res => {
        if (res.code == 200) {
          this.warehouseList = res.data
          this.warehouseList.unshift({id:0, title:'未选择入库单'})
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    updateOssToken(obj) {
      this.aliyunOssToken = obj
    },
    selectImg(obj) {
      this.popParams[obj.name] = obj.url
    },

  
    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if(valid && this.popParams.img && this.popParams.rule_img && this.popParams.tip_img && this.popParams.desc_img && this.popParams.start_date <= this.popParams.end_date) {


            this.$http.post(API.receiptSave, this.popParams).then(res => {
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
            if (this.popParams.start_date > this.popParams.end_date) {
                this.$message.error('结束日期需要大于开始日期');
                return;
            }
          if(!this.popParams.img) {
            this.$message.error('请先上传活动图片');
            return;
          }
          if (!this.popParams.tip_img) {
            this.$message.error('请先上传提示图片');
            return;
          }

          if (!this.popParams.img) {
            this.$message.error('请先上传活动图片');
            return;
          }
          if (!this.popParams.rule_img) {
            this.$message.error('请先上传规则图片');
            return;
          }
          
          if (!this.popParams.desc_img) {
            this.$message.error('请先上传活动说明图片');
            return;
          }

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
