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

                <el-form-item label="连锁名称">
                    <el-input
                        v-model="listQuery.chainName"
                        clearable
                        class="filter-item"
                        placeholder="请输入连锁名称"/>
                </el-form-item>

                <el-form-item label="门店名称">
                    <el-input
                        v-model="listQuery.storeName"
                        clearable
                        class="filter-item"
                        placeholder="请输入门店名称"/>
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
                        v-for="item in awardIdQuery"
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
                    @click="getRankList">
                    <i class="el-icon-search"/>
                    <span> 搜索</span>
                </el-button>

                <el-button
                type="success"
                class="op-btn"
                plain
                @click="backListClick()"
            >
                返回活动列表
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
            <span v-else-if="item.key=='rank'">
                {{ scope.row[item.key]<1? '未知':scope.row[item.key]}}
            </span>
            <span v-else-if="item.key=='cnt'">
                {{ scope.row['correctCnt'] + scope.row['wrongCnt']}}
            </span>
            <span v-else-if="item.key=='award'">
                 {{awardIdMap[scope.row['awardId']]?awardIdMap[scope.row['awardId']]:'未知'}} 
            </span>
            <span v-else-if="item.key=='answerAt'">{{ scope.row['answerAt'] * 1000, 3 | dateFormat}}</span>
    
            <span v-else>{{ scope.row[item.key] }}</span>
        </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
            fixed="right"
            :width="100"
        >
            <template slot-scope="{row}">
            <el-button
                type="primary"
                class="op-btn"
                plain
                size="mini"
                @click="showDetailClick(row)"
                v-if="row.addressId > 0"
            >
                地址
            </el-button>
           

            <el-button type="danger"  plain class="op-btn" size="mini" @click="sendClick(row)" v-if="row.awardId < 1">
            发放奖项 
          </el-button>
            
            
            </template>
        </el-table-column>
        </el-table>
         <el-pagination
        v-show="total>0"
        :total="total"
        :current-page.sync="listQuery.page"
        page-sizes="[5, 10, 20, 30, 50]"
        :page-size.sync="listQuery.limit"
        layout="prev, pager, next, jumper, ->, sizes, total"
        @current-change="handleCurrentChange"
        />
      

    <v-dialog :visible.sync="showAddressFlag" title="收货地址" width="52%" :destroy-on-close='true'>
        <el-descriptions title="收货信息" column="2"> 
            <el-descriptions-item label="微信昵称">{{popParams.nickname}}</el-descriptions-item>
            <el-descriptions-item label="中奖结果"><el-tag size="small">{{awardIdMap[popParams.awardId]?awardIdMap[popParams.awardId]:'未知'}}</el-tag></el-descriptions-item>
            <el-descriptions-item label="收货人">{{addressInfo.name}}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{addressInfo.mobile}}</el-descriptions-item>

            <el-descriptions-item label="身份证号">{{addressInfo.id_card}}</el-descriptions-item>
            <el-descriptions-item label="省市区">{{addressInfo.province_name}}{{addressInfo.city_name}}{{addressInfo.county_name}}</el-descriptions-item>
            <el-descriptions-item label="详细地址">{{addressInfo.detail}}</el-descriptions-item>
        </el-descriptions>
    </v-dialog>

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

    </div>

</template>
<script>

import vDialog from '../../dialog.vue'

export default {
  props: {
    askId: Number,
    placeName: String,
    askName: String,
    popTitle: String,
  },
  data() {
    return {
      formLabelWidth: '80px',
      awardIdMap:{'0':'未知','-1':'未中奖'},

      awardIdQuery: [{ id: 0, name: '全部' }],
      awardTypeMap:{'0':'--', '1':'红包', '2':'积分', '3':'星币', '4':'实物奖'},
      menualAwardQuery: [],

      total:0,
      tabList:[],
      tableConfig : [

        { label: '排行', key: 'rank' },
        { label: '头像', key: 'avatar' },
        { label: '粉丝openid', key: 'openid' },
        { label: '用户昵称', key: 'nickname' },
        { label: '用户名', key: 'name' },
        { label: '手机号', key: 'mobile' },
        { label: '连锁名称', key: 'chainName' },
        { label: '门店名称', key: 'storeName' },

        { label: '正确数', key: 'correctCnt' },
        { label: '答题数', key: 'cnt' },
        { label: '花费时间', key: 'costTime' },
        { label: '完成时间', key: 'answerAt' },
        { label: '是否中奖', key: 'award' },
        // // { label: '参与人数', key: 'joinCnt' },
        // { label: '开始日期', key: 'start_time' },
        // { label: '结束日期', key: 'end_time' },
      ],


      listQuery: {
        askId:0,
        awardId:0,
        nickname:'',
        name:'',
        openid:'',
        mobile:'',
        chainName:'',
        storeName:'',
        page:1,
        limit:20,
      },
      popParams:{
        addressId:0,
        openid:'',
        nickname:'',
        awardId:0,
      },
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


       popAwardParams:{
        askId:0,
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


    };
  },
  created() {
    this.listQuery.askId = this.askId
    this.getRankList()
    this.getAwardList()
   },
   components:{vDialog},
  methods: {
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    handleCurrentChange(page){
      this.listQuery.page = page
      this.getRankList()
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
      this.$http.get(API.quickAddress+'?askId='+this.askId+'&addressId='+this.popParams.addressId+"&openid="+this.popParams.openid).then(res => {
        if (res.code == 200) {
            this.addressInfo = res.data

        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getAwardList() {
      this.$http.get(API.quickAwardList+'?askId='+this.askId).then(res => {
        if (res.code == 200) {


           const awardList = res.data
            this.awardIdQuery = [{id:0, name:'全部'},{id:-1, name:'未中奖'}]

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
    getRankList() {
      this.listLoading = true
      this.$http.get(API.quickRankList,{...this.listQuery}).then(res => {
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

    submitAwardForm(formName) {
      this.popAwardParams.askId = this.askId
      this.$refs[formName].validate((valid, object) => {
        if (valid ) {
          this.awardIdLoading = true
          this.$http.post(API.domain+"QuickSendAward", this.popAwardParams).then(res => {

            if (res.code === 200) {
              this.$message.success('请求成功')
              setTimeout(() => {
                this.showAwardPopFlag = false
                this.getRankList()
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

    sendClick(row) {
      this.popAwardParams.voteId = row.vote_id
      this.popAwardParams.openid = row.openid
      this.popAwardParams.awardId = 0
      this.popAwardParams.awardType = 1
      this.popAwardParams.moeny = 0

      this.showAwardPopFlag = true
      
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
<style lang='scss' scoped>
</style>
