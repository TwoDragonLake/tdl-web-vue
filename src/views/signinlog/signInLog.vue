<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="dodelete" icon="el-icon-delete"></el-button>
      <el-button type="primary"  @click="fetchData" icon="el-icon-refresh"></el-button>
    </div>
    <hr>
    <div >
      <el-row :gutter="20">
        <el-col :span="2" class="mycenter"  >用户名:</el-col>
        <el-col :span="5"><el-input v-model="queryModel.operationUsername"   placeholder="请输入内容"></el-input></el-col>
        <el-col :span="4"> <el-button type="primary" @click="fetchData" icon="el-icon-search"></el-button></el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column :label="$t('table.view')">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="edit" @click="handelView(scope.row)">{{$t('table.view')}}</el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('signInLog.ip')">
        <template slot-scope="scope">
          {{scope.row.ip}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('signInLog.operationUsername')">
        <template slot-scope="scope">
          {{scope.row.operationUsername}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('signInLog.operationPerson')">
        <template slot-scope="scope">
          {{scope.row.operationPerson}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('signInLog.operationContent')">
        <template slot-scope="scope">
          {{scope.row.operationContent}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('signInLog.operationTime')">
        <template slot-scope="scope">
          {{scope.row.operationTime}}
        </template>
      </el-table-column>

    </el-table>


    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageIndex"
                     :page-sizes="[20,30, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="editDialogFormVisible"  width="35%">
      <el-form  ref="editDataForm" :model="model" label-position="left" label-width="120px" style='width: 900px; margin-left:50px;'>
        <el-form-item  :label="$t('signInLog.ip')" prop="configName">
          <el-input v-model="model.ip" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('signInLog.operationUsername')" prop="configSn">
          <el-input  v-model="model.operationUsername" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('signInLog.operationPerson')"  prop="configKey">
          <el-input  v-model="model.operationPerson" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('signInLog.operationContent')"  prop="configValue">
          <el-input  v-model="model.operationContent"  style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('signInLog.operationTime')" >
          <el-input  v-model="model.operationTime"  style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">Close</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { ajaxList,dodelete } from '@/api/signInLog'
export default {
  name: 'SignInLog',
  data() {
    return {
      edit: null,
      list: null,
      listLoading: true,
      total: null,
      queryModel: {
        operationUsername: null
      },
      model: {
        id: null,
        ip: null,
        operationId: null,
        operationUsername: null,
        operationPerson: null,
        operationContent: null,
        operationTime: null
      },
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      multipleSelection: [],
      textMap: {
        view: 'View'
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
    this.edit = this.accessAcl('privilege', 'loginlog', 2)
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      ajaxList(this.queryModel, this.query).then(response => {
        this.list = response.data
        this.listLoading = false
        this.total = response.total
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.query.pageIndex = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.query.pageSize = val
      this.fetchData()
    },
    handelView(row){
      this.model = Object.assign({}, row) // copy obj
      this.dialogStatus = 'view'
      this.editDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['editDataForm'].clearValidate()
      })
    },
    dodelete() {
      if ((this.multipleSelection && this.multipleSelection.length === 0) || !this.multipleSelection) {
        this.$message({
          type: 'success',
          message: '请选择一条数据!'
        })
        return
      }
      this.$confirm('永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let idsstr = ''
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (i === 0) {
            idsstr += idsstr + this.multipleSelection[i].id
          } else {
            idsstr += ',' + this.multipleSelection[i].id
          }
        }
        dodelete(idsstr).then((res) => {
          if (res && res.responseCode === 100) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$notify({
              title: '删除失败',
              message: res.responseMsg,
              type: 'fail',
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .mycenter{
    margin-left: 5%;
    margin-top: 1%;
  }
</style>
