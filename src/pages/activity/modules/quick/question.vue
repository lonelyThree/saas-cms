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

                <el-form-item label="题目编号">
                    <el-input
                        v-model="listQuery.index"
                        clearable
                        class="filter-item"
                        placeholder="请输入题目编号"/>
                </el-form-item>
           
                <el-form-item label="题目名称">
                    <el-input
                        v-model="listQuery.name"
                        clearable
                        class="filter-item"
                        placeholder="请输入粉丝名称"/>
                </el-form-item>

                
                <el-form-item label="答案A">
                    <el-input
                        v-model="listQuery.a"
                        clearable
                        class="filter-item"
                        placeholder="请输入答案A"/>
                </el-form-item>

                <el-form-item label="答案B">
                    <el-input
                        v-model="listQuery.b"
                        clearable
                        class="filter-item"
                        placeholder="请输入答案B"/>
                </el-form-item>

                <el-form-item label="答案C">
                    <el-input
                        v-model="listQuery.c"
                        clearable
                        class="filter-item"
                        placeholder="请输入答案C"/>
                </el-form-item>

                <el-form-item label="答案D">
                    <el-input
                        v-model="listQuery.d"
                        clearable
                        class="filter-item"
                        placeholder="请输入答案D"/>
                </el-form-item>

                <el-form-item label="答案E">
                    <el-input
                        v-model="listQuery.e"
                        clearable
                        class="filter-item"
                        placeholder="请输入答案E"/>
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
                type="success"
                class="op-btn"
                plain
                @click="addClick()"
            >
                添加
          </el-button>
          <el-button
                  type="success"
                  class="op-btn"
                  plain
                  @click="batchImport()"
              >
                  批量导入
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
        <el-pagination
        v-show="total>0"
        :total="total"
        :current-page.sync="listQuery.page"
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size.sync="listQuery.limit"
        layout="prev, pager, next, jumper, sizes, ->, total"
        @current-change="handleCurrentChange"
        />

        <el-dialog :visible.sync="showPopFlag" :title="popPopTitle" width="60%">
                <el-form :model="popParams" :rules="rules" ref="form" label-width="180px">
                  <el-form-item label="问题编号：" prop="index">
                    <el-input-number v-model="popParams.index" :max="1000" :min="1" placeholder="1~1000" v-if="!popParams.id" ></el-input-number>
                  </el-form-item>
                    <el-form-item label="问题名称：" prop="name">
                        <el-input v-model="popParams.name" style="width:600px" placeholder="请输入问题名称"></el-input>
                    </el-form-item>
                    <el-form-item label="答案A：" prop="a">
                        <el-input v-model="popParams.a" style="width:600px" placeholder="请输入答案A"></el-input>
                    </el-form-item>
                    <el-form-item label="答案B：" prop="b">
                        <el-input v-model="popParams.b" style="width:600px" placeholder="请输入答B"></el-input>
                    </el-form-item>
                    <el-form-item label="答案C：" prop="c">
                        <el-input v-model="popParams.c" style="width:600px" placeholder="请输入答案C"></el-input>
                    </el-form-item>
                    <el-form-item label="答案D：" prop="d">
                        <el-input v-model="popParams.d" style="width:600px" placeholder="请输入答案D"></el-input>
                    </el-form-item>
                    <el-form-item label="答案E：" prop="e">
                        <el-input v-model="popParams.e" style="width:600px" placeholder="请输入答案E"></el-input>
                    </el-form-item>
                    <el-form-item label="正确答案：" prop="correct">
                        <el-radio-group
                            v-model="popParams.correct"
                        >
                            <el-radio label="A">A</el-radio>
                            <el-radio label="B">B</el-radio>
                            <el-radio label="C">C</el-radio>
                            <el-radio label="D">D</el-radio>
                            <el-radio label="E">E</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button @click="submitForm('form')" type="primary" :loading="loading">确定</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>

        <el-dialog
        width="900px"
        title="批量导入"
        :visible.sync="showImportDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeImportForm"
      >
        <el-form
          :model="importForm"
          ref="importForm"
          label-width="140px"
        >
          <el-form-item label="上传文件" prop="name">
            <el-upload
              ref="upload"
              action="#"
              accept="*.xls"
              :limit="1" 
              :multiple="false"
              :before-upload="beforeUpload"
              :auto-upload="false"
              :file-list="fileList"

              :on-exceed="handleExceed"
              :on-change="handleChange"
              :on-remove="handleRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeImportForm">取 消</el-button>
          <el-button
            type="primary"
            :loading="importFormSubmitLoading"
            @click="submitImportForm"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>

    </div>

</template>
<script>

import vDialog from '../../dialog.vue'

