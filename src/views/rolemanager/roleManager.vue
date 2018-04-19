<template>
  <div class="app-container">
    <div>
      <el-button type="primary" v-if="add" icon="el-icon-plus">添加</el-button>
      <el-button type="primary" v-if="del"  icon="el-icon-delete">删除</el-button>
      <el-button type="primary" v-if="acl"  icon="el-icon-setting">操作授权</el-button>
    </div>
    <hr>
    <div >
      <el-row :gutter="20">
        <el-col :span="2" class="mycenter"  >角色名称:</el-col>
        <el-col :span="6"><el-input v-model="roleQueryModel.name"   placeholder="请输入内容"></el-input></el-col>
        <el-col :span="2" class="mycenter" >角色标示:</el-col>
        <el-col :span="6"><el-input v-model="roleQueryModel.sn"  placeholder="请输入内容"></el-input></el-col>
        <el-col :span="4"> <el-button type="primary" icon="el-icon-search"></el-button></el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" label='ID' width="95">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column :label="$t('roleManager.name')">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center" :label="$t('roleManager.sn')">
        <template slot-scope="scope">
          <span>{{scope.row.sn}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center" :label="$t('roleManager.note')">
        <template slot-scope="scope">
          {{scope.row.note}}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="Display_time" width="200" :label="$t('table.operation')" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageIndex"
                     :page-sizes="[10,20,30, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="editDialogFormVisible"  width="30%">
      <el-form :rules="rules" ref="roleEditDataForm" :model="roleModel" label-position="left" label-width="70px" style='width: 900px; margin-left:50px;'>
        <el-form-item :rules="rules" :label="$t('roleManager.name')" prop="name">
          <el-input v-model="roleModel.name" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('roleManager.sn')" prop="sn">
          <el-input  v-model="roleModel.sn" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('roleManager.note')" prop="note">
          <el-input  v-model="roleModel.note" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwdEditDialogFormVisible = false">Cancle</el-button>
        <el-button type="primary"   @click="saveUpdate">Save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList } from '@/api/table'
import { fetchData, insert, update, dodelete } from '@/api/roleManager'
export default {
  name: 'RoleManager',
  data() {
    return {
      add: null,
      acl: null,
      del: null,
      edit: null,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      roleQueryModel: {
        name: null,
        sn: null
      },
      roleModel: {
        id: null,
        name: null,
        sn: null,
        note:null
      },
      multipleSelection: [],
      total: null,
      list: null,
      listLoading: true,
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        sn: [{ required: true, message: 'sn is required', trigger: 'blur' }]
      },
      textMap: {
        update: 'Edit',
        create: 'Create',
        acl: 'Set-Acl',
        password: 'Set-Password'
      },
      dialogStatus: null,
      editDialogFormVisible: false
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
      fetchData(this.roleQueryModel, this.query).then(response => {
        this.list = response.datas
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    },
    handleUpdate(row) {
      this.roleModel.id = row.id
      this.roleModel.name = row.name
      this.roleModel.note = row.note
      this.roleModel.sn = row.sn
    },
    saveUpdate() {
      update(this.roleModel).then((res) => {
        if (res && res.responseCode === 100) {
          // this.fetchData()
          this.editDialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.responseMsg,
            type: 'fail',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .mycenter{
    margin-top: 1%;
    margin-left: 5%;
  }
</style>
