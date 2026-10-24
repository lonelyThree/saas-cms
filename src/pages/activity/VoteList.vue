<template>
  <div class="place-wrap" v-if="showType == 1" >
    <el-breadcrumb separator-class="el-icon-arrow-right"  >
      <el-breadcrumb-item>投票活动管理</el-breadcrumb-item>
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


        <el-form-item label="名称">
          <el-input
            v-model="listQuery.name"
            clearable
            class="filter-item"
            placeholder="请输入名称"/>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="listQuery.status"
            clearable
            filterable
            placeholder="请选择状态">
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
        <img width="60" :src="scope.row.imgs[0]" alt="pic" v-if="item.key=='thumb'" />
        <img width="60" :src="scope.row.tip_img" alt="pic" v-else-if="item.key == 'tip_img'" />
          <img width="60" :src="scope.row.vote_cover_url" alt="pic" v-else-if="item.key == 'vote_cover_url'" />
        <span v-else-if="item.key == 'vote_type'">{{typeMap[scope.row['vote_type']]?typeMap[scope.row['vote_type']]:'--'}}</span>
        <span v-else-if="item.key=='placeName'">
          {{placeMap[scope.row['place_id']]?placeMap[scope.row['place_id']]:'渠道'}}
        </span>
        <span v-else-if="item.key=='status'">{{ scope.row[item.key]==1? '上线':(scope.row[item.key]==2? '草稿':'下架')}}</span>
        <el-link type="primary" @click="userClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==1">用户</el-link>
         <el-link type="primary" @click="chainClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==2">连锁</el-link>
         <el-link type="primary" @click="areaClick(scope.row)" v-else-if="item.key == 'limit_type' && scope.row.limit_type == 3">地区</el-link>
        <span v-else-if="item.key=='limit_type'">无限制</span>
        <span v-else-if="item.key=='money'">{{ scope.row['money']}}分</span>
        <span v-else-if="item.key=='date'">{{ scope.row['start_time'] | filter2dateHi}}到{{ scope.row['end_time']  | filter2dateHi}}</span>
        <span v-else-if="item.key=='vote_date'">{{ scope.row['vote_start_time'] | filter2dateHi}}到{{ scope.row['vote_end_time']  | filter2dateHi}}</span>
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
                        @click="handleCopy(scope.row.vote_url, $event)"
                        v-else-if="item.key == 'vote_url'" 
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
              type="primary"
              class="op-btn"
              plain
              size="mini"
              @click="showUserClick(row)"
            >
              报名记录
            </el-button>

            <el-button
            type="warning"
            class="op-btn"
            plain
            size="mini"
            @click="showTopicClick(row, 1)"
            :loading="openLoading"
          >
            报名表单
          </el-button>

          <el-button
            type="warning"
            class="op-btn"
            plain
            size="mini"
            @click="showTopicClick(row, 2)"
            :loading="openLoading"
            v-if="row.topic_type == 1"
          >
            问卷表单
          </el-button>
           <el-button
            type="success"
            class="op-btn"
            plain
            size="mini"
            @click="showAwardClick(row)"
            :loading="openLoading"
          >
            奖品管理
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
    <voteEdit
           @backList="BackList"
           :popParams="popParams"
           :popTitle="popTitle"
           :incomePlaceList="incomePlaceList"
           :fileList="fileList"
           :fileTipList="fileTipList"
            v-else-if="showType == 2" />
  <voteLog
    @backList="BackList"
    :popId= "popId"
    :popTitle="popTitle"
    :openid="showOpenid"
    v-else-if="showType == 3" />
  <voteArea
      @backList="BackList"
      :popId= "popId"
      :popTitle="popTitle"
      v-else-if="showType == 6" />
  <voteTopic
    @backList="BackList"
    :popId= "popId"
    :topicType = "topicType"
    :popTitle="popTitle"
    v-else-if="showType == 8" />
  <voteAward
    @backList="BackList"
    :popId= "popId"
    :topicType = "topicType"
    :popTitle="popTitle"
    v-else-if="showType == 9" />
  <voteJoin
           @backList="BackList"
           @viewShowLogClick="viewShowLogClick"
           :popId = "popId"
           :openid="showOpenid"
            :popParams="popParams"
           :popTitle = "popTitle" v-else />
