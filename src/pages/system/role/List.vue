<template>
  <div class="container role-container">
    <div class="table-box">
      <el-row
        type="flex"
        class="handle-row"
        v-if="false"
      >
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="medium"
          @click.native.prevent="handleCreate"
        >
          添加
        </el-button>
      </el-row>
      <el-table
        :data="list"
        border
        class="table"
        v-loading="loading"
        :style="{'width': '100%', 'margin-top': '15px'}"
      >
        <el-table-column
          v-for="(item, index) in tableConfig"
          :key="index"
          align="center"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <span v-if="item.key === 'deleteFlag'">
              {{ scope.row[item.key] == 1 ? '已禁用': '正常' }}
            </span>
            <span v-else>{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleEdit(scope.row)">
              编辑
            </el-link>
            <el-link v-if="scope.row.code !== 'admin' " type="primary" style="margin-left: 20px" @click="handleEditResource(scope.row.id)">
              分配权限
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogStatus === 'create' ? `添加角色` : `修改角色`"
      :visible.sync="showDialog"
      width="40%"
      @close="dialogClose"
    >
      <view-info
        ref="childInfo"
        :role-info="roleInfo"
        :show-dialog="showDialog"
        @closeDialog="closeDialog"
        @loadData="getList"
      />
    </el-dialog>
    <el-drawer
      class="edit-resource-drawer"
      title="权限分配"
      :visible.sync="showEditResource"
      direction="rtl"
      :before-close="handleClose"
    >
      <div class="drawer-body">
        <el-button
          class="btn-save"
          type="primary"
          plain
          size="mini"
          @click.native.prevent="handleSave"
        >
          保存
        </el-button>
        <el-scrollbar class="resource-tree-wrapper">
          <el-tree
            ref="resourceTree"
            :data="treeData"
            :props="defaultProps"
            node-key="value"
            show-checkbox
            :default-expanded-keys="checkedKeys"
          />
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import ViewInfo from './viewInfo.vue'

export default {
  components: { ViewInfo },
  data() {
    return {
      roleId: 0,
      roleInfo: {},
      dialogStatus: 'create',
      showDialog: false,
      showEditResource: false,
      loading: false,
      showResourceLoading: false,
      list: [],
      tableConfig: [
        { label: '角色名称', key: 'name' },
        { label: '角色编码', key: 'code' },
        { label: '状态', key: 'deleteFlag' }
      ],
      treeData: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    closeDialog() {
      this.showDialog = false
    },
    handleCreate() {
      this.showDialog = true
      this.dialogStatus = 'create'
      this.roleInfo = Object.assign({}, '')
    },

    handleEdit(row) {
      if (row.id) {
        this.$set(row, 'flag', row.deleteFlag)
        this.roleInfo = Object.assign({}, row)
      }
      this.dialogStatus = 'update'
      this.showDialog = true
    },
    searchForm() {
      this.searchParams.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      this.$http.get(API.getRoleList, this.searchParams).then(res => {
        this.loading = false
        const { status, data, count } = res
        if (status == 200) {
          this.list = data && Array.isArray(data) ? data: []
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    dialogClose() {
      this.$refs.childInfo.resetForm()
    },
    async handleEditResource(id) {
      this.roleId = id
      this.showEditResource = true
      // await this.loadAllResource()
      this.loadRoleResource(id)
    },
    loadAllResource() {
      this.$http.get(API.getAllList).then(res => {
        const { status, data } = res
        if (status == 200) {
          this.treeData = data && Array.isArray(data) ? data: []
        } else {
          this.$message.error(res.message)
        }
      })
    },
    findTreeArr(arr, newArr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].list.length === 0 && arr[i].checked) {
          newArr.push(arr[i].value)
        } else {
          if (arr[i].list && arr[i].list.length > 0) {
            this.findTreeArr(arr[i].list, newArr)
          }
        }
      }
      return newArr
    },
    loadRoleResource(id) {
      this.$http.get(API.getPermissionList, { roleId: id }).then(res => {
        const { status, data } = res
        if (status == 200 && data.trees && Array.isArray(data.trees)) {
          this.treeData = data.trees
          let newTrees = []
          newTrees = this.findTreeArr(data.trees, newTrees)
          this.$nextTick(() => {
            this.checkedKeys = newTrees
            this.$refs.resourceTree.setCheckedKeys(newTrees)
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleSave() {
      this.showResourceLoading = true
      let params = {
        roleId: this.roleId,
        permissionIdList: this.$refs.resourceTree.getCheckedKeys().concat(this.$refs.resourceTree.getHalfCheckedKeys())
      }
      this.$http.post(API.roleBindPermission, params).then(res => {
        const { status, data } = res
        if (status == 200) {
          this.showEditResource = false
          this.$message.success('权限保存成功')
            this.$refs.resourceTree.setCheckedKeys([])
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.showResourceLoading = false
      })
    },
    handleClose(done) {
      this.$confirm('此操作将关闭权限分配面板，是否保存权限?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(_ => {
          this.handleSave()
          done();
          this.$refs.resourceTree.setCheckedKeys([])
        })
        .catch(_ => {
          done();
          this.$refs.resourceTree.setCheckedKeys([])
        })
    }
  },
}
</script>
<style lang="scss">
.role-container{
  .el-drawer__header {
    margin-bottom: 20px;

    & > :first-child {
      outline: none;
      color: rgba(0, 0, 0, .85);
      font-size: 14px;
      line-height: 22px;
      font-weight: bold;
    }

    .el-drawer__close-btn {
      outline: none;
    }
  }

  .edit-resource-drawer {
    .el-drawer {
      min-width: 260px;
      max-width: 300px;
    }

    .resource-tree-wrapper {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
}

</style>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .table-box {
    padding-bottom: 20px;

    .eye-icon {
      cursor: pointer;
      font-size: 25px;
    }
  }

  .pagination {
    padding-bottom: 15px;
  }
  .edit-resource-drawer {
    .drawer-body {
      padding: 0 20px 20px 20px;

      .btn-save {
        margin-bottom: 10px;
      }
    }

    .resource-tree-wrapper {
      height: calc(100vh - 120px);
    }
  }

  .btn-edit-resource:focus {
    color: #1890ff;
    background: #e8f4ff;
    border-color: #a3d3ff;
  }

  .search-box {
    // margin-bottom: 20px;
    .search-btn {
      margin-left: 30px;
      margin-bottom: 22px;
    }
  }
}
</style>
