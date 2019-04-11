<template>
	<div class="user-list-container">
		<el-tabs v-model="listQuery.roleType" @tab-click="handleClick">
			<el-tab-pane :label="item.n" :name="item.t" :type="item.t" v-for="item in tagsGroup" :key="item.t"></el-tab-pane>
		</el-tabs>
    <el-button class="add-user-btn" type="button" size="mini" @click="addUser">新增用户</el-button>
		<eb-table :list="list" :columns="columns">
			<el-table-column slot="opt" label="操作">
				<template slot-scope="{ row }">
					<el-button size="mini" type="text" @click="resetPwd(row.userId)">重置密码</el-button>
					<el-button size="mini" type="text" @click="showDetail(row.userId)">查看</el-button>
				</template>
			</el-table-column>
		</eb-table>
    <div class="pagination-box">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="listQuery.page+1"
        :page-size="listQuery.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </div>
	</div>
</template>

<script type="text/ecmascript-6">
  import EbTable from '@/components/EbTable'
  import { getList as getUserList } from '@/api/user'
  import { cloneObj, setTotalSize } from '@/utils'

  export default{
    name: 'list',
    data() {
      return {
        list: [],
        page: 0,
        pageSize: 10,
        totalSize: 0,
        queryType: 2,
        columns: [{ prop: 'userName', label: '登录名' },
          { prop: 'registerTime', label: '注册时间', width: '160' },
          { prop: 'roleName', label: '角色' },
          { prop: 'totalBalance', label: '余额款' },
          { prop: 'totalScore', label: '总积分' },
          { prop: 'statusName', label: '状态' },
          { slot: 'opt' }],
        roleType: this.GLOBAL.userRoleType[0].t,
        tagsGroup: this.GLOBAL.userRoleType,
        inputGroup: [
          { value: '', name: 'productCode', holder: '款号' },
          { value: '', name: 'customName', holder: '客户' },
          { value: '', name: 'orderId', holder: '订单号' },
          { value: '', name: 'sourceId', holder: '客户订单号' }
        ],
        createTime: [],
        listQuery: {
          page: 0,
          pageSize: 10,
          type: 2,
          roleType: this.GLOBAL.userRoleType[0].t
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        getUserList(this.listQuery).then(res => {
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, this.listQuery.page, 'User');
        });
      },
      handleClick(tab, event) {
        this.listQuery.page = 0;
        this.getData();
      },
      handleCurrentChange(val) {
        console.log(this.listQuery.page)
        console.log(val)
        this.listQuery.page = val - 1;
        // this.getData();
      },
      showDetail(id) {
        this.$router.push({ path: '/user/edit', query: { id: id }});
      },
      addUser() {
        this.$router.push({ path: '/user/add', query: { roleType: this.roleType }});
      }
    },
    components: {
      EbTable
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .user-list-container{
    position: relative;
    .add-user-btn{
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }
</style>