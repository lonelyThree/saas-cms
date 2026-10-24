<template>
  <div class="container">
    <el-button type="primary"
               class="primaryBtn"
               @click="getLogAdminDetail('add','')">添加</el-button>
    <div class="table-box">
      <el-table :data="enrollList"
                border
                class="table"
                v-loading="loading">
        <el-table-column prop="name"
                         label="渠道名称"></el-table-column>
        <el-table-column prop="appid"
                         label="渠道appkey"></el-table-column>
        <el-table-column prop="temp"
                         label="模板id"></el-table-column>
        <el-table-column label="模板类型">
          <template slot-scope="scope">
            <span>
              {{typeObj[scope.row.type]}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="getLogAdminDetail('eidt',scope.row)">
              编辑
            </el-link>
            <el-link type="danger"
                     style="margin-left: 10px;"
                     @click="toComment(scope.row)">
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="searchParams.page"
                     :page-sizes="[10, 20, 30]"
                     :page-size="searchParams.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <addio :dialogFormVisible="dialogFormVisible"
           @submitForm="submitForm"
           @resetForm="resetForm"
           :ruleForm="ruleForm"
           :statusArr="statusArr"
           :typeArr="typeArr"
           :dialogState="dialogState"
           :loading="btnLoding" />

  </div>
</template>

<script>
import addio from "./modules/addDio";
export default {
  components: { addio },
  data() {
    const typeObj={
      1: '审核通知',
      2: '问诊咨询跟进',
      3: '订单通知',
    }
    return {
      typeObj,
      searchParams: {
        page: 1,
        limit: 10,
      },
      loading: false,
      total: 0,
      enrollList: [],
      tempData: [{ name: '',doc_name: '',doc_tel: '' }],
      dialogFormVisible: false,
      statusArr: [],
      btnLoding: false,
      ruleForm: {
        place_id: '',
        type: '',
        temp: '',
      },
      typeArr: [
        { name: "审核通知",value: 1 },
        { name: "问诊咨询进度",value: 2 },
        { name: "订单通知",value: 3 },
      ],
      dialogState: ''
    }
  },
  created() {
    this.getEnrollLog();
    this.statusArrapi();
  },
  methods: {
    getEnrollLog() {
      this.loading=true
      this.$http.get(API.getTempList,this.searchParams).then(res => {
        const { data: { data },status,count,message }=res;
        this.loading=false
        if(status==200) {
          this.total=count
          this.enrollList=data
        } else {
          this.$message.error(message)
        }
      })
    },
    // 新建 /编辑
    getLogAdminDetail(it,row) {
      this.dialogState=it;
      if(it=='add') {
        this.dialogFormVisible=true
        this.ruleForm={}
      } else {
        this.ruleForm={ ...row }
        console.log(this.ruleForm)
        this.dialogFormVisible=true
      }
    },
    submitForm(val) {
      this.btnLoding=true;
      this.addTempApi(val)
    },
    addTempApi(val) {
      let prams={}
      if(val.id) { //编辑
        let { appid,...other }=val;
        prams={ ...other }
      } else { //新建
        prams=val
      }
      this.$http.post(API.addTemp,prams).then(res => {
        const { status,message }=res;
        this.btnLoding=false;
        if(status==200) {
          this.dialogFormVisible=false;
          this.getEnrollLog();
          this.$message.success(message);
        } else {
          this.$message.error(message)
        }
      })
    },
    resetForm() {
      this.dialogFormVisible=false
    },
    // 删除
    toComment(row) {
      this.$confirm('确定删除吗?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let prams={
          id: row.id
        }
        this.$http.post(API.delTemp,prams).then(res => {
          const { status,message }=res;
          if(status==200) {
            this.dialogFormVisible=false;
            this.getEnrollLog();
            this.$message.success(message);
          } else {
            this.$message.error(message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    statusArrapi() {
      let prams={
        type: 1
      }
      this.$http.get(API.getAllPlace,prams).then(res => {
        const { data,status,message }=res;
        if(status==200) {
          this.statusArr=data;
        } else {
          this.$message.error(message)
        }
      })
    },
    handleSizeChange(val) {
      this.searchParams.limit=val
      this.getEnrollLog()
    },
    handleCurrentChange(val) {
      this.searchParams.page=val
      this.getEnrollLog()
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
  }
  .pagination {
    padding-bottom: 15px;
  }
  .primaryBtn {
    margin-bottom: 20px;
  }
}
</style>
