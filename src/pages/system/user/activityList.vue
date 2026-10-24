<template>
    <div class="place-wrap" v-if="dataType == 1">
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

                v-if="uid"
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
            <span v-else-if="item.key == 'placeName'">
              {{ placeMap[scope.row['place_id']] ? placeMap[scope.row['place_id']] : '渠道' }}
            </span>
            <span v-else-if="item.key == 'time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat }}</span>
            <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>
            
            <span v-else-if="item.key == 'type'">
                {{ aTypeMap[scope.row['type']] ? aTypeMap[scope.row['type']] : '未知' }}
              </span>
            
            <span v-else-if="item.key == 'status'">{{ scope.row[item.key] == 1 ? '已赋予' : '已移除' }}</span>
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
              @click="statusClick(row, 2, '移除')"
              v-if="row.status == 1"
            >
              移除
            </el-button>

            <el-button
                type="primary"
                class="op-btn"
                plain
                size="mini"
                :loading="openLoading"
                @click="statusClick(row, 1, '赋予')"
                v-if="row.status == 2"
              >
                赋予
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

        <el-dialog :visible.sync="showPopFlag" :title="popPopTitle" width="60%">
            <el-form :model="popParams" :rules="rules" ref="form" label-width="180px">
                <el-form-item label="活动类型：" prop="type">
                  <el-radio-group
                      v-model="popParams.type"
                      @change="searchTypeChange"
                  >
                      <el-radio :label="1">快问快答</el-radio>
                      <el-radio :label="2">开口说</el-radio>
                      <el-radio :label="3">拍小票</el-radio>
                      <el-radio :label="4">看视频</el-radio>
                      <el-radio :label="5">有奖分享</el-radio>
                      <el-radio :label="6">课程管理</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="活动名称：" prop="aid">
                  <el-select v-model="popParams.aid"
                            filterable
                            remote
                            clearable
                            @clear="selectClear"
                            placeholder="请选择"
                            :remote-method="(val) => remoteMethod(val)"
                            @focus="focusMethod"
                            :loading="searchloading"
                           @change="$forceUpdate()"
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
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="submitForm('form')" type="primary" :loading="loading">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
    <activityEdit
        @backList="BackList"
        :popTitle="popTitle"
        :uid="uid"  v-else />
</template>
<script>

import activityEdit from './activityEdit.vue'
import { aTypeList, aTypeMap, statusList } from './ConstConfig'
export default {
  props: {
    aid: Number,
    uid: Number,
    type: Number,
    placeId:Number,
    placeMap:Object,
    popTitle:String,
  },
  data() {
    return {
      dataType:1,

      formLabelWidth: '80px',

      aTypeList:aTypeList,
      aTypeMap:aTypeMap,
      statusList: statusList,

      total:0,
      tabList:[],
      tableConfig : [

        { label: '活动id', key: 'aid' },
        { label: '渠道名称', key: 'placeName' },
        { label: '活动名称', key: 'name' },
        { label: '活动类型', key: 'type'},
        { label: '活动图片', key: 'img' , width:'100px'},
        { label: '状态', key: 'status'},
        // { label: '状态', key: 'status' },
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
        uid:0,

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
      popParams:{
        type:1,
        aid:0,
      },
      loading:false,
      rules: {
        type: [
          { type: 'number', required: true,message: '请选择活动类型',trigger: 'change' }
        ],
        // aid: [
        //   { type: 'number', required: true,message: '请选择活动',trigger: 'change' }
        // ],
      },

      searchloading:false,
      searchTotal:0,
      searchList:[],


      openLoading:false,


    };
  },
  created() {
    this.listQuery.uid = this.uid
    this.listQuery.aid = this.aid
    this.listQuery.type = this.type
    this.getList()
   },
   components:{ activityEdit },
  methods: {
    statusClick(row, status, tip) {
      this.$confirm('此操作将' + tip + '活动访问权限, 重新登录后生效, 是否继续?', '提示', {
        confirmButtonText: tip,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading = true

        this.$http.post(API.userActivityStatus, { id: row.id, status: status }).then((res) => {
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
      this.popParams.aid = ''
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

      console.log(url, "searchDataList", this.popParams.type)

      this.searchQuery.placeId = this.placeId
      let url = API.quickList
      switch (this.popParams.type) {
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

        default:
          break;
      }
      console.log(url, "url", this.popParams.type)
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
        this.popParams = {
          type:1,
          aid:''
        }
        this.popPopTitle = '添加活动'
        this.showPopFlag = true
    },
    joinClick(row){
        this.$message.info('暂不支持')
    },
    editClick(row) {
        this.popParams = row
        this.popPopTitle = '编辑题目'
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
      this.listQuery.uid = this.uid
      this.$http.get(API.userActivityList, {...this.listQuery}).then(res => {
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
        this.popParams.uid = this.uid
        this.$refs[formName].validate((valid, object) => {
        if(valid && this.popParams.aid) {
            this.loading = true
            this.$http.post(API.userActivitySave, this.popParams).then(res => {
                
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
          if (!this.popParams.aid) {
            this.$message.error('请先选择活动')
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
  },
}
</script>
<style lang='scss' scoped>
</style>
