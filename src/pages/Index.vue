<template>
  <div v-if="homeshow">
    <div v-if="indexShow">
      <span class="indexShow-font">欢迎使用药企营销管理系统</span>
    </div>
    <div class="container fs"
         v-else>
        <div class="card fc vertical">
          <div class="title">医生入驻管理</div>
          <div class="content fc">
            <div class="unit fb vertical">
              <div class="num">{{ indexData.audit_doc }}</div>
              <div class="tip">待审核</div>
            </div>
            <div class="unit fb vertical">
              <div class="num">{{ indexData.is_finished }}</div>
              <div class="tip">资料待完善</div>
            </div>
          </div>
          <el-button type="primary"
                     @click="toDocList">去处理</el-button>
        </div>
        <div class="card fc vertical">
          <div class="title">开方医师申请</div>
          <div class="content fc">
            <div class="unit fb vertical">
              <div class="num">{{ indexData.audit_num }}</div>
              <div class="tip">待审核</div>
            </div>
          </div>
          <el-button type="primary"
                     @click="toRdocAudit">去处理</el-button>
        </div>
      </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      indexData: {},
      indexShow: true,
      homeshow:true
    }
  },
  created() {
    // this.homeshow=true
    // this.$http.get(API.getIndexData).then(res => {
    //   this.homeshow = true;
    //   if(res.status==200) {
    //     this.indexData=res.data
    //     console.log(res.data.length==0)
    //     if(res.data.length==0) {
    //       this.indexShow=true;
    //     } else {
    //       this.indexShow=false;
    //     }

    //   } else {
    //     this.$message.error(res.message)
    //   }
    // })
  },
  methods: {
    toDocList() {
      this.$router.push({ path: '/doctor/doc_list' })
    },
    toRdocAudit() {
      this.$router.push({ path: '/doctor/rdoc_audit' })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  align-items: flex-start;
  .card {
    width: 200px;
    height: 200px;
    font-size: 16px;
    background: aliceblue;
    margin: 30px;
    .content {
      height: 60px;
      margin: 20px;
      .unit {
        height: 100%;
        width: 80px;
        .num {
          color: red;
        }
      }
    }
  }
}
.el-pagination {
  margin: 20px 0;
  text-align: right;
}
.indexShow-font {
  color: #409eff;
  font-size: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50% -50%);
}
</style>
