<template>
  <el-drawer
    :title="popTitle"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="90%"
    :show-close="true"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    @close="closeDrawer"
  >
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" :model="listQuery" class="form-container" inline>

       

        <el-form-item label="用户openid">
          <el-input v-model="listQuery.openid" clearable class="filter-item" placeholder="请输入openid" />
        </el-form-item>

         <el-form-item label="业务员openid">
          <el-input v-model="listQuery.salesman_openid" clearable class="filter-item" placeholder="请输入openid" />
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

    


    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row 
      :style="{ 'width': '100%', 'margin-top': '15px' }">
      <el-table-column v-for="(item, index) in tableConfig" :key="index" align="center" :label="item.label"
        :width="item.width" :prop="item.key" :sortable="item.sortable">
        <template slot-scope="scope">
          <img width="60" :src="scope.row.avatar" alt="pic" v-if="item.key == 'avatar'" />
          <span v-else-if="item.key == 'update_at' ">{{ scope.row[item.key] * 1000, 3 |
            dateFormat }}</span>
            <span v-else-if="item.key == 'is_thumps_up'">{{ scope.row[item.key] == 1 ? '已点赞' : '未点赞' }}</span>
            <span v-else-if="item.key=='user_type'">
            {{ userTypeMap[scope.row['user_type']] ? userTypeMap[scope.row['user_type']] : '--' }}
          </span>
          <span v-else-if="item.key=='type'">
            {{ idTypeMap[scope.row['type']] ? idTypeMap[scope.row['type']] : '--' }}
          </span>
          <span v-else-if="item.key=='status'">
            {{ awardMap[scope.row['status']] ? awardMap[scope.row['status']] : '--' }}
          </span>
            <span v-else-if="item.key=='business_id_type'">
              {{ businessUserTypeMap[scope.row['business_id_type']] ? businessUserTypeMap[scope.row['business_id_type']] : '--' }}
          </span>
           <span v-else-if="item.key=='clinic_id_type'">
            {{ clinicUserTypeMap[scope.row['clinic_id_type']] ? clinicUserTypeMap[scope.row['clinic_id_type']] : '--' }}  
            </span>
            <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
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
                @click="viewShowLogClick(row)"
            >
                查看分享记录
            </el-button>
            </template>
            </el-table-column> -->
    </el-table>
    <el-pagination v-show="total > 0" :total="total" :current-page.sync="listQuery.page" :page-sizes="[5, 10, 20, 30, 50]"
      :page-size.sync="listQuery.limit" layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="handleCurrentChange" />
  </el-drawer>
</template>

<script>
export default {
  name: 'SalesManAwardDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    bind_id: {
      type: Number,
      default: 0,
    },
    bind_type: {
      type: Number,
      default: 0,
    },
    activity_type: {
      type: Number,
      default: 0,
    },
    activity_id: {
      type: Number,
      default: 0,
    },
    popTitle: {
      type: String,
      default: '详情',
    },
  },
  computed: {
    drawerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    closeDrawer() {
      this.$emit('closeDrawer');
    },
  },

  data() {
    return {
      formLabelWidth: '68px',
      awardMap: { 0: '未知', 1: '待发放', 2: '已发放', 3: '发放失败' },
      // 1-待发放 2-已发放 3-发放失败
      awardQuery: [{ id: 0, name: '全部' }, { id: 1, name: '待发放' }, { id: 2, name: '已发放' }, { id: 3, name: '发放失败' }],

      total: 0,
      tabList: [],
      tableConfig: [
        { label: '二级活动名称', key: 'sub_activity_name' },
        { label: '业务员openid', key: 'salesman_openid' },
        { label: '业务员用户名', key: 'salesman_name' },
        { label: '业务员手机号', key: 'salesman_mobile' },
        { label: '奖励(分)', key: 'money', width: '100px' },
        { label: '状态', key: 'status' },
        { label: '转账批次号', key: 'batch_id' },
        { label: '失败原因', key: 'reason' },

        { label: '头像', key: 'avatar' },
        { label: '粉丝openid', key: 'openid' },
        { label: '用户昵称', key: 'nickname' },
        { label: '用户名', key: 'user_name' },
        { label: '手机号', key: 'mobile' },

        { label: '行业', key: 'user_type' },

        { label: '企业名称', key: 'business_name' },
        { label: '企业二级部门', key: 'business_department_name' },
        { label: '商业身份', key: 'business_id_type' },
        { label: '连锁名称', key: 'chainName' },
        { label: '门店名称', key: 'storeName' },
        { label: '零售身份', key: 'type' },

        { label: '诊所名称', key: 'clinic_name' },
        { label: '诊所身份', key: 'clinic_id_type' },
      ],


      listQuery: {
        salesman_openid: '',
        openid: '',

        place_id: 0,
        bind_type: 0,
        bind_id: 0,

        page: 1,
        limit: 20,

        order: 1,
      },
      chainLoading: false,
      chainOptions: [],

      sendMoeny:0,
      awaitMoney:0,

      userTypeMap: { 1:'零售', 2:'商业', 3:'诊所'},
      idTypeMap: { 1:'店长', 2:'店员', 3:'药师', 4:'其他'},
      businessUserTypeMap: { 1:'业务员', 2:'开票员', 3:'采购员', 4:'其他'},
      clinicUserTypeMap: { 1:'医生', 2:'护士', 3:'其他'},




    };
  },
  created() {
    console.log(this.bind_id, this.bind_type, "bind_id bind_type")
    this.listQuery.bind_id = this.bind_id
    this.listQuery.bind_type = this.bind_type
    this.getList()
  },
  methods: {
    searchForm() {
      this.listQuery.page = 1
      this.getList()
    },
   
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getList()
    },


    getList() {
      this.listLoading = true
      this.$http.get(API.domain + "SalesManAwardList", { ...this.listQuery }).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          let total = res.data.total
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
    
  },
};
</script>

<style scoped>

</style>
