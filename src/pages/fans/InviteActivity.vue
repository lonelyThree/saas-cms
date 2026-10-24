<template>
  <div class="place-wrap" v-if="showType == 1" >
    <el-breadcrumb separator-class="el-icon-arrow-right"  >
      <el-breadcrumb-item>邀请活动管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
        <el-form ref="listQuery"
               :model="listQuery"
               class="form-container"
               inline>
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


        <el-form-item label="活动名称">
          <el-input
            v-model="listQuery.name"
            clearable
            class="filter-item"
            placeholder="请输入活动名称"/>
        </el-form-item>

        <el-form-item label="活动状态">
          <el-select
            v-model="listQuery.status"
            clearable
            filterable
            placeholder="请选择活动状态">
            <el-option v-for="item in statusList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value"/>
          </el-select>
        </el-form-item>

        
        

        <!-- <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="searchTime"
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item> -->


        <el-form-item>
          <el-button
            type="primary"
            align="right"
            @click="searchForm">
            <i class="el-icon-search"/>
            <span> 搜索</span>
          </el-button>
          <el-button
            @click="addClick"

            v-if="rollType == 1 || rollType == 2"
            type="primary">
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
        <el-image 
          style="width: 60px; height: 60px"
          :key="scope.row.qr_bg_img"
          :src="scope.row.qr_bg_img" 
          :preview-src-list="[scope.row.qr_bg_img]"
          v-if="item.key=='qr_bg_img'">
        </el-image>
        <el-image 
          style="width: 60px; height: 60px"
          :key="scope.row.tip_img"
          :src="scope.row.tip_img" 
          :preview-src-list="[scope.row.tip_img]"
          v-else-if="item.key == 'tip_img'">
        </el-image>
        <el-image 
          style="width: 60px; height: 60px"
          :key="scope.row.wx_work_qr_code"
          :src="scope.row.wx_work_qr_code" 
          :preview-src-list="[scope.row.wx_work_qr_code]"
          v-else-if="item.key == 'wx_work_qr_code'">
        </el-image>
        <span v-else-if="item.key=='placeName'">
          {{placeMap[scope.row['place_id']]?placeMap[scope.row['place_id']]:'渠道'}}
        </span>
        <span v-else-if="item.key=='status'">{{ scope.row[item.key]==1? '上线':(scope.row[item.key]==2? '草稿':'下架')}}</span>
        <!-- <el-link type="primary" @click="userClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==1">用户</el-link>
         <el-link type="primary" @click="chainClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==2">连锁</el-link>
         <el-link type="primary" @click="areaClick(scope.row)" v-else-if="item.key == 'limit_type' && scope.row.limit_type == 3">地区</el-link>
        <span v-else-if="item.key=='limit_type'">无限制</span> -->
         <span v-else-if="item.key=='limit_money'">{{ scope.row.limit_money }} / {{  (scope.row.award_type != 1  || scope.row.receive_date == currentDate)? scope.row.receive_money :0 }}</span>
        <span v-else-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
        <el-button
                      size="mini"
                      icon="el-icon-document-copy"
                      @click="handleCopy(scope.row.link, $event)"
                      v-else-if="item.key=='link'" 
                    >
                      复制
    </el-button>
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
            :loading="openLoading"
            v-if="rollType == 1 || rollType == 2"
            @click="editClick(row)"
          >
            编辑
          </el-button>
         

           <el-button
              type="warning"
              class="op-btn"
              plain
              size="mini"
              @click="showSalesManClick(row)"
            >
              业务员
            </el-button>
         
            <el-button
                type="primary"
                class="op-btn"
                plain
                size="mini"
                @click="showUserClick(row)"
                :loading="openLoading"
              >
                店员
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
  </div>
    <activityEdit
           @backList="BackList"
           :popParams="popParams"
           :popTitle="popTitle"
           :incomePlaceList="incomePlaceList"
           :fileList="fileList"
           :fileTipList="fileTipList"
            v-else-if="showType == 2" />
</template>
<script>
import clip from "../../assets/js/clipboard" // use clipboard directly


import activityEdit from "../fans/modules/InviteActivity/edit.vue"

