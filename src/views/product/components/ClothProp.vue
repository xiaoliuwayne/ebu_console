<template>
  <el-card class="product-prop">
    <div slot="header" class="clearfix">
      <span>商品属性</span>
    </div>
    <div>
      <table class="table table-bordered table-responsive">
        <tbody>
        <tr>
          <td>品名</td>
          <td>
            <el-input type="text" size="mini" v-model="detail.productName"></el-input>
          </td>
        </tr>
        <tr>
          <td>款号*</td>
          <td>
            <el-input type="text" size="mini" v-model="detail.productCode"></el-input>
          </td>
        </tr>
        <tr>
          <td>布封*</td>
          <td>
            <el-input placeholder="请输入内容" size="mini" v-model="detail.width">
              <template slot="prepend">最小</template>
              <template slot="append">cm</template>
            </el-input>
            <el-input placeholder="请输入内容" size="mini" v-model="detail.maxWidth">
              <template slot="prepend">最大</template>
              <template slot="append">cm</template>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>克重</td>
          <td>
            <el-input placeholder="请输入内容" size="mini" v-model="detail.weight">
              <template slot="prepend">最小</template>
              <template slot="append">cm</template>
            </el-input>
            <el-input placeholder="请输入内容" size="mini" v-model="detail.maxWeight">
              <template slot="prepend">最大</template>
              <template slot="append">cm</template>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>成分</td>
          <td>
            <ul class="ingredient-list">
              <template v-for="(ingredient,index) in detail.ingredientList">
                <li class="ingredient-list-item">
                  <el-select v-model="ingredient.name" size="mini" placeholder="请选择">
                    <el-option
                      v-for="item in ingredientData"
                      :key="item.value"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                  <el-input type="number" size="mini" min="0" v-model="ingredient.value">
                    <template slot="append">%</template>
                  </el-input>
                  <el-button type="danger" plain size="mini" :disabled="!(detail.ingredientList.length>1)" @click="deleteIngredientItem(index)">删除</el-button>
                </li>
              </template>
            </ul>
            <el-button type="primary" size="mini" @click="addIngredientItem" plain>增加</el-button>
          </td>
        </tr>
        <tr>
          <td>类型</td>
          <td>
            <el-radio v-for="(status, index) in saleStatus" v-model="detail.saleStatus" :key="index" :label="index">{{status}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>供货价(含税)*</td>
          <td>
            <el-input placeholder="请输入内容" size="mini" v-model="_supplyPrice">
              <template slot="prepend">&yen;</template>
              <template slot="append">/{{unitName}}</template>
            </el-input>
            <el-radio v-for="unit in units" v-model="detail.saleUnit" :key="unit.key" :label="unit.key">{{unit.name}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>大货价</td>
          <td>
            <el-input placeholder="请输入内容" size="mini" v-model="detail.bukPrice">
              <template slot="prepend">&yen;</template>
              <template slot="append">/{{unitName}}</template>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>米样价</td>
          <td>
            <el-input placeholder="请输入内容" size="mini" v-model="detail.samplePrice">
              <template slot="prepend">&yen;</template>
              <template slot="append">/{{unitName}}</template>
            </el-input>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'product-prop',
    data() {
      return {
        saleStatus: this.GLOBAL.saleStatus
      };
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {};
        }
      },
      ingredientData: {
        type: Array,
        default() {
          return [];
        }
      },
      units: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    computed: {
      unitName() {
        for (let i = 0; i < this.units.length; i++) {
          if (this.detail.saleUnit == this.units[i].key) {
            return this.units[i].name;
          }
        }
      },
      _supplyPrice: {
        set(value) {
          value = parseFloat(value || 0);
          this.detail.supplyPrice = value;
          this.detail.bukPrice = (value * 1.1).toFixed(2);
          if (this.detail.saleUnit == 2) {
            this.detail.samplePrice = (value * 2).toFixed(2);
          } else {
            this.detail.samplePrice = (value + (value > 0 ? 20 : 0)).toFixed(2);
          }
        },
        get() {
          return this.detail.supplyPrice;
        }
      }
    },
    methods: {
      addIngredientItem() {
        this.detail.ingredientList.push(
          { name: '', value: '0' }
        );
      },
      deleteIngredientItem(index) {
        this.detail.ingredientList.splice(index, 1);
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .product-prop{
    .table{
      tbody td:first-child{
        width: 100px;
      }
      tbody{
        .el-input--mini{
          width: 45%;
        }
      }
      .ingredient-list{
        .ingredient-list-item{
          margin-bottom:5px;
          .el-input{
            vertical-align: top;
          }
          .el-input--mini{
            width: 30%;
          }
          .el-select{
            vertical-align: top;
            .el-input--mini{
              width: 100%;
            }
          }
          .el-button{
            visibility: hidden;
          }
          &:hover{
            .el-button{
              visibility: visible;
            }
          }
        }
      }
    }
  }
</style>