<template>
  <div class="container" v-if="type == 1">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>消息通知</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
        <el-form
        ref="listQuery"
        :model="listQuery"
        class="form-container"
        inline

            v-if="hasAdminRight"
      >
        <el-form-item
          label="渠道来源"
        >
          <el-select
              v-model="listQuery.place_id"
              clearable
              placeholder="请选择"
              filterable
            >
              <el-option
                v-for="item in placeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
        </el-form-item>
        
        <el-form-item>
            <el-button
            type="primary"
            align="right"
            @click="searchForm"
          >
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>
        </el-form-item>
        </el-form>
        <el-alert
              type="warning"
              effect="light"
              class="alert-tip list-alert"
              :closable="false"
            >
            <div>使用微信历史模板消息，需要先从公众号添加“it科技一>互联网/电子商务”分类</div>
           <div>使用类目模板消息，需要依次先从公众号添加“房地产行业一>房屋中介”、“商家自营一>服饰内衣”、“ 生活服务一>百货/超市/便利店”、“工具一>预约/报名”类目</div>
            </el-alert>
    <div class="table-box" v-loading="loading" v-if="dataFlag">
      <el-row :gutter="24" >
        <el-col :span="8"   v-for="(item, index) in tipArr"
            :key="index" class="tip-card">
          <el-card shadow="always">
            <div slot="header" class="clearfix"   @click="editNotify(item)">
              <el-row type="flex">
                <el-col :span="23">
                  <i :class="item.icon" class="title-icon" ></i>
                  <span>{{item.name}}</span>
                </el-col>
                <el-col :span="1">
                  <i class="el-icon-arrow-right" ></i>
                </el-col>
              </el-row>
              
              
            </div>
            <div class="text item"   @click="editNotify(item)">
              <el-row type="flex">
                <el-col :span="23">
                  <span>微信模板消息</span>
                </el-col>
                <el-col :span="1">
                  <i class="el-icon-success" v-if="item.data.status == 1"></i>
                  <i class="el-icon-error" v-else ></i>
                </el-col>
              </el-row>
              <el-row type="flex">
                  <el-col :span="23">
                    <span>短信通知</span>
                  </el-col>
                  <el-col :span="1">
                    <i class="el-icon-success" v-if="item.data.sms_status == 1"></i>
                    <i class="el-icon-error" v-else ></i>
                  </el-col>
                </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
  </div>
  <div v-else>请先选择渠道</div>
  
  </div>
  <div class="container" v-else>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{ popTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form
       :model="popParams"
                 ref="popForm"
                 label-width="150px"
                 :rules="rules"
      >
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="公众号通知" name="wechat">
          <el-alert
            type="warning"
            effect="light"
            class="alert-tip"
            :closable="false"
          >
          <div> {{ popTip1 }}</div>
         <div> {{ popTip2 }}</div>
          </el-alert>
          <el-alert
              title="发送设置"
              type="info"
              effect="dark"
              :closable="false"
              class="alert-setting"
            >
            </el-alert>
               
            <el-form-item label="发送设置：" prop="status">
              <el-radio v-model="popParams.status" :label=1>开启</el-radio>
              <el-radio v-model="popParams.status" :label=2>关闭</el-radio>
            </el-form-item>
            <el-form-item label="模板类型：" prop="temp_type" v-if="popParams.status == 1">
              <el-radio v-model="popParams.temp_type" :label=1>历史模板</el-radio>
              <el-radio v-model="popParams.temp_type" :label=2>类目模板</el-radio>
            </el-form-item>

              <!-- <el-form-item label="模板设置：" prop="temp" v-if="popParams.status == 1 && popParams.temp_type == 1">
                <el-input v-model="popParams.temp" style="width:600px" placeholder="请输入历史模板id"></el-input>
              </el-form-item>
            <el-form-item label="模板设置：" prop="lm_temp" v-else-if="popParams.status == 1">
              <el-input v-model="popParams.lm_temp" style="width:600px" placeholder="请输入类目模板id"></el-input>
            </el-form-item> -->
        </el-tab-pane>
        <el-tab-pane label="短信通知" name="sms">
            <el-alert
                title="发送设置"
                type="info"
                effect="dark"
                :closable="false"
                class="alert-setting"
              >
              </el-alert>
               
              <el-form-item label="发送设置：" prop="sms_status">
                <el-radio v-model="popParams.sms_status" :label=1>开启</el-radio>
                <el-radio v-model="popParams.sms_status" :label=2>关闭</el-radio>
              </el-form-item>

                <el-form-item label="模板设置：" prop="sms_id" v-if="popParams.sms_status == 1">
                  <el-input v-model="popParams.sms_id" style="width:600px" placeholder="请输入短信模板id"></el-input>
                </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item label="">
            <el-button @click="submitForm('popForm')" type="primary" style="width: 100px;"
            v-loading="saveLoading"
            >保存
            </el-button>
            <el-button @click="backList"  style="width: 100px;" v-loading="saveLoading">返回列表
              </el-button>
          </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tipArr: [],
      listQuery:{
        place_id:'',
      },
      hasAdminRight: false,
      placeList:[],
      showEditFlag:false,
      popTitle:'',
      type:1,
      tabActiveName:'wechat',
      popParams:{
        type: 1,
        temp:'temp',
        lm_temp:'ln-temp',
        temp_type:1,
        status:1,
        sms_id:'sms',
        sms_status:2
      },
      dataFlag:false,

      saveLoading:false,
      loading: true,

      popTip:'',
      rules: {
        // temp: [{ required: true, message: '请输入历史模板id', trigger: 'change' },],
        // lm_temp: [{ required: true, message: '请输入类目模板id', trigger: 'change' },],
        sms_id: [{ required: true, message: '请输入短信模板id', trigger: 'change' },],
      },
      sel_place_id:0,

    }
  },
  
  created() {
    var rollType = this.$storage.get('PE_USER_INFO').type
    rollType == 1 ? this.hasAdminRight = true : ''
    let list = [
    {name: "咨询回复通知", tip1:"添加历史模板消息请先选择“it科技--互联网/电子商务”分类，添加模板“问诊咨询跟进提醒”，编号：OPENTM415291759", tip2: "添加类目模板消息先选择“房屋中介”类目，添加模板“客户跟进提醒”，模板id：51373", type: 2, icon: 'el-icon-chat-dot-round'},
    { name: "视频拨打提醒", tip1: "添加历史模板消息请先选择“it科技--互联网/电子商务”分类，添加模板“问诊咨询跟进提醒”，编号：OPENTM415291759", tip2: "添加类目模板消息先选择“房屋中介”类目，添加模板“客户跟进提醒”，模板id：51373", type: 7, icon: 'el-icon-chat-dot-round' }, 
    { name: "订单付款成功通知", tip1: "添加历史模板消息请先选择“it科技--互联网/电子商务”分类，添加模板“订单生成通知”，模板ID：OPENTM205213550", tip2: "添加类目模板消息先选择“服饰内衣”类目，添加模板“订单支付成功通知”，模板id：51549", type: 4, icon: 'el-icon-s-order'},
    { name: "订单发货通知", tip1: "添加历史模板消息请先选择“it科技--互联网/电子商务”分类，添加模板“订单变更通知”，编号：OPENTM400520954", tip2: "添加类目模板消息先选择“百货/超市/便利店”类目，添加模板“订单发货提醒”，模板id：51549", type: 5, icon: 'el-icon-truck'},
    { name: "订单取消通知", tip1: "添加历史模板消息请先选择“it科技--互联网/电子商务”分类，添加模板“订单变更通知”，编号：OPENTM400520954", tip2: "添加类目模板消息先选择“服饰内衣”类目，添加模板“订单取消提醒”，模板id：51551", type: 6, icon: 'el-icon-document-delete'},
    { name: "审核结果通知", tip1: "添加历史模板消息请先选择“it科技--互联网/电子商务”分类，添加模板“审核结果通知”，编号：OPENTM415281152", tip2: "添加类目模板消息先选择“预约/报名”类目，添加模板“客户跟进提醒”，模板id：49439", type: 1, icon: 'el-icon-time'},]
    list.forEach(el => {
      el.data = {
        type: el.type,
        temp: '',
        lm_temp: '',
        temp_type: 1,
        status: 2,
        sms_id: '',
        sms_status: 2,
        place_id:0,
      }
      this.tipArr.push(el)
    })

        
      
    if (this.hasAdminRight) {
      this.getPlaceList()
    } else {
      this.searchForm()
    }
  },
  methods: {
    editNotify(row) {
      row.data.place_id = this.sel_place_id
      this.type = 2
      this.popParams = row.data
      // this.showEditFlag = true
      this.popTitle = row.name
      this.popTip1 = row.tip1
      this.popTip2 = row.tip2
    },
    getPlaceList() {
      this.$http.get(API.getAllPlace).then(res => {
        if (res.status == 200) {
          this.placeList = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    searchForm() {
      if(this.hasAdminRight && !this.listQuery.place_id) {
        this.$message.error('请先选择渠道')
        return
      }
      this.dataFlag = true

      this.loading = true
      this.$http.get(API.getTempList, this.listQuery).then(res => {
        const { data: { data }, status, message } = res;
       
        if (status == 200) {
          this.sel_place_id = this.listQuery.place_id

          for (let index = 0; index < this.tipArr.length; index++) {
            let el =  this.tipArr[index]
            this.tipArr[index].data = {
              type: el.type,
              temp: '',
              lm_temp: '',
              temp_type: 1,
              status: 2,
              sms_id: '',
              sms_status: 2,
              place_id: this.sel_place_id,
            }
            
          }



          data.forEach(el => {
            let index = (this.tipArr).findIndex((item) => (item.type == el.type))
            if (index > -1) {
              this.tipArr[index].data = el
            }
          })
          this.loading = false
        } else {
           this.loading = false
          this.$message.error(message)
        }
      })



    },
    backList() {
      this.type = 1
      this.searchForm()
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          this.saveLoading=true;
          this.$http.post(API.addTemp, this.popParams).then(res => {
            const { status, message } = res;
            if (status == 200) {
              this.$message.success(message);
            } else {
              this.$message.error(message)
            }
          }).finally(() => {
            this.saveLoading = false
          })
        } else {
          for (var i in object) {
            // console.log(i, object[i], "for")
            this.$message.error(object[i][0].message)
            return false
          }
          return false
        }
    });
  }
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .table-box {
    padding-bottom: 20px;
  }
  .pagination {
    padding-bottom: 15px;
  }
  .primaryBtn {
    margin-bottom: 20px;
  }

  .tip-card{
    margin-bottom: 20px;
    .el-card {
      height: 200px;
      .title-icon {
        font-size: 20px;
        line-height: 30px;
        vertical-align: middle;
      }
      .el-icon-success {
        color: #29bd6e;
      }
      .el-icon-error {
        color: #f22435;
      }
    }
  }

  .alert-tip {
    margin-top:10px;
  }
  .alert-tip.list-alert {
    margin-bottom: 10px;
  }

  .alert-setting {
    background: #f3f5ff;
    color: #000;
    font-weight: bold;
    margin: 20px 0;
  }
}
</style>
