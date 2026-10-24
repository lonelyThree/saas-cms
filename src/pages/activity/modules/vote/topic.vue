<template>
    <div class="place-wrap">
        <el-page-header @back="backListClick" :content="popTitle">
        </el-page-header>
        <el-divider></el-divider>
        <el-card class="box-card" shadow="never">
            <el-form ref="listQuery"
                :model="listQuery"
                class="form-container"
                inline>

  
           
                <el-form-item label="标题">
                    <el-input
                        v-model="listQuery.title"
                        clearable
                        class="filter-item"
                        placeholder="请输入标题"/>
                </el-form-item>

                
                <el-form-item label="类型">
                <el-select
                        v-model="listQuery.type"
                        clearable
                        placeholder="请选择"
                        filterable
                    >
                        <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                 <el-form-item label="是否必填">
                <el-select
                        v-model="listQuery.require"
                        clearable
                        placeholder="请选择"
                        filterable
                    >
                        <el-option
                        v-for="item in requireList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="是否公开">
                <el-select
                        v-model="listQuery.public"
                        clearable
                        placeholder="请选择"
                        filterable
                    >
                        <el-option
                        v-for="item in publicList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>


                 <el-form-item label="状态">
                <el-select
                        v-model="listQuery.status"
                        clearable
                        placeholder="请选择"
                        filterable
                    >
                        <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                

                <el-form-item>
                <el-button
                    type="primary"
                    align="right"
                    @click="getQuestionList">
                    <i class="el-icon-search"/>
                    <span> 搜索</span>
                </el-button>

                <el-button
                      type="primary"
                      align="right"
                      @click="addClick">
                      <i class="el-icon-search"/>
                      <span> 添加</span>
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

            <span v-else-if="item.key=='time' ">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
            <span v-else-if="item.key == 'type'">{{typeMap[scope.row['type']]?typeMap[scope.row['type']]:'未知'}}</span>
            <span v-else-if="item.key == 'require_type'">{{ scope.row[item.key] == 1 ? '必填' : '选填' }}</span>
            <span v-else-if="item.key == 'public_type'">{{ scope.row[item.key] == 1 ? '公开' : '不公开' }}</span>
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
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="listQuery.limit"
        layout="prev, pager, next, jumper, sizes, ->, total"
        @current-change="handleCurrentChange"
        />
      <el-dialog :visible.sync="showPopFlag" :title="popPopTitle" width="60%">
              
              <el-form :model="popParams" :rules="rules" ref="form" label-width="180px">
                  <el-form-item label="标题：" prop="title">
                      <el-input v-model="popParams.title" style="width:300px" placeholder="请输入标题"></el-input>
                  </el-form-item>
                  <el-form-item label="类型：" prop="type">
                      <el-radio-group
                          v-model="popParams.type"
                      >
                          <el-radio :label="1">单选</el-radio>
                          <el-radio :label="2">多选</el-radio>
                          <el-radio :label="3">单行文本</el-radio>
                          <el-radio :label="4">多行文本</el-radio> 
                          <el-radio :label="5">图片</el-radio>
                          <el-radio :label="6">视频</el-radio>
                      </el-radio-group>
                  </el-form-item>
                   <el-form-item label="是否必填：" prop="require_type">
                      <el-radio-group
                          v-model="popParams.require_type"
                      >
                          <el-radio :label="1">必填</el-radio>
                          <el-radio :label="2">选填</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否公开：" prop="public_type">
                      <el-radio-group
                          v-model="popParams.public_type"
                      >
                          <el-radio :label="1">公开</el-radio>
                          <el-radio :label="2">不公开</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="详情排序：" prop="sort">
        <el-input-number v-model="popParams.sort" :max="200000" :min="1" placeholder="越小越靠前"></el-input-number>
      </el-form-item>
                  <el-form-item label="选项：" prop="answers" 
                  v-if="popParams.type == 1 ||  popParams.type == 2">
                    <el-tag
  :key="tag"
  v-for="tag in popParams.answers"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)">
  {{tag}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增选项</el-button>

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
    popId: Number,
    topicType: Number,
    popTitle: String,
  },
  data() {
    return {
      formLabelWidth: '80px',

      total:0,
      tabList:[],
      tableConfig : [
        { label: '排序', key: 'sort' },
        { label: '标题', key: 'title' },
        { label: '类型', key: 'type' },
        { label: '是否必填', key: 'require_type' },
        { label: '是否公开', key: 'public_type' },
        { label: '状态', key: 'status' },
      ],


      listQuery: {
        voteId: 0,
        title: '',
        type: 0,
        require: 0,
        public: 0,
        page:1,
        limit:20,
      },

      typeList: [
          {name: '全部', value: 0},
          {name: '单选', value: 1},
          {name: '多选', value: 2},
          {name: '单行文本', value: 3},
          {name: '多行文本', value: 4},
          {name: '图片', value: 5},
          {name: '视频', value: 6},
        ],
      
      typeMap : {
        1: '单选',
        2: '多选',
        3: '单行文本',
        4: '多行文本',
        5: '图片',
        6: '视频',
      },

        requireList: [
          {name: '全部', value: 0},
          {name: '必填', value: 1},
          {name: '选填', value: 2},
        ],

        publicList: [
          {name: '全部', value: 0},
          {name: '公开', value: 1},
          {name: '不公开', value: 2},
        ],

        statusList: [
          {name: '全部', value: 0},
          {name: '启用', value: 1},
          {name: '禁用', value: 2},
        ],
      
      showPopFlag: false,
      popPopTitle: '',
      popParams: {
        voteId: 0,
        topicType: 0,
        title: '',
        type: 0,
        require_type: 0,
        public_type: 0,
        content:'',
      },
      loading: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        require_type: [
          { required: true, message: '请选择是否必填', trigger: 'change' }
        ],
        public_type: [
          { required: true, message: '请选择是否公开', trigger: 'change' }
        ],
        answers: [
          { required: true, message: '请输入答案', trigger: 'change' }
        ],
      },
      openLoading: false,

      inputVisible: false,
      inputValue: ''


    };
  },
  created() {
    this.listQuery.voteId = this.popId
    this.listQuery.topicType = this.topicType
    this.getQuestionList()
   },
   components:{vDialog},
  methods: {

    handleClose(tag) {
        this.popParams.answers.splice(this.popParams.answers.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.popParams.answers.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },


    checkChange() {
      this.$forceUpdate();
      return true

    },

    delClick(){
        this.$message.info('暂不支持删除')
    },
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },

    addClick() {
      this.popParams = {
        title: '',
        type:1,
        require_type:1,
        public_type:1,
        answers:[]
      }
      this.popPopTitle = '添加表单'
      this.showPopFlag = true
    },
    editClick(row) {
      this.popParams = row
      if(row.type != 1 && row.type != 2) {
        this.popParams.answers = []
      } else {

        this.popParams.answers = JSON.parse(row.answers)

      }
      this.popPopTitle = '编辑表单'
      this.showPopFlag = true
    },
    handleCurrentChange(page){
      this.listQuery.page = page
      this.getQuestionList()
    },
    getQuestionList() {
      this.listLoading = true
      this.$http.get(API.voteTopicList, {...this.listQuery}).then(res => {
        this.listLoading = false
        if (res.code == 200) {
          this.tabList = res.data.data
          this.total = res.data.count
        } else {
          this.$message.error(res.msg)
        }
      })
    }, 
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '该问题, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.voteTopicStatus, { id: row.id, status: status }).then((res) => {
          if (res.code === 200) {
            this.openLoading = false
            this.getQuestionList();
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
    submitForm(formName) {
      this.popParams.voteId = this.popId
      this.popParams.topicType = this.topicType
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          if(this.popParams.type == 2 && this.popParams.answers.length < 3) {
            this.$message.error("类型为多选， 请至少添加三个答案")
            return false;
          }

          if(this.popParams.type == 1 && this.popParams.answers.length < 2) {
            this.$message.error("类型为单选， 请至少添加两个答案")
            return false;
          }
        


          this.loading = true
          this.$http.post(API.voteTopicSave, this.popParams).then(res => {

            if (res.code === 200) {
              this.$message.success('保存成功')
              setTimeout(() => {
                this.showPopFlag = false
                this.getQuestionList()
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
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 200px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
