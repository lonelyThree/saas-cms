<template>
    <div class="place-wrap">
        <el-page-header @back="backListClick" :content="contentPopTitle">
        </el-page-header>
        <el-divider></el-divider>
        <el-card class="box-card" shadow="never">
            <el-form ref="listQuery"
                :model="listQuery"
                class="form-container"
                inline>

  
           
                <el-form-item label="题目名称">
                    <el-input
                        v-model="listQuery.name"
                        clearable
                        class="filter-item"
                        placeholder="请输入题目名称"/>
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
            <span v-else-if="item.key == 'type'">{{ scope.row[item.key] == 1 ? '单选' : (scope.row[item.key] == 3 ? '判断':'多选') }}</span>
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
              
              <el-form :model="popPopParams" :rules="rules" ref="form" label-width="180px">
                <el-form-item label="编号：" prop="index">
                    <el-input-number v-model="popPopParams.index" :max="1000" :min="1" placeholder="1~1000" :disabled="popPopParams.id" ></el-input-number>
                  </el-form-item>
                  <el-form-item label="题目：" prop="name">
                      <el-input v-model="popPopParams.name" style="width:600px" placeholder="请输入题目"></el-input>
                  </el-form-item>
                  <el-form-item label="类型：" prop="type">
                      <el-radio-group
                          v-model="popPopParams.type"
                      >
                          <el-radio :label="1">单选 </el-radio>
                          <el-radio :label="2">多选</el-radio>
                          <el-radio :label="3">判断</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="答案A：" prop="a">
                      <el-input v-model="popPopParams.a" style="width:600px" placeholder="请输入答案A"></el-input>
                  </el-form-item>
                  <el-form-item label="答案B：" prop="b">
                      <el-input v-model="popPopParams.b" style="width:600px" placeholder="请输入答B"></el-input>
                  </el-form-item>
                  <el-form-item label="答案C：" prop="c">
                      <el-input v-model="popPopParams.c" style="width:600px" placeholder="请输入答案C"></el-input>
                  </el-form-item>
                  <el-form-item label="答案D：" prop="d">
                      <el-input v-model="popPopParams.d" style="width:600px" placeholder="请输入答案D"></el-input>
                  </el-form-item>
                  <el-form-item label="答案E：" prop="e">
                      <el-input v-model="popPopParams.e" style="width:600px" placeholder="请输入答案E"></el-input>
                  </el-form-item>
                  <el-form-item label="正确答案：" prop="correct" 
                  v-if="popPopParams.type == 1">
                      <el-radio-group
                          v-model="popPopParams.correct"
                      >
                          <el-radio label="A">A</el-radio>
                          <el-radio label="B">B</el-radio>
                          <el-radio label="C">C</el-radio>
                          <el-radio label="D">D</el-radio>
                          <el-radio label="E">E</el-radio>
                      </el-radio-group>

                </el-form-item>
                <el-form-item label="正确答案：" prop="correct" 
                  v-else-if="popPopParams.type == 3">
                      <el-radio-group
                          v-model="popPopParams.correct"
                      >
                          <el-radio label="A">A</el-radio>
                          <el-radio label="B">B</el-radio>
                      </el-radio-group>

                </el-form-item>

                <el-form-item label="正确答案：" prop="checkList" v-else>
                  <el-checkbox-group v-model="popPopParams.checkList" @change="checkChange">
                    <el-checkbox label="A">A</el-checkbox>
                    <el-checkbox label="B">B</el-checkbox>
                    <el-checkbox label="C">C</el-checkbox>
                    <el-checkbox label="D">D</el-checkbox>
                    <el-checkbox label="E">E</el-checkbox>
                  </el-checkbox-group>

                </el-form-item>


                <el-form-item label="答案解析：" prop="analysis">
                  <el-input type="textarea" v-model="popPopParams.analysis" style="width:600px;" maxlength="500"
                   placeholder='' rows="6" show-word-limit></el-input>
                </el-form-item>

                  <el-form-item label="">
                      <el-button @click="submitForm('form')" type="primary" :loading="loading">确定</el-button>
                  </el-form-item>
              </el-form>
          </el-dialog>
    </div>

</template>
<script>

import vDialog from '../../../../components/Dialog/dialog.vue'

