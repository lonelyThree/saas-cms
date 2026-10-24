<template>
  <div class="place-wrap" v-if="showType == 1" >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item> 商业公司管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" :model="listQuery" class="form-container" inline>
        <el-form-item
              label="所属渠道"
              v-if="rollType == 1"
            >
             <el-select
                  v-model="listQuery.place_id"
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

          <el-form-item label="公司名称">
            <el-input v-model="listQuery.name" clearable class="filter-item" placeholder="请输入公司名称" />
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
          <span v-if="item.key == 'place_id'">
            {{ placeMap[scope.row['place_id']] ? placeMap[scope.row['place_id']] : '渠道' }}
          </span>
          <span v-else-if="item.key == 'status'">{{ scope.row[item.key] == 1 ? '启用' : '禁用' }}</span>
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


           <el-button type="warning" class="op-btn" plain size="mini" @click="subListClick(row)">
            部门列表
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :page-sizes="[10]" limit.sync="10"
      @current-change="handleCurrentChange" />

  
    <el-dialog :visible.sync="showEditPopFlag" :title="popTitle" width="50%">
      <el-form :model="popParams" :rules="editRules" ref="editForm" label-width="100px">

        <el-form-item
              label="所属渠道"
              v-if="rollType == 1"
            >
             <el-select
                  v-model="popParams.place_id"
                  clearable
                  placeholder="请选择"
                  filterable
                  :disabled="popParams.id > 0"
                >
                  <el-option
                    v-for="item in queryPlaceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
            </el-form-item>
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="popParams.name" style="width:300px" placeholder="请输入公司名称"></el-input>
        </el-form-item>


        <el-form-item label="">
          <el-button @click="submitEditForm('editForm')" type="primary" :loading="editLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  <businessSubList
           @backList="BackList"
           :popParams="popParams"
           :popTitle="popTitle"
            v-else-if="showType == 2" />
</template>
<script>
import businessSubList from "../fans/modules/user/businessSubList"
export default {
  components:{businessSubList},
    data() {
    return {
      showType: 1,
      total: 0,
      listQuery: {
        place_id: '',
        name: '',
        status: 0,
        page: 1,
        limit: 10,
      },
      listLoading: false,
      tabList: [],
      tableConfig: [
        { label: '所属渠道', key: 'place_id' },
        { label: '公司名称', key: 'name' },
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
      popTitle: '添加公司',

      popParams:{
        name: '',
        id: 0,
        place_id: '',
      },

      editRules: {
        place_id: [
          { required: true,message: '请选择渠道',trigger: 'change' }
        ],
          name: [
            { required: true, message: '请先输入公司名称', trigger: 'change' }
          ],
      },
      editLoading:false,
      openLoading:false,
    }
  },
  created() {
    if (this.$route.query.activityId) {
      this.listQuery.activityId = this.$route.query.activityId
      this.activityName = this.$route.query.activityName
    }
    
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType == 1) {
      this.getPlaceList()
    } else {
      this.tableConfig.shift()
      // this.tableConfig.shift()
    }
  },
  mounted() {
    this.getTabList();
  },
  methods: {
    BackList() {
      this.showType = 1
    },
    add() {
      this.popParams = {
        name: '',
        place_id: '',
        id: 0,
      }
      this.popTitle = '添加公司'
      this.showEditPopFlag = true
    },
    submitEditForm(formName) {
      let postParams = this.popParams
      if (this.$storage.get('PE_USER_INFO').type == 1) {
         if (this.popParams.place_id == '' || this.popParams.place_id == null || this.popParams.place_id == undefined) {
            this.$message.error('请选择渠道')
          return false
        }
      } else {
        postParams.place_id = this.$storage.get('PE_USER_INFO').place_id
      }

      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          this.editLoading = true
          this.$http.post(API.userBusinessSave, postParams).then(res => {

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
      
      // console.log("submitEditForm", this.popParams, this.selStoreEditOptions)
    },
    editClick(item) {
      this.popParams = item
      this.popTitle = '编辑公司【' + item.name + '】'
      this.showEditPopFlag = true

    },
    subListClick(item) {
      this.popParams = item
      this.popTitle = '商业公司【' + item.name + '】部门列表'
      this.showType = 2

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
   
    searchForm() {
      this.listQuery.page = 1
      this.getTabList()
    },
    getTabList() {
     
      this.listLoading = true
      this.$http.get(API.userBusinessCmsList, { ...this.listQuery }).then(res => {
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
      this.$confirm('此操作将' + tip + '公司, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.userBusinessStatus, { id: row.id, status: status }).then((res) => {
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
