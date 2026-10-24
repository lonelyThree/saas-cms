<template>
  <div class="place-wrap">
    <el-page-header @back="backListClick" :content="popTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" :model="listQuery" class="form-container" inline>

        <el-form-item label="连锁名称">
          <el-select v-model="listQuery.chainId" filterable remote reserve-keyword clearable placeholder="请输入连锁名称关键词"
            :remote-method="chainSearch" :loading="chainLoading">
            <el-option v-for="item in chainOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="粉丝名称">
          <el-input v-model="listQuery.nickname" clearable class="filter-item" placeholder="请输入粉丝名称" />
        </el-form-item>


        <el-form-item label="手机号码">
          <el-input v-model="listQuery.mobile" clearable class="filter-item" placeholder="请输入手机号码" />
        </el-form-item>

        <el-form-item label="用户名称">
          <el-input v-model="listQuery.name" clearable class="filter-item" placeholder="请输入用户名称" />
        </el-form-item>

        <el-form-item label="openid">
          <el-input v-model="listQuery.openid" clearable class="filter-item" placeholder="请输入openid" />
        </el-form-item>

        <el-form-item
                    label="审核状态"
                >
                <el-select
                        v-model="listQuery.status"
                        clearable
                        placeholder="请选择"
                        filterable
                    >
                        <el-option
                        v-for="item in statusQuery"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        />
                    </el-select>
                </el-form-item>

         <el-form-item label="选择奖品">
          <el-select v-model="listQuery.awardId" clearable placeholder="请选择" filterable>
            <el-option v-for="item in awardIdQuery" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" align="right" @click="searchForm">
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>

          <!-- <el-button
                    type="warning"
                    align="right"
                    @click="download">
                    <i class="el-icon-download"/>
                    <span> 导出</span>
                </el-button> -->
        </el-form-item>

      </el-form>

    </el-card>

    


    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row @sort-change="sortChange"
      :style="{ 'width': '100%', 'margin-top': '15px' }">
      <el-table-column v-for="(item, index) in tableConfig" :key="index" align="center" :label="item.label"
        :width="item.width" :prop="item.key" :sortable="item.sortable">
        <template slot-scope="scope">
          <img width="60" :src="scope.row.avatar" alt="pic" v-if="item.key == 'avatar'" />
          <span v-else-if="item.key == 'create_at' ">{{ scope.row[item.key] * 1000, 3 |
            dateFormat }}</span>

            <span v-else-if="item.key == 'award_type'">{{awardTypeMap[scope.row['award_type']]?awardTypeMap[scope.row['award_type']]:'--'}}</span>
            <span v-else-if="item.key == 'award_id'">{{awardIdMap[scope.row['award_id']]?awardIdMap[scope.row['award_id']]:'--'}}</span>

            <span v-else-if="item.key == 'status'">{{statusMap[scope.row['status']]?statusMap[scope.row['status']]:'--'}}</span>
            <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <el-table-column
            align="center"
            label="操作"
            fixed="right"
            :width="120"
        >
            <template slot-scope="{row}">
           <el-button
            type="primary"
            class="op-btn"
            plain
            size="mini"
            @click="showTopicClick(row, 1)"
            :loading="openLoading"
          >
            报名表单
          </el-button>
          <br />

          <el-button
            type="info"
            class="op-btn"
            
            size="mini"
            @click="showTopicClick(row, 2)"
            :loading="openLoading"
            v-if="popParams.topic_type == 1"
          >
            问卷表单
          </el-button>
         <br />

          <el-button type="warning" plain class="op-btn" size="mini" @click="reviewClick(row)">
            人工审核
          </el-button>
          <br />

          <el-button type="danger"  plain class="op-btn" size="mini" @click="sendClick(row)" v-if="row.award_id < 1">
            发放奖项
          </el-button>
           <br  v-if="row.award_id < 1" />

          <el-button type="danger"  plain class="op-btn" size="mini" @click="voteNumEditClick(row)" v-if="popParams.vote_type == 2">
            评分
          </el-button>
            </template>
            </el-table-column>
    </el-table>
    <el-pagination v-show="total > 0" :total="total" :current-page.sync="listQuery.page" :page-sizes="[5, 10, 20, 30, 50]"
      :page-size.sync="listQuery.limit" layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="handleCurrentChange" />

       <TopicDrawer :popTitle="topicDrawer.popTitle" :visible.sync="topicDrawer.visible" :infoList="topicDrawer.infoList" :loading="topicDrawer.loading" @closeDrawer="closeTopicDrawer" />

      <el-dialog :visible.sync="showReviewPopFlag" :title="popReviewTitle" width="60%">
         <el-form :model="popReviewParams" :rules="reviewRules" ref="revieWForm" label-width="180px">
        <el-form-item label="操作" prop="opType">
          <el-radio-group v-model="popReviewParams.opType">

