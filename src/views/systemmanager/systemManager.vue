<template>
  <div class="app-container">
    <div>
      <el-button type="primary" icon="el-icon-plus"></el-button>
      <el-button type="primary" icon="el-icon-edit"></el-button>
      <el-button type="primary" icon="el-icon-delete"></el-button>
      <AclBox>
        ++++++
      </AclBox>
    </div>
    <hr>
    <div >
      <el-row :gutter="20">
        <el-col :span="2" class="mycenter"  >系统名称:</el-col>
        <el-col :span="4"><el-input  v-model="icSystem.name"  placeholder="请输入内容"></el-input></el-col>
        <el-col :span="2" class="mycenter" >系统标示:</el-col>
        <el-col :span="4"><el-input v-model="icSystem.sn"  placeholder="请输入内容"></el-input></el-col>
        <el-col :span="4"> <el-button type="primary" @click="search" icon="el-icon-search"></el-button></el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='Name' width="200">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="Sn" width="200">
        <template slot-scope="scope">
          {{scope.row.sn}}
        </template>
      </el-table-column>
      <el-table-column label="PreUrl" width="300" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column label="OrderNO" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.orderNo}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Remark" width="500" align="center">
        <template slot-scope="scope">
          {{scope.row.note}}
        </template>
      </el-table-column>
      <!--<el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column>-->
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>


</template>

<script>
import { getList } from '@/api/systemManager'
import AclBox from '@/components/PrivilegeAccess/aclBox'
export default {
  name: 'SystemManager',
  components: {
    AclBox
  },
  data() {
    return {
      icSystem: {
        name: null,
        sn: null
      },
      total: null,
      list: null,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
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
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.icSystem, this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchData()
    },
    search() {
      this.fetchData()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .mycenter{
    margin-left: 10%;
    margin-top: 1%;
  }
</style>
