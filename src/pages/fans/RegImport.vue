<template>
    <div class="place-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right"  >
      <el-breadcrumb-item>店员导入</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
        <el-card class="box-card" shadow="never">
            <el-form ref="listQuery"
                :model="listQuery"
                class="form-container"
                inline>

                <el-form-item
              label="所属渠道"
              v-if="rollType == 1"
            >
             <el-select
                  v-model="listQuery.placeId"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in queryPlaceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
            </el-form-item>
             <el-form-item label="所属行业">
            <el-select
              v-model="listQuery.userType"
              clearable
              filterable
              placeholder="所属行业">
              <el-option v-for="item in userTypeList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"/>
            </el-select>
          </el-form-item>
            <el-form-item label="连锁名称">
                <el-select v-model="listQuery.chainId" filterable remote reserve-keyword clearable placeholder="请输入连锁名称关键词"
                  :remote-method="queryChainSearch" :loading="chainLoading">
                  <el-option v-for="item in chainOptions" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

                <el-form-item label="姓名">
                    <el-input
                        v-model="listQuery.name"
                        clearable
                        class="filter-item"
                        placeholder="请输入姓名"/>
                </el-form-item>
           
                <el-form-item label="手机号">
                    <el-input
                        v-model="listQuery.mobile"
                        clearable
                        class="filter-item"
                        placeholder="请输入手机号"/>
                </el-form-item>

                <el-form-item>
                <el-button
                    type="primary"
                    align="right"
                    @click="getList">
                    <i class="el-icon-search"/>
                    <span> 搜索</span>
                </el-button>

                <!-- <el-button
                type="success"
                class="op-btn"
                plain
                @click="addClick()"
            >
                添加
          </el-button> -->
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
            <span v-else-if="item.key == 'placeName'">
              {{ placeMap[scope.row['place_id']] ? placeMap[scope.row['place_id']] : '渠道' }}
            </span>
            <span v-else-if="item.key == 'typeName'">
              {{ typeMap[scope.row['type']] ? typeMap[scope.row['type']] : '未知' }}
            </span>
            <span v-else-if="item.key=='store_adcode'">{{ adCodeToTxt(scope.row.store_adcode)}}</span>
    
            <span v-else-if="item.key=='user_type'">
            {{ userTypeMap[scope.row['user_type']] ? userTypeMap[scope.row['user_type']] : '--' }}
          </span>
          <span v-else-if="item.key=='type'">
            {{ idTypeMap[scope.row['type']] ? idTypeMap[scope.row['type']] : '--' }}
          </span>
            <span v-else-if="item.key=='business_id_type'">
              {{ businessUserTypeMap[scope.row['business_id_type']] ? businessUserTypeMap[scope.row['business_id_type']] : '--' }}
          </span>
           <span v-else-if="item.key=='clinic_id_type'">
            {{ clinicUserTypeMap[scope.row['clinic_id_type']] ? clinicUserTypeMap[scope.row['clinic_id_type']] : '--' }}  
            </span>
            
            <span v-else>{{ scope.row[item.key] }}</span>
        </template>
        </el-table-column>
        <!-- <el-table-column
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
         
          
            </template>
        </el-table-column> -->
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
                  <el-form-item label="连锁名称" class="is-required">
                    <el-select v-model="popParams.chain_id" filterable remote reserve-keyword clearable placeholder="请输入连锁名称关键词"
                      :remote-method="addChainSearch" :loading="addChainLoading" style="width:600px" >
                      <el-option v-for="item in addChainOptions" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="门店名称：" prop="store_name">
                        <el-input v-model="popParams.store_name" style="width:600px" placeholder="请输入门店名称"></el-input>
                    </el-form-item>
                  <el-form-item label="用户名：" prop="name">
                    <el-input v-model="popParams.name" style="width:600px" placeholder="请输入问题用户名"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名：" prop="name">
                    <el-input v-model="popParams.name" style="width:600px" placeholder="请输入问题用户名"></el-input>
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
                    <el-form-item label="用户身份：" prop="type">
                        <el-radio-group
                            v-model="popParams.type"
                        >
                            <el-radio label="1">店员</el-radio>
                            <el-radio label="2">店长</el-radio>
                            <el-radio label="3">药师</el-radio>
                            <el-radio label="4">其他</el-radio>
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

        <el-form-item label="选择渠道：" prop="place_id" v-if="rollType == 1">
        <el-select style="width: 300px;" v-model="importForm.place_id"  clearable filterable>
          <el-option v-for="item in incomePlaceList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
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

