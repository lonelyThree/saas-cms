<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item  v-if="listQuery.activityId > 0">  <a href="/fans/inviteActivity">邀请活动</a> </el-breadcrumb-item>
      <el-breadcrumb-item  v-if="listQuery.activityId > 0"> {{activityName}}</el-breadcrumb-item>
      <el-breadcrumb-item>业务员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" :model="listQuery" class="form-container" inline>
        <el-form-item
              label="所属渠道"
              v-if="rollType == 1"
            >
             <el-select
                  v-model="listQuery.placeId"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in queryPlaceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
            </el-form-item>

          <el-form-item label="手机号码">
            <el-input v-model="listQuery.mobile" clearable class="filter-item" placeholder="请输入手机号码" />
          </el-form-item>

          <el-form-item label="用户名称">
            <el-input v-model="listQuery.name" clearable class="filter-item" placeholder="请输入用户名称" />
          </el-form-item>

          <el-form-item label="信息状态">
            <el-select
              v-model="listQuery.type"
              clearable
              filterable
              placeholder="请选择信息状态">
              <el-option v-for="item in statusList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"/>
            </el-select>
          </el-form-item>


          <el-form-item label="openid">
            <el-input v-model="listQuery.openid" clearable class="filter-item" placeholder="请输入openid" />
          </el-form-item>
           <el-form-item
          label="注册时间"
        >
         <el-date-picker v-model="listQuery.searchRegTime"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="timestamp"
                  :picker-options="pickerOptions0"
                  :default-time="['00:00:00', '23:59:59']"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
              </el-date-picker>
        </el-form-item>
        <el-form-item
          label="登录时间"
        >
         <el-date-picker v-model="listQuery.searchLoginTime"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="timestamp"
                  :picker-options="pickerOptions0"
                  :default-time="['00:00:00', '23:59:59']"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
              </el-date-picker>
        </el-form-item>
          <el-form-item>
          <el-button type="primary" align="right" @click="searchForm">
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-divider></el-divider>
    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row @sort-change="sortChange"
      :style="{ 'width': '100%', 'margin-top': '15px' }">
      <el-table-column v-for="(item, index) in tableConfig" :key="index" align="center" :label="item.label"
        :width="item.width" :prop="item.key" :sortable = "item.sortable">
        <template slot-scope="scope">
          <img width="60" :src="scope.row.avatar" alt="pic" v-if="item.key == 'avatar'" />

           <span v-else-if="item.key == 'last_login_at'"> {{ scope.row.last_login_at * 1000, 3 | dateFormatFilter }}</span>
           <span v-else-if="item.key == 'reg_at'"> {{ scope.row.reg_at * 1000, 3 | dateFormatFilter }}</span>

    
          <span v-else-if="item.key == 'status'">
            {{ statusMap[scope.row['status']] ? statusMap[scope.row['status']] : '未知' }}
          </span>

          <span v-else-if="item.key=='adcode'">{{ adCodeToTxt(scope.row.adcode)}}</span>
    

           <span v-else-if="item.key=='company_id_type'">
              {{ companyIdTypeMap[scope.row['company_id_type']] ? companyIdTypeMap[scope.row['company_id_type']] : '--' }}
          </span>
          
          <span v-else>{{ scope.row[item.key] }}</span>

          <el-link type="warning" @click="reviewClick(scope.row)" v-if="item.key=='status'">修改状态</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :page-sizes="[10]" limit.sync="10"
      @current-change="handleCurrentChange" />

    <el-dialog :visible.sync="showReviewPopFlag" title="认证审核" width="80%">
      <el-form :model="popReviewParams" :rules="reviewRules" ref="revieWForm" label-width="100px">
        <el-descriptions title="" column="3">
            <el-descriptions-item label="openid">{{popParams.openid}}</el-descriptions-item>
            <el-descriptions-item label="用户昵称">{{popParams.nickname}}</el-descriptions-item>
            <el-descriptions-item label="用户名称">{{popParams.name}}</el-descriptions-item>

            <el-descriptions-item label="手机号">{{popParams.mobile}}</el-descriptions-item>
        </el-descriptions>

        <el-form-item label="操作" prop="opType">
          <el-radio-group v-model="popReviewParams.opType">

            <el-radio :label="1" >审核通过</el-radio>
            <el-radio :label="2">审核驳回</el-radio>
          </el-radio-group>
        </el-form-item>




        <el-form-item label="驳回原因："  prop="reason" v-if="popReviewParams.opType == 2">
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
  </div>

</template>
<script>
import { codeToText } from 'element-china-area-data'

