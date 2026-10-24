<template>
  <div class="place-wrap" v-if="showType == 1" >
    <el-breadcrumb separator-class="el-icon-arrow-right"  >
      <el-breadcrumb-item>快问快答管理</el-breadcrumb-item>
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
        </el-form-item>-->


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
        <img width="60" :src="scope.row.start_bg" alt="pic" v-if="item.key=='startBg'" />
        <span v-else-if="item.key=='placeName'">
          {{placeMap[scope.row['place_id']]?placeMap[scope.row['place_id']]:'渠道'}}
        </span>
        <span v-else-if="item.key=='status'">{{ scope.row[item.key]==1? '上线':(scope.row[item.key]==2? '草稿':'下架')}}</span>
        <span v-else-if="item.key == 'auth_type'">{{ scope.row[item.key] == 2 ? '不需要'  :'需要' }}</span>
        <span v-else-if="item.key=='day'">{{ scope.row['day_cnt']}}/{{ scope.row['day_num']}}</span>
        <span v-else-if="item.key=='start_time'">{{ scope.row['start_time'] * 1000, 1 | dateFormat}}</span>

        <span v-else-if="item.key=='end_time'">{{ scope.row['end_time'] * 1000, 1 | dateFormat}}</span>
         <el-button
                        size="mini"
                        icon="el-icon-document-copy"
                        @click="handleCopy(scope.row.link, $event)"
                        v-else-if="item.key == 'link'" 
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
              @click="editClick(row)"
              v-if="rollType == 1 || rollType == 2"
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
              v-if="row.status == 2"
            >
              上架
            </el-button>
         
          <el-button
            type="warning"
            class="op-btn"
            plain
            size="mini"
            @click="showRanksClick(row)"
          >
            排行榜
          </el-button>


          <el-button
            type="success"
            class="op-btn"
            plain
            size="mini"
            @click="showQuestionClick(row)"
          >
            问题管理
          </el-button>

          <el-button
            type="primary"
            class="op-btn"
            plain
            size="mini"
            @click="showAwardsClick(row)"
          >
            奖品管理
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
  <quickEdit
           @backList="BackList"
           :popTitle="popTitle"
           :popParams="popParams"
           :incomePlaceList="incomePlaceList"
           :loading="editBtnLoding"  v-else-if="showType == 2" />
  <quickQuestion
    @backList="BackList"
    :askId = "askRankId"
    :popTitle="popTitle"
    :placeName="placeName" v-else-if="showType == 3" />
  <quickAward
    @backList="BackList"
    :popTitle="popTitle"
    :askId = "askRankId" v-else-if="showType == 4" />
  <quickRank
           @backList="BackList"

           :popTitle="popTitle"
           :askId = "askRankId"
           :askName = "askRankName"
           :placeName="placeName" v-else />
</template>
<script>
import clip from "../../assets/js/clipboard" // use clipboard directly

import quickEdit from "./modules/quick/edit.vue";
import quickRank from "./modules/quick/rank.vue";

import quickAward from "./modules/quick/award.vue";
import quickQuestion from "./modules/quick/question.vue";

import { dateFormat } from "../../assets/js/filters";

import vDialog from './dialog.vue'
export default {
  data(){
    return {
      showType:1, // 1 列表  2 编辑  3 问题管理 4 奖品管理  5 排行榜

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
        page: 0,
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

      editPopParams:{},
      editBtnLoding:false,


      askRankId:1,
      askRankName:'赢大奖',
      placeName:'医家良方',


      tabList:[],
      tableConfig : [
        { label: '渠道名称', key: 'placeName' },
        { label: '活动背景', key: 'startBg' },
        { label: '活动名称', key: 'title' },
        { label: '认证类型', key: 'auth_type' },
        { label: '活动状态', key: 'status' },
        { label: '每天数/天数', key: 'day' },
        { label: '排行榜人数', key: 'rank_cnt' },
        { label: '超时时间', key: 'timeout' },
        // { label: '参与人数', key: 'joinCnt' },
        { label: '开始日期', key: 'start_time' },
        { label: '结束日期', key: 'end_time' },
        { label: '活动地址', key: 'link', width:'100px' },
      ],
      
      fileList:[],
      listLoading:false,
      showDetailFlag:false,
      poptitle:'',
      popParams:{
        id:'',
        name:'',
        appid:'',
        place:'',
        type:'',
        check_store:'',
        scenario:'',
        logo:'',
        file:'',
        ip:'',
        sce_url:'',//一键购药跳转地址
        recipe_url:'',//处方回调url
        record_url:''//问诊记录回调url
      },
      changeFlag:false,

      poptitle: '',

      openLoading:false,

      rollType:5,

      popTitle:'',
    }
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType == 1 ) {
      this.getPlaceList()
    } else {
      this.tableConfig.shift()
    }
  },
  mounted(){
    // this.getPlaceList()
    this.getTabList();
  },
  components:{vDialog, quickEdit,quickRank, quickAward, quickQuestion},
  methods:{
    handleCopy(text, event) {
      clip(text, event)
    },
    delClick(){
        this.$message.info('暂不支持删除')
    },
    editClick(row) {
      this.popTitle = "编辑【快问快答】活动【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】"
      this.popParams = row
      this.popParams.start_date = dateFormat(row.start_time * 1000, 1)
      this.popParams.end_date = dateFormat(row.end_time * 1000, 1)
      this.showType = 2
      // console.log(this.popParams, "this.popParams====")
    },
    addClick() {
      this.popTitle = "添加【快问快答】活动"
      this.popParams = {status:2}
      this.showType = 2
    },
    showRanksClick(row) {
      this.askRankId = row.id
      this.askRankName = row.title
      this.placeName = this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道'
      this.popTitle = "【快问快答】活动【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】排行榜"
      this.showType = 5
      
    },
    showAwardsClick(row) {
      this.askRankId = row.id
      this.popTitle = "【快问快答】活动【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】奖品管理"
      this.showType = 4
      
    },
    showQuestionClick(row) {
      this.askRankId = row.id
      this.popTitle = "【快问快答】活动【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】问题管理"
      this.showType = 3
      
    },
    BackList() {
      this.showType = 1
      this.getTabList()
    },
    editSubmitForm() {

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
    submitForm(formName) {
        this.changeFlag =true;
        this.$refs[formName].validate((valid) => {
          if (valid && this.popParams.logo) {
               this.$http.post(API.addPlace,{...this.popParams}).then((res) => {
                  if (res.code === 200) {
                    this.showDetailFlag = false;
                    this.getTabList();
                    this.$message({
                      type: 'success',
                      message: '完成！'
                    })
                  }else {
                    this.$message.error(res.msg)
                  }
                })
          } else {
            return false;
          }
        });
      },
    searchForm(){
       this.listQuery.page = 1
      this.getTabList()
    },
    

    getTabList(){
      if (this.searchTime && this.searchTime.length == 2) {
        this.listQuery.startTime = this.searchTime[0] / 1000
        this.listQuery.endTime = this.searchTime[1] / 1000 
      }
      this.listLoading = true
      this.$http.get(API.quickList,{...this.listQuery}).then(res => {

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

    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '快问快答活动, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.quickStatus, { id: row.id, status: status }).then((res) => {
          if (res.code === 200) {
            this.openLoading = false
            this.getTabList();
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
    
     handleCurrentChange(page){
      this.listQuery.page = page
      this.getTabList()
    },
  }
}
</script>
<style lang="scss">
  .op-btn {
    margin-bottom: 5px  !important;
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
