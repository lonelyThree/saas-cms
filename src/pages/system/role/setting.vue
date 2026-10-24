<template>
    <div class="role-setting">
        <h2>互联网医院审核</h2>
        <div>
            <ul>
                <li>开启后，会有以下变化：</li>
                <li>1、医生开完处方后，提交签名请求给契约锁时，会先进行人脸识别</li>
                <li>2、在线问诊过程中，患者必须提交实体医疗机构的纸质病历或处方</li>
                <li>3、在线问诊过程，医生写电子病历</li>
                <li>4、患者进入在线问诊页面时，必须阅读并勾选《知情同意书》</li>
                <li>5、医生开了处方后，药师签名之后，在把处方发送给患者</li>
            </ul>
        </div>
       
        <div class="radio-wrap">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="审核">
                    <el-radio-group v-model="form.resource" @change="setStatus">
                        <el-radio label="开"></el-radio>
                        <el-radio label="关"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        
    </div>
</template>
<script>
  export default {
    data () {
      return {
          form:{
              resource: '开'
          },
          is_audit:''
      };
    },
    mounted(){
        this.getStatus();
    },
    methods:{
        getStatus(){
            console.log('getStatus')
            this.$http.get(API.getSetInfo).then(res => {
            if(res.status==200) {
               console.log(res.data.is_audit) //2开
               if(res.data.is_audit==2){
                   this.form.resource = "开"
               }else{
                   this.form.resource = "关"
               }
            } else {
                this.$message.error(res.message)
            }
            })
        },
        setStatus(){
            let res = this.form.resource=="开"?2:1
            this.$http.post(API.setAuditInfo,{is_audit:res}).then(res => {
            if(res.status==200) {
                this.$message.success(res.message)
            } else {
                this.$message.error(res.message)
            }
            })
        }
    }
  }
</script>
<style lang="scss" scoped>
    .role-setting{
        h2{width:128px; padding-left:10px; border-left:3px solid #409EFF; margin:20px 10px;}
        ul{
            background: #eaeaea; padding:20px; margin-left:50px;
            li{line-height: 26px;}
        }
        h2.title{border:0;}
        .radio-wrap{margin: 20px;}
    }
</style>