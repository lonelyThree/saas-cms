<template>
  <div class="place-wrap" v-if="showType == 1">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
        <el-form
        ref="listQuery"
        :model="listQuery"
        class="form-container"
        inline
      >
       <el-form-item
          label="渠道名称"
        >
          <el-input
            v-model="listQuery.name"
            clearable
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入渠道名称"
          />
        </el-form-item>
         <el-form-item
          label="渠道号"
        >
          <el-input
            v-model="listQuery.place"
            clearable
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入渠道号"
          />
        </el-form-item>
        <el-form-item>
           <el-button
            type="primary"
            align="right"
            @click="searchForm"
          >
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>
          <el-button @click="add"  type="primary">
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
            <img width="60" :src="scope.row.logo" alt="logo" v-if="item.key == 'logo'" />
          <span v-else-if="item.key == 'update_at'">{{ scope.row['update_at'] * 1000, 3 | dateFormat }}</span>
            <span v-else>{{ scope.row[item.key] }}</span>
          </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        fixed="right"
        :width="150"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="showDetail(row)"
          >
            编辑
          </el-button>
          <el-button
                type="danger"
                class="op-btn"
                plain
                size="mini"
                :loading="openLoading"
                @click="statusClick(row, 3, '禁用')"
                v-if="row.status == 1"
              >
                禁用
              </el-button>

              <el-button
                type="success"
                class="op-btn"
                plain
                size="mini"
                :loading="openLoading"
                @click="statusClick(row, 1, '启用')"
                v-if="row.status != 1"
              >
                启用
              </el-button>
         
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :page-sizes="[10]"
      limit.sync="10"
      @current-change="handleCurrentChange"
    />
  </div>
      <placeEdit
               @backList="BackList"
               :popTitle="popTitle"
               :editPopParams="popParams"  v-else />
</template>
<script>
import placeEdit from "./modules/edit.vue";

export default {
  data(){
    return {
      record:false,
      recipe:false,
      total:0,
      listQuery:{
          name:'',
          place:'',
          page:1,
          limit:10,
        },
      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id' },
        { label: 'logo', key: 'logo' },
        { label: '渠道名称', key: 'name' },
        { label: 'APPID', key: 'appid' },
        { label: '渠道号', key: 'place' },
        { label: '更新时间', key: 'update_at' },
      ],
      
      fileList:[],
      listLoading:false,
      showDetailFlag:false,
      tempData: { secret: ''},
      poptitle:'',

      showType:1,

      openLoading:false,
      
    }
  },
  mounted(){
    this.getTabList();
  },
  components:{ placeEdit },
  methods:{
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '该渠道, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.placeStatus, { id: row.id, status: status }).then((res) => {
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
      this.$http.get(API.placeList,{...this.listQuery}).then(res => {

        this.listLoading = false
        if (res.code == 200) {
          this.tabList = res.data.data
          this.total = res.data.count
        } else {
          this.$message.error(res.message)
        }
      })
    },
    showDetail(row){
      this.popTitle = '编辑渠道'
      this.popParams = row
      this.showType = 2
    },
    delDetail(row){
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$http.post(API.delPlace,{id:row.id}).then(res => {
            if (res.status == 200) {
               this.$message.success('删除成功！')
               this.getTabList();
            } else {
              this.$message.error(res.msg)
            }
          })
        })
    },
    add(){
      this.popTitle = '新增渠道'
      this.popParams = {
        id: 0,
        name: '',
        appid: '',
        place: 0,
        logo: '',
      }
      this.showType = 2
    },
     handleCurrentChange(page){
      this.listQuery.page = page
      this.getTabList()
    },
  }
}
</script>
<style lang="scss">
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
