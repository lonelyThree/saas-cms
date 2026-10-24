<template>
     <div class="place-wrap">
          <el-page-header @back="backListClick" :content="popTitle">
          </el-page-header>
          <el-divider></el-divider>
        <el-card class="box-card" shadow="never">
            <el-form ref="listQuery"
                :model="listQuery"
                class="form-container"
                inline>
              <el-form-item label="参与日期" v-if="awardType == 1">
                <el-date-picker type="date" placeholder="选择日期" 
                      v-model="listQuery.speakDate"
                      value-format="yyyyMMdd"
                       style="width: 100%;"></el-date-picker>
              </el-form-item>

              <el-form-item
                      label="题目"
                  >
                  <el-select
                          v-model="listQuery.topicId"
                          clearable
                          placeholder="请选择"
                          filterable
                      >
                          <el-option
                          v-for="item in topicList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                          />
                      </el-select>
                  </el-form-item>

                <el-form-item
                    label="获奖状态"
                >
                <el-select
                        v-model="listQuery.awardStatus"
                        clearable
                        placeholder="请选择"
                        filterable
                    >
                        <el-option
                        v-for="item in awardQuery"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        />
                    </el-select>
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
           
                <el-form-item label="粉丝名称">
                    <el-input
                        v-model="listQuery.nickname"
                        clearable
                        class="filter-item"
                        placeholder="请输入粉丝名称"/>
                </el-form-item>

                
                <el-form-item label="手机号码">
                    <el-input
                        v-model="listQuery.mobile"
                        clearable
                        class="filter-item"
                        placeholder="请输入手机号码"/>
                </el-form-item>

                <el-form-item label="用户名称">
                    <el-input
                        v-model="listQuery.name"
                        clearable
                        class="filter-item"
                        placeholder="请输入用户名称"/>
                </el-form-item>

                <el-form-item label="openid">
                    <el-input
                        v-model="listQuery.openid"
                        clearable
                        class="filter-item"
                        placeholder="请输入openid"/>
                </el-form-item>

               
                

                <el-form-item>
                <el-button
                    type="primary"
                    align="right"
                    @click="searchForm">
                    <i class="el-icon-search"/>
                    <span> 搜索</span>
                </el-button>
            </el-form-item>

        </el-form>

        <el-descriptions title="" :column="3">
          <el-descriptions-item label="活动总人次">{{total}}</el-descriptions-item>
          <el-descriptions-item label="发放金额总计(元)">{{ sendMoeny }}</el-descriptions-item>
          <el-descriptions-item label="待领取金额总计(元)">{{ awaitMoney }}</el-descriptions-item>
        </el-descriptions>
        </el-card>


      

        <el-table
        v-loading="listLoading"
        :data="tabList"
        border
        fit
        highlight-current-row
        :style="{'width': '100%', 'margin-top': '15px'}"
        >
        <el-table-column
            v-for="(item, index) in tableConfig"
            :key="index"
            align="center"
            :label="item.label"
            :width="item.width"
            :prop="item.key"
        >
        <template slot-scope="scope">
            <img width="60" :src="scope.row.avatar" alt="pic" v-if="item.key=='avatar'" />
            <span v-else-if="item.key == 'award_status'">{{ scope.row[item.key] == 1 ? '待领取' : (scope.row[item.key] == 2 ? '未获奖' : '已领取') }}</span>
            <span v-else-if="item.key == 'date'">{{ scope.row['speak_date'] | date2Format }}</span>
            <span v-else>{{ scope.row[item.key] }}</span>
        </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
            fixed="right"
            :width="80"
        >
            <template slot-scope="{row}">
            <el-button
                type="primary"
                class="op-btn"
                plain
                size="mini"
                @click="showDetailClick(row)"
            >
                题目
            </el-button>
            
            
            </template>
        </el-table-column>
        </el-table>
      <el-pagination
        v-show="total>0"
        :total="total"
        :current-page.sync="listQuery.page"
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size.sync="listQuery.limit"
        layout="prev, pager, next, jumper, ->, sizes, total"
        @current-change="handleCurrentChange"
      />

    <v-dialog :visible.sync="showPopFlag" title="题目消息" width="52%" :destroy-on-close='true'>
        <el-descriptions title="" column="2"> 
            <el-descriptions-item label="题目ID">{{popParams.topicId}}</el-descriptions-item>
            <el-descriptions-item label="题目状态"><el-tag size="small">{{ popInfo.status == 1?'上线':'下线'}}</el-tag></el-descriptions-item>
           
            <el-descriptions-item label="完成次数/需完成次数">{{ popParams.finishNum }}/{{ popInfo.num }}</el-descriptions-item>

            <el-descriptions-item label="分数阈值">{{ popInfo.score }}</el-descriptions-item>
            <el-descriptions-item label="题目">{{ popInfo.name}}</el-descriptions-item>
        </el-descriptions>
    </v-dialog>
    </div>

