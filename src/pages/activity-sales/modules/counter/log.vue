<template>
  <div class="place-wrap">
    <el-page-header @back="backListClick" :content="popTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" :model="listQuery" class="form-container" inline>



         <el-form-item label="所属企业">
          <el-select v-model="listQuery.company_id" filterable remote reserve-keyword clearable placeholder="请输入连锁名称关键词"
            :remote-method="companySearch" :loading="companyLoading">
            <el-option v-for="item in companyOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="粉丝openid">
          <el-input v-model="listQuery.openid" clearable class="filter-item" placeholder="请输入openid" />
        </el-form-item>

         <el-form-item label="粉丝昵称">
          <el-input v-model="listQuery.nickname" clearable class="filter-item" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="listQuery.name" clearable class="filter-item" placeholder="请输入用户名" />
        </el-form-item>

         <el-form-item label="手机号">
          <el-input v-model="listQuery.mobile" clearable class="filter-item" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="打卡门店">
          <el-input v-model="listQuery.store_name" clearable class="filter-item" placeholder="请输入打卡门店" />
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="listQuery.awardStatus" clearable placeholder="请选择" filterable>
            <el-option v-for="item in awardStatusQuery" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" align="right" @click="searchForm">
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>

          <el-button
                    type="warning"
                    align="right"
                    @click="download">
                    <i class="el-icon-download"/>
                    <span> 导出</span>
                </el-button>
        </el-form-item>

      </el-form>

    </el-card>




    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row row-key="id"
     :style="{'width': '100%', 'margin-top': '15px'}">
      <el-table-column v-for="(item, index) in tableConfig" :key="index" align="center" :label="item.label"
        :width="item.width" :prop="item.key" :sortable="item.sortable">
        <template slot-scope="scope">
          <img width="60" :src="scope.row.avatar" alt="pic" v-if="item.key == 'avatar'" />
          <span v-else-if="item.key=='award_status'">
                {{ awardStatusMap[scope.row[item.key]]? awardStatusMap[scope.row[item.key]]:'未知'}}
            </span>
            <span v-else-if="item.key == 'arrive_is_normal' || item.key == 'leave_is_normal' || item.key == 'is_duration_valid'">{{ scope.row[item.key] == 1 ? '正常' : '异常' }}</span>

          <span v-else-if="item.key == 'leave_at' || item.key == 'arrive_at'">{{ scope.row[item.key] * 1000, 3 | dateFormat }}</span>

          <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" :width="120">
        <template slot-scope="{row}">

          <el-button type="primary" class="op-btn" plain size="mini" @click="showTopicClick(row, 1)">
            到店表单
          </el-button>
          <br />
          <el-button type="info" v-if="row.leave_at > 0" class="op-btn" size="mini"  @click="showTopicClick(row, 2)">
            离店表单
          </el-button>
          <br />

          <el-button type="warning" class="op-btn" size="mini" v-if="row.award_status == 7" @click="reviewClick(row)">
            人工审核
          </el-button>


          <el-button type="warning" class="op-btn" size="mini" v-if="row.award_status == 4" @click="sendclick(row)">
            发放奖励
          </el-button>





        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total>0" :total="total" :current-page.sync="listQuery.page" :page-sizes="[5, 10, 20, 30, 50]"
      :page-size.sync="listQuery.limit" layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="handleCurrentChange" />

    <el-dialog :visible.sync="showReviewPopFlag" :title="popReviewTitle" width="80%">
      <el-form :model="popReviewParams" :rules="reviewRules" ref="revieWForm" label-width="180px">
        <el-form-item label="操作" prop="opType">
          <el-radio-group v-model="popReviewParams.opType">

            <el-radio :label="1" >审核通过</el-radio>
            <el-radio :label="2" >审核驳回</el-radio>
          </el-radio-group>
        </el-form-item>




        <el-form-item label="驳回原因：" prop="reason" v-if="popReviewParams.opType == 2 ">
          <el-select
              v-model="popReviewParams.reason"
              filterable
              allow-create
              default-first-option
              placeholder="请选择或者输入驳回原因"
              style="width:600px" 
              >
              <el-option
                v-for="item in reasonList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="">
          <el-button @click="submitReviewForm('revieWForm')" type="primary" :loading="reviewLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>



     <TopicDrawer :popTitle="topicDrawer.popTitle" :visible.sync="topicDrawer.visible" :infoList="topicDrawer.infoList" :loading="topicDrawer.loading" @closeDrawer="closeTopicDrawer" />
  </div>