import { regionData,codeToText } from 'element-china-area-data'

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
        { label: '所属渠道', key: 'placeName' },
        { label: '用户名', key: 'name' },
        { label: '手机号', key: 'mobile' },
        { label: '区域', key: 'store_adcode' },

        { label: '行业', key: 'user_type' },

        { label: '零售身份', key: 'type' },
        { label: '连锁名称', key: 'chain_name' },
        { label: '门店名称', key: 'store_name' },


        { label: '商业身份', key: 'business_id_type' },
        { label: '企业名称', key: 'business_name' },
        { label: '企业二级部门', key: 'business_department_name' },

        { label: '诊所身份', key: 'clinic_id_type' },
        { label: '诊所名称', key: 'clinic_name' },

        { label: '更新时间', key: 'time' },
      ],


      listQuery: {
        userType: 0,
        mobile:'',
        name:'',
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
        place_id:'',

      },

      rollType: 5,

      incomePlaceList: [],
      // placeList:[],
      queryPlaceList: [],

      placeMap: {},

      // 用户身份： 0-未知 1-店员 2-店长 3-药师 4-其他
      typeMap: {  1:'店员', 2:'店长', 3:'药师', 4:'其他'},

      options: regionData,
      selOptions: [],
      selStoreOptions:[],
      codeToText:codeToText,

      chainLoading: false,
      chainOptions: [],
      addChainLoading: false,
      addChainOptions: [],

      // 行业身份： 0-未知 1-零售 2-商业 3-诊所
      userTypeOptions: [
        { text: '零售', value: 1 },
        { text: '商业', value: 2 },
        { text: '诊所', value: 3 },
      ],
      userTypeMap: { 1:'零售', 2:'商业', 3:'诊所'},
      userTypeList: [
        { name: '全部', value: 0 },
        { name: '零售', value: 1 },
        { name: '商业', value: 2 },
        { name: '诊所', value: 3 },
      ],


      idTypeOptions: [
        { text: '店长', value: 1 },
        { text: '店员', value: 2 },
        { text: '药师', value: 3 },
        { text: '其他', value: 4 },
      ],
      idTypeMap: { 1:'店长', 2:'店员', 3:'药师', 4:'其他'},
    

      businessUserTypeOptions: [
        { text: '业务员', value: 1 },
        { text: '开票员', value: 2 },
        { text: '采购员', value: 3 },
        { text: '其他', value: 4 },
      ],
      businessUserTypeMap: { 1:'业务员', 2:'开票员', 3:'采购员', 4:'其他'},

      clinicUserTypeOptions: [
        { text: '医生', value: 1 },
        { text: '护士', value: 2 },
        { text: '其他', value: 3 },
      ],
      clinicUserTypeMap: { 1:'医生', 2:'护士', 3:'其他'},


      businessUserTypeMap: { 1:'业务员', 2:'开票员', 3:'采购员', 4:'其他'},
      clinicUserTypeMap: { 1:'医生', 2:'护士', 3:'其他'},

    };
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType == 1) {
      this.getPlaceList()
    } else {
      this.tableConfig.shift()
    }
    this.getList()
   },
   components:{},
  methods: {
    addChainSearch(query) {
      this.chainSearch(query, 2)
    },
    queryChainSearch(query) {
      this.chainSearch(query, 1)
    },

    chainSearch(query, type) {
      if (query !== '') {
        if(type == 1) {
          this.chainLoading = true
        } else {
          this.addChainLoading = false
        }
        this.$http.get(API.getChainList + '?name=' + query).then(res => {
          if (res.code == 200) {
            if(type == 1) {
              this.chainLoading = false
              this.chainOptions = res.data
            } else {
              this.addChainLoading = false
              this.addChainOptions = res.data
            }
            

          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        if(type == 1) {
          this.chainOptions = []
        } else {
          this.addChainOptions = []
        }
      }
    },
    getPlaceList() {
      this.$http.get(API.getAllPlace).then(res => {
        if (res.code == 200) {
          // let js = {
          //   value:-1,name:'未归属渠道'
          // }
          // this.placeList = res.data

          let incomePlaceList = []

          let queryPlaceList = [{
            value: 0, name: '全部'
          }]

          let placeMap = {}

          res.data.forEach(el => {
            incomePlaceList.push(el)
            queryPlaceList.push(el)
            placeMap[el.id] = el.name
          });
          // let rs =  JSON.parse(JSON.stringify(res.data))
          // let query = JSON.parse(JSON.stringify(res.data))
          // rs.unshift(js)
          this.incomePlaceList = incomePlaceList

          // query.unshift({
          //   value:0,name:'全部'
          // })
          this.queryPlaceList = queryPlaceList
          this.placeMap = placeMap
          // console.log("queryPlaceList---", this.queryPlaceList)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    adCodeToTxt(adcode) {
      if (!adcode) {
        return '--'
      }
      let provideId = parseInt(adcode/10000)
      let cityId = parseInt(adcode/100)
      let txt = this.codeToText[provideId]
      if (!txt) {
        return '--'
      }
      if (provideId * 100 != cityId) {
        txt = txt + '/' + this.codeToText[cityId]
      }

       if (adcode != cityId * 100) {
        txt = txt + '/' + this.codeToText[adcode]
      }
      
      return txt
      
    },

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
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.$http.get(API.userRegImportList, {...this.listQuery}).then(res => {
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
                this.getList()
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
      this.importForm.place_id = ''
      this.showImportDialog = true
    },
    submitImportForm() {
      if (!this.importForm.place_id && this.rollType == 1) {
        return this.$message.warning('请选择归属渠道')
      }
      if (this.fileList.length === 0) {
        return this.$message.warning('请先选择要上传的文件');
      }

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
      formData.append('place_id', this.importForm.place_id)
      this.importFormSubmitLoading = true
      this.$http.post(API.userRegImportImport, formData)
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