</template>
<script>

import vDialog from '../../dialog.vue'

export default {
  props: {
    speakId: Number,
    popTitle: String,
    awardType: Number,
    money: Number,
    topicId: Number,
  },
  data() {
    return {
      formLabelWidth: '68px',
      awardMap:{'0':'未知','-1':'未中奖'},
      awardQuery:[{id:0, name:'全部'},{id:1, name:'待领取'}, { id: 2, name: '未中奖' }, { id: 2, name: '已领取' }],

      total:0,
      tabList:[],
      tableConfig : [
        { label: '头像', key: 'avatar' },
        { label: '粉丝openid', key: 'openid' },
        { label: '用户昵称', key: 'nickname' },
        { label: '用户名', key: 'name' },
        { label: '手机号', key: 'mobile' },
        { label: '连锁名称', key: 'chainName' },
        { label: '门店名称', key: 'storeName' },

        { label: '题目ID', key: 'topic_id' },
        { label: '领奖状态', key: 'award_status' },
        { label: '转账批次号', key: 'batch_id' },
        { label: '达标次数', key: 'finish_num' },
        // { label: '完成时间', key: 'answerAt' },
        // { label: '是否中奖', key: 'award' },
        // // { label: '参与人数', key: 'joinCnt' },
        // { label: '开始日期', key: 'start_time' },
        // { label: '结束日期', key: 'end_time' },
      ],


      listQuery: {
        speakDate:'',
        speakId:0, 
        topicId:0,
        awardStatus:0,
        nickname:'',
        name:'',
        openid:'',
        mobile:'', 
        chainId:'',
        page:1,
        limit:20,
      },

      popParams:{
        finishNum:0,
        topicId:0,

      },
      popInfo:{
            name:'',
            mobile:'',
            id_card:'',
            province_name:'',
            city_name:'',
            county_name:'',
            detail:'',
        },

      chainLoading:false,
      chainOptions:[],


      showPopFlag:false,

      topicMap:[],
      topicList:[],

      sendMoeny:0,
      awaitMoney:0,


    };
  },
  created() {
    this.listQuery.speakId = this.speakId
    if (this.awardType == 1) {
      this.tableConfig.unshift({
        label: '参与日期', key: 'date'
      })
    }
    this.listQuery.topicId = this.topicId
    this.getList()
    this.getTopicList()
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

    showDetailClick(row){
        this.popParams.finishNum = row.finish_num
        this.popParams.topicId = row.topic_id
        this.popInfo = this.topicMap[row.topic_id]
        console.log(this.topicMap[row.topic_id], this.topicMap)

        this.showPopFlag = true

        // this.getAwardAddress()

    },
    // getAwardAddress() {
    //   this.$http.get(API.quickAddress+'?askId='+this.askId+'&addressId='+this.popParams.addressId+"&openid="+this.popParams.openid).then(res => {
    //     if (res.code == 200) {
    //         this.addressInfo = res.data

    //     } else {
    //       this.$message.error(res.msg)
    //     }
    //   })
    // },
    getTopicList() {
      this.listLoading = true
      this.$http.get(API.speakTopicList, { speakId: this.speakId }).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          this.topicList = res.data.data
          
          res.data.data.forEach(el => {
            this.topicMap[el.id] = el
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getList() {
      this.listLoading = true
      this.$http.get(API.speakJoins,{...this.listQuery}).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          let total = 0
          res.data.cnts.forEach(el => {
            total = total + parseInt(el.cnt)
            if (el.award_status == 1) {
              this.awaitMoney = el.cnt * this.money / 100.0
            } else if (el.award_status == 3) {
              this.sendMoeny = el.cnt * this.money / 100.0
            }
          })

          this.tabList = res.data.data
          this.total = total
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
