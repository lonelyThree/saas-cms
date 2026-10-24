<template>
    <div>
        <el-page-header @back="backListClick" :content="popTitle">
        </el-page-header>
        <el-divider></el-divider>
        <el-card class="box-card" shadow="never">
            <el-form ref="listQuery"
                :model="listQuery"
                class="form-container"
                inline>
              <el-form-item label="类型" prop="type">
                <el-select v-model="listQuery.type" clearable filterable placeholder="请选择类型">
                  <el-option
                    v-for="item in aTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="状态" prop="status">
                <el-select v-model="listQuery.status" clearable filterable placeholder="请选择状态">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

                

                <el-form-item>
                <el-button
                    type="primary"
                    align="right"
                    @click="getList">
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
            
            <img width="60" :src="scope.row.img" alt="pic" v-if="item.key == 'img'" />
            <span v-else-if="item.key == 'time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat }}</span>
            <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
            
            <span v-else-if="item.key == 'type'">
                {{ aTypeMap[scope.row['type']] ? aTypeMap[scope.row['type']] : '未知' }}
              </span>
               <span v-else-if="item.key == 'award_type'">{{ scope.row[item.key] == 2 ? '积分' :(scope.row[item.key] == 3 ? '星币' :'现金' )}}</span>
            
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

              <el-button
            type="primary"
            class="op-btn"
            plain
            size="mini"
            :loading="openLoading"
            @click="editClick(row)"
          >
            编辑
          </el-button>

          <el-button type="info" class="op-btn" size="mini" @click="viewJoinClick(row)">
            邀请记录
          </el-button>

          <el-button
                    type="warning"
                    align="right"
                     size="mini"
                    @click="download(row)">
                    <i class="el-icon-download"/>
                    <span> 统计导出</span>
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

        <el-dialog :visible.sync="showPopFlag" :title="popPopTitle" width="60%" style="max-width: 1500px;">
            <el-form :model="popPopParams" :rules="rules" ref="form" label-width="180px">
                <el-form-item label="活动类型：" prop="type">
                  <el-radio-group
                      v-model="popPopParams.type"
                      @change="searchTypeChange"
                      :disabled="!isAdd"
                      class="custom-radio-group"
                  >
                      <el-radio :label="1">快问快答</el-radio>
                      <el-radio :label="2">开口说</el-radio>
                      <el-radio :label="3">拍小票</el-radio>
                      <el-radio :label="4">看视频</el-radio>
                      <el-radio :label="5">有奖分享</el-radio>
                      <el-radio :label="6">课程管理</el-radio>
                      <el-radio :label="7">投票管理</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="活动名称：" prop="aid">
      
                  <el-select v-model="popPopParams.aid"
                   v-if="isAdd"
                  style="width: 500px;"
                            filterable
                            remote
                            clearable
                            @clear="selectClear"
                            placeholder="请选择"
                            :remote-method="(val) => remoteMethod(val)"
                            @focus="focusMethod"
                            :loading="searchloading"
                           @change="$forceUpdate()"

                            :disabled="!isAdd"
                            >
                    <el-option
                      v-for="item in searchList"
                      :key="item.id"
                      :label="item.title + '(' + item.id + ')'"
                      :value="item.id"
                    >
                    </el-option>
                      <div style="float: right;margin-right:10px;padding-bottom: 10px">
                        <el-pagination
                          @current-change="handleSearchCurrentChange"
                          :current-page="searchQuery.page"
                          :page-size="searchQuery.limit"
                          layout=" prev, pager, next,total"
                          :total="searchTotal">
                        </el-pagination>
                      </div>
                  </el-select>
                  <el-input :value="popPopParams.name + '(' + popPopParams.id + ')'" style="width:600px" disabled  v-else></el-input>
                </el-form-item>

                <el-form-item label="奖励类型" prop="award_type" >
            <el-radio-group v-model=" popPopParams.award_type">
            <el-radio :label="1">红包</el-radio>
            <el-radio :label="2">积分</el-radio>
            <el-radio :label="3">星币</el-radio>
            </el-radio-group>
          </el-form-item>


        <el-form-item label="单次活动奖励(分)：" prop="money">
          <el-input-number v-model="popPopParams.money" :max="20000" :min="0" placeholder="10~20000"></el-input-number>
        </el-form-item>

                <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="popPopParams.sort" :max="200000" :min="1" placeholder="越小越靠前"></el-input-number>
      </el-form-item>
                <el-form-item label="">
                    <el-button @click="submitForm('form')" type="primary" :loading="loading">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

         <SalesManAwardDrawer :popTitle="salesManAwardDrawer.popTitle" :visible.sync="salesManAwardDrawer.visible" v-if="salesManAwardDrawer.visible"
          :bind_type="salesManAwardDrawer.bind_type" :bind_id="salesManAwardDrawer.bind_id" 
          :activity_type="salesManAwardDrawer.activity_type" :activity_id="salesManAwardDrawer.activity_id"
          @closeDrawer="closeSalesManAwardDrawer" />

    </div>