<!-- {1: ' 审核通过展示', 2 : '待审核',  3 : '审核失败',  4 : '审核通过不展示' }, -->
            <el-radio :label="1" >审核通过展示</el-radio>
            <el-radio :label="2" >待审核</el-radio>
            <el-radio :label="3" >审核失败</el-radio>
            <el-radio :label="4" >审核通过不展示</el-radio>
          </el-radio-group>
        </el-form-item>




        <el-form-item label="驳回原因：" prop="reason" >
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


    <el-dialog :visible.sync="showAwardPopFlag" title="发放奖励" width="60%">
         <el-form :model="popAwardParams" :rules="awardIdRules" ref="awardIdForm" label-width="180px">
          <el-alert
    title="每个用户只能获得一个奖，排名奖和票数将未出来前可手动给予手动奖项，获得手动奖项的用户审核且通过的仍参与排名， 但不会再次获得奖项"
    type="warning" effect="dark" :closable="false" style="margin-bottom: 20px"></el-alert>
           <el-form-item label="openid：" prop="openid">
        <el-input v-model="popAwardParams.openid" style="width:500px" placeholder="请输入openid" disabled></el-input>
      </el-form-item>

       <el-form-item label="选择奖品" prop="awardId">
          <el-select v-model="popAwardParams.awardId"  placeholder="请选择" filterable @change="handleChangeAward">
            <el-option v-for="item in menualAwardQuery" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖励类型" v-if="popAwardParams.awardId > 0">
            <el-radio-group v-model="popAwardParams.awardType" :disabled="popAwardParams.awardId > 0">
            <el-radio :label="1">红包</el-radio>
            <el-radio :label="2">积分</el-radio>
            <el-radio :label="3">星币</el-radio>
            <el-radio :label="4">实物奖</el-radio>
            </el-radio-group>
          </el-form-item>

           <el-form-item label="奖励(分)："  v-if="popAwardParams.awardType!=4 && popAwardParams.awardId > 0">
          <el-input-number v-model="popAwardParams.money" :max="20000" :min="0" placeholder="10~20000"  :disabled="popAwardParams.awardId > 0"></el-input-number>
        </el-form-item>


        <el-form-item label="">
          <el-button @click="submitAwardForm('awardIdForm')" type="primary" :loading="awardIdLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

     <el-dialog :visible.sync="showEditVoteNumPopFlag" title="评分" width="60%">
         <el-form :model="popVoteNumParams" :rules="voteNumRules" ref="voteNumForm" label-width="180px">>
           <el-form-item label="openid：" prop="openid">
        <el-input v-model="popVoteNumParams.openid" style="width:500px" placeholder="请输入openid" disabled></el-input>
      </el-form-item>

          <el-form-item label="评分：" prop="voteNum">
          <el-input-number v-model="popVoteNumParams.voteNum" :max="10000" :min="1" placeholder="1~10000"  :disabled="popVoteNumParams.awardId > 0"></el-input-number>
        </el-form-item>

        <el-form-item label="">
          <el-button @click="submitVoteNumForm('voteNumForm')" type="primary" :loading="voteNumLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import TopicDrawer from '@/components/Drawer/TopicDrawer/index.vue';
import vDialog from '../../dialog.vue'