export default {
  props: {
    askId: Number,
    popTitle: String,
  },
  data() {
    return {
      formLabelWidth: '80px',

      total:0,
      tabList:[],
      tableConfig : [

        { label: '编号', key: 'index' },
        { label: '名称', key: 'name' },
        { label: '答案A', key: 'a' },
        { label: '答案B', key: 'b' },
        { label: '答案C', key: 'c' },
        { label: '答案D', key: 'd' },
        { label: '答案E', key: 'e' },

        { label: '正确答案', key: 'correct' },
        { label: '更新时间', key: 'time' },
        // // { label: '参与人数', key: 'joinCnt' },
        // { label: '开始日期', key: 'start_time' },
        // { label: '结束日期', key: 'end_time' },
      ],


      listQuery: {
        askId:0,
        index:'',
        a:'',
        name:'',
        b:'',
        c:'',
        d:'',
        e:'',
        page:1,
        limit:20,
      },

      showPopFlag: false,
      popPopTitle: '',
      popParams: {
        a: '',
        name: '',
        b: '',
        c: '',
        d: '',
        e: '',
        correct: ''
      },
      loading: false,
      rules: {
        index: [
          { type: 'number', required: true, message: '请输入问题编号', trigger: 'change' },
        ],
        name: [
          { required: true, message: '请输入问题名称', trigger: 'change' }
        ],

        a: [
          { required: true, message: '请输入答案A', trigger: 'change' }
        ],

        b: [
          { required: true, message: '请输入答案B', trigger: 'change' }
        ],

        correct: [
          { required: true, message: '请输入选择正确的答案', trigger: 'change' }
        ],
      },
      showImportDialog:false,
      importFormSubmitLoading: false,
      fileList:[],

      importForm:{

      }

    };
  },
  created() {
    this.listQuery.askId = this.askId
    this.getQuestionList()
   },
   components:{vDialog},
  methods: {

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      this.fileList.push(file.raw)
    },
    // 文件超出个数限制时的钩子
    handleExceed(file, fileList) {
      return this.$message.warning('一次只能上传一个文件哦~')
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.fileList = fileList
    },


    addClick() {
      this.popParams = {}
      this.popPopTitle = '添加问题'
      this.showPopFlag = true
    },
    editClick(row) {
      this.popParams = row
      this.popPopTitle = '编辑问题'
      this.showPopFlag = true
    },
    delClick(){
        this.$message.info('暂不支持删除')
    },

    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    handleCurrentChange(page){
      this.listQuery.page = page
      this.getQuestionList()
    },
    getQuestionList() {
      this.listLoading = true
      this.$http.get(API.quickQuestionList, {...this.listQuery}).then(res => {
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
      this.popParams.ask_id = this.askId
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          // console.log(this.popParams)
          if (this.popParams.d && this.popParams.d != "" && !this.popParams.c) {
            this.$message.error("请按照顺序补充答案C")
            return false;
          }
          if (this.popParams.e && this.popParams.e != "" && !this.popParams.d) {
            this.$message.error("请按照顺序补充答案D")
            return false;
          }

          if (this.popParams.correct == 'C' && !this.popParams.c) {
            this.$message.error("正确答案为C， 请补充答案C的内容")
            return false;
          }

          if (this.popParams.correct == 'D' && !this.popParams.d) {
            this.$message.error("正确答案为D， 请补充答案D的内容")
            return false;
          }

          if (this.popParams.correct == 'E' && !this.popParams.e) {
            this.$message.error("正确答案为E， 请补充答案E的内容")
            return false;
          }


          this.loading = true
          this.$http.post(API.quickQuestionSave, this.popParams).then(res => {

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
    batchImport() {
      this.showImportDialog = true
    },
    submitImportForm() {
       // 如果上传的文件列表是空的，给出提示
      if (this.fileList.length === 0) {
        return this.$message.warning('请先选择要上传的文件');
      }
      // 因为我们限制一次只上传1个文件，所以取数组里的第一个就可以了
      let file = this.fileList[0]
      // 获取到文件的后缀以便于判断文件类型
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      // 获取到文件的大小
      let size = file.size / 1024 / 1024;
      // 判断文件类型
      if (extension !== 'xlsx' && extension !== 'xls') {
        this.$message.warning('只能上传后缀是.xlsx或者.xls的文件');
        return
      }
      // 限制上传文件的大小
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M');
        return
      }

      var formData = new FormData()
      formData.append('file', this.fileList[0])
      formData.append('ask_id', this.askId)
      this.importFormSubmitLoading = true
      this.$http.post(API.quickQuestionImport, formData)
        .then(res => {
          this.importFormSubmitLoading = false
          if (res.code === 200) {
            this.$message.success('导入成功')
            this.closeImportForm()
          } else {
            this.$message.error(res.msg)
          }
        })
    },

    closeImportForm() {
      this.showImportDialog = false
      this.$refs.importForm.resetFields()
      this.fileList = []
    },

    beforeUpload(file) {
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isText && !isTextComputer) {
        this.$message.warning('请上传excel格式文件！')
      }
      return isText || isTextComputer
    },

  },
}
</script>
<style lang='scss' scoped>
</style>
