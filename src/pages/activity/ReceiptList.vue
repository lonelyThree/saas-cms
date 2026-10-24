<template>
  <div class="place-wrap" v-if="showType == 1" >
    <el-breadcrumb separator-class="el-icon-arrow-right"  >
      <el-breadcrumb-item>拍小票管理</el-breadcrumb-item>
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


        <el-form-item label="活动名称">
          <el-input
            v-model="listQuery.name"
            clearable
            class="filter-item"
            placeholder="请输入活动名称"/>
        </el-form-item>

        <el-form-item label="活动状态">
          <el-select
            v-model="listQuery.status"
            clearable
            filterable
            placeholder="请选择活动状态">
            <el-option v-for="item in statusList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value"/>
          </el-select>
        </el-form-item>

        
        

        <!-- <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="searchTime"
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item> -->


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
        <img width="60" :src="scope.row.img" alt="pic" v-if="item.key=='img'" />
        <img width="60" :src="scope.row.tip_img" alt="pic" v-else-if="item.key == 'tip_img'" />
        <span v-else-if="item.key == 'send_type'">{{ scope.row[item.key] == 1 ? '自动发放' :'手动发放' }}</span>
        <span v-else-if="item.key == 'type'">{{ scope.row[item.key] == 1 ? '小票' :'入库单' }}</span>
        <span v-else-if="item.key=='placeName'">
          {{placeMap[scope.row['place_id']]?placeMap[scope.row['place_id']]:'渠道'}}
        </span>
        <span v-else-if="item.key=='status'">{{ scope.row[item.key]==1? '上线':(scope.row[item.key]==2? '草稿':'下架')}}</span>
        <el-link type="primary" @click="userClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==1">用户</el-link>
         <el-link type="primary" @click="chainClick(scope.row)" v-else-if="item.key=='limit_type' && scope.row.limit_type==2">连锁</el-link>
         <el-link type="primary" @click="areaClick(scope.row)" v-else-if="item.key == 'limit_type' && scope.row.limit_type == 3">地区</el-link>
        <span v-else-if="item.key=='limit_type'">无限制</span>
        <span v-else-if="item.key=='money'">{{ scope.row['money']}}分</span>
        <span v-else-if="item.key=='date'">{{ scope.row['start_date'] | date2Format}}到{{ scope.row['end_date']  | date2Format}}</span>
        <span v-else-if="item.key=='limit_money'">{{ scope.row.limit_money }} / {{   scope.row.receive_money }}</span>
        <span v-else-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
            <span v-else-if="item.key == 'award_type'">{{ scope.row[item.key] == 2 ? '积分' :(scope.row[item.key] == 3 ? '星币' :'现金' )}}</span>
            <span v-else-if="item.key == 'auth_type'">{{ scope.row[item.key] == 2 ? '不需要'  :'需要' }}</span>
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
            @click="statusClick(row, 3, '下架')"
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

           <el-button
              type="warning"
              class="op-btn"
              plain
              size="mini"
              v-if="row.status != 2"
              @click="showUserClick(row)"
            >
              参与人员
            </el-button>
         
            <el-button
                type="primary"
                class="op-btn"
                plain
                size="mini"
                @click="showChainClick(row)"
                :loading="openLoading"
                v-if="row.status != 3"
              >
                连锁管理
              </el-button>

          <el-button
            type="warning"
            class="op-btn"
            plain
            size="mini"
            @click="showProClick(row)"
            :loading="openLoading"
            v-if="rollType == 1 || rollType == 2"
          >
            产品管理
          </el-button>

           <el-button
                type="warning"
                class="op-btn"
                plain
                size="mini"
                @click="showReceiptClick(row)"
                :loading="openLoading"
                
              >
                小票
              </el-button>

          <el-button
            type="primary"
            class="op-btn"
            plain
            size="mini"
            @click="showAwardsClick(row)"
            v-if="row.rank_status == 1"
          >
            奖品管理
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
  </div>
    <receiptEdit
           @backList="BackList"
           :popParams="popParams"
           :popTitle="popTitle"
           :incomePlaceList="incomePlaceList"
           :fileList="fileList"
           :fileTipList="fileTipList"
            v-else-if="showType == 2" />
  <receiptPro
    @proChainClick="proChainClick"
    @backList="BackList"
    :receiptId= "receiptId"
    :popTitle="popTitle"
    v-else-if="showType == 3" />
