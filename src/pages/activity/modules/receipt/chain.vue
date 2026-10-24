<template>
  <div class="place-wrap">
    <el-page-header @back="backListClick" :content="popTitle">
    </el-page-header>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
      <el-form ref="listQuery" class="form-container" inline>
        <el-form-item>
          <el-button class="op-btn" plain @click="sortClick()" v-if="!isSort">
            排序
          </el-button>
          <el-button type="success" class="op-btn" plain @click="addClick()" v-if="!isSort">
            添加
          </el-button>

          <el-button  class="op-btn" :loading="sortLoading" plain @click="sortCancelClick()" v-if="isSort">
            取消
          </el-button>

          <el-button type="success"  :loading="sortLoading" class="op-btn" plain @click="sortSubmitClick()" v-if="isSort">
            提交
          </el-button>          
        </el-form-item>
      </el-form>
    </el-card>

    <el-table v-loading="listLoading" :data="tabList" border fit highlight-current-row
      :style="{ 'width': '100%', 'margin-top': '15px' }" class="draggable-table" row-key="id">
      <el-table-column class-name="allowDrag" label="移动" width="100" v-if="isSort">
        <template slot-scope="scope">
          <i class="el-icon-rank"></i>
        </template>
      </el-table-column>
      <el-table-column v-for="(item) in tableConfig" :key="item.id" align="center" :label="item.label"
        :width="item.width" :prop="item.key" >
        <template slot-scope="scope">

          <span v-if="item.key == 'time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat }}</span>

          <span v-else-if="item.key == 'time'">{{ scope.row.create_at * 1000, 3 | dateFormat }}</span>
          <span v-else-if="item.key == 'limit_num'">{{ scope.row.receive_num}} / {{ scope.row.limit_num}}</span>
          

          <span v-else-if="item.key == 'status'">{{ scope.row[item.key] == 1 ? '启用' : '禁用' }}</span>
          <span v-else-if="item.key == 'name'">{{ scope.row.Chain.name}}</span>
          <span v-else-if="item.key == 'type'">{{ scope.row[item.key] == 1 ? '小票号+时间' : (scope.row[item.key] == 2 ?'小票号' : (scope.row[item.key] == 3 ?'时间' : '小票号或时间')) }}</span>

          <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" :width="150">
        <template slot-scope="{row}" v-if="!isSort">

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

        <el-form-item label="关键词" prop="keyword">
          <el-input type="textarea" v-model="popParams.keyword" style="width:600px;" maxlength="250"
            placeholder='多个关键词地址用英文“;”隔开' rows="5" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="小票唯一识别号" prop="type">
          <el-radio-group v-model="popParams.type">
            <el-radio :label="1">小票号+时间</el-radio>
            <el-radio :label="2">小票号</el-radio>
            <el-radio :label="3">时间</el-radio>
            <el-radio :label="4">小票号或时间</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="小票号长度" prop="ticker_len">
          <el-input-number v-model="popParams.ticker_len" :max="200" :min="1" placeholder="1~200"></el-input-number>
        </el-form-item>

        <el-form-item label="连锁小票上限控制：" prop="limit_num">
          <el-input-number v-model="popParams.limit_num" :max="1000000" :min="1"
            placeholder="1~1000000"></el-input-number>
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
import Sortable from "sortablejs";

export default {
  props: {
    receiptId: Number,
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
        { label: '唯一识别号', key: 'type' },
        { label: '小票号长度', key: 'ticker_len' },
        { label: '小票上限', key: 'limit_num' },
        { label: '状态', key: 'status' },
        { label: '关键词', key: 'keyword' },
        { label: '更新时间', key: 'time', width: '150px' },
      ],

      chainLoading: false,
      chainOptions: [],


      listQuery: {
        name: '',
        type: 'page',
        page: 1,
        limit: 10
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
      isSort: false,

      sortLoading: false,


    };
  },
  created() {
    let rollType = this.$storage.get('PE_USER_INFO').type
    if (rollType != 1 && rollType != 2) {
      this.$router.push({ name: 'Index' })
    }
    
    this.listQuery.receiptId = this.receiptId
    this.getProList()
    let arr = [0, 1];
    const currRow = arr.splice(1, 1)[0];
         arr.splice(0, 0, currRow);
          console.log(arr, '===arr===')


    
  },
  components: { vDialog },
  methods: {
    // 行拖拽
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const self = this
      console.log(tbody)
      Sortable.create(tbody, {
        handle: ".allowDrag",
        // 指定父元素下可被拖拽的子元素
        draggable: ".el-table__row",
        onEnd: ({ newIndex, oldIndex }) => {
           const currRow = self.tabList.splice(oldIndex, 1)[0];
          self.tabList.splice(newIndex, 0, currRow);
        },
      });
    },
     chainSearch(query) {
      if (query !== '') {
        this.chainLoading = true
        this.$http.get(API.getChainList + '?name=' + query).then(res => {
          if (res.code == 200) {
            this.chainLoading = false
            this.chainOptions = res.data

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
    sortClick(){
      this.isSort = true
    },
    sortCancelClick(){
      this.isSort = false
    },
    sortSubmitClick(){
      let sortChainList = []
      this.tabList.forEach(function(el, index) {
        if (index + 1 != el.display_order) {
          sortChainList.push({
            id:el.id,
            index: index + 1
          })
        }
      })
      if (sortChainList.length == 0) {
        return
      }

      this.sortLoading = true

      this.$http.post(API.receiptChainSortSave, {
        receiptId:this.receiptId,
        sortList:sortChainList
      }).then(res => {

        if (res.code === 200) {
          this.$message.success('保存成功')
          this.isSort = false
          setTimeout(() => {
            this.getProList()
          }, 1000);
        } else {
          this.$message.error(res.msg ? res.msg : '保存失败')
        }
        this.sortLoading = false
      })
        .catch(error => {
          this.$message.error('保存失败')
          this.sortLoading = false

        });
    },
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '连锁, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.receiptChainStatus, { id: row.id, status: status }).then((res) => {
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
      this.popPopTitle = '编辑连锁'
      this.showPopFlag = true
    },
    backListClick() {
      this.$emit('backList', this.ruleForm)
    },
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getProList()
    },
    getProList() {
      this.listLoading = true
      this.listQuery.receiptId = this.receiptId
      this.$http.get(API.receiptChainList, { ...this.listQuery }).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          this.tabList = res.data.data
          this.total = res.data.count
          this.rowDrop();
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    submitForm(formName) {
      //     const audio = new Audio(this.audioSrc);
      // audio.src = this.audioSrc;
      // audio.play();
      // console.log(this.$refs.audio, "this.$refs.audio")
      // this.$refs.audio.play()
      // return
      this.popParams.receiptId = this.receiptId
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          this.loading = true
          this.$http.post(API.receiptChainSave, this.popParams).then(res => {

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
<style lang='scss' scoped>
::v-deep .el-table .cell {
  text-align: center;
}
::v-deep .sortable-chosen > td {
  /* 拖动的样式 */
  background-color: #eff2f6 !important;
  color: #409eff;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  /* 修复拖拽的时候hover的不消失的问题 */
  background-color: #fff;
}

</style>
