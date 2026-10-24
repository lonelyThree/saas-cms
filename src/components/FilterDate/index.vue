<template>
  <el-form-item
    prop="square"
    :label="label"
    class="form-item-group"
    :label-width="labelWidth"
  >
    <el-date-picker
      v-model="filterQuery[startKey]"
      type="datetime"
      value-format="timestamp"
      placeholder="请选择开始时间"
      :picker-options="startTimes"
      class="bra17"
    />
    <span class="range-separator">至</span>
    <el-date-picker
      v-model="filterQuery[endKey]"
      type="datetime"
      value-format="timestamp"
      placeholder="请选择结束时间"
      :picker-options="endTimes"
      default-time="23:59:59"
      @change="endKeyChange"
      class="bra17"
    />
  </el-form-item>
</template>
<script>
export default {
  name: 'FilterDate',
  props: {
    filterQuery: {
      required: false
    },
    labelWidth: {
      required: false,
      default: '100px'
    },
    label: {
      required: false,
      default: '申请日期'
    },
    startKey: {
      required: false,
      default: 'start_time'
    },
    endKey: {
      required: false,
      default: 'end_time'
    },
  },
  data() {
    return {
      startTimes: {
        disabledDate: (time) => {
          if (this.filterQuery[this.endKey]) {
            return time.getTime() > new Date(this.filterQuery[this.endKey]).getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      endTimes: {
        disabledDate: (time) => {
          if (this.filterQuery[this.startKey]) {
            return time.getTime() > Date.now() ||
              time.getTime() < new Date(this.filterQuery[this.startKey]).getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  created() {
  },
  methods: {
    endKeyChange(value) {
    }
  }
}
</script>
<style scoped lang="scss">

</style>
