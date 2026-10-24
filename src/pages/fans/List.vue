<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item  v-if="listQuery.activityId > 0">  <a href="/fans/inviteActivity">邀请活动</a> </el-breadcrumb-item>
      <el-breadcrumb-item  v-if="listQuery.activityId > 0"> {{activityName}}</el-breadcrumb-item>
      <el-breadcrumb-item> 店员管理</el-breadcrumb-item>
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

          <el-form-item label="用户区域">
            <el-cascader
              size="large"
              clearable
              :options="options"
              :props="{ checkStrictly: true }"
              v-model="selOptions">
            </el-cascader>
            <!-- <el-input v-model="listQuery.name" clearable class="filter-item" placeholder="请输入用户名称" /> -->
          </el-form-item>

          <el-form-item label="门店区域">
            <el-cascader
              size="large"
              clearable
              :options="options"
              :props="{ checkStrictly: true }"
              v-model="selStoreOptions">
            </el-cascader>
            <!-- <el-input v-model="listQuery.name" clearable class="filter-item" placeholder="请输入用户名称" /> -->
          </el-form-item>

          <el-form-item label="所属行业">
            <el-select
              v-model="listQuery.UserType"
              clearable
              filterable
              placeholder="所属行业">
              <el-option v-for="item in userTypeList"
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
          <el-button
          :loading="downloadLoading"
                    type="warning"
                    align="right"
                    @click="download">
                    <i class="el-icon-download"/>
                    <span> 导出</span>
                </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-divider></el-divider>
    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row
      :style="{ 'width': '100%', 'margin-top': '15px' }">
      <el-table-column v-for="(item, index) in tableConfig" :key="index" align="center" :label="item.label"
        :width="item.width" :prop="item.key">
        <template slot-scope="scope">
          <img width="60" :src="scope.row.avatar" alt="pic" v-if="item.key == 'avatar'" />
           <span v-else-if="item.key == 'last_login_at'"> {{ scope.row.last_login_at * 1000, 3 | dateFormatFilter }}</span>
           <span v-else-if="item.key == 'reg_at'"> {{ scope.row.reg_at * 1000, 3 | dateFormatFilter }}</span>

          <span v-else-if="item.key == 'status'">
            {{ statusMap[scope.row['status']] ? statusMap[scope.row['status']] : '未知' }}
          </span>
          <span v-else-if="item.key=='user_type'">
            {{ userTypeMap[scope.row['user_type']] ? userTypeMap[scope.row['user_type']] : '--' }}
          </span>
          <span v-else-if="item.key=='type'">
            {{ idTypeMap[scope.row['type']] ? idTypeMap[scope.row['type']] : '--' }}
          </span>
            <span v-else-if="item.key=='business_id_type'">
              {{ businessUserTypeMap[scope.row['business_id_type']] ? businessUserTypeMap[scope.row['business_id_type']] : '--' }}
          </span>
           <span v-else-if="item.key=='clinic_id_type'">
            {{ clinicUserTypeMap[scope.row['clinic_id_type']] ? clinicUserTypeMap[scope.row['clinic_id_type']] : '--' }}  
            </span>

          <el-link type="primary" @click="previceAuthImgClick(scope.row)" v-else-if="item.key=='auth_info' && scope.row.auth_imgs.length > 0">认证图片</el-link>
          
          <span v-else-if="item.key=='adcode'">{{ adCodeToTxt(scope.row.adcode)}}</span>
          <span v-else-if="item.key=='store_adcode'">{{ adCodeToTxt(scope.row.store_adcode)}}</span>
          <span v-else>{{ scope.row[item.key] }}</span>

          <el-link type="warning" @click="reviewClick(scope.row)" v-if="item.key=='auth_info' && (scope.row.status == 3 ||  scope.row.status == 5)">审核</el-link>

          <el-link type="danger" @click="editlick(scope.row)"  v-if="item.key=='auth_info'">修改信息</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :page-sizes="[10]" limit.sync="10"
      @current-change="handleCurrentChange" />
    <el-image-viewer v-if="imageShow" :urlList="imgList" :onClose="() => { imageShow = false }" />

    <el-dialog :visible.sync="showReviewPopFlag" title="认证审核" width="80%">
      <el-form :model="popReviewParams" :rules="reviewRules" ref="revieWForm" label-width="100px">
        <el-descriptions title="" column="3">
            <el-descriptions-item label="渠道名称">{{popParams.place_name}}</el-descriptions-item>
            <el-descriptions-item label="openid">{{popParams.openid}}</el-descriptions-item>
            <el-descriptions-item label="用户昵称">{{popParams.nickname}}</el-descriptions-item>
            <el-descriptions-item label="用户名称">{{popParams.name}}</el-descriptions-item>

            <el-descriptions-item label="手机号">{{popParams.mobile}}</el-descriptions-item>
            <el-descriptions-item label="行业">{{userTypeMap[popParams.user_type] ? userTypeMap[popParams.user_type] : '-'}}</el-descriptions-item>

            <el-descriptions-item label="商业身份">{{businessUserTypeMap[popParams.business_id_type] ? businessUserTypeMap[popParams.business_id_type] : '-'}}</el-descriptions-item>
            <el-descriptions-item label="企业名称">{{popParams.business_name ? popParams.business_name : '-'}}</el-descriptions-item>
            <el-descriptions-item label="企业二级部门">{{popParams.business_department_name ? popParams.business_department_name : '-'}}</el-descriptions-item>

            <el-descriptions-item label="零售身份">{{idTypeMap[popParams.type] ? idTypeMap[popParams.type] : '-'}}</el-descriptions-item>
            <el-descriptions-item label="连锁名称">{{popParams.chain_name ? popParams.chain_name : '-'}}</el-descriptions-item>
            <el-descriptions-item label="门店名称">{{popParams.store_name ? popParams.store_name : '-'}}</el-descriptions-item>

            <el-descriptions-item label="诊所名称">{{popParams.clinic_name ? popParams.clinic_name : '-'}}</el-descriptions-item>
            <el-descriptions-item label="诊所身份">{{clinicUserTypeMap[popParams.clinic_id_type] ? clinicUserTypeMap[popParams.clinic_id_type] : '-'}}</el-descriptions-item>
            <el-descriptions-item label="连锁名称">{{popParams.chain_name ? popParams.chain_name : '-'}}</el-descriptions-item>
            <el-descriptions-item label="门店名称">{{popParams.store_name}}</el-descriptions-item>

            <el-descriptions-item label="门店区域">{{adCodeToTxt(popParams.store_adcode)}}</el-descriptions-item>
            <el-descriptions-item label="用户区域">{{adCodeToTxt(popParams.adcode)}}</el-descriptions-item>


            


            
  
        </el-descriptions>
        <el-form-item label="认证图片" prop="imgList">
          <el-image 
          style="width: 100px; height: 100px; margin: 5px 10px;border: 1px solid #eee;"
          :key="imgSrc"
          :src="imgSrc" 
          v-for="imgSrc in popParams.imgList"
          :preview-src-list="popParams.imgList"
          >
          </el-image>
        </el-form-item>

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
    <el-dialog :visible.sync="showEditPopFlag" title="认证审核" width="50%">
      <el-form :model="popParams" :rules="editRules" ref="editForm" label-width="100px">
        <el-form-item label="openid" prop="title">
          <el-input v-model="popParams.openid" style="width:300px" placeholder="请输入openid" readonly disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="popParams.name" style="width:300px" placeholder="请输入用户名"></el-input>
        </el-form-item>
         <el-form-item label="手机号" prop="mobile">
          <el-input type="number" v-model="popParams.mobile" style="width:300px" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="操作" prop="user_type">
          <el-radio-group v-model="popParams.user_type">

            <el-radio :label="1" >零售 </el-radio>
            <el-radio :label="2">商业</el-radio>
            <el-radio :label="3">诊所</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="连锁名称" prop="chain_id" v-if="popParams.user_type == 1">
            <el-select v-model="popParams.chain_id" filterable remote reserve-keyword clearable placeholder="请输入连锁名称关键词"
              :remote-method="editChaineSarch" :loading="editChainLoading" style="width:300px" @change="selectChainChange" >
              <el-option v-for="item in editChainOptions" :key="item.id" :label="item.name" :value="item.id" style="width:600px" >
              </el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="门店区域" prop="store_adcode" v-if="popParams.user_type == 1">
            <el-cascader
              size="large"
              style="width:300px" 
              filterable
              :options="options"
              :props="{ checkStrictly: true }"
              v-model="selStoreEditOptions"
              @change="handleChange"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="门店名称" prop="store_name" v-if="popParams.user_type == 1">
          <el-input v-model="popParams.store_name" style="width:300px" placeholder="请输入门店名称"></el-input>
        </el-form-item>


        <el-form-item label="">
          <el-button @click="submitEditForm('editForm')" type="primary" :loading="editLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>
