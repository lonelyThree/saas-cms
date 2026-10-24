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
                <el-form-item label="题目名称">
                    <el-input
                        v-model="listQuery.name"
                        clearable
                        class="filter-item"
                        placeholder="请输入题目名称"/>
                </el-form-item>

                

                <el-form-item>
                <el-button
                    type="primary"
                    align="right"
                    @click="getTopicList">
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
            
            <span v-if="item.key=='time' && scope.row.update_at">{{ scope.row.update_at * 1000, 3 | dateFormat}}</span>

            <span v-else-if="item.key=='time'">{{ scope.row.create_at * 1000, 3 | dateFormat}}</span>

            <audio  v-else-if="item.key=='url'"  ref="audio" media-player="audioPlayer"  controls="controls" preload="auto" :src="scope.row.url" crossOrigin="anonymous" ></audio>
    
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
            type="warning"
            plain
            size="mini"
            @click="joinClick(row)"
          >
            参与人数
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
                <el-form-item label="题目：" prop="name">
                    <el-input v-model="popParams.name" style="width:600px" placeholder="请输入题目"></el-input>
                </el-form-item>
                <el-form-item label="次数：" prop="num">
                  <el-input-number v-model="popParams.num" :max="50" :min="1" placeholder="朗读1~50"></el-input-number>
                </el-form-item>
                <el-form-item label="分数：" prop="score">
                  <el-input-number v-model="popParams.score" :max="100" :min="1" placeholder="阈值1~100"></el-input-number>
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
    speakId: Number,
    popTitle:String,
  },
  data() {
    return {
      formLabelWidth: '80px',

      total:0,
      tabList:[],
      tableConfig : [

        { label: '题目', key: 'name' },
        { label: '分数阈值', key: 'score' , width:'100px'},
        { label: '次数', key: 'num' , width:'50px'},
        { label: '示例', key: 'url', width:'350px' },
        // { label: '状态', key: 'status' },
        { label: '更新时间', key: 'time' , width:'150px'},
        // // { label: '参与人数', key: 'joinCnt' },
        // { label: '开始日期', key: 'start_time' },
        // { label: '结束日期', key: 'end_time' },
      ],


      listQuery: {
        name:'',
      },

      showPopFlag:false,
      popPopTitle:'',
      popParams:{
        name:'',
        score:0,
        number:0,
      },
      loading:false,
      rules: {
        name: [
          { required: true,message: '请选择题目名称',trigger: 'change' }
        ],
        num: [
          { type: 'number', required: true,message: '请输入朗读次数',trigger: 'change' }
        ],
        score: [
          { type: 'number', required: true,message: '请输入分数阈值',trigger: 'change' }
        ],
      },
      audioSrc:'https://vipimg.ai-xbys.com/saas/pcm/base/cwj7aihxdesw.pcm',
      audioSrc2:"https://xlxtimg.oss-cn-beijing.aliyuncs.com/speak/16980282956992006.wav",

      audioSrc3:'https://vipimg.ai-xbys.com/saas/wav/base/cwj9hb4d7lzk.wav',


    };
  },
  created() {
    this.listQuery.askId = this.askId
    this.getTopicList()
   },
   components:{vDialog},
  methods: {
    addClick() {
        this.popParams = {}
        this.popPopTitle = '添加题目'
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
    getTopicList() {
      this.listLoading = true
      this.listQuery.speakId = this.speakId
      this.$http.get(API.speakTopicList, {...this.listQuery}).then(res => {
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
        this.popParams.speakId = this.speakId
        this.$refs[formName].validate((valid, object) => {
        if(valid) {
            this.loading = true
            this.$http.post(API.speakTopicSave, this.popParams).then(res => {
                
                if (res.code === 200) {
                    this.$message.success('保存成功')
                    setTimeout(() => {
                        this.showPopFlag = false
                        this.getTopicList()
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
  },
}
</script>
<style lang='scss' scoped>
</style>
