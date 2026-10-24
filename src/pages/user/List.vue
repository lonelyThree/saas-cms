<template>
  <div class="place-wrap">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="never">
        <el-form
        ref="listQuery"
        :model="listQuery"
        class="form-container"
        inline
      >
       <el-form-item
          label="渠道名称"
        >
          <el-input
            v-model="listQuery.name"
            clearable
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入渠道名称"
          />
        </el-form-item>
         <el-form-item
          label="渠道号"
        >
          <el-input
            v-model="listQuery.place"
            clearable
            style="width: 200px;"
            class="filter-item"
            placeholder="请输入渠道号"
          />
        </el-form-item>
        <el-form-item>
           <el-button
            type="primary"
            align="right"
            @click="searchForm"
          >
            <i class="el-icon-search" />
            <span> 搜索</span>
          </el-button>
          <el-button @click="add"  type="primary">
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
            <span v-if="item.key=='type'">{{ scope.row[item.key]==1? '公众号授权':'公众号无授权' }}</span>
            <span v-else-if="item.key=='check_store'">{{ scope.row[item.key]==1?'不校验库存':'库存校验' }}</span>
            <span v-else-if="item.key === 'eyeOpen'" @click="changeEye(scope.row, scope.$index)">
              <i class="el-icon-eye-open eye-icon" v-if="scope.row.eyeOpen"></i>
              <i class="el-icon-eye-close eye-icon" v-if="!scope.row.eyeOpen"></i>
            </span>
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
            plain
            size="mini"
            @click="showDetail(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            @click="delDetail(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :page-sizes="[10]"
      limit.sync="10"
      @current-change="handleCurrentChange"
    />
    <v-dialog :visible.sync="showDetailFlag" :title="poptitle" width="52%" :destroy-on-close='true'>
      <el-form :model="popParams" :rules="rules" ref="form" label-width="150px">
          <el-form-item label="渠道名称(公众号)：" prop="name">
            <el-input v-model="popParams.name" style="width:200px" placeholder="请输入渠道名称"></el-input>
          </el-form-item>
          <el-form-item label="APPID：" prop="appid">
              <el-input v-model="popParams.appid" style="width:200px" placeholder="请输入APPID"></el-input>
          </el-form-item>
          <el-form-item label="渠道号：" prop="place">
              <el-input v-model="popParams.place" style="width:200px" placeholder="请输入渠道号"></el-input>
          </el-form-item>
           <el-form-item label="渠道类型：" prop="type">
            <el-select v-model="popParams.type" placeholder="请选择" filterable>
                <el-option
                  v-for="item in chainType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="是否校验库存：" prop="check_store">
            <el-select v-model="popParams.check_store" placeholder="请选择是否校验" filterable>
                <el-option
                  v-for="item in totalCheckList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="渠道业务场景：" prop="scenario">
            <el-select @change="changeScenario" v-model="popParams.scenario" placeholder="请选择业务场景" filterable>
                <el-option
                  v-for="item in placeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <p style="line-height: 20px; margin-top: 10px;color: #D28EFF;">药店场景下，渠道管理员后台的统计报表中将不显示药企业务代表信息</p>
              <p style="line-height: 20px; margin-top: 5px;color: #D28EFF;">“处方对接第三方”场景下，患者端基本配置中，处方单“一键购药”按钮的跳转配置将禁用</p>
              <div class="cfd-div" v-if="popParams.scenario==3">
                <h3>处方单“一键购药”跳转地址：</h3>
                <p><el-input v-model="popParams.sce_url" placeholder="请联系对方索要"></el-input></p>
                <ul>
                  <li>如果第三方从接口传了跳转地址，则以接口为准；</li>
                  <li>走续方复购的处方单“一键购药”，跳转地址以此处配置为准；</li>
                  <li>如果此处不填，且未从接口传跳转地址，则处方单隐藏“一键购药”按钮</li>
                </ul>
              </div>
          </el-form-item>
          <el-form-item class="flex-form" label="" label-width="45px">
              <el-checkbox @change="changeEl" v-model="record">是否回传问诊单信息</el-checkbox>
              <el-input :disabled="!record" style="width:300px; margin-left:10px;" v-model="popParams.record_url" placeholder="请联系对接方索要回调地址"></el-input>
          </el-form-item>
          <el-form-item class="flex-form" label="" label-width="45px">
              <el-checkbox @change="changeEl" v-model="recipe">是否回传处方单信息</el-checkbox>
              <el-input :disabled="!recipe" style="width:300px; margin-left:10px;" v-model="popParams.recipe_url" placeholder="请联系对接方索要回调地址"></el-input>
          </el-form-item>
          <el-form-item label="IP白名单：" >
            <el-input type="textarea" v-model="popParams.ip" style="width:400px" placeholder='多个IP地址用英文“;”隔开'></el-input>
          </el-form-item>
          <el-form-item class="is-required" label="渠道LOGO：" prop="logo">
            <el-upload
              class="upload-demo"
              action="#"
              :file-list="fileList"
              :on-change="handleChange"
              :http-request="uploadSectionFile"
              list-type="picture-card"
              :before-remove="handleRemove"
              >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div v-if="fileList.length==0&&changeFlag" class="el-form-item__error">请上传图片</div>
          </el-form-item>
          <el-form-item label="">
               <el-button @click="submitForm('form')" type="primary" >确定</el-button>
          </el-form-item>
      </el-form>
    </v-dialog>
  </div>
</template>
<script>
import vDialog from './dialog.vue'
export default {
  data(){
    return {
      record:false,
      recipe:false,
      total:0,
      listQuery:{
          name:'',
          place:'',
          page:1,
          limit:10,
        },
      tabList:[],
      tableConfig : [
        { label: '查看', key: 'eyeOpen' },
        { label: '渠道名称', key: 'name' },
        { label: 'APPID', key: 'appid' },
        { label: '渠道号', key: 'place' },
        { label: '渠道类型', key: 'type' },
        { label: '渠道业务场景', key: 'name' },
        { label: '库存校验', key: 'check_store' },
        { label: 'appkey', key: 'appkey' },
        { label: 'secret', key: 'secret' },
      ],
      chainType:[
        {name:'公众号授权',id:1},
        {name:'公众号无授权',id:2}
      ],
      totalCheckList:[
        {name:'不校验',id:1},
        {name:'校验库存',id:2},
      ],
      placeList:[
        {name:'药企场景',id:1},
        {name:'药店场景',id:2},
        {name:'处方对接第三方',id:3},
      ],
      fileList:[],
      listLoading:false,
      showDetailFlag:false,
      tempData: { secret: ''},
      poptitle:'',
      rules:{
        name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }, ],
        appid: [{ required: true, message: '请输入APPID', trigger: 'blur' }, ],
        place: [{ required: true, message: '请输入渠道号', trigger: 'blur' }, ],
        type: [{ required: true, message: '请选择渠道类型', trigger: 'change' }, ],
        check_store: [{ required: true, message: '请选择是否校验', trigger: 'change' }],
        scenario: [{ required: true, message: '请选择业务场景', trigger: 'change' }],
        // logo: [{ required: true, message: '请上传企业LOGO' }]
      },
      popParams:{
        id:'',
        name:'',
        appid:'',
        place:'',
        type:'',
        check_store:'',
        scenario:'',
        logo:'',
        file:'',
        ip:'',
        sce_url:'',//一键购药跳转地址
        recipe_url:'',//处方回调url
        record_url:''//问诊记录回调url
      },
      changeFlag:false
    }
  },
  mounted(){
    this.getTabList();
  },
  components:{vDialog},
  methods:{
    bef(done){
      // alert(1)
    },
    changeEl(){
      console.log(222)
      if(!this.recipe){
          this.popParams.recipe_url=''
      }
      if(!this.record){
          this.popParams.record_url=''
      }
    },
    changeScenario(){
      if(this.popParams.id&&this.popParams.scenario!=3){
          this.popParams.sce_url = ''
      }
    },
    submitForm(formName) {
        this.changeFlag =true;
        this.$refs[formName].validate((valid) => {
          if (valid && this.popParams.logo) {
               this.$http.post(API.addPlace,{...this.popParams}).then((res) => {
                  if (res.status === 200) {
                    this.showDetailFlag = false;
                     this.getTabList();
                    this.$message({
                      type: 'success',
                      message: '完成！'
                    })
                  }else {
                    this.$message.error(res.message)
                  }
                })
          } else {
            return false;
          }
        });
      },
    searchForm(){
       this.listQuery.page = 1
      this.getTabList()
    },
    handleChange(file, fileList){
      this.changeFlag = true;
      if (fileList.length > 0) {
                this.fileList = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的csv文件
            }
      },
    handleRemove() {
      this.fileList=[];
      this.popParams.logo = ''
    },
    uploadSectionFile(param) {
        const file = param.file
        const form = new FormData()
        // 文件对象
        form.append('type', '1')
        form.append('file', file)
        this.$http.post(API.upload,form).then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '上传成功！'
            })
            this.popParams.logo = res.url
          }else {
            this.$message.error(res.message)
          }
        })
          const prom = new Promise((resolve, reject) => {})
              prom.abort = () => {}
              return prom
      },
    changeEye(row,i){
      if(row.eyeOpen){
          row.eyeOpen = false
          this.tabList[i].secret = this.tempData.secret
      }else{
          row.eyeOpen = true
          this.$http.post(API.getPlaceSecret,{id:row.id}).then(res => {
        if (res.status == 200) {
            this.tempData.secret = row.secret
            this.tabList[i].secret = res.data.secret
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },

    getTabList(){
      this.listLoading = true
      this.$http.get(API.getPlaceList,{...this.listQuery}).then(res => {

        this.listLoading = false
        if (res.status == 200) {
          this.tabList = res.data.data
          this.total = res.count
        } else {
          this.$message.error(res.message)
        }
      })
    },
    showDetail(row){
      this.poptitle = '编辑渠道'
      this.showDetailFlag = true
      this.popParams =  JSON.parse(JSON.stringify(row))
      delete this.popParams.appkey;
      delete this.popParams.secret;
      if(this.popParams.eyeOpen){
        delete this.popParams.eyeOpen;
      }
      
      this.fileList=[];
      this.fileList.push({'url':row.logo})
      if(this.popParams.recipe_url){
        this.recipe = true
      }
      if(this.popParams.record_url){
        this.record = true
      }
    },
    delDetail(row){
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$http.post(API.delPlace,{id:row.id}).then(res => {
            if (res.status == 200) {
               this.$message.success('删除成功！')
               this.getTabList();
            } else {
              this.$message.error(res.message)
            }
          })
        })
    },
    add(){
      this.showDetailFlag = true
      this.changeFlag = false;
       if (this.$refs.form!==undefined) {
           this.popParams=Object.assign({}, undefined);//重置表单
          this.$refs.form.resetFields();
      }
      this.fileList=[]
      this.poptitle = '新增渠道'
      this.record = false
      this.recipe = false
    },
     handleCurrentChange(page){
      this.listQuery.page = page
      this.getTabList()
    },
  }
}
</script>
<style lang="scss">
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
