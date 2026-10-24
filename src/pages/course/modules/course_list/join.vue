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

        <!-- <el-form-item
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
                </el-form-item> -->




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

    


    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row @sort-change="sortChange"
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

  </div>
</template>
<script>

import vDialog from '../../../../components/Dialog/dialog.vue'

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
      awardMap: { '0': '未知', '-1': '未中奖' },
      awardQuery: [{ id: 0, name: '全部' }, { id: 1, name: '待领取' }, { id: 2, name: '未中奖' }, { id: 3, name: '已领取' }],

      total: 0,
      tabList: [],
      tableConfig: [
        { label: '头像', key: 'avatar' },
        { label: '粉丝openid', key: 'openid' },
        { label: '用户昵称', key: 'nickname' },
        { label: '用户名', key: 'name' },
        { label: '手机号', key: 'mobile' },

        { label: '学习奖励', key: 'study_Money', sortable: 'custom' },
        { label: '考试奖励', key: 'exam_money', sortable: 'custom' },

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
        articleId: 0,

        nickname: '',
        name: '',
        openid: '',
        mobile: '',
        chainId: '',

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
    this.listQuery.courseId = this.popId
    this.listQuery.openid = this.openid
    if (this.awardType == 1) {
      this.tableConfig.unshift({
        label: '参与日期', key: 'date'
      })
    }
    this.getList()
  },
  components: { vDialog },
  methods: {
    sortChange(obj) {
      if ('study_Money' == obj.prop) {
        if (!obj.order) {
          this.listQuery.order = 1
        } else {
          this.listQuery.order = (obj.order == 'ascending' ? 3 : 4)
        }

      } else if ('exam_money' == obj.prop) {
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


    getList() {
      this.listLoading = true
      this.$http.get(API.courseUserList, { ...this.listQuery }).then(res => {
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
    download() {
      this.$http.download(API.courseUserExport,{...this.listQuery}).then(res => {
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
      
    }
  },
}
</script>
<style lang='scss' scoped></style>
