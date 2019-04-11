<template>
  <div class="search-group" ref="queryData">
    <ul class="search-group-wrap" v-for="(group,index) in list" :key="index">
      <template v-for="(item,index) in group">
        <li class="search-group-item" :key="index">
          <template v-if="item.type==='dateRange'">
            <div class="block">
              <span class="demonstration">{{item.title}}</span>
              <el-date-picker class="eb-date-range-picker"
                :style="{width: (item.width||dateWidth) + 'px'}"
                v-model="item.value[0]"
                type="date"
                size="mini"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
              <span>至</span>
              <el-date-picker class="eb-date-range-picker"
                :style="{width: (item.width||dateWidth) + 'px'}"
                v-model="item.value[1]"
                type="date"
                size="mini"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="(date) => changeDate(date, item.value)">
              </el-date-picker>
            </div>
          </template>
          <template v-else-if="item.type==='date'">
            <div class="block">
              <span class="demonstration">{{item.title}}</span>
              <el-date-picker class="eb-date-range-picker"
                :style="{width: (item.width||dateWidth) + 'px'}"
                v-model="item.value"
                type="date"
                size="mini"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </div>
          </template>
          <template v-else-if="item.type==='select'">
            <span>{{item.title}}</span>
            <el-select
              :style="{width: item.width + 'px'}"
              v-model="item.value"
              :multiple="item.multiple"
              :collapse-tags="item.collapseTags"
              :clearable="item.clearable"
              size="mini"
              @change="(data)=>handleSelectChange(data,queryData,item.change)"
              :placeholder="item.holder">
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <el-input v-model="item.value" :placeholder="item.holder" size="mini" :style="{width: item.width + 'px'}"></el-input>
          </template>
        </li>
      </template>
      <slot></slot>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import dateRange from '@/components/DateRange';
  export default {
    name: 'SearchInput',
    data() {
      return {
        list: [],
        dateWidth: 130
      };
    },
    props: {
      inputList: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    created() {
      if (typeof this.inputList[0] === 'object' && !Array.isArray(this.inputList[0])) {
        this.list = [this.inputList];
      } else {
        this.list = this.inputList;
      }
    },
    computed: {
      queryData() {
        let data = {};
        let lsVal = '';
        for (let i = 0; i < this.list.length; i++) {
          for (let j = 0; j < this.list[i].length; j++) {
            let item = this.list[i][j];
            lsVal = item.value;
            if (item.type === 'dateRange') {
              if (lsVal[0] && lsVal[0].indexOf('00:00:00') === -1) {
                lsVal[0] = lsVal[0] + ' 00:00:00';
              }
              if (lsVal[1] && lsVal[1].indexOf('23:59:59') === -1) {
                lsVal[1] = lsVal[1] + ' 23:59:59';
              }
            } else if (item.type === 'date') {
              if (lsVal && lsVal.indexOf('00:00:00') === -1) {
                lsVal = lsVal + ' 00:00:00';
              }
            }
            if (Array.isArray(lsVal)) {
              data[item.name] = lsVal;
            } else {
              data[item.name] = lsVal.trim();
            }
          }
        }
        return data;
      }
    },
    methods: {
      handleSelectChange(value, data, callback) {
        callback && callback(value, data);
      },
      changeDate(date, value) {
        value[1] = date ? date.replace('00:00:00', '23:59:59') : date;
      }
    },
    components: {
      dateRange
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .search-group{
    .search-group-wrap{
      margin-bottom: 13px;
      .search-group-item{
        display: inline-block;
        padding: 0 10px;
      }
    }
  }

</style>
