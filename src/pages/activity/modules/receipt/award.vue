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
            <img width="60" :src="scope.row.img" alt="pic" v-if="item.key=='img'" />
            <span v-else-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key=='time' ">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
    
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
         
          

           <!-- <el-button
            type="danger"
            plain
            size="mini"
            @click="delClick(row)"
          >
            删除
          </el-button> -->
            </template>
        </el-table-column>
        </el-table>
        <el-dialog :visible.sync="showPopFlag" :title="popPopTitle" width="60%">
                  <el-form :model="popParams" :rules="rules" ref="form" label-width="180px">
                    <el-form-item label="奖项名称：" prop="name">
                        <el-input v-model="popParams.name" style="width:600px" placeholder="请输入奖项名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称：" prop="title">
                      <el-input v-model="popParams.title" style="width:600px" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item class="is-required" label="商品图片：" prop="img">
                      <UploadSingleImg :initOssToken="true" uploadName="img" :imgUrl="popParams.img"
                        :ossToken="aliyunOssToken" @updateOssToken="updateOssToken" @selectImg="selectImg" />
                    </el-form-item>
                    <el-form-item label="开始排名：" prop="start_index">
                      <el-input-number v-model="popParams.start_index" :max="10000" :min="1" placeholder="1~10000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="结束排名：" prop="end_index">
                      <el-input-number v-model="popParams.end_index" :max="10000" :min="1" placeholder="1~10000"></el-input-number>
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
import UploadSingleImg from "../../../../components/UploadSingleImg/index.vue";

export default {
  props: {
    aId: Number,
    popTitle: String,
  },
  data() {
    return {
      formLabelWidth: '80px',
      awardMap:{'0':'未知','-1':'未中奖'},
      awardQuery:[{id:0, name:'全部'},{id:-1, name:'未中奖'}],

      total:0,
      tabList:[],
      tableConfig : [

        { label: 'ID', key: 'id' },
        { label: '图片', key: 'img' },
        { label: '奖项名称', key: 'name' },
        { label: '奖品名称', key: 'title' },
        { label: '开始排名', key: 'start_index' },
        { label: '结束排名', key: 'end_index' },
        { label: '更新时间', key: 'time' },
      ],

      showPopFlag: false,
      popPopTitle: '',
      popParams: {
      },
      loading: false,
      rules: {
        name: [
          {  required: true, message: '请输入奖项名称', trigger: 'change' },
        ],
        title: [
          {  required: true, message: '请输入商品名称', trigger: 'change' },
        ],
        start_index: [
          { type: 'number', required: true, message: '请输入开始排名', trigger: 'change' },
        ],
        end_index: [
          { type: 'number', required: true, message: '请输入结束排名', trigger: 'change' },
        ],
      },



    };
  },
  created() {
    this.getAwardList()
   },
   components:{vDialog, UploadSingleImg },
  methods: {
     addClick() {
      this.popParams = {}
      this.popPopTitle = '添加奖品'
      this.showPopFlag = true
    },
    editClick(row) {
      this.popParams = row
      this.popPopTitle = '编辑奖品'
      this.showPopFlag = true
    },
    delClick() {
      this.$message.info('暂不支持删除')
    },
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    getAwardList() {
      this.$http.get(API.receiptAwardList+'?op=list&aId='+this.aId).then(res => {
        if (res.code == 200) {
            this.tabList = res.data

        } else {
          this.$message.error(res.msg)
        }
      })
    },
    selectImg(obj) {
      this.popParams[obj.name] = obj.url
    },
    changeDate() {
      this.$forceUpdate()
    },
    submitForm(formName) {
      this.popParams.a_id = this.aId
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          if (this.popParams.start_index > this.popParams.end_index) {
            this.$message.error("结束排名必须大于开始排名")
            return false;
          }
          if (!this.popParams.img) {
            this.$message.error("请先上传商品图片")
            return false;
          }

          

          this.loading = true
          this.$http.post(API.receiptAwardSave, this.popParams).then(res => {

            if (res.code === 200) {
              this.$message.success('保存成功')
              setTimeout(() => {
                this.showPopFlag = false
                this.getAwardList()
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
</style>