<receiptChain
        @backList="BackList"
        :receiptId= "receiptId"
        :popTitle="popTitle"
        v-else-if="showType == 8" />
  <receiptArea
      @backList="BackList"
      :receiptId= "receiptId"
      :popTitle="popTitle"
      v-else-if="showType == 6" />
  <receiptReceipt
             @backList="BackList"

             @proChainClick="proChainClick"
             @viewUserClick="viewUserClick"
             :receiptId = "receiptId"
             :sendType= "popParams.send_type"
             :openid="showOpenid"
             :popParams="popParams"
             :popTitle = "popTitle" v-else-if="showType == 9"  />
  <receiptAward
    @backList="BackList"
    :popTitle="popTitle"
    :aId = "receiptId" v-else-if="showType == 10" />

  
<receiptProChain
        @backList="BackList"
        :receiptId= "receiptId"
        :proId= "proId"
        :popTitle="popTitle"
        v-else-if="showType == 11" />
  <receiptUser
           @backList="BackList"
           @viewReceiptClick="viewReceiptClick"
           :receiptId = "receiptId"
           :openid="showOpenid"
            :popParams="popParams"
           :popTitle = "popTitle" v-else />
</template>
<script>
import clip from "../../assets/js/clipboard" // use clipboard directly

import receiptEdit from "./modules/receipt/edit.vue";
import receiptChain from "./modules/receipt/chain.vue";

import receiptPro from "./modules/receipt/pro.vue";
import receiptArea from "./modules/receipt/area.vue";

import receiptUser from "./modules/receipt/user.vue";
import receiptReceipt from "./modules/receipt/receipt.vue";

import receiptAward from "./modules/receipt/award.vue";


import receiptProChain from "./modules/receipt/pro_chain.vue";

