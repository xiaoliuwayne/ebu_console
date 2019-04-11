<template>
  <div class="table-box">
    <el-table
      :data="list"
      style="width: 100%"
      border
      :show-summary="showSummary"
      :empty-text="emptyText"
      :summary-method="param => getSummaries(param, sumText, summaryColumns, columns)">
      <template v-if="columns.length > 0" v-for="(column,index) in columns">
        <slot v-if="column.slot" :name="column.slot"></slot>
        <component v-else-if="column.component" :is="column.component" :col-config="column" :key="index"></component>
        <el-table-column v-else v-bind="column" :prop="column.prop" :label="column.label" :width="column.width" :key="index"></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
      name: 'ebTable',
      props: {
        list: {
          type: Array,
          default() {
            return [];
          }
        },
        columns: {
          type: Array,
          default() {
            return [];
          }
        },
        showSummary: {
          type: Boolean,
          default() {
            return false;
          }
        },
        sumText: {
          type: String,
          default() {
            return '合计';
          }
        }
      },
      data() {
        return {
          summaryColumns: [],
          units: [],
          emptyText: '数据加载中……'
        };
      },
      created() {
        this.summaryColumns = this.getSummaryColumns(this.columns);
        setTimeout(() => {
          this.emptyText = '暂无数据';
        }, 5000);
      },
      methods: {
        getSummaries(param, sumText, summaryColumns, columnsData) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = sumText;
              return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value)) && (!summaryColumns.length || (summaryColumns.length > 0 && summaryColumns.indexOf(column.property) > -1))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += (columnsData[index].unit ? ' ' + columnsData[index].unit : '');
            } else {
              sums[index] = '';
            }
          });
          return sums;
        },
        getSummaryColumns(data) {
          let columns = data.filter(column => {
            return column.summary === true;
          });
          return columns.map(column => {
            return column.prop;
          });
        }
      }
    };
</script>

<style scoped>
  .table-box{
    width:100%;
    padding: 0 10px;
  }
</style>
