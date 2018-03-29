<template>
  <div class="app-container">
    <div>
      <el-button type="primary" v-if="add" @click="handleCreate"  icon="el-icon-plus"></el-button>
      <el-button type="primary" v-if="del"  @click="handleDelete"  icon="el-icon-delete"></el-button>
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
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label='Name' width="100">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="Sn" width="150">
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
      <<el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('systemManager.name')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>

        <el-form-item :label="$t('systemManager.sn')" prop="sn">
          <el-input v-model="temp.sn"></el-input>
        </el-form-item>

        <el-form-item :label="$t('systemManager.url')" prop="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>

        <el-form-item :label="$t('systemManager.orderNo')" prop="orderNo">
          <el-input v-model="temp.orderNo"></el-input>
        </el-form-item>

        <el-form-item :label="$t('systemManager.note')" prop="note">
          <el-input v-model="temp.note"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancle</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">confirm</el-button>
        <el-button v-else type="primary" @click="updateData">confirm</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { getList, insert, update, dodelete } from '@/api/systemManager'
// import store from '@/store'
//  import { getToken } from '@/utils/auth'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

export default {
  name: 'SystemManager',
  data() {
    return {
      add: null,
      del: null,
      edit: null,
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
        sortField: 'id'
      },
      calendarTypeOptions,
      dialogStatus: '',
      dialogFormVisible: false,
      statusOptions: ['published', 'draft', 'deleted'],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        id: undefined,
        name: 1,
        sn: '',
        url: '',
        note: '',
        orderNo: '',
        status: 'published'
      },
      rules: {
        name: [{ required: true, message: 'title is required', trigger: 'blur' }],
        sn: [{ required: true, message: 'title is required', trigger: 'blur' }],
        url: [{ required: true, message: 'title is required', trigger: 'blur' }],
        note: [{ required: true, message: 'title is required', trigger: 'blur' }],
        orderNo: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      multipleSelection: []
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
    this.add = this.accessAcl('privilege', 'icsystem', 0)
    this.edit = this.accessAcl('privilege', 'icsystem', 2)
    this.del = this.accessAcl('privilege', 'icsystem', 3)
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
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insert(this.temp).then((res) => {
            if (res && res.responseCode === 100) {
              this.fetchData()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
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
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          update(this.temp).then((res) => {
            if (res && res.responseCode === 100) {
              this.fetchData()
              this.dialogFormVisible = false
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
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    handleDelete() {
      if (this.multipleSelection.length === 0) {
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
            this.dialogFormVisible = false
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
    margin-left: 10%;
    margin-top: 1%;
  }
</style>
