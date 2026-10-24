<template>
  <div class="place-wrap" v-if="showType == 1">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>贴柜活动管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" :model="listQuery" class="form-container" inline>
        <el-form-item label="所属渠道" v-if="rollType == 1">
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

        <el-form-item label="名称">
          <el-input
            v-model="listQuery.name"
            clearable
            class="filter-item"
            placeholder="请输入活动名称"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="listQuery.status"
            clearable
            filterable
            placeholder="请选择状态"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" align="right" @click="searchForm">
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>
          <el-button
            @click="addClick"
            v-if="rollType == 1 || rollType == 2"
            type="primary"
          >
            添加
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
      :style="{ width: '100%', 'margin-top': '15px' }"
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
          <!-- 图片展示 -->
          <img
            width="60"
            :src="getImg(scope.row)"
            alt="pic"
            v-if="item.key == 'imgs'"
          />
          
          <!-- 渠道名称映射 -->
          <span v-else-if="item.key == 'placeName'">
            {{ placeMap[scope.row['place_id']] ? placeMap[scope.row['place_id']] : '渠道' }}
          </span>

          <!-- 状态映射 -->
          <span v-else-if="item.key == 'status'">
            {{ scope.row[item.key] == 1 ? '上线' : (scope.row[item.key] == 2 ? '草稿' : '下架') }}
          </span>

          <el-link type="primary" @click="userClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==1">用户</el-link>
         <el-link type="primary" @click="chainClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==2">连锁</el-link>
         <el-link type="primary" @click="areaClick(scope.row)" v-else-if="item.key == 'limit_type' && scope.row.limit_type == 3">地区</el-link>
        <span v-else-if="item.key=='limit_type'">无限制</span>
        <span v-else-if="item.key=='money'">{{ scope.row['money']}}分</span>
        <span v-else-if="item.key=='date'">{{ scope.row['start_date'] | date2Format}}到{{ scope.row['end_date']  | date2Format}}</span>
        <span v-else-if="item.key=='limit_money'">{{ scope.row.limit_money }} / {{   scope.row.receive_money || 0}}</span>
        
        <span v-else-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
            <span v-else-if="item.key == 'award_type'">{{ scope.row[item.key] == 2 ? '积分' :(scope.row[item.key] == 3 ? '星币' :'现金' )}}</span>
            <span v-else-if="item.key == 'auth_type'">{{ scope.row[item.key] == 2 ? '不需要'  :'需要' }}</span>

<span v-else-if="item.key == 'business_type'">{{ getBusinessTypeText(scope.row) }}</span>
       

          <!-- 发放方式映射 -->
          <span v-else-if="item.key == 'send_type'">
            {{ sendTypeMap[scope.row['send_type']] || '--' }}
          </span>
        

          <!-- 默认显示 -->
          <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" :width="200">
        <template slot-scope="{ row }">
          <el-button
            type="danger"
            class="op-btn"
            plain
            size="mini"
            :loading="openLoading"
            @click="statusClick(row, 3, '下架')"
            v-if="row.status == 1"
          >
            下架
          </el-button>

          <el-button
            type="primary"
            class="op-btn"
            plain
            size="mini"
            :loading="openLoading"
            v-if="rollType == 1 || rollType == 2"
            @click="editClick(row)"
          >
            编辑
          </el-button>

          <el-button
            type="success"
            class="op-btn"
            plain
            size="mini"
            :loading="openLoading"
            @click="statusClick(row, 1, '上架')"
            v-if="row.status == 2 || row.status == 3"
          >
            上架
          </el-button>

          <el-button
            type="primary"
            class="op-btn"
            plain
            size="mini"
            @click="showLogClick(row)"
          >
            打卡记录
          </el-button>

          <el-button
            type="primary"
            class="op-btn"
            plain
            size="mini"
            @click="showBindClick(row)"
          >
            活动列表
          </el-button>

          <el-button
            type="warning"
            class="op-btn"
            plain
            size="mini"
            @click="showTopicClick(row, 1)"
            :loading="openLoading"
          >
            到店表单
          </el-button>

           <el-button
            type="warning"
            class="op-btn"
            plain
            size="mini"
            @click="showTopicClick(row, 2)"
            :loading="openLoading"
          >
            离店表单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total > 0"
      :total="total"
      :current-page.sync="listQuery.page"
      :page-sizes="[5, 10, 20, 30, 50]"
      :page-size.sync="listQuery.limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="handleCurrentChange"
    />
  </div>

  <!-- 编辑/添加组件 -->
  <counterEdit
    v-else-if="showType == 2"
    @backList="BackList"
    :popParams="popParams"
    :popTitle="popTitle"
    :incomePlaceList="incomePlaceList"
    :fileList="fileList"
  />

  <!-- 记录组件 -->
  <counterLog
    v-else-if="showType == 3"
    @backList="BackList"
    :popId="popId"
    :popParams="popParams"
    :popTitle="popTitle"
  />
   <!-- 绑定组件 -->
  <counterBind
    v-else-if="showType == 4"
    @backList="BackList"
    @viewJoinClick="viewJoinClick"
    :popParams="popParams"
    :popTitle="popTitle"
  />
    <counterArea
      @backList="BackList"
      :popId= "popId"
      :popTitle="popTitle"
      v-else-if="showType == 6" />
  <counterTopic
    @backList="BackList"
    :popId= "popId"
    :topicType = "topicType"
    :popTitle="popTitle"
    v-else-if="showType == 8" />
    <counterJoin
    @backList="BackList"
    :popId= "popId"
    :topicType = "topicType"
    :popTitle="popTitle"
    v-else-if="showType == 9" />
