<template>
  <div class="place-wrap" v-if="showType == 1" >
    <el-breadcrumb separator-class="el-icon-arrow-right"  >
      <el-breadcrumb-item>药企列表</el-breadcrumb-item>
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


        <el-form-item label="药企名称">
          <el-input
            v-model="listQuery.name"
            clearable
            class="filter-item"
            placeholder="请输入药企名称"/>
        </el-form-item>

        <el-form-item label="药企状态">
          <el-select
            v-model="listQuery.status"
            clearable
            filterable
            placeholder="请选择药企状态">
            <el-option v-for="item in statusList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value"/>
          </el-select>
        </el-form-item>

        
        


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
        <img width="60" :src="scope.row.logo" alt="logo" v-if="item.key=='logo'" />
        <img width="60" :src="scope.row.img" alt="img" v-else-if="item.key=='img'" />
        <span v-else-if="item.key=='placeName'">
          {{placeMap[scope.row['place_id']]?placeMap[scope.row['place_id']]:'渠道'}}
        </span>
        <span v-else-if="item.key=='status'">{{ scope.row[item.key]==1? '上架':(scope.row[item.key]==2? '下架':'弃用')}}</span>
         <span v-else-if="item.key=='type'">{{ scope.row[item.key]==1? '活动':'药企大学'}}</span>
           <el-button
                      size="mini"
                      icon="el-icon-document-copy"
                      @click="handleCopy(scope.row.url, $event)"
                      v-else-if="item.key=='url'" 
                    >
                      复制
    </el-button>
        <span v-else-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
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
              type="warning"
              class="op-btn"
              plain
              size="mini"
              @click="showActivityListClick(row)"
            >
              活动列表
            </el-button>
 
          <el-button
            type="danger"
            class="op-btn"
            plain
            size="mini"
            :loading="openLoading"
            @click="statusClick(row, 2, '下架')"
            v-if="row.status == 1 || row.status == 9"
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
            v-if="row.status == 2"
          >
            上架
          </el-button>

          <el-button
            type="warnging"
            class="op-btn"
            plain
            size="mini"
            :loading="openLoading"
            @click="statusClick(row, 9, '废弃')"
            v-if="row.status == 1 || row.status == 2"
          >
            废弃
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
    <companyActivityEdit
           @backList="BackList"
           :popParams="popParams"
           :popTitle="popTitle"
           :incomePlaceList="incomePlaceList"
           :fileList="fileList"
           :fileTipList="fileTipList"
            v-else-if="showType == 2" />
    <companyActivityActivity
           @backList="BackList"
           :popParams="popParams"
           :popTitle="popTitle"
           :incomePlaceList="incomePlaceList"
           v-else-if="showType == 3" />
    <companyActivityUniversity
           @backList="BackList"
           :popParams="popParams"
           :popTitle="popTitle"
           :incomePlaceList="incomePlaceList"
           v-else-if="showType == 4" />
</template>
<script>
import clip from "../../assets/js/clipboard" // use clipboard directly

import companyActivityEdit from "./modules/company_activity/edit.vue";
import companyActivityActivity from "./modules/company_activity/activity.vue";
import companyActivityUniversity from "./modules/company_activity/university.vue";

import vDialog from '../../components/Dialog/dialog.vue'
export default {
  data(){
    return {
      showType:1, // 1 列表  2 添加/编辑活动  3 活动列表 4 药企大学

      record:false,
      recipe:false,
      total:0,
      listQuery: {
        name: '', //药企名称
        status: '',//药企状态  删除 上架 下架
        page: 1,
        limit: 10,
        startTime: 0,
        endTime: 0,
        placeId: '', //所属渠道
      },

      statusList: [
        {name: '全部', value: ''},
        {name: '上架', value: 1},
        {name: '下架', value: 2},
        {name: '废弃', value: 9},
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
        { label: '药企名称', key: 'company_name' },
        { label: '活动名称', key: 'name' },
        { label: '列表图', key: 'img', width:'100px' },
        { label: '活动类型', key: 'type' },
        { label: '状态', key: 'status' },
        { label: '排序', key: 'sort' },
        { label: '活动地址', key: 'url' },
        { label: '更新时间', key: 'time' },
      ],
      
      fileList:[],
      fileTipList:[],
      listLoading:false,
      poptitle:'',
      popParams:{
      },
      fileList:[],

      openLoading:false,
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
  components:{vDialog, companyActivityEdit, companyActivityActivity, companyActivityUniversity},
  methods:{
    handleCopy(text, event) {
      clip(text, event)
    },

    addClick() {
        this.popTitle = "添加【药企活动】"
        this.popParams = {
          company_id:'',
        }
        this.fileList=[]
        this.fileTipList = []
        this.showType = 2
    },
    
    editClick(row) {
        this.popTitle = "编辑【药企活动】【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.name+"】"
        this.popParams = row
        this.fileList=[]
        this.fileTipList = []
        this.fileList.push({'url':row.img})
        this.showType = 2
    },
    showActivityListClick(row) {
      if (row.type == 2) {
        this.popTitle = "【药企活动】"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"【"+row.name+"】药企大学"
        this.popParams = row
        this.showType = 4
      } else {
        this.popTitle = "【药企活动】"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"【"+row.name+"】活动列表"
        this.popParams = row
        this.showType = 3
      }
        
    },
  
    statusClick(row, status, tip) {
      this.$confirm('此操作将'+tip+'药企活动, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.companyActivityStatus,{id:row.id, status:status}).then((res) => {
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
      this.listLoading = true
      this.$http.get(API.companyActivityList,{...this.listQuery}).then(res => {
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
