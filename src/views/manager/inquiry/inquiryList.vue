<template>
	<div class="main-content">
		<!-- 定制订单列表 -->
		<el-tabs v-model="status" @tab-click="handleClick">
			<el-tab-pane :label="item.n" :name="item.t" :type="item.t" v-for="item in tagsGroup" :key="item.t"></el-tab-pane>
		</el-tabs>

		<div class="search-block">
			<search-input :inputList="inputGroup" @keyup.enter.native="handleSearch" ref="queryData"></search-input>
		</div>

		<div class="searchBtn">
			<el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
		</div>

		<eb-table :list="list" :columns="columns">
			<el-table-column slot="img" label="产品图片" width="110">
				<template slot-scope="{ row }">
					<img :src="row.image" alt="" width="85" height="85" style="object-fit:cover" @click="showDetail(row)">
				</template>
			</el-table-column>
			<el-table-column slot="opt" label="操作" width="150">
				<div slot-scope="{ row }">
					<el-button size="mini" type="text" @click="showDetail(row)">查看&nbsp</el-button>
					<el-popover
					placement="left"
					width="500"
					trigger="click">
					<el-table :data="row.detail.note">
						<el-table-column width="120" property="createTime" label="时间">
							<template slot-scope="scope">
								{{parseTime(scope.row.createTime)}}
							</template>
						</el-table-column>
						<el-table-column property="content" label="内容"></el-table-column>
					</el-table>
					<el-button size="mini" type="text" slot="reference">备注</el-button>
					</el-popover>
				</div>
			</el-table-column>
		</eb-table>

		<div class="pagination-box">
			<el-pagination @current-change="handleCurrentChange" :current-page="page+1" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
			</el-pagination>
		</div>

	</div>
