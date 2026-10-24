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


          <el-form-item label="课程名称">
            <el-input
              v-model="listQuery.name"
              clearable
              class="filter-item"
              placeholder="请输入课程名称"/>
          </el-form-item>

          <el-form-item label="课程ID">
            <el-input
              v-model="listQuery.courseId"
              clearable
              class="filter-item"
              placeholder="请输入课程ID"/>
          </el-form-item>

          <el-form-item label="关联状态">
            <el-select
              v-model="listQuery.status"
              clearable
              filterable
              placeholder="请选择关联状态">
              <el-option v-for="item in statusList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"/>
            </el-select>
          </el-form-item>

          
          


          <el-form-item>
            <el-button
              type="primary"
              align="right"
              @click="searchForm">
              <i class="el-icon-search"/>
              <span> 搜索</span>
            </el-button>
            <el-button
              @click="addClick"
              v-if="rollType == 1 || rollType == 2"
              type="primary">
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
          <img width="60" :src="scope.row.course_img" alt="pic" v-if="item.key=='course_img'" />
          <span v-else-if="item.key=='status' || item.key=='course_status'">{{ scope.row[item.key]==1? '上线':(scope.row[item.key]==2? '下架':'下架')}}</span>
          <span v-else-if="item.key=='recommend'">{{ scope.row[item.key]==1? '推荐':'-'}}</span>
          <span v-else-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

              <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
              <el-button
                        size="mini"
                        icon="el-icon-document-copy"
                        @click="handleCopy(scope.row.link, $event)"
                        v-else-if="item.key=='link'" 
                      >
                        复制
      </el-button>
              <span v-else>{{ scope.row[item.key] }}</span>
        </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          :width="200"
        >
          <template slot-scope="{row}">
  
            <el-button
              type="danger"
              class="op-btn"
              plain
              size="mini"
              :loading="openLoading"
              @click="statusClick(row, 2, '下架')"
              v-if="row.status == 1"
            >
              下架
            </el-button>

            <el-button
              type="primary"
              class="op-btn"
              plain
              size="mini"
              :loading="openLoading"
              v-if="rollType == 1 || rollType == 2"
              @click="editClick(row)"
            >
              编辑
            </el-button>
            <el-button
              type="success"
              class="op-btn"
              plain
              size="mini"
              :loading="openLoading"
              @click="statusClick(row, 1, '上架')"
              v-if="row.status == 2"
            >
              上架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="total>0"
        :total="total"
        :current-page.sync="listQuery.page"
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size.sync="listQuery.limit"
        layout="prev, pager, next, jumper, ->, sizes, total"
        @current-change="handleCurrentChange"
      />
      <el-dialog :visible.sync="showPopFlag" v-if="showPopFlag"  :title="popPopTitle" width="60%">
        <el-form :model="popPopParams" :rules="rules" ref="form" label-width="150px">
        
         <el-form-item label="课程名称：" class="is-required">
          <el-select v-model="popPopParams.course_id" filterable remote reserve-keyword clearable placeholder="请输入课程名称关键词"
            :remote-method="courseSearch" :loading="courseSearchLoading" style="width:600px" >
            <el-option v-for="item in courseOptions" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否推荐：" prop="recommend" >
            <el-radio-group v-model="popPopParams.recommend">
            <el-radio :label="1">推荐</el-radio>
            <el-radio :label="2">不推荐</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="popPopParams.sort" :max="200000" :min="1" placeholder="越大越靠前"></el-input-number>
      </el-form-item>


          <el-form-item label="">
            <el-button @click="submitForm('form')" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>
  <script>
  import clip from "../../../../assets/js/clipboard" // use clipboard directly
  import vDialog from '../../../../components/Dialog/dialog.vue'

  export default {
    props: {
    popParams: Object,
    popTitle: String,
  },
    data(){
      return {

        total: 0,

        listQuery: {
          placeId: -1,
          categoryId: -1,
          courseId: '',
          name: '', //活动名称
          status: '',//活动状态  草稿 上架 下架
          page: 1,
          limit: 10,
        },

        statusList: [
          {name: '全部', value: ''},
          {name: '已上线', value: 1},
          {name: '草稿', value: 2},
          {name: '下架', value: 3},
        ],

        popId:1,


        tabList:[],
        tableConfig : [
          { label: 'ID', key: 'id' },
          { label: '课程图片', key: 'course_img' },
          { label: '课程ID', key: 'course_id' },
          { label: '课程名称', key: 'course_name' },
          { label: '排序', key: 'sort' },
          { label: '关联状态', key: 'status' },
          { label: '课程状态', key: 'course_status' },
          { label: '推荐状态', key: 'recommend' },
          { label: '更新时间', key: 'time' },
        ],
        
        listLoading:false,
        openLoading:false,
        popPoptitle:'',
        popPopParams:{
        },
        showPopFlag:false,

      rules: {
        course_id: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        recommend: [
          { required: true, message: '请选择推荐状态', trigger: 'change' }
        ],
      },
      courseSearchLoading: false,
      courseOptions: [],

      }
    },
    created() {
      this.rollType = this.$storage.get('PE_USER_INFO').type
      this.listQuery.placeId = this.popParams.place_id
      this.listQuery.categoryId = this.popParams.id
      this.contentPopTitle = this.popTitle + "关联课程列表"
    },
    mounted(){
      this.getTabList();
    },
    components:{vDialog},
    methods:{

      courseSearch(query) {
      if (query !== '') {
        this.courseSearchLoading = true
        let params = {
          name: query,
          placeId: this.popParams.place_id,
        }
        this.$http.get(API.courseSearch, {...params}).then(res => {
          if (res.code == 200) {
            this.courseSearchLoading = false
            this.courseOptions = res.data

          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.courseOptions = [];
      }
    },
      backListClick() {
      this.$emit('backList', this.ruleForm)
    },
 

      handleCopy(text, event) {
        clip(text, event)
      },

      addClick() {
          this.popPopTitle = "添加" + this.popTitle +"关联课程"
          this.popPopParams = {
            recommend: 2,
          }
          this.showPopFlag = true
      },
      
      editClick(row) {
          this.popPopTitle = "编辑"+ this.popTitle +"关联课程"
          this.popPopParams = row
          this.courseOptions = [
            {
              id: row.course_id,
              title: row.course_name
            }
          ]
          this.showPopFlag = true
      },
    
      statusClick(row, status, tip) {
        this.$confirm('此操作将'+tip+'关联课程, 是否继续?', '提示', {
          confirmButtonText: tip,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.openLoading = true

          this.$http.post(API.courseCategoryCourseStatus,{id:row.id, status:status}).then((res) => {
            if (res.code === 200) {
              this.openLoading = false
              this.getTabList();
              this.$message({
                type: 'success',
                message: '完成'
              })
            }else {
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
      searchForm(){
        this.listQuery.page = 1
        this.getTabList()
      },
      

      getTabList(){
        this.listLoading = true
        this.$http.get(API.courseCategoryCourseList,{...this.listQuery}).then(res => {
          this.listLoading = false
          if (res.code == 200) {
            this.tabList = res.data.data
            this.total = res.data.count
            // console.log(this.tabList, "tabList")
          } else {
            this.$message.error(res.msg)
          }
        })
      },
    
      handleCurrentChange(page){
        this.listQuery.page = page
        this.getTabList()
      },

      submitForm(formName) {
        this.popPopParams.place_id = this.popParams.place_id
        this.popPopParams.category_id = this.popParams.id
        this.$refs[formName].validate((valid, object) => {
        if(valid) {
            this.loading = true
            this.$http.post(API.courseCategoryCourseSave, this.popPopParams).then(res => {
                
                if (res.code === 200) {
                    this.$message.success('保存成功')
                    setTimeout(() => {
                        this.showPopFlag = false
                        this.getTabList()
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
    }
  }
  </script>
  <style lang="scss">
    .op-btn {
      margin-bottom: 5px !important;
    }
    .el-upload-list__item {
        transition: none !important;
      }
    .cfd-div{
      background: #eaeaea; padding:10px; margin-top:10px;
      p{margin-bottom:5px;}
      ul{
        list-style: disc; margin-left:20px;
        li{ line-height: 26px; font-size:12px;}
      }
    }  
    .place-wrap{
      .flex-form{
        .el-form-item__content{display: flex !important;}
      }
    
    }
    
  </style>
