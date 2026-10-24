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

      <el-form-item label="是否需要认证" prop="auth_type">
        <el-radio-group v-model="popParams.auth_type">
          <el-radio :label="1">认证</el-radio>
          <el-radio :label="2">不认证</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="活动简介：" prop="desc">
        <el-input type="textarea" v-model="popParams.desc" style="width:600px;" maxlength="500" placeholder='' rows="6"
          show-word-limit></el-input>
      </el-form-item>


      <el-form-item class="is-required"  label="轮播图片：" prop="imgs">
        <UploadMultiImg uploadName="imgs" style="width:800px" :fileList="popParams.imgs" :ossToken="aliyunOssToken"
          :limitNum="10" @updateOssToken="updateOssToken" @selectMultiImg="selectMultiImg" />
      </el-form-item>


      <el-form-item  label="背景图片：" prop="bg_img">
            <UploadSingleImg
                uploadName="bg_img"
                :imgUrl="popParams.bg_img"
                :ossToken="aliyunOssToken"
                @updateOssToken="updateOssToken"
                @selectImg = "selectImg"
              />

          </el-form-item>


      <el-form-item label="活动说明：" prop="content">
        <tinymce ref="tinymce" v-model="popParams.content" :width="700" :height="300" />
      </el-form-item>

      <el-form-item label="投票开始时间" prop="vote_start_time">
        <el-date-picker v-model="popParams.vote_start_time" type="datetime" format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm" placeholder="选择投票开始时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="投票结束时间" prop="vote_end_time">
        <el-date-picker v-model="popParams.vote_end_time" type="datetime" format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm" placeholder="选择投票结束时间">
        </el-date-picker>
      </el-form-item>


      <el-form-item label="客服地址：" prop="cservice_url">
        <el-input v-model="popParams.cservice_url" style="width:600px" placeholder="请输入客服地址"></el-input>
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

      <el-form-item label="活动模式：" prop="vote_type">
        <el-radio-group v-model="popParams.vote_type"  :disabled="popParams.id > 0">
          <el-radio :label="1">投票模式</el-radio>
          <el-radio :label="2">审核模式</el-radio>
          <el-radio :label="3">案例征集</el-radio>
          <el-radio :label="4">评委打分</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序模式：" prop="sort_type" v-if="popParams.vote_type == 4">
        <el-radio-group v-model="popParams.sort_type">
          <el-radio :label="1">总分</el-radio>
          <el-radio :label="2">平均分</el-radio>
        </el-radio-group>
      </el-form-item>



      <el-form-item label="自动审核：" prop="pass_type">
        <el-radio-group v-model="popParams.pass_type">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="案例名称：" prop="name_type">
        <el-radio-group v-model="popParams.name_type">
          <el-radio :label="1">必填</el-radio>
          <el-radio :label="2">选填</el-radio>
          <el-radio :label="3">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="案例说明：" prop="info_type">
        <el-radio-group v-model="popParams.info_type">
          <el-radio :label="1">必填</el-radio>
          <el-radio :label="2">选填</el-radio>
          <el-radio :label="3">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="案例图片：" prop="img_type">
        <el-radio-group v-model="popParams.img_type">
          <el-radio :label="1">必填</el-radio>
          <el-radio :label="2">选填</el-radio>
          <el-radio :label="3">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>


      <el-form-item label="编号排序：" prop="number_type">
        <el-radio-group v-model="popParams.number_type">
          <el-radio :label="1">展示</el-radio>
          <el-radio :label="2">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>


      <el-form-item label="排行榜：" prop="rank_type">
        <el-radio-group v-model="popParams.rank_type">
          <el-radio :label="1">展示</el-radio>
          <el-radio :label="2">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>


      <el-form-item label="问卷表单：" prop="topic_type">
        <el-radio-group v-model="popParams.topic_type">
          <el-radio :label="1">展示</el-radio>
          <el-radio :label="2">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="popParams.sort" :max="200000" :min="1" placeholder="越小越靠前"></el-input-number>
      </el-form-item>

       <el-form-item label="主题颜色：" prop="theme_color">
        <el-color-picker v-model="popParams.theme_color"></el-color-picker>
      </el-form-item>

       <el-form-item label="字体颜色：" prop="font_color">
        <el-color-picker v-model="popParams.font_color"></el-color-picker>
      </el-form-item>


      <el-form-item label="报名按钮名称：" prop="btn_name">
        <el-input v-model="popParams.btn_name" max="30" style="width:600px" placeholder="报名按钮名称（20个字以内）"></el-input>
      </el-form-item>

    
      <el-form-item label="报名开始时间：" prop="start_time">
        <el-date-picker v-model="popParams.start_time" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报名结束时间：" prop="end_time">
        <el-date-picker v-model="popParams.end_time" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
       <el-form-item label="奖品发放时间：" prop="send_time">
        <el-date-picker v-model="popParams.send_time" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
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

        vote_start_time: [
          { required: true, message: '请选择投票开始时间', trigger: 'change' },
        ],
        vote_end_time: [
          { required: true, message: '请选择投票结束时间', trigger: 'change' },
        ],


        start_time: [
          { required: true, message: '请选择活动开始时间', trigger: 'change' },
        ],
        end_time: [
          { required: true, message: '请选择活动结束时间', trigger: 'change' },
        ],
        send_time : [
          { required: true, message: '请选择奖品发放时间', trigger: 'change' },
        ],
        vote_type: [
          { required: true, message: '请选择活动模式', trigger: 'change' },
        ],
        auth_type: [
          { required: true, message: '请选择认证类型', trigger: 'change' }
        ],
        number_type: [
          { required: true, message: '请选择编号排序是否展示', trigger: 'change' }
        ],
        rank_type: [
          { required: true, message: '请选择排行榜是否展示', trigger: 'change' }
        ],
        topic_type: [
          { required: true, message: '请选择问卷表单是否展示', trigger: 'change' }
        ],

        sort_type: [
          { required: true, message: '请选择评分排序类型', trigger: 'change' }
        ],

        pass_type: [
          { required: true, message: '请选择是否自动审核通过', trigger: 'change' }
        ],


        theme_color: [
          { required: true, message: '请选择主题颜色', trigger: 'change' }
        ],
        font_color: [
          { required: true, message: '请选择字体颜色', trigger: 'change' }
        ],
        btn_name: [
          { required: true, message: '请输入报名按钮名称', trigger: 'change' }
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
        if (valid  && this.popParams.imgs && this.popParams.start_time <= this.popParams.end_time && this.popParams.vote_start_time <= this.popParams.vote_end_time
          && this.popParams.send_time >= this.popParams.vote_end_time
        ) {

          this.$http.post(API.voteSave, this.popParams).then(res => {
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
          if (this.popParams.start_time > this.popParams.end_time) {
            this.$message.error('结束时间需要大于开始时间');
            return;
          }
          if (this.popParams.vote_start_time > this.popParams.vote_end_time) {
            this.$message.error('投票结束时间需要大于投票开始时间');
            return;
          }
          if (this.popParams.send_time < this.popParams.vote_end_time) {
            this.$message.error('奖品发放时间需要大于结束时间');
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