</template>
<script>
import TopicDrawer from '@/components/Drawer/TopicDrawer/index.vue';
import vDialog from '../../dialog.vue'

export default {
  props: {
    popId: Number,
    popTitle: String,
    sendType: Number,

    popParams: Object,
    openid: String,
  },
  data() {
    return {
      formLabelWidth: '68px',
    
      awardStatusMap: { '0': '未知',  '2': '未中奖', '3': '待领取', '4': '待发放', '5': '已领取' , '6': '已发放', '7': '待审核', '8' : '审核失败' },
      awardStatusQuery: [{ id: 0, name: '全部' },  { id: 3, name: '待领取' }, { id: 4, name: '待发放' }, 
        { id: 5, name: '已领取' }, { id: 6, name: '已发放' } , { id: 7, name: '待审核' }, { id: 8, name: '审核失败' }],
      total:0,
      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id'  },

        { label: '审核状态', key: 'award_status' },
         { label: '金额(分)', key: 'money', width: '100px'},
        { label: '头像', key: 'avatar', width: '90px' },
             { label: '粉丝openid', key: 'openid' , width: '150px' },
        { label: '粉丝昵称', key: 'nickname' },
        { label: '业务员姓名', key: 'username' },
        { label: '手机号', key: 'mobile' },
        { label: '所属企业', key: 'companyName' },
        { label: '二级部门', key: 'companyDepartmentName' },
        
        { label: '打卡门店', key: 'store_name' },
        { label: '到店打卡时间', key: 'arrive_at', width:'140px'},
        { label: '到店距离', key: 'arrive_distance' },
        { label: '到店状态', key: 'arrive_is_normal' },

        { label: '到店时长', key: 'duration' },
        { label: '时长状态', key: 'is_duration_valid' },

        { label: '离店打卡时间', key: 'leave_at' , width:'140px'},
        { label: '离店距离', key: 'leave_distance' },
        { label: '离店状态', key: 'leave_is_normal' },
      


       


        { label: '转账批次号', key: 'batch_id' },

      ],


      listQuery: {
        logId:'',
        counterId:0, 
        company_id:0, 
        openid:'',
          nickname:'',
          name:'',
          mobile:'',
          store_name:'',
        awardStatus:0,



        order:0,
        page:1,

        limit:20,

      },
      
      popReviewTitle:'',
      showReviewPopFlag:false,
      reviewLoading:false,



      popReviewParams:{
        counterId:0,
        CheckInLogId:0,
        openid:'',
        
        opType:0,
        reason:'',
      },
      reviewRules: {
        opType: [
          { required: true, message: '请先选择操作类型', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入驳回原因', trigger: 'change' }
        ],
      },

      companyLoading:false,
      companyOptions:[
        { 'id': 0, name: '全部' },
      ],


      showPopFlag:false,


      companyList: [{ 'id': 0, name: '全部' }, { 'id': -1, name: '未知' }],

      reasonList:[
        '打卡位置异常',
        '到店时长不足',
        '请上传清晰、真实门店照片',
        '非活动门店不能打卡',
      ],

      topicDrawer: {
        visible: false,
        infoList: [],
        loading: false,
        popTitle: '详情',
      },
      abortController : null,

    };
  },
  created() {
      this.rollType = this.$storage.get('PE_USER_INFO').type
      if (this.rollType == 1) {
        // this.getPlaceList()
      } else {
        this.tableConfig.shift()
      }
    this.listQuery.counterId = this.popId
    this.listQuery.openid = this.openid
    this.listQuery.type = this.popParams.type


    this.getList()
   },
   components:{vDialog, TopicDrawer},
  methods: {
     searchForm() {
      this.listQuery.page = 1
      this.getList()
    },
    companySearch(query){
       if (query !== '') {
        this.companyLoading = true
        this.$http.get(API.domain +"UserCompanyCmsList?place_id=" + this.popParams.place_id + '&name=' + query).then(res => {

          console.log(res, "companySearch==res")
          if (res.code == 200) {
            this.companyLoading = false
            this.companyOptions = res.data.data

          } else {
             this.companyLoading = false
            this.$message.error(res.msg)
          }
        })
      } else {
        this.companyOptions = [];
      }
    },
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    handleCurrentChange(page){
      this.listQuery.page = page
      this.getList()
    },

    submitReviewForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid &&  this.popReviewParams.opType) {
          this.reviewLoading = true
          this.$http.post(API.domain+"CounterCheckInLogReview", this.popReviewParams).then(res => {

            if (res.code === 200) {
              this.$message.success('请求成功')
              setTimeout(() => {
                this.showReviewPopFlag = false
                this.getList()
              }, 1000);
            } else {
              this.$message.error(res.msg ? res.msg : '审核失败')
            }
            this.reviewLoading = false
          })
            .catch(error => {
              this.$message.error('请求失败')
              this.reviewLoading = false

            });
        } else {
          if (!this.popReviewParams.opType) {
            this.$message.error('请先选择审核操作')
            return false
          }
          for (var i in object) {
            this.$message.error(object[i][0].message)
            return false
          }
          return false;
        }
      });
    },

    sendclick(row) {
      this.$confirm('此操作将发放【'+row.openid+'】奖励, 是否继续?', '提示', {
        confirmButtonText: "发放奖励",
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$http.post(API.domain+"CounterCheckInLogSend", { counterId: row.counter_id, CheckInLogId: row.id, openid: row.openid }).then((res) => {
          if (res.code === 200) {
            this.$message.success('发放成功')
            this.getTabList();
            
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
      
    },

    
    reviewClick(row) {
      this.popReviewParams.counterId = row.counter_id
      this.popReviewParams.CheckInLogId = row.id
      this.popReviewParams.openid = row.openid
      this.popReviewParams.opType = 0
      this.popReviewParams.reason = ''
      this.popReviewTitle = '人工审核'

      this.showReviewPopFlag = true
      // this.$http.get(API.receiptManual, { receiptId: this.receiptId, id:row.id }).then(res => {
      //   if (res.code == 200) {
      //     this.$message.info('审核成功')
      //     this.getList()
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      // })
      
    },

    

    getList() {
      // console.log(API.receiptReceip, "API.receiptReceip", "getlist")
      this.listLoading = true
      this.$http.get(API.domain+"CounterCheckInLogList",{...this.listQuery}).then(res => {
        this.listLoading = false
        if (res.code == 200) {


          this.tabList = res.data.data
          this.total =  res.data.count
          // console.log(this.tabList, "tabList")
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    showTopicClick(row, topicType) {
       // ✅ 取消上一个还在飞行中的请求
    if (this.abortController) {
      this.abortController.abort();
    }
     this.abortController = new AbortController();
      this.topicDrawer.visible = true
      this.topicDrawer.loading = true
       this.topicDrawer.infoList = [];
       this.topicDrawer.popTitle = row.username + '【' + row.store_name +  '】'+(topicType == 1 ? '到店表单详情' : '离店表单详情')
      this.$http.get(API.domain+"CounterCheckInFormInfo",{checkInLogId:row.id, counterId:row.counter_id, topicType: topicType}, { signal: this.abortController.signal }).then(res => {
        if (res.code == 200) {
          this.topicDrawer.infoList = res.data
          this.topicDrawer.visible = true
        } else {
          this.$message.error(res.msg)
        }
        this.topicDrawer.loading = false
      }) .catch(err => {
        // 5️⃣ 区分主动取消和真正的网络错误
        if (axios.isCancel(err) || (err && err.code === 'ERR_CANCELED')) {
          // 主动取消的请求，什么都不做，静默处理
          return;
        }
        this.$message.error('网络请求失败，请重试');
      })
      .finally(() => {
        this.topicDrawer.loading = false;
      });

    } ,// 关闭抽屉时也取消请求
  closeTopicDrawer() {
    // console.log('closeTopicDrawer===closeTopicDrawer');
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.topicDrawer.visible = false;
    this.topicDrawer.loading = false;
    this.topicDrawer.infoList = [];
  },

  download() {
      this.$http.download(API.domain+"CounterCheckInLogExport",{...this.listQuery}).then(res => {
        if (res.status != 200) {
          this.$message.error('导出失败')
          return
        }
        if (res.data.type == 'application/json') {
          let reader = new FileReader();
          reader.readAsText(res.data, "utf-8");
        reader.onload = (e) => {
      let readerres = reader.result;
      let parseObj  = JSON.parse(readerres);
      this.$message.error(parseObj.msg?parseObj.msg:'导出失败')
    };
    return
    
          
        }
        let fileName = decodeURIComponent(res.headers["content-disposition"].split("=")[1])
        if (!res.data) { //data为axios返回的文件流
          this.$message.error('导出失败')
          return
        }
        const file = new Blob([res.data], { type: "application/vnd.ms-excel;charset=utf-8" });
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
            a.style.display = 'none'
            a.href = url // 指定下载链接
            a.download = fileName //指定下载文件名
            a.click() //触发下载
            URL.revokeObjectURL(a.href) //释放URL对象
      })
      
    },
  },
}
</script>
<style lang='scss' scoped>
</style>
