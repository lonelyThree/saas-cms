<template>
  <div class="upload-container">
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >
      多图上传
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        ref="upload"
        :multiple="true"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        class="editor-slide-upload"
        action
        list-type="picture-card"
        accept="image/*"
        :http-request="uploadSectionFile"
      >
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="cancelUpload">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import upload from "@/mixins/upload2";

export default {
  // mixins: [upload],
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff',
    },
  },
  data() {
    return {
      dialogVisible: false,
      imageList: [
        // { name: '', url: '' }
      ],
    }
  },
  methods: {
    handleSubmit() {
      // console.table(this.imageList)
      this.$emit('successCBK', this.imageList)
      this.$refs.upload.clearFiles()
      this.imageList = []
      this.dialogVisible = false
    },
    handleRemove(file) {
      console.log('handle remove')
      var index = this.imageList.findIndex(el => {
        return el.name == file.name
      })
      this.imageList.splice(index, 1)
    },
    beforeUpload(file) {
      console.log('before upload')
      var size = file.size / 1024 / 1024
      if (size > 2) {
        this.$message({
          message: '上传图片大小不能超过 2M!',
          type: 'warning',
        })
        return false
      }
    },
    cancelUpload() {
      console.log('cancel upload')
      this.$refs.upload.clearFiles()
      this.imageList = []
      this.dialogVisible = false
    },
    uploadSectionFile(params) {
      // console.log(params)
      return new Promise((resolve, reject) => {
        this.uploadFn(1, params.file, url => {
          if (url) {
            this.imageList.push({
              name: params.file.name,
              url: this.$api.baseImgUrl + url,
            })
            resolve(params.file)
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