<script>
import { regionData,codeToText } from 'element-china-area-data'
export default {
  components:{
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer.vue')
  },
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
        sex: '',
        mobile: '',
        card: '',
        nickname: '',
        relation: '',
        sex: '',
        time: '',
        page: 1,
        limit: 10,
        UserType: 0,
        searchRegTime: [],
        searchLoginTime: [],
        downloadLoading: false,
      },
      tabList: [],
      tableConfig: [
        { label: '头像', key: 'avatar', width: 90 },
        { label: '粉丝openid', key: 'openid' },
        { label: '用户昵称', key: 'nickname' },
        { label: '用户名', key: 'name' },
        { label: '手机号', key: 'mobile' },
        { label: '状态', key: 'status' },

        { label: '行业', key: 'user_type' },
        { label: '认证信息', key: 'auth_info' },
        { label: '企业名称', key: 'business_name' },
        { label: '企业二级部门', key: 'business_department_name' },
        { label: '商业身份', key: 'business_id_type' },
        { label: '连锁名称', key: 'chain_name' },
        { label: '门店名称', key: 'store_name' },
        { label: '零售身份', key: 'type' },
        { label: '用户区域', key: 'adcode' },
        { label: '门店区域', key: 'store_adcode' },

        { label: '诊所名称', key: 'clinic_name' },
        { label: '诊所身份', key: 'clinic_id_type' },
        { label: 'poi', key: 'store_uid' },
        { label: '邀请用户', key: 'sales_name' },
        { label: '活动名称', key: 'activity_title' },
        { label: '注册时间', key: 'reg_at' },
        { label: '最后登录时间', key: 'last_login_at' },

      ],
      sexList: [
        { name: '男', value: 1 },
        { name: '女', value: 2 }
      ],
      relationList: [
        { label: '自己', value: 1 },
        { label: '爱人', value: 2 },
        { label: '父亲', value: 3 },
        { label: '母亲', value: 4 },
        { label: '子女', value: 5 },
        { label: '兄弟姐妹', value: 6 },
        { label: '朋友', value: 7 },
        { label: '其他', value: 8 },
      ],
      fileList: [],
      listLoading: false,
      tempData: { name: '', mobile: '', card: '' },
      total: 0,
      totalPat: 0,

      rollType: 5,

      // placeList:[],
      queryPlaceList: [],


      statusList: [
        {name: '全部', value: 0},
        {name: '未注册', value: 3},
        {name: '已注册', value: 4},
        {name: '待审核', value: 5},
        {name: '审核通过', value: 6},
        {name: '审核驳回', value: 7},
        {name: '地址异常', value: 1},
        {name: '已获取定位', value: 2},
      ],
      
      //1-已注册 2-已访问 3-认证待审核 4-审核驳回 5-认证成功
      statusMap: { 1:'已注册', 2:'已访问', 3:'待审核', 4:'审核驳回', 5:'审核通过', 7:'已隐藏'},

      // 行业身份： 0-未知 1-零售 2-商业 3-诊所
      userTypeOptions: [
        { text: '零售', value: 1 },
        { text: '商业', value: 2 },
        { text: '诊所', value: 3 },
      ],
      userTypeMap: { 1:'零售', 2:'商业', 3:'诊所'},
      userTypeList: [
        { name: '全部', value: 0 },
        { name: '零售', value: 1 },
        { name: '商业', value: 2 },
        { name: '诊所', value: 3 },
      ],


      idTypeOptions: [
        { text: '店长', value: 1 },
        { text: '店员', value: 2 },
        { text: '药师', value: 3 },
        { text: '其他', value: 4 },
      ],
      idTypeMap: { 1:'店长', 2:'店员', 3:'药师', 4:'其他'},
    

      businessUserTypeOptions: [
        { text: '业务员', value: 1 },
        { text: '开票员', value: 2 },
        { text: '采购员', value: 3 },
        { text: '其他', value: 4 },
      ],
      businessUserTypeMap: { 1:'业务员', 2:'开票员', 3:'采购员', 4:'其他'},

      clinicUserTypeOptions: [
        { text: '医生', value: 1 },
        { text: '护士', value: 2 },
        { text: '其他', value: 3 },
      ],
      clinicUserTypeMap: { 1:'医生', 2:'护士', 3:'其他'},


      businessUserTypeMap: { 1:'业务员', 2:'开票员', 3:'采购员', 4:'其他'},
      clinicUserTypeMap: { 1:'医生', 2:'护士', 3:'其他'},

      chainLoading: false,
      chainOptions: [],

      options: regionData,
      selOptions: [],
      selStoreOptions:[],
      selStoreEditOptions:[],
      codeToText:codeToText,

      imageShow:false,
      showReviewPopFlag:false,
      showEditPopFlag: false,

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
        '请按要求补全认证资料！',
        '资料拍摄不清晰，请重新拍摄上传！',
      ],

      editChainLoading: false,
      editChainOptions: [],
      editRules: {
          name: [
            { required: true, message: '请先输入用户名', trigger: 'change' }
          ],
          mobile: [
            { required: true, message: '请先输入手机号', trigger: 'change' }
          ],
          chain_name: [
            { required: true, message: '请先选择连锁', trigger: 'change' }
          ],
          store_adcode: [
            { required: true, message: '请先选择门店区域', trigger: 'change' }
          ],
          store_name: [
            { required: true, message: '请先输入门店名称', trigger: 'change' }
          ],
      },
      editLoading:false,
    }
  },
  created() {
    if (this.$route.query.activityId) {

      this.listQuery.placeId = this.$route.query.placeId
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
    selectChainChange(value) {
      const selectedOption = this.editChainOptions.find(item => item.id === value);
  if (selectedOption) {
    this.popParams.chain_name = selectedOption.name
  }
      
},

    editChaineSarch(query) {
      this.execChainSearch(query, true);
    },
    chainSearch(query) {
      this.execChainSearch(query, false);
    },
    submitEditForm(formName) { 
      if(this.selStoreEditOptions.length != 3 && this.popReviewParams.user_type == 1) {
        this.$message.error('请选择具体的区县');
        return
      }
      this.popParams.store_adcode = parseInt(this.selStoreEditOptions[2])
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          this.editLoading = true
          this.$http.post(API.fansUpdateInfo, this.popParams).then(res => {

            if (res.code === 200) {
              this.$message.success('保存成功')
              setTimeout(() => {
                this.showEditPopFlag = false
                this.getTabList()
              }, 1000);
            } else {
              this.$message.error(res.msg ? res.msg : '保存失败')
            }
            this.editLoading = false
          })
            .catch(error => {
              this.$message.error('请求失败')
              this.editLoading = false

            });
        } else {
          for (var i in object) {
            this.$message.error(object[i][0].message)
            return false
          }
          return false;
        }
      });
      
      // console.log("submitEditForm", this.popParams, this.selStoreEditOptions)
    },
    editlick(item) {
      this.popParams = item
      let selStoreEditOptions = [];
      let storeAdcode = item.store_adcode;
      if(storeAdcode / 10000 > 0) {
        selStoreEditOptions.push(''+parseInt(storeAdcode / 10000))
        selStoreEditOptions.push(''+parseInt(storeAdcode / 100))
        selStoreEditOptions.push(''+storeAdcode)
      }

      this.selStoreEditOptions = selStoreEditOptions

      // console.log(item.chain_id, item.chain_name, 'e', item)

      if(!item.chain_id) {
        item.chain_id = 0
        this.editChainOptions = []
      } else {
        // console.log(item.chain_id, item.chain_name, 'e')
        this.editChainOptions = [{
        id: item.chain_id,
        name: item.chain_name
      }]
      }

      this.showEditPopFlag = true

    },

    handleChange(value) {
      // 简单实现：只允许选择叶子节点
      if (value && value.length > 0) {
        const lastValue = value[value.length - 1];
        // 检查是否为叶子节点（通过是否有children属性判断）
        const isLeaf = this.isLeafNode(lastValue);
        if (!isLeaf) {
          this.$message.warning('请选择具体的区县');
          this.selStoreEditOptions = [];
        }
      }
    },
    isLeafNode(value) {
      // 简化判断：通过递归查找该值是否为叶子节点
      const findLeaf = (nodes, target) => {
        for (let node of nodes) {
          if (node.value === target) {
            return !node.children || node.children.length === 0;
          }
          if (node.children && node.children.length > 0) {
            const result = findLeaf(node.children, target);
            if (result) return true;
          }
        }
        return false;
      };
      return findLeaf(this.options, value);
    },
    submitReviewForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid &&  this.popReviewParams.opType) {
          this.reviewLoading = true
          this.$http.post(API.userReviewManual, this.popReviewParams).then(res => {

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

    previceAuthImgClick(item) {
      let imgList = item.auth_imgs.split(',')
      if (imgList.length > 0) {
        this.imageShow = true
        this.imgList = imgList
      } else {
        this.$message.error('无认证图片')
      }

    },
    reviewClick(item) {
      this.popParams = item
      let imgList = item.auth_imgs.split(',')
      this.popParams.imgList = imgList
      this.popReviewParams.openid = item.openid
      this.popReviewParams.opType = 0
      this.popReviewParams.reason = ''
      this.showReviewPopFlag = true

    },
    execChainSearch(query, isEdit) {
      if (query !== '') {
        if(isEdit) {
          this.editChainLoading = true
        } else {
          this.chainLoading = true

        }
        this.$http.get(API.getChainList + '?name=' + query).then(res => {
          if (res.code == 200) {
            if(isEdit) {
              this.editChainLoading = false
              this.editChainOptions = res.data
            } else {
              this.chainLoading = false
              this.chainOptions = res.data
            }

          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        if(isEdit) {
              this.editChainOptions = [];
            } else {
              this.chainOptions = [];
            }
        
      }
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
    searchForm() {
      this.listQuery.page = 1
      this.getTabList()
    },
    getTabList() {
      // console.log(this.selOptions, this.selStoreOptions, '===getTabList===')
      if (this.selOptions.length > 0) {
        this.listQuery.adcode = this.selOptions[this.selOptions.length - 1]
      } else {
        this.listQuery.adcode = ''
      }

      if (this.selStoreOptions.length > 0) {
        this.listQuery.store_adcode = this.selStoreOptions[this.selStoreOptions.length - 1]
      } else {
        this.listQuery.store_adcode = ''
      }
      this.listLoading = true
      this.$http.get(API.fansList, { ...this.listQuery }).then(res => {
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
    download() {
      this.downloadLoading = true
      this.$http.download(API.domain+"FansUserExport",{...this.listQuery}).then(res => {
        if (res.status != 200) {
          this.downloadLoading = false
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

      this.downloadLoading = false
    return
    
          
        }
        let fileName = decodeURIComponent(res.headers["content-disposition"].split("=")[1])
        if (!res.data) { //data为axios返回的文件流
          this.$message.error('导出失败')
          this.downloadLoading = false
          return
        }

      this.downloadLoading = false
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
  }
}
</script>
