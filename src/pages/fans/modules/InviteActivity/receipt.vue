<template>
  <div class="place-wrap">
    <el-page-header @back="backListClick" :content="popTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" :model="listQuery" class="form-container" inline>

        <el-form-item label="小票ID">
          <el-input v-model="listQuery.logId" clearable class="filter-item" placeholder="请输入id" />
        </el-form-item>

        <el-form-item label="连锁名称">
          <el-select v-model="listQuery.chainId" clearable placeholder="请选择" filterable>
            <el-option v-for="item in chainList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>


        <el-form-item label="产品名称">
          <el-select v-model="listQuery.proName" clearable placeholder="请选择" filterable>
            <el-option v-for="item in proList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>


        <el-form-item label="粉丝openid">
          <el-input v-model="listQuery.openid" clearable class="filter-item" placeholder="请输入openid" />
        </el-form-item>

        <el-form-item label="小票单号">
          <el-input v-model="listQuery.receiptNum" clearable class="filter-item" placeholder="请输入小票单号" />
        </el-form-item>

        <el-form-item label="消费时间">
          <el-input v-model="listQuery.consumptionTime" clearable class="filter-item" placeholder="请输入消费时间" />
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="listQuery.status" clearable placeholder="请选择" filterable>
            <el-option v-for="item in statusQuery" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="发放状态">
          <el-select v-model="listQuery.awardStatus" clearable placeholder="请选择" filterable>
            <el-option v-for="item in awardStatusQuery" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>



        <el-form-item>
          <el-button type="primary" align="right" @click="searchForm">
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>
        </el-form-item>

      </el-form>

      <el-descriptions title="" :column="4">
        <el-descriptions-item label="活动总人次">{{total}}</el-descriptions-item>
        <el-descriptions-item label="发放金额总计">{{ moneyList[3] + moneyList[4] + moneyList[5] + moneyList[6] + moneyList[7]
          }}元/{{ parseInt(cntList[3]) + parseInt(cntList[4]) + parseInt(cntList[5]) + parseInt(cntList[6]) +
          parseInt(cntList[7]) }}</el-descriptions-item>
        <el-descriptions-item label="待领取金额总计">{{ moneyList[3] }}元/{{ cntList[3] }}</el-descriptions-item>
        <el-descriptions-item label="待发放金额总计">{{ moneyList[4] }}元/{{ cntList[4] }}</el-descriptions-item>
        <el-descriptions-item label="已领取金额总计">{{ moneyList[5] }}元/{{ cntList[5] }}</el-descriptions-item>
        <el-descriptions-item label="已发放金额总计">{{ moneyList[6] }}元/{{ cntList[6] }}</el-descriptions-item>
        <el-descriptions-item label="待审核金额总计">{{ moneyList[7] }}元/{{ cntList[7] }}</el-descriptions-item>
      </el-descriptions>
    </el-card>




    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row row-key="id"
      @sort-change="sortChange" :style="{'width': '100%', 'margin-top': '15px'}">
      <el-table-column v-for="(item, index) in tableConfig" :key="index" align="center" :label="item.label"
        :width="item.width" :prop="item.key" :sortable="item.sortable">
        <template slot-scope="scope">
          <span v-if="item.key == 'award_status'">{{ awardStatusMap[scope.row[item.key]] }}</span>
          <span v-else-if="item.key == 'status'">{{ statusMap[scope.row[item.key]] }}</span>
          <span v-else-if="item.key=='user_status'">
                {{ userStatusMap[scope.row[item.key]]? userStatusMap[scope.row[item.key]]:'未知'}}
            </span>
          <span v-else-if="item.key == 'fail_type'">{{ failTypeMap[scope.row[item.key]] }}
            {{ scope.row.status == 5 || (scope.row.status == 1 && scope.row.award_status == 2) ? ';'+scope.row.reason:''
            }}</span>
          <span v-else-if="item.key == 'date'">{{ scope.row['speak_date'] | date2Format }}</span>

          <span v-else-if="item.key == 'chainName'">{{ chainMap[scope.row.chain_id] }}</span>

          <span v-else-if="item.key == 'create_at'">{{ scope.row.create_at * 1000, 3 | dateFormat }}</span>

          <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" :width="150">
        <template slot-scope="{row}">

          <el-button type="primary" class="op-btn" plain size="mini" @click="showImgClick(row)">
            小票
          </el-button>
          <el-button type="info" class="op-btn" size="mini" @click="viewUserClick(row)">
            用户
          </el-button>


          <el-button type="warning" class="op-btn" size="mini" v-if="row.award_status == 7"
            @click="reviewClick(row, 2)">
            红包审核
          </el-button>

          <el-button type="warning" class="op-btn" size="mini" v-else-if="row.status == 3" @click="reviewClick(row,1)">
            人工审核
          </el-button>

          <el-button type="warning" class="op-btn" size="mini" v-else-if="row.status == 1 || row.status == 4" @click="showTimeEditClick(row)">
            修改消费日期
          </el-button>

          <el-button type="success" class="op-btn" plain size="mini" v-if="row.products" @click="showProsClick(row)">
            产品消息
          </el-button>
          

          <el-button type="warning" class="op-btn" size="mini" v-if="popParams.type == 2 && row.warehouse_status == 1" @click="insertClick(row,1)">
            入库
          </el-button>






        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total>0" :total="total" :current-page.sync="listQuery.page" :page-sizes="[5, 10, 20, 30, 50]"
      :page-size.sync="listQuery.limit" layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="handleCurrentChange" />

    <v-dialog :visible.sync="showPopFlag" title="产品消息" width="80%" :destroy-on-close='true'>
      <el-table :data="popParams" border fit highlight-current-row :style="{ 'width': '100%' }">
        <el-table-column v-for="(item, index) in popTableConfig" :key="index" align="center" :label="item.label"
          :width="item.width" :prop="item.key">
          <template slot-scope="scope">

            <span>{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </v-dialog>

    <el-dialog :visible.sync="showReviewPopFlag" :title="popReviewTitle" width="80%">
      <el-form :model="popReviewParams" :rules="reviewRules" ref="revieWForm" label-width="180px">
        <el-form-item label="操作" prop="opType">
          <el-radio-group v-model="popReviewParams.opType">
            <el-radio :label="1" v-if="popReviewParams.type==2">红包发放审核通过</el-radio>
            <el-radio :label="2" v-if="popReviewParams.type == 2">红包发放审核驳回</el-radio>

            <el-radio :label="3" v-if="popReviewParams.type == 1">审核通过</el-radio>
            <el-radio :label="4" v-if="popReviewParams.type == 1">审核驳回</el-radio>
          </el-radio-group>
        </el-form-item>




        <el-form-item label="驳回原因：" prop="reason" v-if="popReviewParams.opType == 2 || popReviewParams.opType == 4">
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

        <el-form-item label="小票金额（分）：" prop="money" v-if="popReviewParams.opType == 1 || popReviewParams.opType == 3">
          <el-input-number v-model="popReviewParams.money" :max="100000" :min="1" style="width:250px"
            placeholder="小票金额1~10000"></el-input-number>
        </el-form-item>

        <el-form-item label="连锁名称" prop="chainId" v-if="popReviewParams.opType == 1 || popReviewParams.opType == 3">
          <el-select v-model="popReviewParams.chainId" clearable placeholder="请选择" filterable>
            <el-option v-for="item in chainList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="小票单号" prop="receiptNum" v-if="popReviewParams.opType == 1 || popReviewParams.opType == 3">
          <el-input v-model="popReviewParams.receiptNum" clearable class="filter-item" placeholder="请输入小票单号" />
        </el-form-item>

        <el-form-item label="消费时间" prop="consumptionTime"
          v-if="popReviewParams.opType == 1 || popReviewParams.opType == 3">
          <el-input v-model="popReviewParams.consumptionTime" clearable class="filter-item" placeholder="请输入消费时间" />
        </el-form-item>

        <el-form-item label="">
          <el-button @click="submitReviewForm('revieWForm')" type="primary" :loading="reviewLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="showInsertPopFlag" :title="popReviewTitle" width="80%">
      <el-form :model="popInsertParams" :rules="insertRules" ref="insertForm" label-width="180px">

        <el-form-item label="小票张数：" prop="num" >
          <el-input-number v-model="popInsertParams.num" :max="100000" :min="1" style="width:250px"
            placeholder="小票张数1~10000"></el-input-number>
        </el-form-item>

        <el-form-item label="连锁名称：" prop="chain_id">
          <el-select v-model="popInsertParams.chain_id" clearable placeholder="请选择" filterable>
            <el-option v-for="item in chainList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-button @click="submitInsertForm('insertForm')" type="primary" :loading="insertLoading">入库</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="showEditTimePopFlag" :title="popReviewTitle" width="80%">
      <el-form :model="popReviewParams" :rules="reviewRules" ref="revieWForm" label-width="180px">
        <el-form-item label="消费时间" prop="consumptionTime">
          <el-input v-model="popReviewParams.consumptionTime" clearable class="filter-item" placeholder="请输入消费时间" />
        </el-form-item>

        <el-form-item label="">
          <el-button @click="submitEditTimeForm('revieWForm')" type="primary" :loading="reviewLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>
<script>

import vDialog from '../../dialog.vue'

export default {
  props: {
    receiptId: Number,
    popTitle: String,
    sendType: Number,

    popParams: Object,
    openid: String,
  },
  data() {
    return {
      formLabelWidth: '68px',
      userStatusMap:{0:'未知',1:'正常',2:'人工疑似',3:'自动疑似',4:'人工异常',5:'自动异常'},
      statusMap:{'0':'','1':'自动审核成功', '2': '自动审核失败' , '3': '人工审核待处理' , '4': '人工审核成功' , '5': '人工审核失败'  },
     
      statusQuery:[{id:0, name:'全部'},{id:1, name:'自动审核成功'}, { id: 2, name: '自动审核失败' }, { id: 3, name: '人工审核待处理' }, { id: 4, name: '人工审核成功' }, { id: 5, name: '人工审核失败' }],

      failTypeMap: { '0': '', '1': '小票识别失败', '2': '小票内容为空', '3': '小票多于一张', '4': '小票单号识别失败', '5': '小票单号重复', '6': '连锁为空或者不匹配', '7': '产品不匹配', '8': '未在活动期间', '14': '单号或者消费日期为空', '15': '小票长度不符合', '16':'小票超出限定日期', '17':'小票超出个人限额', '18':'小票超出每次限额', '19' :'小票超出连锁限制', '20':'用户异常'},

      awardStatusMap: { '0': '未知',  '2': '未中奖', '3': '待领取', '4': '待发放', '5': '已领取' , '6': '已发放', '7': '待审核' },
      awardStatusQuery: [{ id: 0, name: '全部' }, { id: 2, name: '未中奖' }, { id: 3, name: '待领取' }, { id: 4, name: '待发放' }, { id: 5, name: '已领取' }, { id: 6, name: '已发放' } , { id: 7, name: '待审核' }],
      

      total:0,
      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id'  },
        { label: '上传时间', key: 'create_at', width:'130px', sortable: 'custom'},


        { label: '金额(分)', key: 'money', width: '100px', sortable:'custom' },
        { label: '审核状态', key: 'status' },

        
        { label: '领奖状态', key: 'award_status' },

        { label: '店员姓名', key: 'username' },
        { label: '粉丝openid', key: 'openid' , width: '150px' },
        { label: '粉丝昵称', key: 'nickname' },
        { label: '连锁名称', key: 'chainName' },
        { label: '消费时间', key: 'consumption_time' },
        { label: '转账批次号', key: 'batch_id' },

        { label: '商户名称', key: 'shop_name' },
        { label: '小票单号', key: 'receipt_num' },
        { label: '收银员', key: 'employee_num' },
        { label: '审核失败原因', key: 'fail_type' },
        { label: '用户状态', key: 'user_status' },

      ],


      listQuery: {
        logId:'',
        receiptId:0, 
        openid:'',
        status:0,
        awardStatus:0,

        receiptNum:'',
        consumptionTime:'',

        proName:'',
        chainId:0,
        order:0,
        page:1,

        limit:20,

        type:1,
      },

      popParams:[
      ],

      popInsertParams:{},
      
      popReviewTitle:'',
      showReviewPopFlag:false,
      reviewLoading:false,
      showInsertPopFlag:false,
      insertLoading:false,

      showEditTimePopFlag:false,


      popReviewParams:{

        receiptId: 0,
        logId:0,
        type:1,
        opType:0,

        money:0,
        reason:'',

        chainId:0,
        receiptNum:'',
        consumptionTime:'',
      },
      reviewRules: {
        opType: [
          { required: true, message: '请先选择操作类型', trigger: 'change' }
        ],
        money: [
          { type: 'number', required: true, message: '请输入小票金额', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入驳回原因', trigger: 'change' }
        ],
      },

      insertRules: {
        num: [
          { type: 'number', required: true, message: '请输入小票张数', trigger: 'change' }
        ],
        chain_id: [
          { required: true, message: '请选择入库的连锁', trigger: 'change' }
        ],
      },

      popTableConfig: [
        { label: '产品名称', key: 'Key' },
        { label: '金额', key: 'Money' },

        { label: '小票商品名称', key: 'Name' },
        { label: '数量', key: 'Num' },
        { label: '单价', key: 'Price' },
      ],

      chainLoading:false,
      chainOptions:[],


      showPopFlag:false,


      chainMap: {},
      chainList: [{ 'id': 0, name: '全部' }, { 'id': -1, name: '未知' }],

      proList:['全部'],

      //'0': '未知', '2': '未中奖', '3': '待领取', '4': '待发放', '5': '已领取', '6': '已发放', '7': '待审核' },
      moneyList: [0, 0, 0, 0, 0, 0, 0 ,0, 0 ],
      cntList: [0, 0, 0, 0, 0, 0, 0, 0, 0],

      sendMoeny:0,
      awaitMoney:0,

      reasonList:[
        '非活动期间销售小票不能参加活动！',
        '请上传真实小票照片！',
        '非活动指定产品销售小票不能参加！',
        '该小票已领取奖励，请勿重复申请！',
        '请上传清晰完整小票照片！'
      ]
    };
  },
  created() {
      this.rollType = this.$storage.get('PE_USER_INFO').type
      if (this.rollType == 1 && 'saas' == this.$storage.get('PE_USER_INFO').info.currentLoginName) {
        // this.getPlaceList()
      } else {
        this.tableConfig.pop()
        this.tableConfig.pop()
        this.tableConfig.pop()
        this.tableConfig.pop()
      }
    this.listQuery.receiptId = this.receiptId
    this.listQuery.openid = this.openid
    this.listQuery.type = this.popParams.type

    if (this.sendType == 1) {
      this.awardStatusQuery = [{ id: 0, name: '全部' }, { id: 2, name: '未中奖' }, { id: 3, name: '待领取' }, { id: 5, name: '已领取' }, { id: 6, name: '已发放' }, { id: 7, name: '待审核' }]
    } else {
      this.awardStatusQuery = [{ id: 0, name: '全部' }, { id: 2, name: '未中奖' }, { id: 4, name: '待发放' }, { id: 6, name: '已发放' }, { id: 7, name: '待审核' }]
    }


    this.chainMap[-1] = '未知'
    this.getList()
    this.getProList()
    this.getChainList()
   },
   components:{vDialog},
  methods: {
    showTimeEditClick(row) {
      this.popReviewParams.logId = row.id
      this.popReviewParams.consumptionTime = row.consumption_time
      this.popReviewTitle = '修改消费日期'
      this.showEditTimePopFlag = true

    },
    submitEditTimeForm(formName) {
      this.popReviewParams.receiptId = this.receiptId
      this.$refs[formName].validate((valid, object) => {
        if (valid ) {
          this.reviewLoading = true
          this.$http.post(API.receiptEditTime, this.popReviewParams).then(res => {

            if (res.code === 200) {
              this.$message.success('修改成功')
              setTimeout(() => {
                this.showEditTimePopFlag = false
                this.getList()
              }, 1000);
            } else {
              this.$message.error(res.msg ? res.msg : '修改失败')
            }
            this.reviewLoading = false
          })
            .catch(error => {
              this.$message.error('修改失败')
              this.reviewLoading = false

            });
        } else {
          this.$message.error('修改失败')
        }
      });
    },
    sortChange(obj) {
      if('money' == obj.prop) {
        this.listQuery.order = (obj.order == 'ascending'?3:4)
      } else if ('create_at' == obj.prop) {
        this.listQuery.order = (obj.order == 'ascending'?1:2)
      }
      this.listQuery.page = 1
      // console.log(this.listQuery, obj.column, obj.prop, obj.order, "sortChange")
      this.getList()
    },
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

    getChainList() {
      this.$http.get(API.receiptChainList, { receiptId: this.receiptId }).then(res => {
        if (res.code == 200) {
          res.data.data.forEach(el => {
            this.chainList.push({id: el.Chain.id, name: el.Chain.name})
            this.chainMap[el.Chain.id] = el.Chain.name
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },


    getProList() {
      this.$http.get(API.receiptProList, { receiptId:this.receiptId }).then(res => {
        if (res.code == 200) {
           res.data.data.forEach(el => {
            this.proList.push( el.name )
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    showImgClick(row) {
      window.open(row.img)
    },
    submitReviewForm(formName) {
      this.popReviewParams.receiptId = this.receiptId
      this.$refs[formName].validate((valid, object) => {
        if (valid &&  this.popReviewParams.opType) {
          this.reviewLoading = true
          this.$http.post(API.receiptManual, this.popReviewParams).then(res => {

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

    submitInsertForm(formName) {
      this.popInsertParams.receiptId = this.receiptId
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          this.insertLoading = true
          this.$http.post(API.receiptWarehouseIn, this.popInsertParams).then(res => {

            if (res.code === 200) {
              this.$message.success('请求成功')
              setTimeout(() => {
                this.showInsertPopFlag = false
                this.getList()
              }, 1000);
            } else {
              this.$message.error(res.msg ? res.msg : '入库失败')
            }
            this.insertLoading = false
          })
            .catch(error => {
              this.$message.error('请求失败')
              this.insertLoading = false

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

    viewUserClick(row) {
      this.$emit('viewUserClick', { openid: row.openid, popParams: this.popParams })
    },

    insertClick(row, type) {
      this.popInsertParams.logId = row.id
      this.popInsertParams.num = 1
      this.popInsertParams.chain_id = row.chain_id
      this.popReviewTitle = '入库'

      this.showInsertPopFlag = true
      // this.$http.get(API.receiptManual, { receiptId: this.receiptId, id:row.id }).then(res => {
      //   if (res.code == 200) {
      //     this.$message.info('审核成功')
      //     this.getList()
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      // })
      
    },

    reviewClick(row, type) {
      this.popReviewParams.logId = row.id
      this.popReviewParams.type = type
      this.popReviewParams.opType = 0
      this.popReviewParams.money = row.money
      this.popReviewParams.reason = ''
      this.popReviewParams.chainId = row.chain_id
      this.popReviewParams.receiptNum = row.receipt_num
      this.popReviewParams.consumptionTime = row.consumption_time
      this.popReviewTitle = type==1?'人工审核':'红包审核'

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

    

    showProsClick(row){
        this.popParams = row.products

        this.showPopFlag = true

        // this.getAwardAddress()

    },
    getList() {
      // console.log(API.receiptReceip, "API.receiptReceip", "getlist")
      this.listLoading = true
      this.$http.get(API.receiptReceipt,{...this.listQuery}).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          let total = 0
          this.moneyList = [0, 0, 0, 0, 0, 0, 0, 0, 0]
          this.cntList = [0, 0, 0, 0, 0, 0, 0, 0, 0]
          res.data.moneys.forEach(el => {
            total = total + parseInt(el.cnt)
            this.moneyList[el.award_status] = el.moneys / 100.0
            this.cntList[el.award_status] = el.cnt
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
