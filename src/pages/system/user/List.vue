<template>
  <div class="container" v-if="showType == 1">
    <el-form
      class="search-box fs"
      ref="search"
      :model="searchParams"
      label-width="80px"
    >
      <el-form-item
        prop="email"
        label="邮箱"
        clearable
      >
        <el-input
          v-model="searchParams.email"
          clearable
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item label="渠道来源" prop="place_id">
        <el-select v-model="searchParams.place_id" clearable filterable placeholder="请选择">
          <el-option
            v-for="item in queryPlaceList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="searchParams.role" clearable filterable placeholder="请选择角色">
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-button class="search-btn" type="primary" @click="searchForm">
        查询
      </el-button>
      <el-button
        class="search-btn"
        type="primary"
        @click.native.prevent="handleCreate"
      >
        添加
      </el-button>
      <el-button
        class="search-btn"
        type="warning"
        @click.native.prevent="handleUserReset"
      >
        重置用户
      </el-button>
    </el-form>

    <div class="table-box">
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
            <span v-if="item.key=='placeName'">
            {{ placeMap[scope.row['place_id']] ? placeMap[scope.row['place_id']] : '渠道' }}
          </span>
          <span v-else-if="item.key == 'role'"> {{ roleMap[scope.row['type']] ? roleMap[scope.row['type']] : '未知角色' }}</span>
          <span v-else-if="item.key=='status'">{{ scope.row[item.key] == 1 ? '启用' :'禁用' }}</span>
           <span v-else-if="item.key == 'createTime' && scope.row.update_time">{{ scope.row.update_time * 1000, 3 | dateFormat }}</span>

           <span v-else-if="item.key == 'createTime'">{{ scope.row.create_time * 1000, 3 | dateFormat }}</span>
            <span v-else>{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
                  type="warning"
                  class="op-btn"  
                plain
                size="mini"
                :loading="openLoading"
                 @click="changePwd(scope.row)" style="margin-left: 20px">
              重置密码
            </el-button>

            <el-button
                type="primary"
                class="op-btn"  
              plain
              size="mini"
              :loading="openLoading"
              v-if="scope.row.type == 5" @click="showActivityList(scope.row)" >
              数据权限
            </el-button>

            <el-button
              type="danger"
              class="op-btn"
              plain
              size="mini"
              :loading="openLoading"
              @click="statusClick(scope.row, 2, '禁用')"
              v-if="scope.row.status == 1"
            >
              禁用
            </el-button>

            <el-button
              type="success"
              class="op-btn"
              plain
              size="mini"
              :loading="openLoading"
              @click="statusClick(scope.row, 1, '启用')"
              v-if="scope.row.status == 2"
            >
              启用
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParams.page"
        :page-sizes="[10, 20, 30]"
        :page-size="searchParams.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    

    <el-dialog
      title="修改密码"
      :visible.sync="pwdDialog"
      width="40%"
      @close="dialogClose"
    >
      <change-pwd
        :userInfo="userInfo"
        :pwd-dialog="pwdDialog"
        @closeDialog="closePwdDialog"
        @loadData="getList"
        @backList="BackList"
        popTitle="修改密码"
      />
    </el-dialog>

     <el-dialog
      title="重置用户"
      :visible.sync="userResetDialog"
      width="40%"
      @close="dialogClose"
    >
      <user-reset
        :pwd-dialog="userResetDialog"
        @closeDialog="closeUserResetDialog"
      />
    </el-dialog>
  </div>
  <ViewInfo
    @backList="BackList"
    :popTitle="popTitle"
    :placeList="incomePlaceList"
    :editPopParams="popParams"  v-else-if="showType == 2" />
  <ActivityList
      @backList="BackList"
      :popTitle="popTitle"
      :placeMap="placeMap"
      :placeId="placeId"
      :uid = "uid" v-else />
                   
</template>

<script>
import { tableConfig, roleList, roleMap } from './ConstConfig'
import ViewInfo from './viewInfo.vue'
import ChangePwd from './changePwd.vue'
import ActivityList from './activityList.vue'
import UserReset from './UserReset.vue'
export default {
  components: { ViewInfo, ChangePwd, ActivityList,UserReset },
  data() {
    return {
      userInfo: {},
      dialogStatus: 'create',
      roleList: roleList,
      roleMap: roleMap,
      showDialog: false,
      pwdDialog: false,
      userResetDialog: false,
      searchParams: {
        place_id: '',
        role: '',
        email: '',
        page: 1,
        limit: 10,
      },
      statusArr: [],
      loading: false,
      total: 0,
      list: [],
      copyList: [],
      chainList: [],
      tableConfig: tableConfig,

      incomePlaceList: [],
      // placeList:[],
      queryPlaceList: [],
      placeMap: {},

      showType: 1,
      popTitle:'',
      uid:0,

      openLoading:false,

      placeId:0,
    }
  },
  created() {
    this.getList()
    this.getPlaceList()
  },
  methods: {

    handleUserReset() {
      this.userResetDialog = true
    },
    closeUserResetDialog() {
      this.userResetDialog = false
    },
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '用户, 重新登录后生效, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.userStatus, { id: row.id, status: status }).then((res) => {
          if (res.code === 200) {
            this.openLoading = false
            this.getList();
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

    changeDate() {
      this.$forceUpdate()
    },
     BackList() {
      this.showType = 1
      this.getList()
    },

    closeDialog() {
      this.showDialog = false
    },
    closePwdDialog() {
      this.pwdDialog = false
    },
    handleCreate() {
      this.popTitle = '新增用户'
      this.popParams =  {
        id:0,
        password: '', // 密码
        confirmPassword: '',
        account: '', // 电子邮件
        type: '',
        place_id: '',
      }
      this.showType = 2
    },
    showActivityList(row) {
      this.popTitle = '【'+row.account+'】数据权限'
      this.uid = row.id
      this.placeId = row.place_id
      this.showType = 3
    },
    changePwd(row) {
      this.userInfo = row
      this.pwdDialog = true
      
    },
    handleEdit(row) {
      if (row.profileId) {
        this.userInfo = Object.assign({}, row)
      }
      this.dialogStatus = 'update'
      this.showDialog = true
    },
    searchForm() {
      this.searchParams.page = 1
      this.getList()
    },
    getPlaceList() {
      this.$http.get(API.getAllPlace).then(res => {
        if (res.code == 200) {
          // let js = {
          //   value:-1,name:'未归属渠道'
          // }
          // this.placeList = res.data

          let incomePlaceList = [{
            value: -1, name: '未归属渠道'
          }]

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

    getList() {
      this.loading = true
      this.$http.get(API.userList, this.searchParams).then(res => {
        this.loading = false
        const { code, msg } = res
        if (code == 200) {
          const { data, count } = res.data
          this.total = count || 0
          this.list = data && Array.isArray(data) ? data: []
          this.copyList = JSON.parse(JSON.stringify(this.list))
        } else {
          this.$message.error(msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.searchParams.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.searchParams.page = val
      this.getList()
    },
    dialogClose() {
      // this.$refs.childInfo.resetForm()
    },
    getDetail(row, i) {
      if (row.eyeOpen) {
        this.$set(row, 'eyeOpen', false)
        row.email = this.copyList[i].email
      } else {
        this.$http.post(API.getUserEmail, { id: row.profileId }).then(res => {
          if (res.status == 200) {
            this.$set(row, 'eyeOpen', true)
            row.email = res.data.email || ''
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
  },
}
</script>

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

  .search-box {
    // margin-bottom: 20px;
    .search-btn {
      margin-left: 30px;
      margin-bottom: 22px;
    }
  }
}
</style>
