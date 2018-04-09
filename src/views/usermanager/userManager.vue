<template>
  <div class="app-container" style="white-space: nowrap;">
    <div class="treetable-left">
      <Tree :datas="treeData" @node-click="handleTreeClick"></Tree>
    </div>
    <div class="treetable-right">
      <div>
        <el-button type="primary" icon="el-icon-plus"></el-button>
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
        <el-button type="primary" icon="el-icon-info">查看详情</el-button>
        <el-button type="primary" icon="el-icon-setting">分配角色</el-button>
        <el-button type="primary" icon="el-icon-setting">操作授权</el-button>
        <el-button type="primary" icon="el-icon-view">修改密码</el-button>
      </div>
      <hr>
      <div >
        <el-row :gutter="20">
          <el-col :span="2" class="mycenter"  >用户名:</el-col>
          <el-col :span="4"><el-input v-model="queryModel.username"   placeholder="请输入内容"></el-input></el-col>
          <el-col :span="1" class="mycenter" >姓名:</el-col>
          <el-col :span="3"><el-input v-model="queryModel.realName"  placeholder="请输入内容"></el-input></el-col>
          <el-col :span="1" class="mycenter" >手机:</el-col>
          <el-col :span="4"><el-input v-model="queryModel.mobile"  placeholder="请输入内容"></el-input></el-col>
          <el-col :span="1" class="mycenter" >邮箱:</el-col>
          <el-col :span="4"><el-input v-model="queryModel.email"  placeholder="请输入内容"></el-input></el-col>
          <el-col :span="1"> <el-button type="primary" @click="fetchData" icon="el-icon-search"></el-button></el-col>
        </el-row>
      </div>
      <el-table :data="data" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label='username' width="95">
          <template slot-scope="scope">
            {{scope.row.username}}
          </template>
        </el-table-column>
        <el-table-column label="realName">
          <template slot-scope="scope">
            {{scope.row.realName}}
          </template>
        </el-table-column>
        <el-table-column label="sex" width="110" align="center">
          <template slot-scope="scope">
            <span>{{(scope.row.sex === 0)?'男':'女'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="roles" width="110" align="center">
          <template slot-scope="scope">
            {{scope.row.roles}}
          </template>
        </el-table-column>
        <el-table-column label="mobile" width="110" align="center">
          <template slot-scope="scope">
            {{scope.row.mobile}}
          </template>
        </el-table-column>
        <el-table-column label="phone" width="110" align="center">
          <template slot-scope="scope">
            {{scope.row.phone}}
          </template>
        </el-table-column>
        <el-table-column label="email" width="110" align="center">
          <template slot-scope="scope">
            {{scope.row.email}}
          </template>
        </el-table-column>
        <el-table-column label="deptName" width="110" align="center">
          <template slot-scope="scope">
            {{scope.row.deptName}}
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageIndex"
                       :page-sizes="[10,20,30, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
  import { Tree } from '@/views/usermanager/index'
  import { getDeptTree } from '@/api/departmentManager'
  import { fetchData } from '@/api/userMananger'
  export default {
    name: 'UserManager',
    components: {
      Tree
    },
    data() {
      return {
        listLoading: true,
        treeData: null,
        queryModel: {
          departmentId: null,
          username: null,
          realName: null,
          mobile: null,
          email: null
        },
        query: {
          pageIndex: 1,
          pageSize: 20
        },
        data: null,
        total: null
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getDeptTree()
    },
    methods: {
      getDeptTree() {
        getDeptTree().then((res) => {
          this.treeData = res
          if (this.treeData.length > 0) {
            this.queryModel.departmentId = this.treeData[0].id
          }
          this.fetchData()
        })
      },
      fetchData() {
        this.listLoading = true
        fetchData(this.queryModel, this.query).then((res) => {
          this.data = res.data
          this.total = res.total
          this.listLoading = false
        })
      },
      handleTreeClick(payload) {
        this.queryModel.departmentId = payload.node.id
        this.$nextTick(() => {
          this.fetchData()
        })
      },
      handleCurrentChange(val) {
        this.query.pageIndex = val
        this.$nextTick(() => {
          this.fetchData()
        })
      },
      handleSizeChange(val) {
        this.query.pageSize = val
        this.$nextTick(() => {
          this.fetchData()
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .treetable-left {
    height: 100%;
    width: 20%;
    float:left;
  }
  .treetable-right {
    float:left;
    width: 80%;
  }
</style>