export default {
  props: {
    popParams: Object,
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
        { label: '类型', key: 'type' },
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
        placeId: -1,
        courseId: -1,
        questionId: -1,
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
      popPopParams: {

        placeId: -1,
        courseId: -1,
        questionId: -1,
        type:1,
        a: '',
        name: '',
        b: '',
        c: '',
        d: '',
        e: '',
        correct:'',
        checkList:[],
      },
      loading: false,
      rules: {
        index: [
          { type: 'number', required: true, message: '请输入问题编号', trigger: 'change' },
        ],
        name: [
          { required: true, message: '请输入题目名称', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        
        a: [
          { required: true, message: '请输入答案A', trigger: 'change' }
        ],

        b: [
          { required: true, message: '请输入答案B', trigger: 'change' }
        ],

        correct: [
          { required: true, message: '请选择正确的答案', trigger: 'change' }
        ],
        // checkList: [
        //   { required: true, message: '请选择正确的答案', trigger: 'change' }
        // ],
      },
      openLoading: false,


    };
  },
  created() {
    this.contentPopTitle = this.popTitle + '问答列表'
    this.listQuery.placeId = this.popParams.place_id
    this.listQuery.courseId = this.popParams.course_id
    this.listQuery.questionId = this.popParams.id
    this.getQuestionList()
   },
   components:{vDialog},
  methods: {
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
      this.popPopParams = {
        type:1,
        checkList:[]
      }
      this.popPopTitle = '添加'+ this.popTitle+'题目'
      this.showPopFlag = true
    },
    editClick(row) {
      this.popPopParams = row
      if(row.type == 1 || row.type == 3) {
        this.popPopParams.checkList = []
      } else {

        this.popPopParams.checkList = this.popPopParams.correct.split(',')
        this.popPopParams.correct = ''

      }
      this.popPopTitle = '编辑'+ this.popTitle+'题目'
      this.showPopFlag = true
    },
    handleCurrentChange(page){
      this.listQuery.page = page
      this.getQuestionList()
    },
    getQuestionList() {
      this.listLoading = true
      this.$http.get(API.courseTopicList, {...this.listQuery}).then(res => {
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

    this.popPopParams.placeId = this.popParams.place_id
    this.popPopParams.courseId = this.popParams.course_id
    this.popPopParams.questionid = this.popParams.id
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          if(this.popPopParams.type == 2) {
            let checkList = this.popPopParams.checkList
      
            checkList = checkList.filter(index => (index == 'A' || index == 'B' || index == 'C' || index == 'D' || index == 'E'))
            checkList.sort(function(a, b){
              return a < b ? -1 : 1
            })
            this.popPopParams.checkList = checkList
            if(this.popPopParams.checkList.length < 2) {
              this.$message.error("题目为多选， 请至少选择两个答案")
              return false;
            }
            this.popPopParams.correct = this.popPopParams.checkList.join(',')
          }
          
          if(this.popPopParams.d && this.popPopParams.d != "" && !this.popPopParams.c) {
            this.$message.error("请按照顺序补充答案C")
            return false;
          }
          if (this.popPopParams.e && this.popPopParams.e != "" && !this.popPopParams.d) {
            this.$message.error("请按照顺序补充答案D")
            return false;
          }

          if (this.popPopParams.type == 1 && this.popPopParams.correct == 'C' && !this.popPopParams.c) {
            this.$message.error("正确答案为C， 请补充答案C的内容")
            return false;
          }

          if (this.popPopParams.type == 1 && this.popPopParams.correct == 'D' && !this.popPopParams.d) {
            this.$message.error("正确答案为D， 请补充答案D的内容")
            return false;
          }

          if (this.popPopParams.type == 1 && this.popPopParams.correct == 'E' && !this.popPopParams.e) {
            this.$message.error("正确答案为E， 请补充答案E的内容")
            return false;
          }


          if (this.popPopParams.type == 2 && this.popPopParams.correct.indexOf('C') != -1  && !this.popPopParams.c) {
            this.$message.error("正确答案包含C， 请补充答案C的内容")
            return false;
          }

          if (this.popPopParams.type == 2 && this.popPopParams.correct.indexOf('D') != -1 && !this.popPopParams.d) {
            this.$message.error("正确答案包含D， 请补充答案D的内容")
            return false;
          }

          if (this.popPopParams.type == 2 && this.popPopParams.correct.indexOf('E') != -1  && !this.popPopParams.e) {
            this.$message.error("正确答案包含E， 请补充答案E的内容")
            return false;
          }

          if (this.popPopParams.type == 3 && this.popPopParams.correct != 'A' && this.popPopParams.correct != 'B') {
            this.$message.error("判断题答案必须是A或者B")
            return false;
          }

          if (this.popPopParams.type == 3 && (this.popPopParams.a == '' || this.popPopParams.b == '')) {
            this.$message.error("判断题A和B不能为空")
            return false;
          }

          if (this.popPopParams.type == 3 && (this.popPopParams.c || this.popPopParams.d  || this.popPopParams.e )) {
            console.log(this.popPopParams, "this.popPopParams")
            this.$message.error("判断题C、D、E不能有内容")
            return false;
          }


          this.loading = true
          this.$http.post(API.courseTopicSave, this.popPopParams).then(res => {

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
</style>
