<template>
    <el-dialog width="50%"  :title="popTitle" :visible="dialogFormVisible"
        @close="close">
        <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
        </el-input>

        <el-tree
          v-loading="listLoading"
          :data="cityList"
          show-checkbox
          node-key="value"
          :indent="30"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :default-checked-keys="selectList"
          accordion
          ref="tree">
        </el-tree>

        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {regionData} from 'element-china-area-data'

export default {
    props: {
        popId: Number,
        popTitle: String,
    },
    data() {
        return {
            dialogFormVisible: true,
            cityList: regionData,
            loading:false,
            filterText:'',
            listLoading:true,
            selectList:[]
        };
    },
    created() { 
        this.getArea()
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        close() {
            this.$emit('backList', this.ruleForm)

        },
        getArea() {
            this.$http.get(API.watchVideoArea+"?id="+ this.popId).then(res => {
                if (res.code === 200) {
                    this.selectList = res.data.trim(',').split(',')
                    this.listLoading = false
                } else {
                    this.$message.error(res.msg ? res.msg : '获取区域失败')
                    setTimeout(() => {
                        this.close()
                    }, 1000);
                }
            }).catch(error => {
                this.$message.error(res.msg ? res.msg : '获取区域失败')
                setTimeout(() => {
                    this.close()
                }, 1000);

            });
        },
        submitForm(formName) {
            this.loading = true
            this.listLoading = true
            let list = this.$refs.tree.getCheckedKeys()
            const setList = new Set(list)
            // console.log("map===list", list['12'], map2['12'], map3['12'], setList.has('12'));
            // 首先将全部的code拿到整合成一个数组
            let area = ',' // 整合(拼装后)的数组
            list.forEach(v => {
                if(v.length == 2) {
                    area = area +v+ ','
                } else if (v.length == 4) {
                    if (!setList.has(v.substr(0,2))) {
                        area = area + v + ','
                    }
                } else  {
                    if (!setList.has(v.substr(0, 2)) && !setList.has(v.substr(0, 4))) {
                        area = area + v + ','
                    }
                }
            })

            this.$http.post(API.watchVideoAreaSave, {'id':this.popId, 'area':area}).then(res => {
                console.log(res)
                if (res.code === 200) {
                    this.$message.success('保存成功')
                    setTimeout(() => {
                        this.close()
                    }, 1000);
                } else {
                    this.loading = false
                    this.listLoading = false
                    this.$message.error(res.msg ? res.msg : '保存失败')
                }
            }).catch(error => {
                this.loading = false
                this.listLoading = false
                this.$message.error('保存失败')

            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.$emit('resetForm')
        },
    },
}
</script>
<style lang='scss' scoped>
.custom-tree-container {
    // display: flex;
    .block {
        width: 50%;
    }
}
.el-input {
    margin-bottom: 10px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
