<template>
  <div class="select-dialog">
    <span>{{options}}</span>
    <el-button type="primary" size="mini" @click="visible = true" plain>选择{{data.label}}</el-button>
    <el-dialog :title="data.label" :visible.sync="visible">
      <el-radio-group v-if="data.radio" v-model="radio">
        <template v-for="(item, index) in items">
          <el-radio :label="item">{{item}}</el-radio>
        </template>
      </el-radio-group>
      <el-checkbox-group v-else v-model="checkList">
        <template v-for="(item, index) in items">
          <el-checkbox :label="item">{{item}}</el-checkbox>
        </template>
      </el-checkbox-group>
      <div class="custom-input">
        <span>自定义：</span>
        <el-input type="text" size="mini" v-model="input" @keyup.enter.native="handleInput" clearable></el-input>
        <el-button size="mini" plain @click="handleInput">添加</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini" plain>取消</el-button>
        <el-button type="primary" @click="handleDialogConfirm(data)" size="mini" plain>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data() {
      return {
        visible: false,
        input: '',
        value: [],
        checkList: [],
        radio: ''
      };
    },
    props: {
      data: {
        type: Object,
        default() {
          return {
            label: '',
            children: [],
            checkList: [],
            radio: false
          };
        }
      }
    },
    computed: {
      options() {
        return this.value.join('、');
      }
    },
    watch: {
      data: {
        handler(data) {
          this.value = JSON.parse(JSON.stringify(data.checkList || []));
          this.items = JSON.parse(JSON.stringify(data.children || []));
          if (data.radio) {
            this.radio = this.value[0] || '';
            if (this.radio !== '' && this.items.indexOf(this.radio) === -1) {
              this.items.push(this.radio);
            }
          } else {
            this.checkList = this.value;
          }
        },
        deep: true,
        immediate: true
      },
      checkList: {
        handler() {
          this.checkList.forEach(v => {
            if (this.items.indexOf(v) === -1) {
              this.items.push(v);
            }
          });
        },
        immediate: true
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      handleDialogConfirm(data) {
        let input = this.input.trim();
        if (input !== '') {
          this.$confirm('自定义项输入了内容，是否使用该项？', {
            confirmButtonText: '使用',
            cancelButtonText: '不使用'
          }).then(() => {
            this.handleInput();
            this.handleConfirm();
          }).catch(() => {
            this.handleConfirm();
          });
        } else {
          this.handleConfirm();
        }
      },
      handleConfirm() {
        this.value = this.data.radio ? [this.radio] : this.checkList;
        this.$emit('dialogConfirm', this.value);
        this.visible = false;
      },
      handleInput() {
        let input = this.input.trim();
        if (input === '') { return false; }
        if (this.items.indexOf(input) === -1) {
          this.items.push(input);
          if (this.data.radio) {
            this.radio = input;
          } else {
            this.checkList.push(input);
          }
          this.input = '';
        }
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .select-dialog {
    .custom-input{
      margin: 20px 0;
      .el-input{
        margin-right: 20px;
        width: 50%;
      }
    }
  }
</style>
