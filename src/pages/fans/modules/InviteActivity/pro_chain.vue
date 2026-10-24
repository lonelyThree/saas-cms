<template>
  <div class="place-wrap">
    <el-page-header @back="backListClick" :content="popTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" class="form-container" inline>



        <el-form-item>

          <el-button type="success" class="op-btn" plain @click="addClick()">
            添加
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row
      :style="{ 'width': '100%', 'margin-top': '15px' }">
      <el-table-column v-for="(item, index) in tableConfig" :key="index" align="center" :label="item.label"
        :width="item.width" :prop="item.key">
        <template slot-scope="scope">

          <span v-if="item.key == 'time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat }}</span>

          <span v-else-if="item.key == 'time'">{{ scope.row.create_at * 1000, 3 | dateFormat }}</span>
          

          <span v-else-if="item.key == 'status'">{{ scope.row[item.key] == 1 ? '启用' : '禁用' }}</span>
          <span v-else-if="item.key == 'name'">{{ scope.row.Chain.name}}</span>
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
    <el-pagination v-show="total > 0" :total="total" :current-page.sync="listQuery.page"
      :page-size.sync="listQuery.limit" layout="prev, pager, next, jumper, sizes, ->, total"
      @current-change="handleCurrentChange" />

    <el-dialog :visible.sync="showPopFlag" :title="popPopTitle" width="60%">
      <el-form :model="popParams" :rules="rules" ref="form" label-width="180px">
        <el-form-item label="连锁名称" class="is-required">
          <el-select v-model="popParams.chainId" filterable remote reserve-keyword clearable placeholder="请输入连锁名称关键词"
            :remote-method="chainSearch" :loading="chainLoading" style="width:600px" v-if="!popParams.id">
            <el-option v-for="item in chainOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <label v-else>{{popParams.name }}</label>
        </el-form-item>

        <el-form-item label="奖励金额（分）：" prop="money">
            <el-input-number v-model="popParams.money" :max="100000" :min="1" style="width:250px" placeholder="奖励金额10~10000"></el-input-number>
        </el-form-item>


        <el-form-item label="">
          <el-button @click="submitForm('form')" type="primary" :loading="loading">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

import vDialog from '../../dialog.vue'

export default {
  props: {
    receiptId: Number,
    proId: Number,
    popTitle: String,
  },
  data() {
    return {
      formLabelWidth: '80px',

      total: 0,
      tabList: [],
      tableConfig: [

        { label: '连锁ID', key: 'chain_id', width: '100px' },
        { label: '连锁名称', key: 'name' },
        { label: '金额（分）', key: 'money' , width:'100px'},
        { label: '状态', key: 'status' },
        { label: '更新时间', key: 'time', width: '150px' },
      ],

      chainLoading: false,
      chainOptions: [],


      listQuery: {
        receiptId:0,
        proId:0
      },

      openLoading:false,

      showPopFlag: false,
      popPopTitle: '',
      popParams: {
        name: '',
        score: 0,
        number: 0,
      },
      loading: false,
      rules: {
        chainId: [
          { required: true, message: '请先选择连锁', trigger: 'change' }
        ],
        keyword: [
          { required: true, message: '请输入关键词', trigger: 'change' }
        ],

        type: [
          { type: 'number', required: true, message: '请输入小票唯一识别号', trigger: 'change' }
        ],
        ticker_len: [
          { type: 'number', required: true, message: '请输入小票号长度', trigger: 'change' }
        ],
        limit_num: [
          { type: 'number', required: true, message: '请输入连锁小票上限控制', trigger: 'change' }
        ],
      },


    };
  },
  created() {
    let rollType = this.$storage.get('PE_USER_INFO').type
    if (rollType != 1 && rollType != 2) {
      this.$router.push({ name: 'Index' })
    }
    
    this.listQuery.receiptId = this.receiptId
    this.getProList()
  },
  components: { vDialog },
  methods: {
     chainSearch(query) {
      if (query !== '') {
        this.chainLoading = true
        this.$http.get(API.receiptChainSearch + '?receiptId=' + this.receiptId + '&name=' + query).then(res => {
          if (res.code == 200) {
            this.chainLoading = false
            this.chainOptions = res.data.data

          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.chainOptions = [];
      }
    },
    addClick() {
      this.popParams = {}
      this.popPopTitle = '添加连锁'
      this.showPopFlag = true
    },
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '连锁自定义红包, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.receiptProChainStatus, { id: row.id, status: status }).then((res) => {
          if (res.code === 200) {
            this.openLoading = false
            this.getProList();
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
    editClick(row) {
      this.popParams = row
      this.popParams.name = row.Chain.name
      this.popParams.chainId = row.chain_id
      this.popPopTitle = '编辑连锁自定义红包'
      this.showPopFlag = true
    },
    backListClick() {
      this.$emit('backList', this.ruleForm)
    },
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getQuestionList()
    },
    getProList() {
      this.listLoading = true
      this.listQuery.receiptId = this.receiptId
      this.listQuery.proId = this.proId
      this.$http.get(API.receiptProChainList, { ...this.listQuery }).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          this.tabList = res.data.data
          this.total = res.data.count
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    submitForm(formName) {
      this.popParams.receiptId = this.receiptId
      this.popParams.proId = this.proId
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          this.loading = true
          this.$http.post(API.receiptProChainSave, this.popParams).then(res => {

            if (res.code === 200) {
              this.$message.success('保存成功')
              setTimeout(() => {
                this.showPopFlag = false
                this.getProList()
              }, 1000);
            } else {
              this.$message.error(res.msg ? res.msg : '保存失败')
            }
            this.loading = false
          })
            .catch(error => {
              this.$message.error('保存失败')
              this.loading = false

            });
        } else {
          for (var i in object) {
            this.$message.error(object[i][0].message)
            return false
          }
          return false;
        }
      });
    },
  },
}
</script>
<style lang='scss' scoped></style>
