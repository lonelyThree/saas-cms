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
      <el-form-item class="is-required" label="提示图片：" prop="tip_img">
        <UploadSingleImg uploadName="tip_img" :imgUrl="popParams.tip_img" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>

      <el-form-item class="is-required" label="引导图片：" prop="guide_imgs">
        <UploadMultiImg uploadName="guide_imgs"  style="width:800px"  :fileList="popParams.guide_imgs" :ossToken="aliyunOssToken" :limitNum="10"
          @updateOssToken="updateOssToken" @selectMultiImg="selectMultiImg" />

      </el-form-item>
      <el-form-item class="is-required" label="海报背景图：" prop="qr_bg_img">
        <UploadSingleImg uploadName="qr_bg_img" :imgUrl="popParams.qr_bg_img" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>

      <el-form-item class="is-required" label="引导客服账号：" prop="customer_cards">
        <el-tag
          :key="tag"
          v-for="tag in popParams.customer_cards"
          closable
          :disable-transitions="false"
          @close="handleCustomClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputCustomVisible"
          v-model="inputCustomValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showCustomInput">+ 新增客服</el-button>

      </el-form-item>



      <el-form-item label="客服地址：" prop="cservice_url">
        <el-input v-model="popParams.cservice_url" style="width:600px" placeholder="请输入客服地址"></el-input>
      </el-form-item>



      <!-- <el-form-item label="限制规则" prop="limit_type">
        <el-radio-group v-model="popParams.limit_type">
          <el-radio :label="1">用户</el-radio>
          <el-radio :label="2">连锁</el-radio>
          <el-radio :label="3">地区</el-radio>
          <el-radio :label="4">无限制</el-radio>
        </el-radio-group>
      </el-form-item> -->


      <el-form-item label="注册奖励(分)：" prop="reg_money">
        <el-input-number v-model="popParams.reg_money" :max="200" :min="1" placeholder="1~20000"></el-input-number>
      </el-form-item>

      <el-form-item label="认证奖励(分)：" prop="auth_money">
        <el-input-number v-model="popParams.auth_money" :max="200" :min="1" placeholder="1~200"></el-input-number>
      </el-form-item>

      <el-form-item label="分享奖励(分)：" prop="share_money">
        <el-input-number v-model="popParams.share_money" :max="20000" :min="1"
          placeholder="1~20000"></el-input-number>
      </el-form-item>

      <el-form-item label="业务员提成(分)：" prop="sales_man_money">
        <el-input-number v-model="popParams.sales_man_money" :max="20000" :min="1"
          placeholder="1~20000"></el-input-number>
      </el-form-item>

      <el-form-item label="企微关注欢迎语：">
          <el-checkbox v-model="welcomeStatusList[0]" name="welcomeStatusList">文本</el-checkbox>
          <el-checkbox v-model="welcomeStatusList[1]" name="welcomeStatusList">图文</el-checkbox>
          <el-checkbox v-model="welcomeStatusList[2]" name="welcomeStatusList">图片</el-checkbox>
      </el-form-item>

      <el-form-item label="企微文本：" prop="welcome"  v-if="welcomeStatusList[0]">
          <el-input type="textarea" v-model="popParams.welcome" style="width:600px;" maxlength="250"
            placeholder='企微关注欢迎语文本' rows="5" show-word-limit></el-input>
      </el-form-item>

      <el-form-item class="is-required" label="企微图文icon：" prop="wx_work_icon"  v-if="welcomeStatusList[1]">
        <UploadSingleImg uploadName="wx_work_icon" :imgUrl="popParams.wx_work_icon" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
      </el-form-item>

      <el-form-item label="企微图文描述：" prop="wx_work_desc">
        <el-input v-model="popParams.wx_work_desc" style="width:600px" placeholder="请输入企微关注欢迎语的图文描述"></el-input>
      </el-form-item>


      <el-form-item class="is-required" label="企微图片：" prop="wx_work_img"  v-if="welcomeStatusList[2]">
        <UploadSingleImg uploadName="wx_work_img" :imgUrl="popParams.wx_work_img" :ossToken="aliyunOssToken"
          @updateOssToken="updateOssToken" @selectImg="selectImg" />
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
  components: { UploadSingleImg, UploadMultiImg },
  data() {
    return {
      formLabelWidth: '100px',

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
        reg_money: [
          { type: 'number',required: true,message: '请输入注册奖励金额, 必须为数字值',trigger: 'change' },
        ],
        auth_money: [
          { type: 'number', required: true, message: '请输入认证奖励金额, 必须为数字值', trigger: 'change' },
        ],
        share_money: [
          { type: 'number', required: true, message: '请输入分享奖励, 必须为数字值', trigger: 'change' },
        ],
        sales_man_money: [
          { type: 'number', required: true, message: '请输入业务员提成奖励, 必须为数字值', trigger: 'change' },
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

    inputCustomVisible: false,
    inputCustomValue: ''
    ,
    welcomeStatusList: [
    false,false,false
    ]

    };
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType != 1 && this.rollType != 2) {
      this.$router.push({ name: 'Index' })
    }
    
    if((this.popParams.welcome_status & 1) == 1) {
      this.welcomeStatusList[0] = true
    }
    if((this.popParams.welcome_status & 2) == 2) {
      this.welcomeStatusList[1] = true
    }
    if((this.popParams.welcome_status & 4) == 4) {
      this.welcomeStatusList[2] = true
    }


  },
  methods: {

    handleCustomClose(tag) {
        this.popParams.customer_cards.splice(this.popParams.customer_cards.indexOf(tag), 1);
      },

      showCustomInput() {
        this.inputCustomVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputCustomValue = this.inputCustomValue;
        if (inputCustomValue) {
          this.popParams.customer_cards.push(inputCustomValue);
        }
        this.inputCustomVisible = false;
        this.inputCustomValue = '';
      },
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },

    updateOssToken(obj) {
      this.aliyunOssToken = obj
    },
    selectImg(obj) {
      this.popParams[obj.name] = obj.url
    },

    selectMultiImg(obj) {
      console.log("selectMultiImg", obj, this.popParams[obj.name])
      if (!this.popParams[obj.name]) {
        this.popParams[obj.name] = []
      }
      if(obj.urls) {
        this.popParams[obj.name] = obj.urls
      } else {
        this.popParams[obj.name].push(obj.url)
      }
      
      console.log("selectMultiImg", obj, this.popParams[obj.name])
    },

  
    submitForm(formName) {
      this.popParams.welcome_status = 0
      if(this.welcomeStatusList[0]) {
        this.popParams.welcome_status = this.popParams.welcome_status | 1
      }
      if(this.welcomeStatusList[1]) {
        this.popParams.welcome_status = this.popParams.welcome_status | 2
      }
      if(this.welcomeStatusList[2]) {
        this.popParams.welcome_status = this.popParams.welcome_status | 4
      }
      console.log(this.popParams, this.welcomeStatusList, "===this.popParams===")
      this.$refs[formName].validate((valid, object) => {
        if(valid && this.popParams.qr_bg_img && this.popParams.guide_imgs && this.popParams.tip_img && this.popParams.customer_cards) {


            this.$http.post(API.inviteActivitySave, this.popParams).then(res => {
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
          //   if (this.popParams.start_date > this.popParams.end_date) {
          //       this.$message.error('结束日期需要大于开始日期');
          //       return;
          //   }
          if(!this.popParams.guide_imgs) {
            this.$message.error('请先上传引导图片');
            return;
          }
          if (!this.popParams.tip_img) {
            this.$message.error('请先上传提示图片');
            return;
          }

          if (!this.popParams.qr_bg_img) {
            this.$message.error('请先上传海报背景图');
            return;
          }
          if (!this.popParams.customer_cards) {
            this.$message.error('请先上传引导客服二维码图片');
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
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