export default {
  data(){
    return {
      showType:1, // 1 列表  2 添加/编辑活动 3 产品管理 4 白名单管理 5 连锁管理 6 区域管理 7 参与人员管理 8 连锁管理 9 小票管理 10 奖品管理 11 连锁红包

      record:false,
      recipe:false,
      total:0,
       pickerOptions0: {
        // disabledDate(time) {
        //   // return time.getTime() > new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        // }
      },
      searchTime:'',
      listQuery: {
        name: '', //活动名称
        status: '',//活动状态  草稿 上架 下架
        page: 1,
        limit: 10,
        startTime: 0,
        endTime: 0,
        placeId: '', //所属渠道
      },

      statusList: [
        {name: '全部', value: ''},
        {name: '已上线', value: 1},
        {name: '草稿', value: 2},
        {name: '下架', value: 3},
      ],
      incomePlaceList:[],
      // placeList:[],
      queryPlaceList:[],

      placeMap:{},


      aId:1,


      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id' },
        { label: '渠道名称', key: 'placeName' },
        { label: '活动名称', key: 'title' },
        { label: '海报背景图', key: 'qr_bg_img', width:'100px' },
        { label: '提示图片', key: 'tip_img', width: '100px' },
        { label: '活动状态', key: 'status' },
        { label: '注册奖励(分)', key: 'reg_money' },
        { label: '认证奖励(分)', key: 'auth_money' },
        { label: '分享奖励(分)', key: 'share_money' },
        { label: '业务员奖励(分)', key: 'sales_man_money' },
        { label: '活动地址', key: 'link' },
        { label: '企微好友码', key: 'wx_work_qr_code', width:'100px' },
        { label: '更新时间', key: 'time' },
      ],
      
      fileList:[],
      fileTipList:[],
      listLoading:false,
      showDetailFlag:false,
      poptitle:'',
      popParams:{
      },
      fileList:[],

      changeFlag:false,
      openLoading:false,

      currentDate:0,
      showOpenid:'',

      rollType:5,

      proId:0,

    }
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType == 1) {
      this.getPlaceList()
    } else {
      this.tableConfig.shift()
      this.tableConfig.shift()
    }
  },
  mounted(){
    // this.getPlaceList()
    this.getTabList();
  },
  components:{activityEdit},
  methods:{

    handleCopy(text, event) {
      clip(text, event)
    },

    addClick() {
        this.popTitle = "添加【推广邀请】活动"
        this.popParams = {
          status:2,
          guide_imgs:[],
          customer_cards:[],
        }
        this.fileList=[]
        this.fileTipList = []
        this.showType = 2
    },
    editClick(row) {
        this.popTitle = "编辑【推广邀请】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】"
        this.popParams = row
        this.popParams.guide_imgs = row.guide_imgs.trim(',').split(',')
        this.popParams.customer_cards = row.customer_cards.trim(',').split(',')
        this.showType = 2
    },

    showUserClick(row) {
      this.$router.push({ path: '/fans/list',  query:{activityId:row.id,activityName:row.title,placeId:row.place_id}})
    },

    showSalesManClick(row) {
      this.$router.push({ path: '/fans/salesManList',  query:{activityId:row.id,activityName:row.title,placeId:row.place_id}})
    },
    
    statusClick(row, status, tip) {
      this.$confirm('此操作将'+tip+'活动, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.inviteActivityStatus,{id:row.id, status:status}).then((res) => {
          if (res.code === 200) {
            this.openLoading = false
            this.getTabList();
            this.$message({
              type: 'success',
              message: '完成'
            })
          }else {
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
    BackList() {
      this.showType = 1
      this.getTabList()
    },
    editBackForm() {

    },
    getPlaceList(){
        this.$http.get(API.getAllPlace).then(res => {
        if (res.code == 200) {
          // let js = {
          //   value:-1,name:'未归属渠道'
          // }
          // this.placeList = res.data

          let incomePlaceList = [{
            value:-1,name:'未归属渠道'
          }]

          let queryPlaceList = [{
            value:0,name:'全部'
          }]

          let placeMap = {}

          res.data.forEach(el => {
            incomePlaceList.push(el)
            queryPlaceList.push(el)
            placeMap[el.id] = el.name
          });
          // let rs =  JSON.parse(JSON.stringify(res.data))
          // let query = JSON.parse(JSON.stringify(res.data))
          // rs.unshift(js)
          this.incomePlaceList = incomePlaceList

          // query.unshift({
          //   value:0,name:'全部'
          // })
          this.queryPlaceList = queryPlaceList
          this.placeMap = placeMap
          // console.log("queryPlaceList---", this.queryPlaceList)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    searchForm(){
      this.listQuery.page = 1
      this.getTabList()
    },

    getTabList(){
      let date = new Date()
      this.currentDate = date.getFullYear() * 10000 + (date.getMonth() + 1)*100 + date.getDate()
      if (this.searchTime && this.searchTime.length == 2) {
        this.listQuery.startTime = this.searchTime[0] / 1000
        this.listQuery.endTime = this.searchTime[1] / 1000 
      }
      this.listLoading = true
      this.$http.get(API.inviteActivityList,{...this.listQuery}).then(res => {
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
    
     handleCurrentChange(page){
      this.listQuery.page = page
      this.getTabList()
    },
  }
}
</script>
<style lang="scss">
  .op-btn {
    margin-bottom: 5px !important;
  }
  .el-upload-list__item {
      transition: none !important;
    }
  .cfd-div{
    background: #eaeaea; padding:10px; margin-top:10px;
    p{margin-bottom:5px;}
    ul{
      list-style: disc; margin-left:20px;
      li{ line-height: 26px; font-size:12px;}
    }
  }  
  .place-wrap{
    .flex-form{
       .el-form-item__content{display: flex !important;}
    }
   
  }
  
</style>
