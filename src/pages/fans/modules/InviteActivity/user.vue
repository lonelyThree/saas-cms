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

               
                
                <el-form-item
                    label="选择奖项"
                >
                <el-select
                        v-model="listQuery.awardId"
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
                <el-form-item
                    label="用户状态"
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
                <el-form-item>
                <el-button
                    type="primary"
                    align="right"
                    @click="searchForm">
                    <i class="el-icon-search"/>
                    <span> 搜索</span>
                </el-button>

                <el-button
                    type="warning"
                    align="right"
                    @click="download">
                    <i class="el-icon-download"/>
                    <span> 下载</span>
                </el-button>
            </el-form-item>

        </el-form>

        </el-card>


      

        <el-table
        v-loading="listLoading"
        :data="tabList"
        border
        fit
        highlight-current-row
        @sort-change="sortChange"
        :style="{'width': '100%', 'margin-top': '15px'}"
        >
        <el-table-column
            v-for="(item, index) in tableConfig"
            :key="index"
            align="center"
            :label="item.label"
            :width="item.width"
            :prop="item.key"

              :sortable = "item.sortable"
        >
        <template slot-scope="scope">
            <img width="60" :src="scope.row.avatar" alt="pic" v-if="item.key=='avatar'" />
            <span v-else-if="item.key=='rank'">
                {{ scope.row[item.key]<1? '未知':scope.row[item.key]}}
            </span>
            <span v-else-if="item.key=='r_status'">
                {{ statusMap[scope.row[item.key]]? statusMap[scope.row[item.key]]:'未知'}}
            </span>

            
            <span v-else-if="item.key=='award'">
                 {{awardMap[scope.row['awardId']]?awardMap[scope.row['awardId']]:'未知'}}
            </span>
            <span v-else-if="item.key=='warn_num'">
                 {{scope.row.warn_num?scope.row.warn_num:'随活动'}}
            </span>
            <span v-else-if="item.key=='ban_num'">
              {{scope.row.ban_num?scope.row.ban_num:'随活动'}}
            </span>
            <span v-else-if="item.key == 'errorAt' || item.key == 'updateTime'">{{ scope.row[item.key] * 1000, 3 | dateFormat }}</span>
            <span v-else>{{ scope.row[item.key] }}</span>
        </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
            fixed="right"
            :width="200"
        >
            <template slot-scope="{row}">
            <el-button
                type="primary"
                class="op-btn"
                plain
                size="mini"
                @click="viewReceiptClick(row)"
            >
                小票
            </el-button>

            <el-button
                type="success"
                class="op-btn"
                plain
                size="mini"
                @click="viewDayNumClick(row)"
            >
                每天统计
            </el-button>

            <!-- <div> -->

            <!-- <el-button
                type="danger"
                class="op-btn"
                plain
                size="mini"
                @click="statusClick(row, 1, '解除')"
                v-if="row.r_status == 2"
            >
                解除异常
            </el-button>
            <el-button
                type="danger"
                class="op-btn"
                plain
                size="mini"
                @click="statusClick(row, 2, '标记')"
                v-else
            >
                标记异常
            </el-button> -->
            <!-- </div> -->
            
            <div>

              <el-button
                type="danger"
                class="op-btn"
                plain
                size="mini"
                @click="updateDayNumClick(row)"
            >
                刷新统计
            </el-button>

            <el-button
                type="warning"
                class="op-btn"
                plain
                size="mini"
                @click="showDetailClick(row)"
                v-if="row.addressId > 0"
            >
                地址
            </el-button>
            </div>

            <el-button
                type="warning"
                class="op-btn"
                plain
                size="mini"
                @click="showUserPopInfo(row)"
            >
                用户操作
            </el-button>

            <el-button
                type="success"
                class="op-btn"
                plain
                size="mini"
                @click="showDayLimitEdit(row)"
            >
                修改上限
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

      <v-dialog :visible.sync="showAddressFlag" title="收货地址" width="52%" :destroy-on-close='true'>
        <el-descriptions title="收货信息" column="2"> 
            <el-descriptions-item label="微信昵称">{{popParams.nickname}}</el-descriptions-item>
            <el-descriptions-item label="中奖结果"><el-tag size="small">{{awardMap[popParams.awardId]?awardMap[popParams.awardId]:'未知'}}</el-tag></el-descriptions-item>
            <el-descriptions-item label="收货人">{{addressInfo.name}}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{addressInfo.mobile}}</el-descriptions-item>

            <el-descriptions-item label="身份证号">{{addressInfo.id_card}}</el-descriptions-item>
            <el-descriptions-item label="省市区">{{addressInfo.province_name}}{{addressInfo.city_name}}{{addressInfo.county_name}}</el-descriptions-item>
            <el-descriptions-item label="详细地址">{{addressInfo.detail}}</el-descriptions-item>
        </el-descriptions>
    </v-dialog>

    <v-dialog :visible.sync="showDayNumFlag" :title="dayNumTitle" width="52%" :destroy-on-close='true'>
      <el-table
        v-loading="dayNumLoading"
        :data="dayNumList"
        border
        fit
        highlight-current-row
        :style="{'width': '100%', 'margin-top': '15px'}"
        >
        <el-table-column
            v-for="(item, index) in dayNumTableConfig"
            :key="index"
            align="center"
            :label="item.label"
            :width="item.width"
            :prop="item.key"
        >
        <template slot-scope="scope">
            <span v-if="item.key=='rank'">
                {{ scope.row[item.key]<1? '未知':scope.row[item.key]}}
            </span>
            <span v-else-if="item.key=='r_status'">
                {{ statusMap[scope.row[item.key]]? statusMap[scope.row[item.key]]:'未知'}}
            </span>

            
            <span v-else-if="item.key=='award'">
                 {{awardMap[scope.row['awardId']]?awardMap[scope.row['awardId']]:'未知'}}
            </span>
            <span v-else-if="item.key=='warn_num'">
                 {{scope.row.warn_num?scope.row.warn_num:'随活动'}}
            </span>
            <span v-else-if="item.key=='ban_num'">
              {{scope.row.ban_num?scope.row.ban_num:'随活动'}}
            </span>
            <span v-else-if="item.key == 'errorAt' || item.key == 'updateTime'">{{ scope.row[item.key] * 1000, 3 | dateFormat }}</span>
            <span v-else>{{ scope.row[item.key] }}</span>
        </template>
        </el-table-column>
      </el-table>
    </v-dialog>

    <el-dialog :visible.sync="showUserPopInfoFlag" :title="userPopTitle" width="80%">
      <el-form :model="popInfoParams" :rules="infoRules" ref="infoForm" label-width="180px">
        <el-form-item label="用户状态：" prop="status">
          <el-radio-group v-model="popInfoParams.status">
            <el-radio :label="1" >正常</el-radio>
            <el-radio :label="2" >手动疑似</el-radio>
            <el-radio :label="3" disabled>自动疑似</el-radio>
            <el-radio :label="4" >手动异常</el-radio>
            <el-radio :label="5" disabled>自动异常</el-radio>
          </el-radio-group>
        </el-form-item>
      
        <el-form-item label="弹窗内容：" prop="pop_info" >
          <el-input type="textarea" v-model="popInfoParams.pop_info" style="width:600px;" maxlength="250"
            placeholder='弹窗内容' rows="5" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-button @click="submitPopInfoForm('infoForm')" type="primary" :loading="popInfoLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="showDayLimitFlag" :title="dayLimitTitle" width="80%">
      <el-form :model="popInfoParams" :rules="dayLimitRules" ref="dayLimitForm" label-width="180px">
        <el-form-item label="疑似上限" prop="warn_num" >
          <el-input-number v-model="dayLitmitParams.warn_num" :max="200" :min="0" style="width:250px"
            placeholder="0~200"></el-input-number>
        </el-form-item>
        <el-form-item label="异常上限" prop="ban_num" >
          <el-input-number v-model="dayLitmitParams.ban_num" :max="200" :min="0" style="width:250px"
            placeholder="0~200"></el-input-number>
        </el-form-item>

        <el-form-item label="">
          <el-button @click="submmitDayLimit('dayLimitForm')" type="primary" :loading="dayLimitLoading">确定</el-button>
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
    popParams: Object,
    openid: String,
  },
  data() {
    return {
      formLabelWidth: '68px',
      awardMap:{'0':'未知','-1':'未中奖'},
      awardQuery:[{id:0, name:'全部'},{id:-1, name:'未中奖'}],

      statusMap:{0:'未知',1:'正常',2:'人工疑似',3:'自动疑似',4:'人工异常',5:'自动异常'},

      statusQuery:[{id:0, name:'全部'},{id:1, name:'正常'},{id:2, name:'人工疑似'},{id:3, name:'自动疑似'},{id:4, name:'人工异常'},{id:5, name:'自动异常'
      }],

      total:0,
      tabList:[],
      tableConfig : [
        { label: '排行', key: 'rank' },

{ label: '用户状态', key: 'r_status' },
        { label: '头像', key: 'avatar' },
        { label: '粉丝openid', key: 'openid' },
        { label: '用户昵称', key: 'nickname' },
        { label: '用户名', key: 'name' },
        { label: '手机号', key: 'mobile' },
        { label: '连锁名称', key: 'chain_name' },
        { label: '门店名称', key: 'store_name' },

        { label: '金额', key: 'money', sortable: 'custom' },
        { label: '错误次数', key: 'errorNum', sortable: 'custom' },
        { label: '上次错误时间', key: 'errorAt' },
        { label: '人工次数', key: 'manualNum', sortable: 'custom' },



        { label: '警告上限', key: 'warn_num' },
        { label: '禁止上限', key: 'ban_num' },

        { label: '上次时间', key: 'updateTime' },
        { label: '中奖张数', key: 'num' },
        { label: '是否中奖', key: 'award' },
        
        // { label: '是否中奖', key: 'award' },
        // // { label: '参与人数', key: 'joinCnt' },
        // { label: '开始日期', key: 'start_time' },
        // { label: '结束日期', key: 'end_time' },
      ],


      listQuery: {
        receiptId:0, 

        nickname:'',
        name:'',
        openid:'',
        mobile:'', 
        chainId:'',

        awardId:0,

        page:1,
        limit:20,

        order:1,
      },
      chainLoading:false,
      chainOptions:[],

       addressInfo:{
            name:'',
            mobile:'',
            id_card:'',
            province_name:'',
            city_name:'',
            county_name:'',
            detail:'',
        },


      showAddressFlag:false,

      infoRules: {
        pop_info: [
          { required: false, message: '请输入弹窗内容', trigger: 'change' }
        ],
      },
      dayLimitRules:{
      },

      showUserPopInfoFlag:false,
      popInfoLoading:false,
      userPopTitle:'',

      popInfoParams:{
        id:0,
        openid:'',
        pop_info:'',
        status:0,
      },

      showDayNumFlag:false,
      dayNumTitle:'',
      dayNumLoading:false,
      dayNumTableConfig:[
        { label: '日期', key: 'date' },
         {label: '中奖张数', key: 'num' },
      ],
      dayNumList:[],

      showDayLimitFlag:false,
      dayLimitTitle:'',
      dayLimitLoading:false,
      dayLitmitParams:{
        openid:'',
        receiptId:this.receiptId,
        ban_num:0,
        warn_num:0,
      },

    };
  },
  created() {
    this.listQuery.receiptId = this.receiptId
    this.listQuery.openid = this.openid
    if (this.awardType == 1) {
      this.tableConfig.unshift({
        label: '参与日期', key: 'date'
      })
    }
    this.getAwardList()
    this.getList()
   },
   components:{vDialog},
  methods: {
    showDayLimitEdit(row){
      this.dayLitmitParams.openid = row.openid
      this.dayLimitTitle = '设置'+row.nickname+'上限'
      this.dayLitmitParams.warn_num = row.warn_num
      this.dayLitmitParams.ban_num = row.ban_num
      this.showDayLimitFlag = true
    },
    submmitDayLimit(formName) {
      this.dayLimitLoading = true
      this.dayLitmitParams.receiptId = this.receiptId

      this.$http.post(API.receiptUserDayLimit, this.dayLitmitParams).then(res => {
        this.dayLimitLoading = false
        if (res.code == 200) {
          this.showDayLimitFlag = false
          this.$message.success('更新成功')
          this.getList()

        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateDayNumClick(row) {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$http.post(API.receiptUserUpdateDayNum, {receiptId:this.receiptId, openid:row.openid}).then(res => {
          loading.close()
        if (res.code == 200) {
          this.$message.success('更新成功')


        } else {
          this.$message.error(res.msg)
        }
      })

    },
    getDayNum(openid) {
      this.dayNumLoading = true
      this.$http.get(API.receiptUserDayNum+'?receiptId='+this.receiptId+'&openid='+openid).then(res => {
        if (res.code == 200) {
          
          this.dayNumList =Object.entries(res.data).map(([key, value]) => ({
            date: key,
            num: value
          }))
          this.dayNumLoading = false


        } else {
          this.$message.error(res.msg)
        }
      })
    },
    viewDayNumClick(row) {
      this.showDayNumFlag = true
      this.dayNumTitle = '【'+row.nickname +'】每天张数统计'
     

      this.getDayNum(row.openid)

    },
    showDetailClick(row){
        this.popParams.nickname = row.nickname
        this.popParams.openid = row.openid
        this.popParams.awardId = row.awardId
        this.popParams.addressId = row.addressId
        this.addressInfo = {
            name:'',
            mobile:'',
            id_card:'',
            province_name:'',
            city_name:'',
            county_name:'',
            detail:'',
        }

        this.showAddressFlag = true

        this.getAwardAddress()

    },
    getAwardAddress() {
      this.$http.get(API.receiptAddress+'?aId='+this.receiptId+'&addressId='+this.popParams.addressId+"&openid="+this.popParams.openid).then(res => {
        if (res.code == 200) {
            this.addressInfo = res.data

        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getAwardList() {
      this.$http.get(API.receiptAwardList+'?aId='+this.receiptId).then(res => {
        if (res.code == 200) {
        //   let awardMap = {}
          let awardQuery = []
          res.data.forEach(el => {
            this.awardMap[el.id] = el.name
            awardQuery.push({id:el.id,name:el.name})
          });
        //   this.awardMap = awardMap
          this.awardQuery = this.awardQuery.concat(awardQuery)

        } else {
          this.$message.error(res.msg)
        }
      })
    },
    sortChange(obj) {
      if ('money' == obj.prop) {
        if (!obj.order) {
          this.listQuery.order =  1
        } else {
          this.listQuery.order = (obj.order == 'ascending' ? 3 : 4)
        }
        
      } else if ('create_at' == obj.prop) {
        this.listQuery.order = (obj.order == 'ascending' ? 1 : 2)
      } else if ('errorNum' == obj.prop) {
        this.listQuery.order = (obj.order == 'ascending' ? 5 : 6)
      } else if ('manualNum' == obj.prop) {
        this.listQuery.order = (obj.order == 'ascending' ? 7 : 8)
      }
      this.listQuery.page = 1
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
    viewReceiptClick(row) {
      this.$emit('viewReceiptClick', {openid:row.openid, popParams:this.popParams })
    },
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    handleCurrentChange(page){
      this.listQuery.page = page
      this.getList()
    },
    showUserPopInfo(row){
      this.popInfoParams.id = row.r_id
      this.popInfoParams.openid = row.openid
      this.popInfoParams.pop_info = row.pop_info
      this.popInfoParams.status = row.r_status
      this.userPopTitle = '【'+row.nickname +'】操作'
      this.showUserPopInfoFlag = true

    },
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '用户异常状态，是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.receiptUserStatus, { id: row.r_id, receiptId:this.receiptId, status: status }).then((res) => {
          if (res.code === 200) {
            this.openLoading = false
            this.getList();
            this.$message({
              type: 'success',
              message: '完成'
            })
          } else {
            this.openLoading = false
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

    download() {
      this.$http.download(API.receiptUserExport,{...this.listQuery}).then(res => {
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

    
    getList() {
      this.listLoading = true
      this.$http.get(API.receiptUser,{...this.listQuery}).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          this.tabList = res.data.data
          this.total = res.data.count
          // console.log(this.tabList, "tabList")
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    submitPopInfoForm(formName) {
        this.$refs[formName].validate((valid, object) => {
        if(valid) {
            this.popInfoLoading = true
            this.$http.post(API.receiptUserPopInfoSave, this.popInfoParams).then(res => {
                
                if (res.code === 200) {
                    this.$message.success('保存成功')
                    setTimeout(() => {
                        this.showUserPopInfoFlag = false
                        this.getList()
                    }, 1000);
                } else {
                    this.$message.error(res.msg?res.msg:'保存失败')
                }
                this.popInfoLoading = false
            })
            .catch(error => {
                this.$message.error('保存失败')
                this.popInfoLoading = false

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
  },
}
</script>
<style lang='scss' scoped>
</style>