import vDialog from './dialog.vue'
export default {
  data(){
    return {
      showType:1, // 1 列表  2 添加/编辑活动 3 产品管理 4 白名单管理 5 连锁管理 6 区域管理 7 参与人员管理 8 连锁管理 9 小票管理 10 奖品管理 11 连锁红包

      record:false,
      recipe:false,
      total:0,
       pickerOptions0: {
        // disabledDate(time) {
        //   // return time.getTime() > new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        // }
      },
      searchTime:'',
      listQuery: {
        name: '', //活动名称
        status: '',//活动状态  草稿 上架 下架
        page: 1,
        limit: 10,
        startTime: 0,
        endTime: 0,
        placeId: '', //所属渠道
      },

      statusList: [
        {name: '全部', value: ''},
        {name: '已上线', value: 1},
        {name: '草稿', value: 2},
        {name: '下架', value: 3},
      ],
      incomePlaceList:[],
      // placeList:[],
      queryPlaceList:[],

      placeMap:{},


      receiptId:1,


      tabList:[],
      tableConfig : [
        { label: 'ID', key: 'id' },
        { label: '渠道名称', key: 'placeName' },
        { label: '活动图片', key: 'img', width:'100px' },
        { label: '提示图片', key: 'tip_img', width: '100px' },
        { label: '活动类型', key: 'type' },
        { label: '认证类型', key: 'auth_type' },
        { label: '活动名称', key: 'title' },
        { label: '活动状态', key: 'status' },
        { label: '每题红包(分)', key: 'money' },
        { label: '规则限制', key: 'limit_type' },
        { label: '奖励类型', key: 'award_type' },
        { label: '活动限额(分)', key: 'limit_money' },
        // { label: '超时时间', key: 'timeout' },
        // { label: '参与人数', key: 'joinCnt' },
        { label: '活动日期', key: 'date' },

        { label: '活动地址', key: 'link' },
        { label: '更新时间', key: 'time' },
      ],
      
      fileList:[],
      fileTipList:[],
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
      },
      fileList:[],

      changeFlag:false,
      openLoading:false,

      currentDate:0,
      showOpenid:'',

      rollType:5,

      proId:0,
    }
  },
  created() {
    this.rollType = this.$storage.get('PE_USER_INFO').type
    if (this.rollType == 1) {
      this.getPlaceList()
    } else {
      this.tableConfig.shift()
      this.tableConfig.shift()
    }
  },
  mounted(){
    // this.getPlaceList()
    this.getTabList();
  },
  components:{vDialog, receiptPro, receiptChain,receiptEdit, receiptUser, receiptReceipt, receiptArea, receiptAward, receiptProChain},
  methods:{
    showAwardsClick(row) {
      this.receiptId = row.id
      this.popTitle = "【拍小票】活动【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】问题管理"
      this.showType = 10
      
    },

    handleCopy(text, event) {
      clip(text, event)
    },

    userClick() {
      this.$message.info('暂不支持用户白名单编辑')
    },
    chainClick() {
      this.$message.info('暂不支持连锁白名单编辑')
    },

    delClick(){
        this.$message.info('暂不支持删除')
    },
    addClick() {
        this.popTitle = "添加【拍小票】活动"
        this.popParams = {
          rank_status:2,
          award_type:1,
        }
        this.fileList=[]
        this.fileTipList = []
        this.showType = 2
    },
    showUserClick(row) {
      this.popTitle = "【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】参与人员"
      this.receiptId = row.id
      this.popParams = row
      this.showOpenid = ''
      this.showType = 7
    },
    viewUserClick(obj) {
      this.popTitle = "【" + (this.placeMap[obj.popParams.place_id] ? this.placeMap[obj.popParams.place_id] : '渠道') + "】【" + obj.popParams.title + "】参与人员"
      this.receiptId = obj.popParams.id
      this.showOpenid =  obj.openid
      this.showType = 7
    },

    proChainClick(obj) {
      this.popTitle = obj.popTitle + "【" + obj.name + "】("+obj.money+"分)连锁红包"
      this.receiptId = obj.receiptId
      this.proId = obj.proId

      this.showType = 11
    },
    viewReceiptClick(obj) {
      this.popTitle = "【" + (this.placeMap[obj.popParams.place_id] ? this.placeMap[obj.popParams.place_id] : '渠道') + "】【" + obj.popParams.title + "】小票管理"
      this.receiptId = obj.popParams.id
      this.showOpenid = obj.openid
      this.showType = 9
    },
    showReceiptClick(row) {
       this.popTitle = "【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】小票管理"
      this.receiptId = row.id
      this.popParams = row
      this.showOpenid = ''
      this.showType = 9
    },
    areaClick(row) {
      this.popTitle = "选择【" + (this.placeMap[row.place_id] ? this.placeMap[row.place_id] : '渠道') + "】【" + row.title + "】地区"
      this.receiptId = row.id
      this.showType = 6
      console.log("areaClick===areaClick", row)
    },
    editClick(row) {
        this.popTitle = "编辑【拍小票】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】"
        this.popParams = row
        this.popParams.start_date = row.start_date+""
        this.popParams.end_date = row.end_date+""
        this.fileList=[]
        this.fileTipList = []
        this.fileList.push({'url':row.img})

        this.fileTipList.push({ 'url': row.tip_img })
        this.showType = 2
    },
    showProClick(row) {
        this.popTitle = "【拍小票】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】产品管理"
        this.receiptId = row.id
        this.showType = 3
    },
    showChainClick(row) {
        this.popTitle = "【拍小票】活动【"+(this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道')+"】【"+row.title+"】连锁管理"
        this.receiptId = row.id
        this.showType = 8
    },
    showQuestionClick(row) {
      this.askRankId = row.id
      this.askRankName = row.title
      this.placeName = this.placeMap[row.place_id]?this.placeMap[row.place_id]:'渠道'
      this.showType = 3
      
    },
    statusClick(row, status, tip) {
      this.$confirm('此操作将'+tip+'活动, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.receiptStatus,{id:row.id, status:status}).then((res) => {
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
    BackList() {
      console.log("BackList", "BackList[[[]]]")
      this.showType = 1
      this.getTabList()
    },
    editSubmitForm() {

    },
    editBackForm() {

    },
    getPlaceList(){
        this.$http.get(API.getAllPlace).then(res => {
        if (res.code == 200) {
          // let js = {
          //   value:-1,name:'未归属渠道'
          // }
          // this.placeList = res.data

          let incomePlaceList = [{
            value:-1,name:'未归属渠道'
          }]

          let queryPlaceList = [{
            value:0,name:'全部'
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
    bef(done){
      // alert(1)
    },
    changeEl(){
      // console.log(222)
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
                  if (res.code === 200) {
                    this.showDetailFlag = false;
                    this.getTabList();
                    this.$message({
                      type: 'success',
                      message: '完成！'
                    })
                  }else {
                    this.$message.error(res.msg)
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
      let date = new Date()
      this.currentDate = date.getFullYear() * 10000 + (date.getMonth() + 1)*100 + date.getDate()
      if (this.searchTime && this.searchTime.length == 2) {
        this.listQuery.startTime = this.searchTime[0] / 1000
        this.listQuery.endTime = this.searchTime[1] / 1000 
      }
      this.listLoading = true
      this.$http.get(API.receiptList,{...this.listQuery}).then(res => {
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
