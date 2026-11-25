<template>
            <el-upload
                ref="ImageChang"
                class="upload-img"
                :multiple="true"
                action="/"
                :limit="limitNum"
                :file-list="imgUrlList"
                :http-request="uploadSectionFile"
                :before-upload="beforeUpload"
                :on-exceed="onExceed"
                :on-remove="onRemove"
                :on-change = "onChange"
                :show-file-list="true"
                list-type="picture-card"
                >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
</template>
<script>

import draggable from 'vuedraggable';
import Sortable from 'sortablejs';

export default {
    name: 'UploadMultiImg',
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
        fileList: {
            type: Array,
            required: false,
            default: () => []
        },
        ossToken: {
            type: Object,
            required: false,
            default: {}
        },
        limitNum: {
            type: Number,
            required: false,
            default: 10
        },

    },
    components: {
        draggable
    },
    watch: {
        //正确给 ossToken 赋值的 方法
        ossToken: function (newVal, oldVal) {
            // console.log("getOssToken==ossToken==updateOssToken", newVal, oldVal)
            this.aliyunOssToken = newVal
        },
        //正确给 ossToken 赋值的 方法
        fileList: function (newVal, oldVal) {
            let imgUrlList = []
            // console.log("watch==fileList==watch", newVal, oldVal)
            newVal.forEach(url => {
                imgUrlList.push({url:url})
            });
            this.imgUrlList = imgUrlList
            this.initDragSort()
        }
    },
    data() {
        return {
            aliyunOssToken:{},
            imgUrlList:[],
            sortable: null
        }
    },
    beforeDestroy() {
        if (this.sortable) {
            this.sortable.destroy()
            this.sortable = null
        }
    },
    mounted() {
        // this.fileList = []
        // if (this.imgUrl) {
        //     this.fileList.push({ url: this.imgUrl })
        // }

        // this.imgUrlList = this.fileList

        let imgUrlList = []
            // console.log("watch==fileList==watch", newVal, oldVal)
        this.fileList.forEach(url => {
            imgUrlList.push({url:url})
        });
        this.imgUrlList = imgUrlList
        
        console.log("getOssToken", this.initOssToken)

        this.aliyunOssToken = this.ossToken
        if(this.initOssToken) {
            this.getOssToken(null)
        }

        this.initDragSort();
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
        // 支持拖拽排序
        initDragSort() {
            if (this.sortable) {
                this.sortable.destroy()
                this.sortable = null
            }
            const el = this.$refs.ImageChang && this.$refs.ImageChang.$el.querySelectorAll('.el-upload-list')[0]
            if (!el) return
            this.sortable = Sortable.create(el, {
                onEnd: ({ oldIndex, newIndex }) => {
                    // 交换位置
                    const arr = this.imgUrlList;
                    const page = arr[oldIndex];
                    arr.splice(oldIndex, 1);
                    arr.splice(newIndex, 0, page);
                    let urls = []
                    arr.forEach(item => {
                        urls.push(item.url)
                    });
                    this.$emit('selectMultiImg', { name: this.uploadName, url: '', urls:urls })
                }
            });
        },
     
            onExceed(files, fileList) {
            if (this.limit < 2) {
                this.$message.info('图片只能上传一张')
            }
            
            // console.log(files, fileList, "onExceed, files, fileList")
        },
        onRemove(files, fileList) {
            let urls = []
            fileList.forEach(item => {
                        urls.push(item.url)
                    });
            this.$emit('selectMultiImg', { name: this.uploadName, url: '', urls:urls })
        },
        onChange(file, fileList) {
            console.log("onChange", file, fileList)
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
            var fileUrl = this.aliyunOssToken.url + '/' + filePath

            this.$http.post(url, formData, {}).then(res => {
                if (res.code === 200 || res.code == 1000) {
                    console.log("uploadFile", res)

                    this.$emit('selectMultiImg', {name: this.uploadName, url: fileUrl })

                    // console.log(res.code, res, "res.code", fileUrl)
                    param.fileUrl = fileUrl
                    this.$message.success('图片上传成功')
                } else {
                    // console.log(res)
                    this.$message.error(res.data.msg ? res.data.msg : '图片上传失败');
                    // self.prevent = false;
                }
            })
                .catch(error => {
                    // console.log("图片上传失败", error)
                    this.$message.error("图片上传失败");
                });
        },
        uploadSectionFile(param) {
            console.log("uploadSectionFile", param)
            if (!this.aliyunOssToken  || !this.aliyunOssToken.expire  || this.aliyunOssToken.expire * 1000 < new Date().getTime()) {
                this.getOssToken(param)
                return
            }
            this.uploadFile(param)
        },
    }
}
</script>
<style scoped lang="scss"></style>
