<template>
  <div>
    <el-page-header @back="backListClick" :content="popTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" :model="listQuery" class="form-container" inline>


          <el-form-item label="部门名称">
            <el-input v-model="listQuery.name" clearable class="filter-item" placeholder="请输入部门名称" />
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
          <el-form-item>
          <el-button type="primary" align="right" @click="searchForm">
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>
           <el-button @click="add"  type="primary">
            添加
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-divider></el-divider>
    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row
      :style="{ 'width': '100%', 'margin-top': '15px' }">
      <el-table-column v-for="(item, index) in tableConfig" :key="index" align="center" :label="item.label"
        :width="item.width" :prop="item.key">
        <template slot-scope="scope">
          <span v-if="item.key == 'status'">{{ scope.row[item.key] == 1 ? '启用' : '禁用' }}</span>
          <span v-else>{{ scope.row[item.key] }}</span>

        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" :width="150">
        <template slot-scope="{row}">

          <el-button type="primary" class="op-btn" plain size="mini" @click="editClick(row)">
            编辑
          </el-button>
          <el-button type="danger" class="op-btn" plain size="mini" :loading="openLoading"
            @click="statusClick(row, 2, '禁用')" v-if="row.status == 1">
            禁用
          </el-button>

          <el-button type="primary" class="op-btn" plain size="mini" :loading="openLoading"
            @click="statusClick(row, 1, '启用')" v-if="row.status == 2">
            启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :page-sizes="[10]" limit.sync="10"
      @current-change="handleCurrentChange" />

  
    <el-dialog :visible.sync="showEditPopFlag" :title="popPopTitle" width="50%">
      <el-form :model="popPopParams" :rules="editRules" ref="editForm" label-width="100px">

  
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="popPopParams.name" style="width:300px" placeholder="请输入部门名称"></el-input>
        </el-form-item>


        <el-form-item label="">
          <el-button @click="submitEditForm('editForm')" type="primary" :loading="editLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>
<script>
export default {
  props: {
    popParams: Object,
    popTitle:String,
  },
  data() {
    return {
      total: 0,
      listQuery: {
        placeId: '',
        name: '',
        status: 0,
        page: 1,
        limit: 10,
      },
      listLoading: false,
      tabList: [],
      tableConfig: [
        { label: '部门名称', key: 'name' },
        { label: '状态', key: 'status' },
      ],
      
      total: 0,

      rollType: 5,

      incomePlaceList: [],
      // placeList:[],
      queryPlaceList: [],

      placeMap: {},

      statusList: [
        {name: '全部', value: 0},
        {name: '启用', value: 1},
        {name: '禁用', value: 2},
      ],

      showEditPopFlag: false,
      popPopTitle: '添加部门',

      popPopParams:{
        name: '',
        id: 0,
        place_id: '',
        business_id: '',
      },

      editRules: {
          name: [
            { required: true, message: '请先输入部门名称', trigger: 'change' }
          ],
      },
      editLoading:false,
      openLoading:false,
    }
  },
  created() {
  },
  mounted() {
    this.getTabList();
  },
  methods: {
    backListClick() {
      this.$emit('backList', this.ruleForm)
    },
    add() {
      this.popPopParams = {
        name: '',
        place_id: '',
        id: 0,
      }
      this.popPopTitle = '添加部门'
      this.showEditPopFlag = true
    },
    submitEditForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          this.editLoading = true
          this.popPopParams.business_id = this.popParams.id
          this.popPopParams.place_id = this.popParams.place_id
          this.$http.post(API. userBusinessDepartmentSave, this.popPopParams).then(res => {

            if (res.code === 200) {
              this.$message.success('保存成功')
              setTimeout(() => {
                this.showEditPopFlag = false
                this.getTabList()
              }, 1000);
            } else {
              this.$message.error(res.msg ? res.msg : '保存失败')
            }
            this.editLoading = false
          })
            .catch(error => {
              this.$message.error('请求失败')
              this.editLoading = false

            });
        } else {
          for (var i in object) {
            this.$message.error(object[i][0].message)
            return false
          }
          return false;
        }
      });
      
      // console.log("submitEditForm", this.popPopParams, this.selStoreEditOptions)
    },
    editClick(item) {
      this.popPopParams = item
      this.popPopTitle = '编辑部门【' + item.name + '】'
      this.showEditPopFlag = true

    },
  
   
    searchForm() {
      this.listQuery.page = 1
      this.getTabList()
    },
    getTabList() {
     
      this.listLoading = true
      this.listQuery.business_id = this.popParams.id
      this.$http.get(API. userBusinessDepartmentCmsList, { ...this.listQuery }).then(res => {
        if (res.code == 200) {
          this.tabList = res.data.data
          this.total = res.data.count
        } else {
          this.$message.error(res.msg)
        }
      })
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getTabList()
    },
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '部门, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API. userBusinessDepartmentStatus, { id: row.id, status: status }).then((res) => {
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
  }
}
</script>