export default {
  props: {
    popId: Number,
    popTitle: String,
    popParams: Object,
    openid: String,
  },
  data() {
    return {
      formLabelWidth: '68px',
      // 活动状态 
      statusQuery: [{ id: 0, name: '全部' }, { id: 1, name: '审核通过展示' }, { id: 2, name: '待审核' }, { id: 3, name: '审核失败' }, { id: 4, name: '审核通过不展示'}],
      statusMap : {1: ' 审核通过展示', 2 : '待审核',  3 : '审核失败',  4 : '审核通过不展示' },

      awardIdQuery: [{ id: 0, name: '全部' }],
      awardTypeMap:{'0':'--', '1':'红包', '2':'积分', '3':'星币', '4':'实物奖'},
      menualAwardQuery: [],
      awardIdMap : {},

    

      total: 0,
      tabList: [],
      tableConfig: [

        { label: 'ID', key: 'id' },
        { label: '头像', key: 'avatar', width: 100 },
        { label: '粉丝openid', key: 'openid' },
        { label: '用户昵称', key: 'nickname' },
        { label: '用户名', key: 'user_name' },
        { label: '手机号', key: 'mobile' },
        { label: '连锁名称', key: 'chainName' },
        { label: '门店名称', key: 'storeName' },

        { label: '投票数/分', key: 'vote_num', sortable: 'custom' },
         { label: '报名序号', key: 'vote_index', sortable: 'custom' },
        { label: '案例名称', key: 'name' },
        { label: '案例状态', key: 'status' },
        { label: '奖励类型', key: 'award_type' },

        { label: '奖励(分)', key: 'money' },
        { label: '批次ID', key: 'batch_id' },
        { label: '奖项名称', key: 'award_id' },
        { label: '时间', key: 'create_at' , sortable: 'custom'},
      ],


      listQuery: {
        voteId: 0,

        nickname: '',
        name: '',
        openid: '',
        mobile: '',
        chainId: '',
        awardId: 0,

        page: 1,
        limit: 20,

        order: 1,
      },
      chainLoading: false,
      chainOptions: [],

      sendMoeny:0,
      awaitMoney:0,

      topicDrawer: {
        visible: false,
        infoList: [],
        loading: false,
        popTitle: '详情',
      },
      abortController : null,

      reasonList:[
        '案例不符合要求',
        '案例重复上传',
        '案例图片不清晰',
      ],

      popReviewParams:{
        voteId:0,
        openid:'',
        
        opType:0,
        reason:'',
      },

      openLoading:false,
      reviewLoading:false,
      popReviewTitle:'人工审核',
      showReviewPopFlag:false,

      reviewRules: {
        opType: [
          { required: true, message: '请先选择操作类型', trigger: 'change' }
        ],
      },

      popAwardParams:{
        voteId:0,
        openid:'',
        awardId:0,
      },

      awardIdLoading:false,
      showAwardPopFlag:false,

      awardIdRules: {
        awardId: [
          { required: true, message: '请先选择奖品', trigger: 'change' }
        ],
      },

      popVoteNumParams:{
        voteId:0,
        openid:'',
        voteNum:0,
      },
      voteNumLoading:false,
      showEditVoteNumPopFlag:false,
      voteNumRules: {
        voteNum: [
          { required: true, message: '请输入评分', trigger: 'blur' }
        ],
      },
    };
  },
  created() {
    this.listQuery.voteId = this.popId
    this.listQuery.openid = this.openid
    if (this.awardType == 1) {
      this.tableConfig.unshift({
        label: '参与日期', key: 'date'
      })
    }
    this.getList()
    this.getAwardList()
  },
  components: { vDialog, TopicDrawer },
  methods: {
    sortChange(obj) {
      if ('vote_num' == obj.prop) {
        if (!obj.order) {
          this.listQuery.order = 1
        } else {
          this.listQuery.order = (obj.order == 'ascending' ? 3 : 4)
        }

      } else if ('vote_index' == obj.prop) {
        if (!obj.order) {
          this.listQuery.order = 1
        } else {
          this.listQuery.order = (obj.order == 'ascending' ? 5 : 6)
        }

      } else if ('create_at' == obj.prop) {
        this.listQuery.order = (obj.order == 'ascending' ? 1 : 2)
      }
      this.listQuery.page = 1
      this.getList()
    },
    searchForm() {
      this.listQuery.page = 1
      this.getList()
    },
    chainSearch(query) {
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
    viewShowLogClick(row) {
      this.$emit('viewShowLogClick', { openid: row.openid, popParams: this.popParams })
    },
    backListClick() {
      this.$emit('backList', this.ruleForm)
    },
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getList()
    },

    getAwardList() {
      this.$http.get(API.domain+'VoteAwardList?op=search&voteId='+this.popId).then(res => {
        if (res.code == 200) {
            const awardList = res.data
            this.awardIdQuery = [{ id: 0, name: '全部' }]

            this.awardIdMap =  {}
            this.menualAwardQuery = [{id: 0, name: '请选择', award_type:1, money: 0}]
            for (let i = 0; i < awardList.length; i++) {
              const awardItem = awardList[i]
              this.awardIdQuery.push({ id: awardItem.id, name: awardItem.name })
              this.awardIdMap[awardItem.id] = awardItem.name
              if (awardList[i].send_type == 1) {
                this.menualAwardQuery.push({ id: awardItem.id, name: awardItem.name, award_type:awardItem.award_type,
                  money: awardItem.money
                })
              } 

            }
        } else {
          this.$message.error(res.msg)
        }
      })
    },


    getList() {
      this.listLoading = true
      this.$http.get(API.domain + "VoteUserList", { ...this.listQuery }).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          let total = res.data.count
          this.awaitMoney = 0
          this.sendMoeny = 0

          this.tabList = res.data.data
          this.total = total
          console.log(this.tabList, "tabList", this.sendMoeny, this.awaitMoney)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    download() {
      this.$http.download(API.voteUserExport,{...this.listQuery}).then(res => {
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
    showTopicClick(row, topicType) {
       // ✅ 取消上一个还在飞行中的请求
    if (this.abortController) {
      this.abortController.abort();
    }
     this.abortController = new AbortController();
      this.topicDrawer.visible = true
      this.topicDrawer.loading = true
       this.topicDrawer.infoList = [];
       this.topicDrawer.popTitle = row.user_name + '【' + row.storeName +  '】'+(topicType == 1 ? '报名表单详情' : '问卷表单详情')
      this.$http.get(API.domain+"VoteUserFormInfo",{voteId:row.vote_id, openid:row.openid, topicType: topicType}, { signal: this.abortController.signal }).then(res => {
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
    submitReviewForm(formName) {
      this.popReviewParams.voteId = this.popId
      if (!this.popReviewParams.opType) {
        this.$message.error('请先选择审核操作')
        return false
      }
      if (this.popReviewParams.opType != 1 && !this.popReviewParams.reason) { 
        this.$message.error('请填写原因')
        return false
      }
      this.$refs[formName].validate((valid, object) => {
        if (valid &&  this.popReviewParams.opType) {
          this.reviewLoading = true
          this.$http.post(API.domain+"VoteUserReview", this.popReviewParams).then(res => {

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

    submitAwardForm(formName) {
      this.popAwardParams.voteId = this.popId
      this.$refs[formName].validate((valid, object) => {
        if (valid ) {
          this.awardIdLoading = true
          this.$http.post(API.domain+"VoteSendAward", this.popAwardParams).then(res => {

            if (res.code === 200) {
              this.$message.success('请求成功')
              setTimeout(() => {
                this.showAwardPopFlag = false
                this.getList()
              }, 1000);
            } else {
              this.$message.error(res.msg ? res.msg : '发放失败')
            }
            this.awardIdLoading = false
          })
            .catch(error => {
              this.$message.error('发放失败')
              this.awardIdLoading = false

            });
        } else {
          for (var i in object) {
            this.$message.error(object[i][0].message)
            return false
          }
          return false;
        }
      });
    },

    submitVoteNumForm(formName) {
      this.popVoteNumParams.voteId = this.popId
      this.$refs[formName].validate((valid, object) => {
        if (valid ) {
          this.voteNumLoading = true
          this.$http.post(API.domain+"VoteEditVoteNum", this.popVoteNumParams).then(res => {

            if (res.code === 200) {
              this.$message.success('请求成功')
              setTimeout(() => {
                this.showEditVoteNumPopFlag = false
                this.getList()
              }, 1000);
            } else {
              this.$message.error(res.msg ? res.msg : '修改失败')
            }
            this.voteNumLoading = false
          })
            .catch(error => {
              this.$message.error('修改失败')
              this.voteNumLoading = false

            });
        } else {
          for (var i in object) {
            this.$message.error(object[i][0].message)
            return false
          }
          return false;
        }
      });
    },

    
    reviewClick(row) {
      this.popReviewParams.voteId = row.vote_id
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

    sendClick(row) {
      this.popAwardParams.voteId = row.vote_id
      this.popAwardParams.openid = row.openid
      this.popAwardParams.awardId = 0
      this.popAwardParams.awardType = 1
      this.popAwardParams.moeny = 0

      this.showAwardPopFlag = true
      
    },

    voteNumEditClick(row) {
      this.popVoteNumParams.voteId = row.vote_id
      this.popVoteNumParams.openid = row.openid
      this.popVoteNumParams.voteNum = row.vote_num

      this.showEditVoteNumPopFlag = true
    },

    changeAward(item) {
      this.popAwardParams.awardType = item.award_type
      this.popAwardParams.money = item.money
    },

    handleChangeAward(value) {
    
    // 如果需要获取完整对象 item，可以手动查找
    if (value) {
      const selectedItem = this.menualAwardQuery.find(item => item.id === value);
      this.changeAward(selectedItem);
    } 
  },

  },
}
</script>
<style lang='scss' scoped></style>
