<template>
    <div class="place-wrap">
        <el-page-header @back="backListClick" :content="popTitle">
        </el-page-header>
        <el-divider></el-divider>
        <el-form :model="popParams" :rules="rules" ref="form" label-width="150px">
             <el-form-item
            label="省份" prop="province_id"
          >
           <el-select
                v-model="popParams.province_id"
                placeholder="请选择"
                filterable
              >
                <el-option
                  v-for="item in provinceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
          </el-form-item>
              <el-form-item label="连锁名称：" prop="name">
                <el-input v-model="popParams.name" style="width:600px" placeholder="请输入连锁名称"></el-input>
              </el-form-item>
              <el-form-item label="">
                   <el-button @click="submitForm('form')" type="primary" >确定</el-button>
              </el-form-item>
          </el-form>
    </div>
</template>
<script>

import {  regionData } from 'element-china-area-data';

export default {
    props: {
        editPopParams: Object,
        popTitle: String,
    },
    components: {  },
    data() {
        return {
            formLabelWidth: '80px',

            provinceList:regionData,
            
            rules: {
                name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' },],
                province_id: [{ required: true, message: '请选择连锁所在省份', trigger: 'blur' },],
            },
            
            popParams:{}


        };
    },
    created() {
        this.popParams = this.editPopParams
    },
    methods: {
        backListClick() {
            this.$emit('backList', this.ruleForm)
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid ) {
                    this.$http.post(API.chainSave, { ...this.popParams }).then((res) => {
                        if (res.code === 200) {
                            
                            this.$message({
                                type: 'success',
                                message: '完成！'
                            })
                            this.backListClick();
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.$emit('resetForm')
        }
    },
}
</script>
<style lang='scss' scoped></style>
