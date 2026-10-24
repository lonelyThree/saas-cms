<template>
  <div class="place-wrap" v-if="showType == 1" >
    <el-page-header @back="backListClick" :content="contentPopTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
       <el-form ref="listQuery"
               :model="listQuery"
               class="form-container"
               inline>
        <el-form-item label="试卷名称">
          <el-input
            v-model="listQuery.name"
            clearable
            class="filter-item"
            placeholder="请输入试卷名称"/>
        </el-form-item>

        <el-form-item label="试卷状态">
          <el-select
            v-model="listQuery.status"
            clearable
            filterable
            placeholder="请选择试卷状态">
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
        <span v-if="item.key=='status'">{{ scope.row[item.key]==1? '上线':(scope.row[item.key]==2? '草稿':'下架')}}</span>
         <span v-else-if="item.key=='difficulty_type'">{{ scope.row[item.key]==1? '易':(scope.row[item.key]==2? '中':'难')}}</span>
        <span v-else-if="item.key=='money'">{{ scope.row['money']}}分</span>
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

           <!-- <el-button
              type="warning"
              class="op-btn"
              plain
              size="mini"
              v-if="row.status != 2"
              @click="showUserClick(row)"
            >
              人员统计
            </el-button> -->
         
  

          <el-button
            type="warning"
            class="op-btn"
            plain
            size="mini"
            @click="showTopicClick(row)"
            :loading="openLoading"
            v-if="row.status != 3"
          >
            问答管理
          </el-button>

          <el-button
            type="danger"
            class="op-btn"
            plain
            size="mini"
            @click="exportClick(row)"
            :loading="openLoading"
          >
            导出
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
   <questionEdit
           @backList="BackList"
           :popParams="subPopParams"
           :popTitle="subPopTitle"
            v-else-if="showType == 2" />
  <questionTopic
    @backList="BackList"
    :popParams="subPopParams"
    :popTitle="subPopTitle"
    v-else-if="showType == 3" />
  <questionJoin
           @backList="BackList"
           :popId = "popId"
           :openid="showOpenid"
            :popParams="popParams"
           :popTitle = "popTitle" v-else />
</template>
<script>

import questionEdit from "./questionEdit.vue";

import questionJoin from "./join.vue";

import questionTopic from "./topic.vue";

import vDialog from '../../../../components/Dialog/dialog.vue'
export default {
  props: {
    popTitle: String,
    popParams: Object,
  },
  data(){
    
    return {
      showType:1, // 1 列表  2 添加/编辑活动 3 产品管理 4 白名单管理 5 连锁管理 6 区域管理 7 参与人员管理 8 连锁管理
      total:0,
  
      listQuery: {
        placeId: '', //所属渠道
        courseId: '',
        name: '', //试卷名称
        status: '',//试卷状态  草稿 上架 下架
        page: 1,
        limit: 10,
      },

      statusList: [
        {name: '全部', value: ''},
        {name: '已上线', value: 1},
        {name: '草稿', value: 2},
        {name: '下架', value: 3},
      ],


      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id' },
        { label: '试卷名称', key: 'name' },
        { label: '试卷状态', key: 'status' },
        { label: '试卷奖励(分)', key: 'money' },
        { label: '达标次数', key: 'standard_num' },
        { label: '试卷难度', key: 'difficulty_type' },
        { label: '排序', key: 'sort' },
        { label: '更新时间', key: 'time' },
      ],
      
      listLoading:false,
      subPopTitle:'',
      subPopParams: {},

      rollType:5,
      contentPopTitle: '',
    }
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    this.contentPopTitle = this.popTitle + "试卷列表"

      this.listQuery.placeId = this.popParams.place_id
      this.listQuery.courseId = this.popParams.id
  },
  mounted(){
    // this.getPlaceList()
    this.getTabList();
  },
  components:{vDialog, questionEdit, questionJoin, questionTopic},
  methods:{

    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    addClick() {
        this.subPopTitle = "添加"+this.popTitle+"试卷"
        this.subPopParams = {
          difficulty_type:1,
          place_id:this.popParams.place_id,
          course_id:this.popParams.id

        }
        this.showType = 2
    },
    showUserClick(row) {
      this.subPopTitle = "【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】参与人员"
      this.subPopParams = row
      this.showType = 7
    },
    editClick(row) {
        this.subPopTitle = "编辑"+this.popTitle+"【"+row.name+"】"
        this.subPopParams = row
        this.showType = 2
    },
    showTopicClick(row) {
        this.subPopTitle = this.popTitle+"【"+row.name+"】"
        this.subPopParams = row
        this.showType = 3
    },

    exportClick(row) {
      this.$http.download(API.domain + 'CourseExamExport',{questionId: row.id, courseId:row.course_id, placeId:row.place_id}).then(res => {
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
      
    },
    statusClick(row, status, tip) {
      this.$confirm('此操作将'+tip+'试卷, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.courseQuestionStatus,{id:row.id, status:status}).then((res) => {
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
  
    searchForm(){
      this.listQuery.page = 1
      this.getTabList()
    },
    

    getTabList(){
    
      this.listLoading = true
      this.$http.get(API.courseQuestionList,{...this.listQuery}).then(res => {
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