</template>
<script>
import { getList } from "@/api/inquiry";
import {
  parseTime,
  cloneObj,
  setTotalSize,
  byTypeGetObj,
  formatTime
} from "@/utils/index";
import SearchInput from "@/components/SearchInputGroup"
import EbTable from "@/components/EbTable"
export default {
  data() {
    return {
			selection: [],
			page: 0,
			pageSize: 15,
			totalSize: 0,
			tagsGroup: this.GLOBAL.inquiryStatus,
			orderId: this.$route.query.orderId || 0,
			status: this.$route.query.status || this.GLOBAL.inquiryStatus[0].t,
			productType: this.$route.query.C2 || 6,
			searchType: false,
			searchKey: {},
			inputGroup: [
				[],
				[
					{ value: "", name: "inquiryId", holder: "需求ID" },
					{ value: "", name: "name", holder: "联系人" },
					{ value: "", name: "phone", holder: "联系电话" },
					{ value: "", name: "companyName", holder: "公司名" },
					{
						value: '',
						name: 'statusList',
						type: 'select',
						multiple:true,
						options: [
							/* { label: '全部', value: '' }, */
						],
						title: '需求单状态:',
						width: 249
					},
				]
				
			],
			list: [],
			columns: [
				{ prop: "inquiryId", label: "ID", width:60,},
				{ slot: 'img' },
				{ prop: "createTime", label: "发布时间", width:90,},
				/* { prop: "saysPassed", label: "投放时间",}, */
				{ prop: "expireTime", label: "有效期", width:130,},
				{ prop: "name", label: "联系人" },
				{ prop: "companyName", label: "采购商名" },
				{ prop: "phone", label: "电话", width:120 },
				{ prop: "status", label: "状态" },
				{ prop: "responseCount", label: "回样数", width:60 },
				{ prop: "confirmedCount", label: "合适", width:60 },
				{ prop: "deputeCollect", label: "跑腿", width:50},
				{ prop: "deliverPay", label: "支付", width:100},
				{ slot: "opt" }
			]
    	}
  	},
	created() {

		this.inputGroup[1][4].options = this.GLOBAL.inquiryStatusD.map(res => {
			return {
				label: res.n, 
				value: res.t
			}
		})



		let query = cloneObj(this.$route.query);
		let inputs = this.inputGroup; // 根据路由参数回填搜索框
		for (let i = 0; i < inputs.length; i++) {
			for (let j = 0; j < inputs[i].length; j++) {
				if (query[inputs[i][j].name] != null) {
				inputs[i][j].value = query[inputs[i][j].name];
				}
			}
		}

		this.queryAction({ status: this.status });
	},
	methods: {
		parseTime(time){
			return parseTime(time,'{m}-{d} {h}:{i}')
		},
		queryAction(params) {

			let query = cloneObj(this.$route.query);

			let search = this.searchKey;

			for (let key in search) {
				//把上次搜索的内容加入参数
				
				if (search[key].length != 0) {
				query[key] = search[key];
				} else {
				delete query[key];
				}
			}

			params = params || {};
			
			for (let key in params) {
				//获得本次操作定义的参数信息
				query[key] = params[key];
			}

			query.page = parseInt(query.page) || 0;
			query.pageSize = parseInt(query.pageSize) || this.pageSize;
			query['status'] = query.status || this.status

			this.page = query.page;
			this.$router.push({ query: query });

			//按照api文档格式化传到后台的查询参数
			query.param = {}

		
		/* if(query['status'] == '99'){
			query['status'] = '-1'
			query.param['deputeCollect'] = 1
		}else{
			delete query.param['deputeCollect']
		} */

		for(let key in query){
			if(key == 'page' || key == 'pageSize' || key == 'param'){
				
			}else{
				query.param[key] = query[key]
				delete query[key]
			}
		}
	
		this.getData(query);
	},
    getData(params) {
      
		getList(params).then(res => {
			this.list = res.formatList
			this.totalSize = res.totalSize
        /* res.list.forEach(item => {
          item.customizeTypeName = this.GLOBAL.customizeTypes[
            item.customizeType
          ];
          item.invoiceType = item.invoiceType == 1 ? "是" : "否";
          item.createTime = parseTime(item.createTime);
          item.payStrategyName = this.GLOBAL.payStrategy[item.payStrategyId];
          item.demandStatus = byTypeGetObj(
            item.status,
            this.GLOBAL.demandStatus
          ).n;
        });
        this.list = res.list;
        this.totalSize = setTotalSize(
          res.totalSize,
          params.page,
          "customizationList"
        );  */
		});
	},
    handleCurrentChange(val) {
		if (this.page === val - 1) return;
		this.queryAction({ page: val - 1 });
    },
    // 搜索
    handleSearch() {
		let queryKey = this.$refs.queryData.queryData;
		if (queryKey.createTime) {
			queryKey.startTime = queryKey.createTime[0] || "";
			queryKey.endTime = queryKey.createTime[1] || "";
		}
		delete queryKey.createTime;
		this.searchKey = queryKey;
		this.queryAction({ page: 0 });
    },
    // 点击切换
    handleClick(tab, event) {
      	this.queryAction({ status: tab.$attrs.type, page: 0 });
    },
    // 跳转详情页
    showDetail(item) {

		let id = item.inquiryId;
		//  1 新品定制 customizationDetail
		//  2 需求定制 demandCustomizationDetail
		this.$router.push({
			path:'inquiryDetail',
			query: { inquiryId: id }
		})
      // if (item.customizeType == 1) {
      //   this.$router.push({
      //     path: "customizationDetail",
      //     query: { orderId: id }
      //   });
      // } else if (item.customizeType == 2) {
      //   this.$router.push({
      //     path: "demandCustomizationDetail",
      //     query: { orderId: id }
      //   });
      // }
		}
	},
	components: {
		EbTable,
		SearchInput
	}
};
</script>
<style lang='scss' scoped>
.searchBtn {
  height: 80px;
  line-height: 80px;
  float: right;
  margin-right: 10px;
}
</style>
