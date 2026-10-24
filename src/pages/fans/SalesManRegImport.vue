<template>
    <div class="place-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right"  >
      <el-breadcrumb-item>店员导入</el-breadcrumb-item>
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
            <!-- <el-form-item label="连锁名称">
                <el-select v-model="listQuery.chainId" filterable remote reserve-keyword clearable placeholder="请输入连锁名称关键词"
                  :remote-method="queryCompanySearch" :loading="companyLoading">
                  <el-option v-for="item in companyOptions" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item> -->

                <el-form-item label="姓名">
                    <el-input
                        v-model="listQuery.name"
                        clearable
                        class="filter-item"
                        placeholder="请输入姓名"/>
                </el-form-item>
           
                <el-form-item label="手机号">
                    <el-input
                        v-model="listQuery.mobile"
                        clearable
                        class="filter-item"
                        placeholder="请输入手机号"/>
                </el-form-item>

                <el-form-item>
                <el-button
                    type="primary"
                    align="right"
                    @click="getList">
                    <i class="el-icon-search"/>
                    <span> 搜索</span>
                </el-button>

                <!-- <el-button
                type="success"
                class="op-btn"
                plain
                @click="addClick()"
            >
                添加
          </el-button> -->
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
            
            <span v-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>
            <span v-else-if="item.key=='time' ">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
            <span v-else-if="item.key == 'placeName'">
              {{ placeMap[scope.row['place_id']] ? placeMap[scope.row['place_id']] : '渠道' }}
            </span>
            <span v-else-if="item.key=='company_id_type'">
              {{ companyIdTypeMap[scope.row['company_id_type']] ? companyIdTypeMap[scope.row['company_id_type']] : '--' }}
          </span>
            
            <span v-else>{{ scope.row[item.key] }}</span>
        </template>
        </el-table-column>
        <!-- <el-table-column
            align="center"
            label="操作"
            fixed="right"
            :width="150"
        >
            <template slot-scope="{row}">
            
                <el-button
            type="primary"
            class="op-btn"
            plain
            size="mini"
            @click="editClick(row)"
          >
            编辑
          </el-button>
         
          
            </template>
        </el-table-column> -->
        </el-table>
        <el-pagination
        v-show="total>0"
        :total="total"
        :current-page.sync="listQuery.page"
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size.sync="listQuery.limit"
        layout="prev, pager, next, jumper, sizes, ->, total"
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

        <el-form-item label="选择渠道：" prop="place_id" v-if="rollType == 1">
        <el-select style="width: 300px;" v-model="importForm.place_id"  clearable filterable>
          <el-option v-for="item in incomePlaceList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
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

</template>
<script>


export default {
  props: {
    askId: Number,
    popTitle: String,
  },
  data() {
    return {
      formLabelWidth: '80px',

      total:0,
      tabList:[],
      tableConfig : [
        { label: '所属渠道', key: 'placeName' },
        { label: '用户名', key: 'name' },
        { label: '手机号', key: 'mobile' },
        { label: '用户身份', key: 'company_id_type' },

        { label: '所属企业', key: 'company_name' },
        { label: '企业二级部门', key: 'company_department_name' },
        { label: '意向区域', key: 'area' },

        { label: '更新时间', key: 'time' },
      ],


      listQuery: {
        mobile:'',
        name:'',
        page:1,
        limit:20,
      },

      showPopFlag: false,
      popPopTitle: '',
      popParams: {
      },
      loading: false,
      rules: {
      },
      showImportDialog:false,
      importFormSubmitLoading: false,
      fileList:[],

      importForm:{
        place_id:'',

      },

      rollType: 5,

      incomePlaceList: [],
      // placeList:[],
      queryPlaceList: [],

      placeMap: {},

      companyLoading: false,
      companyOptions: [],


      // 商业用户身份： 0-未知 1-业务代表 2-主管 3-经理 4-其他
      companyIdTypeMap: { 1:'业务代表', 2:'主管', 3:'经理', 4:'其他'},

    };
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType == 1) {
      this.getPlaceList()
    } else {
      this.tableConfig.shift()
    }
    this.getList()
   },
   components:{},
  methods: {

    queryCompanySearch(query) {
      this.companySearch(query)
    },

    companySearch(query) {
      if (query !== '') {
        if(type == 1) {
          this.companyLoading = true
        } else {
          this.addCompanyLoading = false
        }
        this.$http.get(API.getCompanyList + '?name=' + query).then(res => {
          if (res.code == 200) {
            this.companyLoading = false
            this.companyOptions = res.data
            this.$nextTick(() => {
              this.$refs.form.clearValidate()
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.companyOptions = []
      }
    },
    getPlaceList() {
      this.$http.get(API.getAllPlace).then(res => {
        if (res.code == 200) {
          // let js = {
          //   value:-1,name:'未归属渠道'
          // }
          // this.placeList = res.data

          let incomePlaceList = []

          let queryPlaceList = [{
            value: 0, name: '全部'
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


        handleCurrentChange(page){
      this.listQuery.page = page
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.$http.get(API.domain + "SalesManRegImportList", {...this.listQuery}).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          this.tabList = res.data.data
          this.total = res.data.count
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    
    batchImport() {
      this.importForm.place_id = ''
      this.showImportDialog = true
    },
    submitImportForm() {
      if (!this.importForm.place_id && this.rollType == 1) {
        return this.$message.warning('请选择归属渠道')
      }
      if (this.fileList.length === 0) {
        return this.$message.warning('请先选择要上传的文件');
      }

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
      formData.append('place_id', this.importForm.place_id)
      this.importFormSubmitLoading = true
      this.$http.post(API.domain + "SalesManRegImportImport", formData)
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

  },
}
</script>
<style lang='scss' scoped>
</style>
