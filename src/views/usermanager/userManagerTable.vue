<template>
  <div class="app-container">
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
        <el-col :span="4"><el-input v-model="input"   placeholder="请输入内容"></el-input></el-col>
        <el-col :span="1" class="mycenter" >姓名:</el-col>
        <el-col :span="3"><el-input v-model="input"  placeholder="请输入内容"></el-input></el-col>
        <el-col :span="1" class="mycenter" >手机:</el-col>
        <el-col :span="4"><el-input v-model="input"  placeholder="请输入内容"></el-input></el-col>
        <el-col :span="1" class="mycenter" >邮箱:</el-col>
        <el-col :span="4"><el-input v-model="input"  placeholder="请输入内容"></el-input></el-col>
        <el-col :span="1"> <el-button type="primary" icon="el-icon-search"></el-button></el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.pageviews}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'
export default {
  name: 'UserManagerTable',
  data() {
    return {
      list: null,
      listLoading: true
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
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .mycenter{
    margin-top: 1.5%;
  }
</style>
