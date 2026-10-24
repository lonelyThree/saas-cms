<template>
  <div class="place-wrap">
    <el-page-header @back="backListClick" :content="popTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" :model="listQuery" class="form-container" inline>

        <el-form-item label="记录ID">
          <el-input v-model="listQuery.logId" clearable class="filter-item" placeholder="请输入id" />
        </el-form-item>

        <el-form-item label="连锁名称">
                     <el-select
                      v-model="listQuery.chainId"
                      filterable
                      remote
                      reserve-keyword
                      clearable
                      placeholder="请输入连锁名称关键词"
                      :remote-method="chainSearch"
                      :loading="chainLoading">
                      <el-option
                        v-for="item in chainOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>

        <el-form-item label="邀请openid">
          <el-input v-model="listQuery.shareOpenid" clearable class="filter-item" placeholder="请输入openid" />
        </el-form-item>

        <el-form-item label="阅读openid">
          <el-input v-model="listQuery.openid" clearable class="filter-item" placeholder="请输入openid" />
        </el-form-item>


        <el-form-item label="发放状态">
          <el-select v-model="listQuery.awardStatus" clearable placeholder="请选择" filterable>
            <el-option v-for="item in awardStatusQuery" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

         <el-form-item label="奖品">
          <el-select v-model="listQuery.awardId" clearable placeholder="请选择" filterable>
            <el-option v-for="item in awardIdQuery" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>



        <el-form-item>
          <el-button type="primary" align="right" @click="searchForm">
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>
        </el-form-item>

      </el-form>


    </el-card>




    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row row-key="id"
      :style="{'width': '100%', 'margin-top': '15px'}">
      <el-table-column v-for="(item, index) in tableConfig" :key="index" align="center" :label="item.label"
        :width="item.width" :prop="item.key" >
        <template slot-scope="scope">
          <span v-if="item.key == 'is_award'">{{ scope.row[item.key] == 2 ? '已发放' : '未发放' }}</span>

          <span v-else-if="item.key == 'create_at' || item.key == 'view_time'">{{ scope.row[item.key] * 1000, 3 | dateFormat }}</span>

          <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total>0" :total="total" :current-page.sync="listQuery.page" :page-sizes="[5, 10, 20, 30, 50]"
      :page-size.sync="listQuery.limit" layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="handleCurrentChange" />

  </div>

</template>
<script>

import vDialog from '../../dialog.vue'

export default {
  props: {
    popId: Number,
    popTitle: String,
    openid: String,
  },
  data() {
    return {
      formLabelWidth: '68px',
      
      isAwardMap: {  '1' : '已发放',  '2': '未发放' },
      awardStatusQuery: [{ id: 0, name: '全部' }, { id: 1, name: '已发放' }, { id: 2, name: '未发放' }],

      awardIdQuery: [{ id: 0, name: '全部' }],
      menualAwardQuery: [],
      

      total:0,
      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id'  },
        { label: '阅读时间', key: 'create_at', width:'130px'},
        { label: '奖励时间', key: 'view_time', width:'130px'},


        { label: '奖励(分)', key: 'money', width: '100px' },
        { label: '发放状态', key: 'is_award' },

        { label: '邀请店员姓名', key: 'username' },
        { label: '邀请粉丝openid', key: 'share_openid' , width: '150px' },
        { label: '邀请粉丝昵称', key: 'nickname' },
        { label: '邀请连锁名称', key: 'chainName' },
        { label: '转账批次号', key: 'batch_id' },

        { label: '阅读店员姓名', key: 'view_username' },
         { label: '阅读粉丝昵称', key: 'view_nickname' },
        { label: '阅读粉丝openid', key: 'openid' , width: '150px' },

        { label: '失败原因', key: 'reason' },

      ],


      listQuery: {
        articleId:0, 
        openid:'',
        shareOpenid:'',
        awardStatus:0,

        chainId:'',
        awardId:0,

        page:1,
        limit:20,
      },

      popParams:[
      ],

   
   


      
    

      chainLoading:false,
      chainOptions:[],


      showPopFlag:false,


      chainMap: {},
      chainList: [{ 'id': 0, name: '全部' }, { 'id': -1, name: '未知' }],

      reasonList:[
        '请提供真实的信息',
        '请上传清晰、真实门店照片',
      ],

    };
  },
  created() {
      this.rollType = this.$storage.get('PE_USER_INFO').type
      if (this.rollType == 1 && 'saas' == this.$storage.get('PE_USER_INFO').info.currentLoginName) {
        // this.getPlaceList()
      } else {
        this.tableConfig.pop()
      }
    this.listQuery.articleId = this.popId
    this.listQuery.shareOpenid = this.openid

    this.getList()
    this.getAwardList()
   },
   components:{vDialog},
  methods: {
     searchForm() {
      this.listQuery.page = 1
      this.getList()
    },
    chainSearch(query){
       if (query !== '') {
        this.chainLoading = true
        this.$http.get(API.getChainList + '?name=' + query).then(res => {
          if (res.code == 200) {
            this.chainLoading = false
            this.chainOptions = res.data

          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.chainOptions = [];
      }
    },
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    handleCurrentChange(page){
      this.listQuery.page = page
      this.getList()
    },

    getAwardList() {
      this.$http.get(API.domain+'VoteAwardList?op=search&voteId='+this.popId).then(res => {
        if (res.code == 200) {
            const awardList = res.data
            this.awardIdQuery = [{ id: 0, name: '全部' },
              ...awardList.map(item => ({ id: item.id, name: item.name }))
            ]

        } else {
          this.$message.error(res.msg)
        }
      })
    },

    
  

   

    
    getList() {
      // console.log(API.receiptReceip, "API.receiptReceip", "getlist")
      this.listLoading = true
      this.$http.get(API.articleUserLog,{...this.listQuery}).then(res => {
        this.listLoading = false
        if (res.code == 200) {

          this.tabList = res.data.data
          this.total = res.data.total
          // console.log(this.tabList, "tabList")
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
}
</script>
<style lang='scss' scoped>
</style>
