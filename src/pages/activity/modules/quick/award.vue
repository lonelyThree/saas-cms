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
            <img width="60" :src="scope.row.img" alt="pic" v-if="item.key=='img' && scope.row.img != ''" />
            <span v-else-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key=='time' ">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
             <span v-else-if="item.key == 'send_type'">{{sendTypeMap[scope.row['send_type']]?sendTypeMap[scope.row['send_type']]:'--'}}</span>
            <span v-else-if="item.key == 'award_type'">{{awardTypeMap[scope.row['award_type']]?awardTypeMap[scope.row['award_type']]:'--'}}</span>

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

                    <el-alert
    title="每个用户只能获得一个奖，排名将未出来前可手动给予手动奖项，获得手动奖项的用户仍参与排名， 但不会再次获得奖项"
    type="warning" effect="dark" :closable="false" style="margin-bottom: 10px;"></el-alert>
    
                    <el-form-item label="奖项名称：" prop="name">
                        <el-input v-model="popParams.name" style="width:600px" placeholder="请输入奖项名称"></el-input>
                    </el-form-item>
                     <el-form-item label="奖励发放" prop="send_type">
        <el-radio-group v-model="popParams.send_type" :disabled="popParams.id > 0">
          <el-radio :label="1">手动</el-radio>
          <el-radio :label="2">排名</el-radio>
          <!-- <el-radio :label="3">票数</el-radio> -->
        </el-radio-group>
      </el-form-item>

                        <el-form-item label="奖励类型" prop="award_type" >
            <el-radio-group v-model=" popParams.award_type" :disabled="popParams.id > 0">
            <el-radio :label="1">红包</el-radio>
            <el-radio :label="2">积分</el-radio>
            <el-radio :label="3">星币</el-radio>
            <el-radio :label="4" v-if="popParams.send_type!=3">实物奖</el-radio>
            </el-radio-group>
          </el-form-item>

           <el-form-item label="奖励(分)：" prop="money" v-if="popParams.award_type!=4">
          <el-input-number v-model="popParams.money" :max="20000" :min="0" placeholder="0~20000"  :disabled="popParams.id > 0"></el-input-number>
          <div class="tips" v-if="popParams.send_type == 3">票数除以1000的给予对应的奖励值</div>
        </el-form-item>
         
                    <el-form-item label="商品名称：" prop="title" v-if="popParams.award_type==4">
                      <el-input v-model="popParams.title" style="width:600px" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item class="is-required" label="商品图片：" prop="img" v-if="popParams.award_type==4">
                      <UploadSingleImg :initOssToken="true" uploadName="img" :imgUrl="popParams.img"
                        :ossToken="aliyunOssToken" @updateOssToken="updateOssToken" @selectImg="selectImg" />
                    </el-form-item>
                    <el-form-item label="开始排名：" prop="start_index" v-if="popParams.send_type == 2">
                      <el-input-number v-model="popParams.start_index" :max="10000" :min="1" placeholder="1~10000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="结束排名：" prop="end_index" v-if="popParams.send_type == 2">
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
    askId: Number,
    popTitle: String,
  },
  data() {
    return {
      formLabelWidth: '80px',
      sendTypeMap:{'0':'未知', '1':'手动', '2':'排名', '3':'票数'},
      awardTypeMap:{'0':'未知', '1':'红包', '2':'积分', '3':'星币', '4':'实物奖'},

      total:0,
      tabList:[],
      tableConfig : [

        { label: 'ID', key: 'id' },
        // { label: '图片', key: 'img' },
        { label: '奖项类型', key: 'award_type' },
        { label: '发放类型', key: 'send_type' },
        { label: '奖项名称', key: 'name' },
        { label: '奖项价值', key: 'money' },
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
        award_type: [
          { required: true, message: '请选择奖项类型', trigger: 'change' },
        ],
        send_type: [
          { required: true, message: '请选择发放类型', trigger: 'change' },
        ],
        money: [
          { type: 'number', required: true, message: '请输入奖项价值', trigger: 'change' },
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
      this.popParams = {
        id: 0,
        send_type: 1,
        award_type: 1,
      }
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
      this.$http.get(API.quickAwardList+'?op=list&askId='+this.askId).then(res => {
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
      this.popParams.ask_id = this.askId
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          if (this.popParams.start_index > this.popParams.end_index) {
            this.$message.error("结束排名必须大于开始排名")
            return false;
          }
          if (this.popParams.award_type==4 && !this.popParams.img) {
            this.$message.error("请先上传商品图片")
            return false;
          }

          

          this.loading = true
          this.$http.post(API.quickAwardSave, this.popParams).then(res => {

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
