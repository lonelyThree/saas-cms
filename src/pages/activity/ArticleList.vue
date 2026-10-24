<template>
  <div class="place-wrap" v-if="showType == 1" >
    <el-breadcrumb separator-class="el-icon-arrow-right"  >
      <el-breadcrumb-item>有奖分享管理</el-breadcrumb-item>
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
        <img width="60" :src="scope.row.thumb" alt="pic" v-if="item.key=='thumb'" />
        <img width="60" :src="scope.row.tip_img" alt="pic" v-else-if="item.key == 'tip_img'" />
          <img width="60" :src="scope.row.article_cover_url" alt="pic" v-else-if="item.key == 'article_cover_url'" />
        <span v-else-if="item.key == 'send_type'">{{ scope.row[item.key] == 1 ? '自动发放' :'手动发放' }}</span>
        <span v-else-if="item.key=='placeName'">
          {{placeMap[scope.row['place_id']]?placeMap[scope.row['place_id']]:'渠道'}}
        </span>
        <span v-else-if="item.key=='status'">{{ scope.row[item.key]==1? '上线':(scope.row[item.key]==2? '草稿':'下架')}}</span>
        <el-link type="primary" @click="userClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==1">用户</el-link>
         <el-link type="primary" @click="chainClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==2">连锁</el-link>
         <el-link type="primary" @click="areaClick(scope.row)" v-else-if="item.key == 'limit_type' && scope.row.limit_type == 3">地区</el-link>
        <span v-else-if="item.key=='limit_type'">无限制</span>
        <span v-else-if="item.key=='money'">{{ scope.row['money']}}分</span>
        <span v-else-if="item.key=='date'">{{ scope.row['start_date'] | date2Format}}到{{ scope.row['end_date']  | date2Format}}</span>
        <span v-else-if="item.key=='limit_money'">{{ scope.row.limit_money }} / {{  (scope.row.award_type != 1  || scope.row.receive_date == currentDate)? scope.row.receive_money :0 }}</span>
        
        <span v-else-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
            <span v-else-if="item.key == 'award_type'">{{ scope.row[item.key] == 2 ? '积分' :(scope.row[item.key] == 3 ? '星币' :'现金' )}}</span>
            <span v-else-if="item.key == 'auth_type'">{{ scope.row[item.key] == 2 ? '不需要'  :'需要' }}</span>
        <el-button
                      size="mini"
                      icon="el-icon-document-copy"
                      @click="handleCopy(scope.row.link, $event)"
                      v-else-if="item.key=='link'" 
                    >
                      复制
    </el-button>
     <el-button
                        size="mini"
                        icon="el-icon-document-copy"
                        @click="handleCopy(scope.row.article_url, $event)"
                        v-else-if="item.key == 'article_url'" 
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
              type="warning"
              class="op-btn"
              plain
              size="mini"
              v-if="row.status != 2"
              @click="showUserClick(row)"
            >
              人员统计
            </el-button>

            <el-button
              type="primary"
              class="op-btn"
              plain
              size="mini"
              v-if="row.status != 2"
              @click="showLogClick(row)"
            >
              分享记录
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
    <articleEdit
           @backList="BackList"
           :popParams="popParams"
           :popTitle="popTitle"
           :incomePlaceList="incomePlaceList"
           :fileList="fileList"
           :fileTipList="fileTipList"
            v-else-if="showType == 2" />
  <articleLog
    @backList="BackList"
    :popId= "popId"
    :popTitle="popTitle"
    :openid="showOpenid"
    v-else-if="showType == 3" />
  <articleArea
      @backList="BackList"
      :popId= "popId"
      :popTitle="popTitle"
      v-else-if="showType == 6" />
  <articleJoin
           @backList="BackList"
           @viewShowLogClick="viewShowLogClick"
           :popId = "popId"
           :openid="showOpenid"
            :popParams="popParams"
           :popTitle = "popTitle" v-else />
</template>
<script>
import clip from "../../assets/js/clipboard" // use clipboard directly

import articleEdit from "./modules/article/edit.vue";

import articleArea from "./modules/article/area.vue";

import articleJoin from "./modules/article/join.vue";

import articleLog from "./modules/article/log.vue";

