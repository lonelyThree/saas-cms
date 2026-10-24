<style lang="scss" scoped></style>
<template>
    <section>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="120">
            </el-table-column>
            <el-table-column label="日期" width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址" show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="toggleSelection([tableData[1], tableData[2]])"
                >切换第二、第三行的选中状态</el-button
            >
            <el-button @click="toggleSelection()">取消选择</el-button>
            <el-button @click="test()">test</el-button>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            tableData: [
                {
                    id: 1,
                    date: "2016-05-03",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    id: 2,
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    id: 3,
                    date: "2016-05-04",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    id: 4,
                    date: "2016-05-01",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    id: 5,
                    date: "2016-05-08",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    id: 6,
                    date: "2016-05-06",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    id: 7,
                    date: "2016-05-07",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
            ],
            multipleSelection: [],
        };
    },

    created() {},
    mounted() {
        this.test();
    },

    methods: {
        test() {
            //- 默认选中行
            let checkedIdRows = [1, 3, 5];

            this.tableData.forEach(o => {
                if (checkedIdRows.indexOf(o.id) >= 0) {
                    this.$refs.multipleTable.toggleRowSelection(o);
                }
            });
        },
        /*切换*/
        toggleSelection(rows) {
            console.log("***", rows);
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },

        /*选中*/
        handleSelectionChange(val) {
            console.log("###", val);
            this.multipleSelection = val;
        },
    },
};
</script>
