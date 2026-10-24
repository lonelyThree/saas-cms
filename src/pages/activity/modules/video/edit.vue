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

          <el-form-item  label="视频地址：" prop="video_url">
            <el-input v-model="popParams.video_url" style="width:600px" placeholder="请输入视频地址"></el-input>
          </el-form-item>


          <el-form-item class="is-required" label="视频封面图片：" prop="video_cover_url">
            <UploadSingleImg
              :initOssToken="true"
              uploadName="video_cover_url"
              :imgUrl="popParams.video_cover_url"
              :ossToken="aliyunOssToken"
              @updateOssToken="updateOssToken"
              @selectImg = "selectImg"
            />
          </el-form-item>

          <el-form-item label="视频描述" prop="desc">
            <tinymce
              ref="tinymce"
              v-model="popParams.desc"
              :width="700"
              :height="300"
            />
          </el-form-item>

          

          <el-form-item class="is-required" label="活动图片：" prop="img">
            <UploadSingleImg
                uploadName="img"
                :imgUrl="popParams.img"
                :ossToken="aliyunOssToken"
                @updateOssToken="updateOssToken"
                @selectImg = "selectImg"
              />

          </el-form-item>
          <el-form-item class="is-required" label="提示图片：" prop="tip_img">
            <UploadSingleImg
                  uploadName="tip_img"
                  :imgUrl="popParams.tip_img"
                  :ossToken="aliyunOssToken"
                  @updateOssToken="updateOssToken"
                  @selectImg = "selectImg"
                />
            </el-form-item>
           <el-form-item class="is-required" label="规则图片：" prop="rule_img">
            <UploadSingleImg
                  uploadName="rule_img"
                  :imgUrl="popParams.rule_img"
                  :ossToken="aliyunOssToken"
                  @updateOssToken="updateOssToken"
                  @selectImg = "selectImg"
                />
            </el-form-item>
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

        <el-form-item label="每次答题数量：" prop="each_num">
          <el-input-number v-model="popParams.each_num" :max="255" :min="1" placeholder="1~255"></el-input-number>
        </el-form-item>

        <el-form-item label="问卷题目数量：" prop="total_num">
          <el-input-number v-model="popParams.total_num" :max="1000" :min="1" placeholder="1~1000"></el-input-number>
        </el-form-item>

        <el-form-item label="答题等待时间(秒)：" prop="wait_times">
            <el-input-number v-model="popParams.wait_times" :max="2000000" :min="1" placeholder="1~2000000"></el-input-number>
        </el-form-item>

        <el-form-item label="答题超时时间(秒)：" prop="timeout">
            <el-input-number v-model="popParams.timeout" :max="255" :min="1" placeholder="1~255"></el-input-number>
        </el-form-item>


        <el-form-item label="题目奖励标准(分)：" prop="money">
          <el-input-number v-model="popParams.money" :max="20000" :min="1" placeholder="10~20000"></el-input-number>
        </el-form-item>

        <el-form-item label="达标分值：" prop="standard_num">
          <el-input-number v-model="popParams.standard_num" :max="255" :min="1" placeholder="1~255"></el-input-number>
        </el-form-item>

        <el-form-item label="参与次数：" prop="join_num">
          <el-input-number v-model="popParams.join_num" :max="255" :min="1" placeholder="1~255"></el-input-number>
        </el-form-item>

         
          <el-form-item label="活动总上限" prop="limit_money">
            <el-input-number v-model="popParams.limit_money" size="large" :max=" 20000000 " :min=" 1 " placeholder="10~20000000"></el-input-number>
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
import UploadSingleImg from "../../../../components/UploadSingleImg/index.vue";
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
    }
  },
  components:{ UploadSingleImg, Tinymce },
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

        video_url: [
          { required: true, message: '请输入视频地址', trigger: 'change' }
        ],
        limit_type: [
          { required: true,message: '请选择限制规则',trigger: 'change' }
        ],

        desc: [
          { required: true, message: '请选择视频描述', trigger: 'change' }
        ],
        money: [
          { type: 'number',required: true,message: '请输入奖励金额, 必须为数字值',trigger: 'change' },
        ],
        limit_money: [
          { type: 'number', required: true, message: '请输入奖励限额, 必须为数字值', trigger: 'change' },
        ],

        wait_times: [
          { type: 'number', required: true, message: '请输入答题等待时间, 必须为数字值', trigger: 'change' },
        ],

        timeout: [
          { type: 'number', required: true, message: '请输入答题超时时间, 必须为数字值', trigger: 'change' },
        ],

        standard_num: [
          { type: 'number', required: true, message: '请输入达标分值, 必须为数字值', trigger: 'change' },
        ],
        join_num: [
          { type: 'number', required: true, message: '请输入参与次数, 必须为数字值', trigger: 'change' },
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
    //   this.popParams.desc = ' ' // 故意输入一个空格，触发timymce watch
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
    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if(valid && this.popParams.img && this.popParams.rule_img  && this.popParams.tip_img  && this.popParams.video_cover_url    && this.popParams.start_date <= this.popParams.end_date) {


            this.$http.post(API.watchVideoSave, this.popParams).then(res => {
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
          if(!this.popParams.video_cover_url) {
            this.$message.error('请先上传视频封面图片');
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