import vDialog from './dialog.vue'
export default {
  data(){
    return {
      showType:1, // 1 列表  2 添加/编辑活动 3 记录管理 4 白名单管理 5 连锁管理 6 区域管理 7 参与人员管理 

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


      popId:1,


      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id' },
        { label: '渠道名称', key: 'placeName' },
        { label: '文章图片', key: 'thumb', width:'100px' },
        { label: '文章名称', key: 'title' },
        { label: '活动状态', key: 'status' },
        { label: '分享奖励(分)', key: 'share_money' },
        { label: '规则限制', key: 'limit_type' },

        { label: '奖励类型', key: 'award_type' },
        { label: '认证类型', key: 'auth_type' },
        // { label: '视频地址', key: 'article_url' },
        { label: '活动限额(分)', key: 'limit_money' },

        // { label: '提示图片', key: 'tip_img', width: '100px' },
        // { label: '视频封面', key: 'article_cover_url', width: '100px' },
        // { label: '参与人数', key: 'joinCnt' },
        { label: '活动日期', key: 'date' },

        { label: '活动地址', key: 'link' },
        { label: '更新时间', key: 'time' },
      ],
      
      fileList:[],
      fileTipList:[],
      listLoading:false,
      tempData: { secret: ''},
      poptitle:'',
      rules:{
        name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }, ],
        appid: [{ required: true, message: '请输入APPID', trigger: 'blur' }, ],
        place: [{ required: true, message: '请输入渠道号', trigger: 'blur' }, ],
        type: [{ required: true, message: '请选择渠道类型', trigger: 'change' }, ],
        check_store: [{ required: true, message: '请选择是否校验', trigger: 'change' }],
        scenario: [{ required: true, message: '请选择业务场景', trigger: 'change' }],
        // logo: [{ required: true, message: '请上传企业LOGO' }]
      },
      popParams:{
      },
      fileList:[],

      changeFlag:false,
      openLoading:false,

      currentDate:0,
      showOpenid:'',

      rollType:5,
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
  components:{vDialog, articleEdit, articleJoin, articleLog, articleArea},
  methods:{
    handleCopy(text, event) {
      clip(text, event)
    },

    userClick() {
      this.$message.info('暂不支持用户白名单编辑')
    },
    chainClick() {
      this.$message.info('暂不支持连锁白名单编辑')
    },

    delClick(){
        this.$message.info('暂不支持删除')
    },
    addClick() {
        this.popTitle = "添加【有奖分享】活动"
        this.popParams = {
          award_type:1
        }
        this.fileList=[]
        this.fileTipList = []
        this.showType = 2
    },
    showUserClick(row) {
      this.popTitle = "【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】参与人员"
      this.popId = row.id
      this.popParams = row
      this.showOpenid = ''
      this.showType = 7
    },
    areaClick(row) {
      this.popTitle = "选择【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】地区"
      this.popId = row.id
      this.showType = 6
    },
    editClick(row) {
        this.popTitle = "编辑【有奖分享】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】"
        this.popParams = row
        this.popParams.start_date = row.start_date+""
        this.popParams.end_date = row.end_date+""
        this.fileList=[]
        this.fileTipList = []
        this.fileList.push({'url':row.img})
        this.showType = 2
    },
    showLogClick(row) {
        this.popTitle = "【有奖分享】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】分享记录"
        this.popId = row.id
        this.showOpenid = ''
        this.showType = 3
    },

    viewShowLogClick(obj) {
      console.log(obj, "==viewShowLogClick==")
      this.popTitle = "【有奖分享】活动【"+(this.placeMap[obj.popParams.place_id]?this.placeMap[obj.popParams.place_id]:'渠道')+"】【"+obj.popParams.title+"】分享记录"
      this.popId = obj.popParams.id
      this.showOpenid = obj.openid
      this.showType = 3
    },    
    showQuestionClick(row) {
      this.askRankId = row.id
      this.askRankName = row.title
      this.placeName = this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道'
      this.showType = 3
      
    },
    statusClick(row, status, tip) {
      this.$confirm('此操作将'+tip+'活动, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.articleStatus,{id:row.id, status:status}).then((res) => {
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
      console.log("BackList", "BackList[[[]]]")
      this.showType = 1
      this.getTabList()
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
      this.$http.get(API.articleList,{...this.listQuery}).then(res => {
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