</template>
<script>

import SalesManAwardDrawer from '@/components/Drawer/SalesManAwardDrawer/index.vue';

export default {
  name: 'CounterBind', 


   components: { SalesManAwardDrawer },
  props: {
    popParams:Object,
    popTitle:String,
  },
  data() {
    return {

      formLabelWidth: '80px',

      aTypeList: [
  { label: '全部', value: 0 },
  { label: '快问快答', value: 1 },
  { label: '开口说', value: 2 },
  { label: '拍小票', value: 3 },
  { label: '看视频', value: 4 },
  { label: '有奖分享', value: 5 },
  { label: '课程管理', value: 6 },
  { label: '投票管理', value: 7 },
],
 
      aTypeMap:{
  1: '快问快答',
  2: '开口说',
  3: '拍小票',
  4: '看视频',
  5: '有奖分享',
  6: '课程管理',
  7: '投票管理',
},
      statusList: [
        { label: '全部', value: 0 },
        { label: '启用', value: 1 },
        { label: '禁用', value: 2 },
      ],

      total:0,
      tabList:[],
      tableConfig : [

        { label: '活动id', key: 'aid' },
        { label: '活动名称', key: 'name' },
        { label: '活动类型', key: 'type'},
        { label: '活动图片', key: 'img' , width:'100px'},

        { label: "奖励类型", key: "award_type" },
        { label: '单次活动奖励', key: 'money' },
        { label: '状态', key: 'status'},
         { label: '排序', key: 'sort' },
        { label: '更新时间', key: 'time' , width:'150px'},
        // // { label: '参与人数', key: 'joinCnt' },
        // { label: '开始日期', key: 'start_time' },
        // { label: '结束日期', key: 'end_time' },
      ],
      //3.78  37
      //22 25


      listQuery: {
        type:0,
        status:0,
        aid:0,
        counterId:0,

        page: 0,
        limit: 10,
      },

      searchQuery: {
        name:'',
        place_id:0,

        page: 1,
        limit: 10,
      },

      showPopFlag:false,
      popPopTitle:'',
      popPopParams:{
        type:1,
        aid:0,
      },
      loading:false,
      rules: {
        type: [
          { type: 'number', required: true,message: '请选择活动类型',trigger: 'change' }
        ],
        aid: [
          { type: 'number', required: true,message: '请选择活动',trigger: 'change' }
        ],
        award_type: [
          { type: 'number', required: true,message: '请选择奖励类型',trigger: 'change' }
        ],
        money: [
          { type: 'number', required: true,message: '请输入单次活动奖励金额',trigger: 'change' }
        ],
        sort: [
          { type: 'number', required: true,message: '请输入排序',trigger: 'change' }
        ],
      
      },

      searchloading:false,
      searchTotal:0,
      searchList:[],


      openLoading:false,
      isAdd:true,

      salesManAwardDrawer: {
        visible: false,
        loading: false,
        popTitle: '详情',
        bind_id: 0,
        bind_type: 0,
        activity_id: 0,
        activity_type: 0,
      },


    };
  },
  created() {
    console.log(this.popParams, "popParams")
    this.listQuery.counterId = this.popParams.id
    this.searchQuery.placeId = this.popParams.place_id
    // this.listQuery.aid = this.aid
    // this.listQuery.type = this.type
    this.getList()
   },
  methods: {
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '活动，是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.counterBindStatus, { id: row.id, status: status }).then((res) => {
          if (res.code === 200) {
            this.openLoading = false
            this.getList();
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

    //更新值
    updateValue(val) {

      // console.log('selectChange', val);
    },
    focusMethod: function () {
      if (!this.searchDataList || (this.searchDataList && this.searchDataList.length == 0)) {
        this.searchDataList();
      }
    },
    searchTypeChange() {
      this.popPopParams.aid = ''
      this.searchQuery.name = ''
      this.searchQuery.page = 1
      this.searchDataList()
    },
    selectClear: function () {
      this.searchQuery.name = ''
      this.searchQuery.page = 1
      this.searchDataList()
    },
    //翻页
    handleSearchCurrentChange(val) {
      this.searchQuery.page = val
      this.searchDataList()
    },
    remoteMethod(val) {
      this.searchQuery.name = val
      this.searchloading = true
      this.searchDataList()
    },

    searchDataList() {


      this.searchQuery.placeId = this.popParams.place_id
      let url = API.quickList
      switch (this.popPopParams.type) {
        case 2:
          url = API.speakList
          break;
        case 3:
          url = API.receiptList
          break;
        case 4:
          url = API.watchVideoList
          break;
        case 5:
          url = API.articleList
          break;
        case 6:
          url = API.courseList
          break;
        case 7:
          url = API.voteList
          break;

        default:
          break;
      }
      this.$http.get(url, { ...this.searchQuery }).then(res => {
        this.searchloading = false
        if (res.code == 200) {
          this.searchList = res.data.data
          this.searchTotal = res.data.count
          // console.log(this.tabList, "tabList")
        } else {
          this.$message.error(res.msg)
        }
      })
      
    },
    addClick() {
        this.popPopParams = {
          id: 0,
          type:1,
          aid:''
        }
        this.isAdd = true
    
        this.popPopTitle = '添加活动'
        this.showPopFlag = true
    },
    joinClick(row){
        this.$message.info('暂不支持')
    },
    editClick(row) {
        this.popPopParams = row
        this.isAdd = false
        this.popPopTitle = '编辑活动 【'+row.name+'】'
        this.showPopFlag = true
    },
    backListClick(){
        this.$emit('backList',this.ruleForm)
    },
    handleCurrentChange(page){
      this.listQuery.page = page
      this.getQuestionList()
    },
    getList() {
      this.listLoading = true
      this.listQuery.counterid = this.counterid
      this.$http.get(API.counterBindList, {...this.listQuery}).then(res => {
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
        this.popPopParams.counter_id = this.popParams.id
        this.popParams.place_id = this.popParams.place_id
        this.$refs[formName].validate((valid, object) => {
        if(valid && this.popPopParams.aid && this.popPopParams.award_type) {
            this.loading = true
            this.$http.post(API.counterBindSave, this.popPopParams).then(res => {
                
                if (res.code === 200) {
                    this.$message.success('保存成功')
                    setTimeout(() => {
                        this.showPopFlag = false
                        this.getList()
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
          if (!this.popPopParams.aid) {
            this.$message.error('请先选择活动')
            return false
          } else if (!this.popPopParams.award_type) {
            this.$message.error('请先选择奖励类型')
            return false
          }
          for (var i in object) {
            this.$message.error(object[i][0].message)
            return false
          }
          return false;
        }
      });
    },

    viewJoinClick(row) {

       this.salesManAwardDrawer = {
         visible: true,
         loading: false,
         popTitle: '【'+row.name+'】邀请记录',
         bind_type: 8, // Assuming bind_type is 1 for this example
         bind_id: row.id, // Assuming row has an id property
         activity_type: row.type,
         activity_id: row.aid,
       }
       console.log(this.salesManAwardDrawer, "salesManAwardDrawer")

  
    },

    closeSalesManAwardDrawer() {
      this.salesManAwardDrawer.visible = false;
    },
    download(row) {
      this.$http.download(API.domain+"CounterBindUserExport",{counterId:row.counter_id, 
        bind_id:row.id, aid:row.aid, type:row.type
      }).then(res => {
        if (res.status != 200) {
          this.$message.error('导出失败')
          return
        }
        if (res.data.type == 'application/json') {
          let reader = new FileReader();
          reader.readAsText(res.data, "utf-8");
        reader.onload = (e) => {
      let readerres = reader.result;
      let parseObj  = JSON.parse(readerres);
      this.$message.error(parseObj.msg?parseObj.msg:'导出失败')
    };
    return
    
          
        }
        let fileName = decodeURIComponent(res.headers["content-disposition"].split("=")[1])
        if (!res.data) { //data为axios返回的文件流
          this.$message.error('导出失败')
          return
        }
        const file = new Blob([res.data], { type: "application/vnd.ms-excel;charset=utf-8" });
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
            a.style.display = 'none'
            a.href = url // 指定下载链接
            a.download = fileName //指定下载文件名
            a.click() //触发下载
            URL.revokeObjectURL(a.href) //释放URL对象
      })
      
    }
  },
}
</script>
<style lang='scss' scoped>
/* 1. 容器设置为 Flex 布局，允许换行 */
.custom-radio-group {
  display: flex;
  flex-wrap: wrap; /* 关键：允许子元素换行 */
  gap: 10px 20px; /* 行间距 10px，列间距 20px */
}

/* 2. 修正每个 Radio 项的样式，确保对齐 */
:deep(.el-radio) {
  margin-right: 0; /* 清除默认右边距，由 gap 控制间距 */
  height: auto; /* 适应多行文本高度 */
  align-items: flex-start; /* 顶部对齐，防止多行时图标居中难看 */
}
</style>
