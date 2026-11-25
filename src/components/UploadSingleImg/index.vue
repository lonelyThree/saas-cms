<template>
    <el-upload
        class="upload-img"
        :multiple="false"
        action="/"
        :limit="1"
        :file-list="fileList"
        :http-request="uploadSectionFile"
        :before-upload="beforeUpload"
        :on-exceed="onExceed"
        :on-remove="onRemove"
        list-type="picture-card"
        >
        <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
</template>
<script>
export default {
    name: 'UploadSingleImg',
    props: {
        initOssToken: {
            type: Boolean,
            required: false,
            default: false
        },
        uploadName: {
            type: String,
            required: false,
            default: ''
        },
        imgUrl: {
            type: String,
            required: false,
            default: ''
        },
        ossToken: {
            type: Object,
            required: false,
            default: {}
        },

    },
    watch: {
        //正确给 ossToken 赋值的 方法
        ossToken: function (newVal, oldVal) {
            // console.log("getOssToken==ossToken==updateOssToken", newVal, oldVal)
            this.aliyunOssToken = newVal
        }
    },
    data() {
        return {
            fileList:[],
            aliyunOssToken:{}
        }
    },
    mounted() {
        this.fileList = []
        if (this.imgUrl) {
            this.fileList.push({ url: this.imgUrl })
        }
        
        // console.log("getOssToken", this.initOssToken)

        this.aliyunOssToken = this.ossToken
        if(this.initOssToken) {
            this.getOssToken(null)
        }
    },
    methods: {
        getFileExt(file) {
            const match = String(file.name || '').match(/\.([a-zA-Z0-9]+)$/)
            return match ? match[1].toLowerCase() : ''
        },
        beforeUpload(file) {
            const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
            const ext = this.getFileExt(file)
            const isImage = /^image\/(jpeg|png|gif|webp|bmp)$/.test(file.type)
            if (!isImage || allowed.indexOf(ext) === -1) {
                this.$message.error('仅支持 jpg、png、gif、webp、bmp 图片')
                return false
            }
            if (file.size > 5 * 1024 * 1024) {
                this.$message.error('图片大小不能超过 5MB')
                return false
            }
            return true
        },
       onExceed(files, fileList) {
            if (this.limit < 2) {
                this.$message.info('图片只能上传一张')
            }
            
            // console.log(files, fileList, "onExceed, files, fileList")
        },
        onRemove(files, fileList) {
            this.$emit('selectImg', { name: this.uploadName, url: '' })
        },

        getOssToken(param) {
            this.$http.get(API.getPolicyToken).then(res => {
                if (res.code === 200) {
                    this.aliyunOssToken = res.data
                    this.$emit('updateOssToken', this.aliyunOssToken)
                    if (param) {
                        this.uploadFile(param)
                    }
                    
                } else if (param) {
                    this.$message.error(res.msg ? res.msg : '图片上传失败')
                }
            }).catch(error => {
                if (param) {
                    this.$message.error('图片上传失败')
                }
            });
        },
        uploadFile(param) {
            const file = param.file

            var filename = new Date().getTime();
            var formData = new FormData();
            //注意formData里append添加的键的大小写
            formData.append('x-oss-forbid-overwrite', true)

            let filePath = this.aliyunOssToken.dir + filename + '.' + this.getFileExt(file)

            formData.append('key', filePath); //存储在oss的文件路径
            formData.append('OSSAccessKeyId', this.aliyunOssToken.accessid); //accessKeyId
            formData.append('policy', this.aliyunOssToken.policy); //policy
            formData.append('Signature', this.aliyunOssToken.signature); //签名
            formData.append('success_action_status', '200'); //签名
            formData.append('callback', this.aliyunOssToken.callback); //签名
            formData.append("file", file);
            var url = this.aliyunOssToken.host;
            var fileUrl = this.aliyunOssToken.host + '/' + filePath

            this.$http.post(url, formData, {}).then(res => {
                if (res && res.code === 200) {

                    this.$emit('selectImg', {name: this.uploadName, url: filePath })

                    // console.log(res.code, res, "res.code", fileUrl)
                    param.fileUrl = fileUrl
                    this.$message.success('图片上传成功')
                } else {
                    // console.log(res)
                    this.$message.error((res && res.msg) ? res.msg : '图片上传失败');
                    // self.prevent = false;
                }
            })
                .catch(error => {
                    // console.log("图片上传失败", error)
                    this.$message.error("图片上传失败");
                });
        },
        uploadSectionFile(param) {
            if (!this.aliyunOssToken  || !this.aliyunOssToken.expire  || this.aliyunOssToken.expire * 1000 < new Date().getTime()) {
                this.getOssToken(param)
                return
            }
            this.uploadFile(param)
        },
        refreshImg(fileList) {
            this.fileList = fileList
        },
    }
}
</script>
<style scoped lang="scss"></style>
