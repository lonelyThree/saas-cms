<template>
  <div class="place-wrap" v-if="showType == 1">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>连锁管理</el-breadcrumb-item>
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
            label="省份"
          >
           <el-select
                v-model="listQuery.province_id"
                clearable
                placeholder="请选择"
                filterable
              >
                <el-option
                  v-for="item in provinceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
          </el-form-item>

       <el-form-item
          label="连锁名称"
        >
          <el-input
            v-model="listQuery.name"
            clearable
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入连锁名称"
          />
        </el-form-item>
         <el-form-item
          label="连锁ID"
        >
          <el-input
            v-model="listQuery.chain_id"
            clearable
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入连锁ID"
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

          <el-button
                  type="success"
                  class="op-btn"
                  plain
                  @click="batchImport()"
              >
                  批量导入
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
            <span v-if="item.key=='province'">{{ codeToText[scope.row.province_id] ?codeToText[scope.row.province_id]:'--'}}</span>
          <span v-else-if="item.key=='update_at' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>
            <span v-else-if="item.key=='update_at'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
            <span v-else-if="item.key=='status'">{{ scope.row[item.key]==1? '启用':'禁用'}}</span>
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
                @click="statusClick(row, 2, '禁用')"
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

    <el-dialog
        width="900px"
        title="批量导入"
        :visible.sync="showImportDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeImportForm"
      >
        <el-form
          :model="importForm"
          ref="importForm"
          label-width="140px"
        >
          <el-form-item label="上传文件" prop="name">
            <el-upload
              ref="upload"
              action="#"
              accept="*.xls"
              :limit="1" 
              :multiple="false"
              :before-upload="beforeUpload"
              :auto-upload="false"
              :file-list="fileList"

              :on-exceed="handleExceed"
              :on-change="handleChange"
              :on-remove="handleRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeImportForm">取 消</el-button>
          <el-button
            type="primary"
            :loading="importFormSubmitLoading"
            @click="submitImportForm"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>
  </div>
  
      <placeEdit
               @backList="BackList"
               :popTitle="popTitle"
               :editPopParams="popParams"  v-else />
</template>
<script>
import placeEdit from "./modules/edit.vue";
import {  regionData, codeToText } from 'element-china-area-data';

export default {
  data(){
    return {
      record:false,
      recipe:false,
      provinceList:regionData,
      codeToText:codeToText,
      total:0,
      listQuery:{
          name:'',
          chain_id:'',
          province_id:'',
          page:1,
          limit:10,
        },
      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id' },
        { label: '省份id', key: 'province_id' },
        { label: '省份名称', key: 'province' },
        { label: '连锁名称', key: 'name' },
        { label: '更新时间', key: 'update_at' },
        { label: '活动状态', key: 'status' },
      ],
      
      fileList:[],
      listLoading:false,
      showDetailFlag:false,
      tempData: { secret: ''},
      poptitle:'',

      showType:1,

      openLoading:false,

      showImportDialog:false,
      importFormSubmitLoading: false,
      fileList:[],

      importForm:{

      }
      
    }
  },
  mounted(){
    this.getTabList();
  },
  components:{ placeEdit },
  methods:{
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '该连锁, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.chainStatus, { id: row.id, status: status }).then((res) => {
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
      this.$http.get(API.chainList,{...this.listQuery}).then(res => {

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
      this.popTitle = '编辑连锁'
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
      this.popTitle = '新增连锁'
      this.popParams = {
        id: 0,
        name: '',
        province_id: 11,
      }
      this.showType = 2
    },
     handleCurrentChange(page){
      this.listQuery.page = page
      this.getTabList()
    },

    batchImport() {
      this.showImportDialog = true
    },
    submitImportForm() {
       // 如果上传的文件列表是空的，给出提示
      if (this.fileList.length === 0) {
        return this.$message.warning('请先选择要上传的文件');
      }
      // 因为我们限制一次只上传1个文件，所以取数组里的第一个就可以了
      let file = this.fileList[0]
      // 获取到文件的后缀以便于判断文件类型
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      // 获取到文件的大小
      let size = file.size / 1024 / 1024;
      // 判断文件类型
      if (extension !== 'xlsx' && extension !== 'xls') {
        this.$message.warning('只能上传后缀是.xlsx或者.xls的文件');
        return
      }
      // 限制上传文件的大小
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M');
        return
      }

      var formData = new FormData()
      formData.append('file', this.fileList[0])
      this.importFormSubmitLoading = true
      this.$http.post(API.chainImport, formData)
        .then(res => {
          this.importFormSubmitLoading = false
          if (res.code === 200) {
            this.$message.success('导入成功')
            this.closeImportForm()
          } else {
            this.$message.error(res.msg)
          }
        })
    },

    closeImportForm() {
      this.showImportDialog = false
      this.$refs.importForm.resetFields()
      this.fileList = []
    },

    beforeUpload(file) {
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isText && !isTextComputer) {
        this.$message.warning('请上传excel格式文件！')
      }
      return isText || isTextComputer
    },

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      this.fileList.push(file.raw)
    },
    // 文件超出个数限制时的钩子
    handleExceed(file, fileList) {
      return this.$message.warning('一次只能上传一个文件哦~')
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.fileList = fileList
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
