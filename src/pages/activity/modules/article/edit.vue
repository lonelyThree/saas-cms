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
          <el-form-item label="文章名称：" prop="title">
            <el-input v-model="popParams.title" style="width:600px" placeholder="请输入文章名称"></el-input>
          </el-form-item>

          <el-form-item label="文章作者：" prop="author">
            <el-input v-model="popParams.author" style="width:600px" placeholder="请输入文文章作者"></el-input>
          </el-form-item>

          <el-form-item label="是否需要认证" prop="auth_type" >
        <el-radio-group v-model=" popParams.auth_type">
          <el-radio :label="1">认证</el-radio>
          <el-radio :label="2">不认证</el-radio>
        </el-radio-group>
      </el-form-item>

       <el-form-item label="文章简介：" prop="desc">
                  <el-input type="textarea" v-model="popParams.desc" style="width:600px;" maxlength="500"
                   placeholder='' rows="6" show-word-limit></el-input>
                </el-form-item>

          <el-form-item class="is-required" label="文章图片：" prop="thumb">
            <UploadSingleImg
                uploadName="thumb"
                :imgUrl="popParams.thumb"
                :ossToken="aliyunOssToken"
                @updateOssToken="updateOssToken"
                @selectImg = "selectImg"
              />

          </el-form-item>


    

          <el-form-item label="文章内容：" prop="content">
            <tinymce
              ref="tinymce"
              v-model="popParams.content"
              :width="700"
              :height="300"
            />
          </el-form-item>

         

          <el-form-item label="轮播图片：" prop="imgs">
            <UploadMultiImg 
              uploadName="imgs"
              style="width:800px"
              :fileList="popParams.imgs" 
              :ossToken="aliyunOssToken" :limitNum="10"
          @updateOssToken="updateOssToken" @selectMultiImg="selectMultiImg" />
            </el-form-item>
           <!-- <el-form-item class="is-required" label="规则图片：" prop="rule_img">
            <UploadSingleImg
                  uploadName="rule_img"
                  :imgUrl="popParams.rule_img"
                  :ossToken="aliyunOssToken"
                  @updateOssToken="updateOssToken"
                  @selectImg = "selectImg"
                />
            </el-form-item> -->
          <el-form-item label="客服地址：" prop="cservice_url">
              <el-input v-model="popParams.cservice_url" style="width:600px" placeholder="请输入客服地址"></el-input>
          </el-form-item>

          <el-form-item label="奖励类型" prop="award_type" >
            <el-radio-group v-model=" popParams.award_type">
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

        <el-form-item label="阅读达标奖励：" prop="share_money">
          <el-input-number v-model="popParams.share_money" :max="1000" :min="1" placeholder="1~1000"></el-input-number>
        </el-form-item>

        <!-- <el-form-item label="阅读奖励：" prop="money">
          <el-input-number v-model="popParams.money" :max="1000" :min="0" placeholder="0~1000"></el-input-number>
        </el-form-item> -->

        <el-form-item label="阅读达标时间(秒)：" prop="standard_times">
            <el-input-number v-model="popParams.standard_times" :max="1000" :min="0" placeholder="0~1000"></el-input-number>
        </el-form-item>

        <el-form-item label="每人总限额：" prop="limit_money_person">
          <el-input-number v-model="popParams.limit_money_person" :max="1000000" :min="1" placeholder="1~1000000"></el-input-number>
        </el-form-item>

         
          <el-form-item label="活动总上限" prop="limit_money">
            <el-input-number v-model="popParams.limit_money" size="large" :max=" 20000000 " :min=" 1 " placeholder="10~20000000"></el-input-number>
          </el-form-item>

          <el-form-item label="阅读人数：" prop="view">
        <el-input-number v-model="popParams.view" :max="200000" :min="0" placeholder="1~20000"></el-input-number>
      </el-form-item>

             <el-form-item label="阅读递增人数：" prop="view_step">
        <el-input-number v-model="popParams.view_step" :max="200" :min="1" placeholder="1~20000"></el-input-number>
      </el-form-item>

      <el-form-item label="阅读查看人数：" >
        <label class="el-form-item__label">{{popParams.real_view}}</label>
      </el-form-item>

       <el-form-item label="点赞人数：" prop="thumps_up">
        <el-input-number v-model="popParams.thumps_up" :max="200000" :min="0" placeholder="1~20000"></el-input-number>
      </el-form-item>

             <el-form-item label="点赞递增人数：" prop="thumps_up_step">
        <el-input-number v-model="popParams.thumps_up_step" :max="200" :min="1" placeholder="1~200"></el-input-number>
      </el-form-item>

      <el-form-item label="真实点赞人数：" >
        <label class="el-form-item__label">{{popParams.real_thumps_up}}</label>
      </el-form-item>

      <el-form-item label="文章发布时间"
                      prop="create_time">
          <el-date-picker v-model="popParams.create_time"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="奖励开始日期"
                      prop="start_date">
          <el-date-picker v-model="popParams.start_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyyMMdd"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="奖励结束日期"
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
import UploadSingleImg from "../../../../components/UploadSingleImg/index.vue";
import UploadMultiImg from "../../../../components/UploadMultiImg/index.vue";
import Tinymce from '../../../../components/Tinymce'

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
    },
  },
  components:{ UploadSingleImg, UploadMultiImg, Tinymce },
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
          { required: true,message: '请输入文章名称',trigger: 'change' }
        ],

        desc: [
          { required: true, message: '请输入文章简介', trigger: 'change' }
        ],
        limit_type: [
          { required: true,message: '请选择限制规则',trigger: 'change' }
        ],

        content: [
          { required: true, message: '请选择文章内容', trigger: 'change' }
        ],

        limit_money: [
          { type: 'number', required: true, message: '请输入奖励限额, 必须为数字值', trigger: 'change' },
        ],

        standard_times: [
          { type: 'number', required: true, message: '请输入阅读达标时间, 必须为数字值', trigger: 'change' },
        ],

        // money: [
        //   { type: 'number', required: true, message: '请输入阅读达标奖励, 必须为数字值', trigger: 'change' },
        // ],

        share_money: [
          { type: 'number', required: true, message: '请输入阅读达标奖励, 必须为数字值', trigger: 'change' },
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
    // if (window.tinymce) {
    //   this.$refs.tinymce.hasChange = false
    //   this.popParams.content = ' ' // 故意输入一个空格，触发timymce watch
    // }
  },
  methods: {
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
      if (!this.popParams[obj.name]) {
        this.popParams[obj.name] = []
      }
      if(obj.urls) {
        this.popParams[obj.name] = obj.urls
      } else {
        this.popParams[obj.name].push(obj.url)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if(valid && this.popParams.thumb   &&  this.popParams.start_date <= this.popParams.end_date) {


            this.$http.post(API.articleSave, this.popParams).then(res => {
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
          if(!this.popParams.thumb) {
            this.$message.error('请先上传文章图片');
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
<style lang='scss' scoped>
</style>
