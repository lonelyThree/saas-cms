<template>
    <div class="place-wrap">
        <el-page-header @back="backListClick" :content="popTitle">
        </el-page-header>
        <el-divider></el-divider>
        <el-form :model="popParams" :rules="rules" ref="form" label-width="150px">
            <el-form-item label="选择渠道：" prop="place_id" v-if="rollType == 1">
                <el-select
                    style="width: 300px;"
                    v-model="popParams.place_id"
                    :disabled="editMode == 1"
                    clearable
                    filterable
                >
                    <el-option
                    v-for="item in incomePlaceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    >
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
            <el-upload
              class="upload-img"
              :multiple="multiple"
              action="/"
              :limit="limit"
              :file-list="fileList"
              :http-request="uploadSectionFile"
              :on-exceed="onExceed"
              :on-remove="onRemove"
              list-type="picture-card"
              >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <!-- <div v-if="popParams.img.length==0&&changeFlag" class="el-form-item__error">请上传图片</div> -->
          </el-form-item>
          <el-form-item class="is-required" label="提示图片：" prop="tip_img">
              <el-upload
                class="upload-img"
                :multiple="multiple"
                action="/"
                :limit="limit"
                :file-list="fileTipList"
                :http-request="uploadSectionTipFile"
                :on-exceed="onExceedTip"
                :on-remove="onRemoveTip"
                list-type="picture-card"
                >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <!-- <div v-if="popParams.img.length==0&&changeFlag" class="el-form-item__error">请上传图片</div> -->
            </el-form-item>
          <el-form-item label="客服地址：" prop="cservice_url">
              <el-input v-model="popParams.cservice_url" style="width:600px" placeholder="请输入客服地址"></el-input>
          </el-form-item>

          <el-form-item label="奖励类型" prop="receive_type" >
            <el-radio-group v-model=" popParams.receive_type">
            <el-radio :label="1">红包</el-radio>
            <el-radio :label="2">积分</el-radio>
            <el-radio :label="3">星币</el-radio>
            </el-radio-group>
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

       

         <el-form-item label="奖励领取" prop="award_type">
            <el-radio-group
                v-model="popParams.award_type"
            >
                <el-radio :label="1">每日一次</el-radio>
                <el-radio :label="2">仅一次</el-radio>
            </el-radio-group>
        </el-form-item>

         <el-form-item label="奖励金额(分)：" prop="money">
            <el-input-number v-model="popParams.money" :max="20000" :min="1" placeholder="10~20000"></el-input-number>
          </el-form-item>
          <el-form-item :label="popParams.award_type == 1?'每日上限(分)：':'活动总上限(分)'" prop="limit_money">
            <el-input-number v-model="popParams.limit_money" size="large" :max=" 20000000 " :min=" 1 " placeholder="1~20000000"></el-input-number>
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
        award_type: [
          { required: true, message: '请选择奖励领取限制', trigger: 'change' }
        ],
        money: [
          { type: 'number',required: true,message: '请输入奖励金额, 必须为数字值',trigger: 'change' },
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
        receive_type: [
          { required: true,message: '请选择奖励类型',trigger: 'change' },
        ],

        auth_type: [
          { required: true, message: '请选择认证类型', trigger: 'change' }
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
    onExceed(files, fileList){
        this.$message.info( '图片只能上传一张')
        // console.log(files, fileList, "onExceed, files, fileList")
    },
    onRemove(files, fileList) {
        this.popParams.img = ''
    },
    onExceedTip(files, fileList) {
      this.$message.info('图片只能上传一张')
      // console.log(files, fileList, "onExceed, files, fileList")
    },
    onRemoveTip(files, fileList) {
      this.popParams.tip_img = ''
    },
    getOssToken(param, type){
        this.$http.get(API.getPolicyToken).then(res => {
            console.log(res)
            if (res.code === 200) {
                this.aliyunOssToken = res.data
                this.uploadFile(param, type)
            } else {
                this.$message.error(res.msg?res.msg:'图片上传失败')
            }
        })
        .catch(error => {
            this.$message.error('图片上传失败')

        });
    },
    uploadFile(param, type){
        const file = param.file

        var filename = new Date().getTime();
        var formData = new FormData();
        //注意formData里append添加的键的大小写
        formData.append('x-oss-forbid-overwrite', true)

        let filePath = this.aliyunOssToken.dir + filename +'.' + file.name.match(/[^\.]\w*$/g)[0]
        
        formData.append('key', filePath); //存储在oss的文件路径
        formData.append('OSSAccessKeyId', this.aliyunOssToken.accessid); //accessKeyId
        formData.append('policy', this.aliyunOssToken.policy); //policy
        formData.append('Signature', this.aliyunOssToken.signature); //签名
        formData.append('success_action_status', '200'); //签名
        formData.append('callback', this.aliyunOssToken.callback); //签名
        formData.append("file", file);
        var url = this.aliyunOssToken.host;
        var fileUrl = this.aliyunOssToken.host +'/' +filePath

         this.$http.post(url, formData, {}).then(res => {
            console.log(res.code, res, "res.code")
                if (res.code === 200 || res.code == 1000) {
                    if (type == 'tip_img') {
                      this.popParams.tip_img = filePath
                    } else {
                      this.popParams.img = filePath
                    }
                    
                    // console.log(res.code, res, "res.code", fileUrl)
                    param.fileUrl = fileUrl
                    this.$message.success('图片上传成功')
                } else {
                    this.$message.error(response.data.msg?response.data.msg:'图片上传失败');
                    // self.prevent = false;
                }
            })
            .catch(error => {
                console.log("图片上传失败", error)
                this.$message.error("图片上传失败");
            });
    },
    uploadSectionFile(param) {
        if (this.aliyunOssToken.expire * 1000 < new Date().getTime()) {
            this.getOssToken(param, '')
            return
        }
        this.uploadFile(param, '')
    },
    uploadSectionTipFile(param) {
      if (this.aliyunOssToken.expire * 1000 < new Date().getTime()) {
        this.getOssToken(param, 'tip_img')
        return
      }
      this.uploadFile(param, 'tip_img')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if(valid && this.popParams.img && this.popParams.start_date <= this.popParams.end_date) {


            this.$http.post(API.speakSave, this.popParams).then(res => {
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
          console.log(formName, valid, "object")
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
