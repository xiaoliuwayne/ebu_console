<template>
  <div class="eb-date-range" ref="dateValue">
    <div class="block">
      <span class="demonstration">{{title}}</span>
      <el-date-picker class="eb-date-range-picker"
        v-model="dateValue[0]"
        type="date"
        :size="size"
        placeholder="选择日期"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <span>至</span>
      <el-date-picker class="eb-date-range-picker"
        v-model="dateValue[1]"
        type="date"
        :size="size"
        placeholder="选择日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="changeDate">
      </el-date-picker>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'eb-date-range',
    data() {
      return {
        dateValue: []
      };
    },
    props: {
      title: {
        type: String,
        default: function() {
          return '';
        }
      },
      size: {
        type: String,
        default: function() {
          return 'mini';
        }
      },
      defaultDate: {
        type: Array,
        default: function() {
          return ['', ''];
        }
      }
    },
    created() {
      this.dateValue = this.defaultDate;
    },
    methods: {
      changeDate(date) {
        this.dateValue[1] = date.replace('00:00:00', '23:59:59');
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .eb-date-range{
    .eb-date-range-picker{
      width: 140px;
    }
  }
</style>