export default {
  data() {
    return {
      activityName:'',

      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        }
      },
      searchTime: '',
      total: 0,
      listQuery: {
        name: '',
        placeId: 22,
        mobile: '',
        openid: '',
        page: 1,
        limit: 10,

        order:1,
        searchRegTime: [],
        searchLoginTime: [],
      },
      tabList: [],
      tableConfig: [
        { label: '头像', key: 'avatar', width: 90 },
        { label: '粉丝openid', key: 'openid' },
        { label: '用户昵称', key: 'nickname' },
        { label: '用户名', key: 'name' },
        { label: '手机号', key: 'mobile' },

        { label: '状态', key: 'status' },

        { label: '所属企业', key: 'company_name' },
        { label: '二级部门', key: 'company_department_name' },
        // { label: '意向区域', key: 'area' },
        { label: '待提现', key: 'money' , sortable: 'custom' },
        { label: '待审核', key: 'lock_money' , sortable: 'custom' },
        { label: '已提现', key: 'out_money' , sortable: 'custom' },
        { label: '活动名称', key: 'activity_title' , sortable: 'custom' },

        { label: '身份', key: 'company_id_type' },
        { label: '用户区域', key: 'adcode' },
        { label: '注册时间', key: 'reg_at' },
        { label: '最后登录时间', key: 'last_login_at' },
      ],
      listLoading: false,
      total: 0,
      totalPat: 0,

      rollType: 5,

      // placeList:[],
      queryPlaceList: [],


      statusList: [
        {name: '待审核', value: 5},
        {name: '审核通过', value: 6},
        {name: '审核驳回', value: 7},
      ],
      
      //1-已注册 2-已访问 3-认证待审核 4-认证失败 5-认证成功
      statusMap: { 3:'待审核', 4:'审核驳回', 5:'审核通过'},

     
      showReviewPopFlag: false,
      popParams:{},
      reviewLoading:false,
      popReviewParams:{
          openid: '',
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
      reasonList:[
        '该区域暂未开放！',
        '与平台需求不匹配！',
      ],
      // 商业用户身份： 0-未知 1-业务代表 2-主管 3-经理 4-其他
      companyIdTypeMap: { 1:'业务代表', 2:'主管', 3:'经理', 4:'其他'},

       codeToText:codeToText,
    }
  },
  created() {
    if (this.$route.query.activityId) {
      this.listQuery.activityId = this.$route.query.activityId
      this.activityName = this.$route.query.activityName
    }
    
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType == 1) {
      this.getPlaceList()
    } else {
      this.tableConfig.shift()
      // this.tableConfig.shift()
    }
  },
  mounted() {
    this.getTabList();
  },
  methods: {
    sortChange(obj) {
      console.log(obj, obj.prop);
      if (!obj.order ) {
        this.listQuery.order = 0
      } else if ('money' == obj.prop) {
        this.listQuery.order = (obj.order == 'ascending' ? 1 : 2)
        
      } else if ('lock_money' == obj.prop) {
        this.listQuery.order = (obj.order == 'ascending' ? 3 : 4)
      } else if ('out_money' == obj.prop) {
        this.listQuery.order = (obj.order == 'ascending' ? 5 : 6)
      } 
      this.listQuery.page = 1
      this.getTabList()
    },

    submitReviewForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid &&  this.popReviewParams.opType) {
          this.reviewLoading = true
          this.$http.post(API.salesManReviewManual, this.popReviewParams).then(res => {

            if (res.code === 200) {
              this.$message.success('请求成功')
              setTimeout(() => {
                this.showReviewPopFlag = false
                this.getTabList()
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

    reviewClick(item) {
      this.popParams = item
      this.popReviewParams.openid = item.openid
      this.popReviewParams.opType = 0
      this.popReviewParams.reason = ''
      this.showReviewPopFlag = true

    },
    
    getPlaceList() {
      this.$http.get(API.getAllPlace).then(res => {
        if (res.code == 200) {
          // let js = {
          //   value:-1,name:'未归属渠道'
          // }
          // this.placeList = res.data

          let queryPlaceList = []



          res.data.forEach(el => {
            queryPlaceList.push(el)
          });
          // let rs =  JSON.parse(JSON.stringify(res.data))
          // let query = JSON.parse(JSON.stringify(res.data))
          // rs.unshift(js)

          // query.unshift({
          //   value:0,name:'全部'
          // })
          this.queryPlaceList = queryPlaceList
          // console.log("queryPlaceList---", this.queryPlaceList)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    
    searchForm() {
      this.listQuery.page = 1
      this.getTabList()
    },
    getTabList() {
      this.listLoading = true
      this.$http.get(API.salesManList, { ...this.listQuery }).then(res => {
        if (res.code == 200) {
          this.tabList = res.data.data
          this.total = res.data.count
        } else {
          this.$message.error(res.msg)
        }
      })
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getTabList()
    },
    adCodeToTxt(adcode) {
      if (!adcode) {
        return '--'
      }
      let provideId = parseInt(adcode/10000)
      let cityId = parseInt(adcode/100)
      let txt = this.codeToText[provideId]
      if (!txt) {
        return '--'
      }
      if (provideId * 100 != cityId) {
        txt = txt + '/' + this.codeToText[cityId]
      }

       if (adcode != cityId * 100) {
        txt = txt + '/' + this.codeToText[adcode]
      }
      
      return txt
      
    },
  }
}
</script>