</template>
<script>
import clip from "../../assets/js/clipboard" // use clipboard directly

import voteEdit from "./modules/vote/edit.vue";

import voteArea from "./modules/vote/area.vue";

import voteJoin from "./modules/vote/join.vue";

import voteLog from "./modules/vote/log.vue";

import voteTopic from "./modules/vote/topic.vue";


import voteAward from "./modules/vote/award.vue";

import vDialog from './dialog.vue'
export default {
  data(){
    return {
      showType:1, // 1 列表  2 添加/编辑活动 3 记录管理 4 白名单管理 5 连锁管理 6 区域管理 7 参与人员管理  8 表单管理 9 奖品管理

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

      typeMap : {
        1: '投票模式',
        2: '审核模式',
        3: '案例征集',
        4: '评委打分'
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


      popId: 1,
      topicType: 1,


      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id' },
        { label: '渠道名称', key: 'placeName' },
        { label: '轮播图', key: 'thumb', width:'100px' },
        { label: '名称', key: 'title' },
        { label: '状态', key: 'status' },
        { label: '活动类型', key: 'vote_type' },
        { label: '规则限制', key: 'limit_type' },

        // { label: '奖励类型', key: 'award_type' },
        { label: '认证类型', key: 'auth_type' },
        // { label: '视频地址', key: 'vote_url' },
        // { label: '活动限额(分)', key: 'limit_money' },

        // { label: '提示图片', key: 'tip_img', width: '100px' },
        // { label: '视频封面', key: 'vote_cover_url', width: '100px' },
        // { label: '参与人数', key: 'joinCnt' },
        { label: '报名日期', key: 'date' },
        { label: '投票日期', key: 'vote_date' },

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
  components:{vDialog, voteEdit, voteJoin, voteLog, voteArea, voteTopic, voteAward},
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
        this.popTitle = "添加【投票活动】活动"
        this.popParams = {
          auth_type: 1,
          vote_type: 1,
          sort_type: 1,
          limit_type: 3,
          number_type: 2,
          rank_type: 2,
          topic_type: 1,
          pass_type: 2,
          theme_color: '#FF814D',
          font_color: '#333333',
          btn_name: '我要报名',

        }
        this.fileList=[]
        this.showType = 2
    },
    showUserClick(row) {
      this.popTitle = "【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】报名记录"
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
        this.popTitle = "编辑【投票活动】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】"
        this.popParams = row
        this.popParams.start_date = row.start_date+""
        this.popParams.end_date = row.end_date+""
        this.fileList=[]
        this.fileTipList = []
        for (let i = 0; i <  row.imgs.length; i++) {
          this.fileList.push({'url':row.imgs[i]})
        }
        this.showType = 2
    },
    showLogClick(row) {
        this.popTitle = "【投票活动】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】分享记录"
        this.popId = row.id
        this.showOpenid = ''
        this.showType = 3
    },

    showTopicClick(row, topicType) {
        this.popTitle = "【投票活动】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】"
        if (topicType == 1) {
          this.popTitle += "报名表单管理"
        } else {
          this.popTitle += "问卷表单管理"
        }
        this.popId = row.id
        this.topicType = topicType
        this.showType = 8
    },

    showAwardClick(row) {
        this.popTitle = "【投票活动】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】奖品管理"
        this.popId = row.id
        this.showType = 9
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

        this.$http.post(API.voteStatus,{id:row.id, status:status}).then((res) => {
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
      this.$http.get(API.voteList,{...this.listQuery}).then(res => {
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
