<template>
    <div class="place-wrap">
        <el-page-header @back="backListClick" :content="popTitle">
        </el-page-header>
        <el-divider></el-divider>
        <el-card class="box-card" shadow="never">
            <el-form ref="listQuery"
                class="form-container"
                inline>

                

                <el-form-item>

                <el-button
                type="success"
                class="op-btn"
                plain
                @click="addClick()"
            >
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
            
            <span v-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key == 'status'">{{ scope.row[item.key] == 1 ? '启用' : '禁用' }}</span>
    
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
            class="op-btn"
            plain
            size="mini"
            @click="editClick(row)"
          >
            编辑
          </el-button>
            
          <el-button
            type="warning"
            class="op-btn"
            plain
            size="mini"
            @click="proChainClick(row)"
          >
            连锁红包
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
              type="primary"
              class="op-btn"
              plain
              size="mini"
              :loading="openLoading"
              @click="statusClick(row, 1, '启用')"
              v-if="row.status == 2"
            >
              启用
            </el-button>
        </template>
        </el-table-column>
        </el-table>
        <el-pagination
        v-show="total>0"
        :total="total"
        :current-page.sync="listQuery.page"
        :page-size.sync="listQuery.limit"
        layout="prev, pager, next, jumper, sizes, ->, total"
        @current-change="handleCurrentChange"
        />

        <el-dialog :visible.sync="showPopFlag" :title="popPopTitle" width="60%">
            <el-form :model="popParams" :rules="rules" ref="form" label-width="180px">
                <el-form-item label="商品名称：" prop="name">
                    <el-input v-model="popParams.name" :readonly="popParams.id"  style="width:600px" placeholder="请输入商品名称"></el-input>
                </el-form-item>

                  
                <el-form-item label="奖励金额（分）：" prop="money">
                  <el-input-number v-model="popParams.money" :max="100000" :min="1" style="width:250px" placeholder="奖励金额10~10000"></el-input-number>
                </el-form-item>

                <el-form-item label="关键词：" prop="keyword">
                    <el-input type="textarea" v-model="popParams.keyword" style="width:600px;" maxlength="250" placeholder='多个关键词地址用英文“;”隔开'  rows="5" show-word-limit></el-input>
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
    popTitle:String,
  },
  data() {
    return {
      formLabelWidth: '80px',

      total:0,
      tabList:[],
      tableConfig : [

        { label: '名称', key: 'name' },
        { label: '状态', key: 'status' },
        { label: '金额（分）', key: 'money' , width:'100px'},
        { label: '关键词', key: 'keyword'},
        { label: '更新时间', key: 'time' , width:'150px'},
      ],


      listQuery: {
        name:'',
      },

      showPopFlag:false,
      popPopTitle:'',
      popParams:{
        name:'',
        score:0,
        number:0,
      },
      loading:false,
      rules: {
        name: [
          { required: true,message: '请输入产品名称',trigger: 'change' }
        ],
        money: [
          { type: 'number', required: true,message: '请输入产品金额',trigger: 'change' }
        ],
        keyword: [
          { required: true,message: '请输入关键词',trigger: 'change' }
        ],
      },

      openLoading:false,


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
   components:{vDialog},
  methods: {
    proChainClick(row) {
      this.$emit('proChainClick', { proId: row.id, name: row.name, money:row.money, receiptId:this.receiptId, popTitle: this.popTitle })
    },
    addClick() {
        this.popParams = {}
        this.popPopTitle = '添加产品'
        this.showPopFlag = true
    },
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '产品, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.receiptProStatus, { id: row.id, status: status }).then((res) => {
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
        this.popPopTitle = '编辑产品'
        this.showPopFlag = true
    },
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    handleCurrentChange(page){
      this.listQuery.page = page
      this.getQuestionList()
    },
    getProList() {
      this.listLoading = true
      this.listQuery.receiptId = this.receiptId
      this.$http.get(API.receiptProList, {...this.listQuery}).then(res => {
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
    //     const audio = new Audio(this.audioSrc);
    // audio.src = this.audioSrc;
    // audio.play();
        // console.log(this.$refs.audio, "this.$refs.audio")
        // this.$refs.audio.play()
        // return
        this.popParams.receiptId = this.receiptId
        this.$refs[formName].validate((valid, object) => {
        if(valid) {
            this.loading = true
            this.$http.post(API.receiptProSave, this.popParams).then(res => {
                
                if (res.code === 200) {
                    this.$message.success('保存成功')
                    setTimeout(() => {
                        this.showPopFlag = false
                        this.getProList()
                    }, 1000);
                } else {
                    this.$message.error(res.msg?res.msg:'保存失败')
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
</style>