</template>

<script>
// 假设你需要引入新的编辑和日志组件，请根据实际路径调整
import counterEdit from "./modules/counter/edit.vue"; 
import counterLog from "./modules/counter/log.vue";
import counterBind from "./modules/counter/bind.vue";
import counterArea from "./modules/counter/area.vue";
import counterTopic from "./modules/counter/topic.vue";
import counterJoin from "./modules/counter/join.vue";


export default {
  data() {
    return {
      showType: 1, // 1 列表 2 编辑/添加 3 记录
      total: 0,
      searchTime: "",
      listQuery: {
        name: "",
        status: "",
        page: 1,
        limit: 10,
        startTime: 0,
        endTime: 0,
        placeId: "",
      },
      
      // 映射字典
      limitTypeMap: {
        1: "白名单",
        2: "连锁限制",
        3: "无限制",
      },
      awardTypeMap: {
        1: "积分",
        2: "余额",
        3: "红包",
      },
      sendTypeMap: {
        1: "自动发放",
        2: "手动发放",
      },
      statusList: [
        { name: "全部", value: "" },
        { name: "已上线", value: 1 },
        { name: "草稿", value: 2 },
        { name: "下架", value: 3 },
      ],
      
      incomePlaceList: [],
      queryPlaceList: [],
      placeMap: {},

      popId: 1,
      tabList: [],
      
      // 贴柜活动表格配置
      tableConfig: [
        { label: "ID", key: "id" },
        { label: "渠道名称", key: "placeName" },
        { label: "活动图片", key: "imgs", width: "100px" },
        { label: "活动名称", key: "title" },
        { label: "状态", key: "status" },
        { label: "限制规则", key: "limit_type" },
        { label: "奖励类型", key: "award_type" },
        // { label: '行业限制', key: 'business_type' },
        // { label: '奖励类型', key: 'award_type' },
        // { label: '认证类型', key: 'auth_type' },
        { label: '活动限额(分)', key: 'limit_money' },
        { label: "打开奖励(分)", key: "money" },
        { label: "活动限额(分)", key: "limit_money" },
        { label: "门店上限(次)", key: "store_limit" },
        { label: "每日上限(次)", key: "daily_limit" },
        { label: "打卡距离(米)", key: "distance_limit" },
        { label: "最小间隔(秒)", key: "min_interval" },
        { label: "发放方式", key: "send_type" },
        { label: '活动日期', key: 'date' },
        { label: "更新时间", key: "time" },
      ],

      fileList: [],
      listLoading: false,
      popTitle: "",
      popParams: {},
      openLoading: false,
      rollType: 5,
    };
  },
  created() {
    this.rollType = this.$storage.get("PE_USER_INFO").type;
    if (this.rollType == 1) {
      this.getPlaceList();
    } else {
      // 如果不是超级管理员，移除渠道列
      // this.tableConfig = this.tableConfig.filter(item => item.key !== 'placeName');
      this.tableConfig.shift()
      this.tableConfig.shift()
    }
  },
  mounted() {
    this.getTabList();
  },
  components: { counterEdit, counterLog, counterBind,counterArea, counterTopic, counterJoin },
  methods: {
     showTopicClick(row, topicType) {
        this.popTitle = "【贴柜培训】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】打卡表单管理"
        this.popId = row.id
        this.topicType = topicType
        if (topicType == 1) {
          this.popTitle += "到店打卡表单管理"
        } else {
          this.popTitle += "离店打卡表单管理"
        }
        this.showType = 8
    },
    addClick() {
      this.popTitle = "添加【贴柜活动】";
      // 初始化默认参数，根据 Go 结构体字段
      this.popParams = {
        limit_type: 3,
        award_type: 1,
        send_type: 1,
        daily_limit: 1,
        min_interval: 0,
        distance_limit: 0,
        store_limit: 0,
        money: 0,
        limit_money: 0,
        receive_money: 0,
        limit_retail_type: 2,
        limit_business_type: 2,
        limit_clinic_type: 2,
      };
      this.fileList = [];
      this.showType = 2;
    },
    
    editClick(row) {
      this.popTitle = "编辑【贴柜培训】活动【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】" + row.title ;
      this.popParams = { ...row };

      this.popParams.start_date = row.start_date+""
        this.popParams.end_date = row.end_date+""
      // 处理图片回显
      this.fileList = [];
      this.popParams.imgs = row.imgs.split(',').filter(item => item.trim() !== '')
      this.showType = 2;
    },

    areaClick(row) {
      this.popTitle = "选择【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】地区"
      this.popId = row.id
      this.showType = 6
    },

    showLogClick(row) {
      this.popTitle = "【贴柜培训】活动【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】打卡记录";
      this.popId = row.id;
      this.popParams = { ...row }
      this.showType = 3;
    },

     showBindClick(row) {
      this.popTitle ="【贴柜培训】活动【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】关联活动列表";
      this.popId = row.id;
       this.popParams = { ...row }
      this.showType = 4;
    },


    statusClick(row, status, tip) {
      this.$confirm(`此操作将${tip}活动, 是否继续?`, "提示", {
        confirmButtonText: tip,
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.openLoading = true;
          // 假设 API 路径为 API.counterStatus，请根据实际后端接口调整
          this.$http
            .post(API.counterStatus, { id: row.id, status: status })
            .then((res) => {
              this.openLoading = false;
              if (res.code === 200) {
                this.getTabList();
                this.$message({ type: "success", message: "完成" });
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(() => {
               this.openLoading = false;
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消" });
        });
    },

    BackList() {
      this.showType = 1;
      this.getTabList();
    },

    getPlaceList() {
      this.$http.get(API.getAllPlace).then((res) => {
        if (res.code == 200) {
          let incomePlaceList = [{ value: -1, name: "未归属渠道" }];
          let queryPlaceList = [{ value: 0, name: "全部" }];
          let placeMap = {};

          res.data.forEach((el) => {
            incomePlaceList.push(el);
            queryPlaceList.push(el);
            placeMap[el.id] = el.name;
          });

          this.incomePlaceList = incomePlaceList;
          this.queryPlaceList = queryPlaceList;
          this.placeMap = placeMap;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    searchForm() {
      this.listQuery.page = 1;
      this.getTabList();
    },

    getTabList() {
      this.listLoading = true;
      // 假设 API 路径为 API.counterList，请根据实际后端接口调整
      this.$http
        .get(API.counterList, { ...this.listQuery })
        .then((res) => {
          this.listLoading = false;
          if (res.code == 200) {
            this.tabList = res.data.data;
            this.total = res.data.count;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    handleCurrentChange(page) {
      this.listQuery.page = page;
      this.getTabList();
    },
     getBusinessTypeText(row) {
      const types = [];
      // 使用 == 保持与原代码一致的类型比较行为，虽然推荐 ===，但此处为了最小化改动风险保留原意
      if (row.limit_retail_type == 1) {
        types.push('零售');
      }
      if (row.limit_business_type == 1) {
        types.push('商业');
      }
      if (row.limit_clinic_type == 1) {
        types.push('诊所');
      }
      return types.join('、');
    },

     getImg(row) {
      // console.log(row.imgs, "==getImg==", row.imgs.split(',').filter(item => item.trim() !== '')[0]);
       return row.imgs.split(',').filter(item => item.trim() !== '')[0] || '';
     },

    viewJoinClick(obj) {
       this.popTitle = "【贴柜培训】活动【" + (this.placeMap[obj.popParams.place_id] ? this.placeMap[obj.popParams.place_id] : '渠道') +
        "】【" + obj.title + "】【" + obj.popParams.name + "】参与人员";
      this.popParams = obj.popParams
      this.showType = 9
    },
  },
};
</script>

<style lang="scss">
.op-btn {
  margin-bottom: 5px !important;
}
.el-upload-list__item {
  transition: none !important;
}
.place-wrap {
  .flex-form {
    .el-form-item__content {
      display: flex !important;
    }
  }
}
</style>