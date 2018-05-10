<template>
  <div class="app-container" style="white-space: nowrap;">
    <div class="treetable-left">
      <Tree :datas="treeData" @node-click="handlePrivSystemsClick"></Tree>
    </div>
    <div class="treetable-right">
      <div>
        <el-button type="primary" v-if="add" @click="handleCreate" icon="el-icon-plus"></el-button>
        <el-button type="primary" v-if="del" @click="handleDelete"  icon="el-icon-delete"></el-button>
      </div>
      <hr>
      <el-table :data="data" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" :label="$t('systemPriValue.Name')" width="100">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('systemPriValue.Position')" width="100">
          <template slot-scope="scope">
            {{scope.row.position}}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('systemPriValue.OrderNo')" width="100">
          <template slot-scope="scope">
            {{scope.row.orderNo}}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('systemPriValue.Remark')" width="100">
          <template slot-scope="scope">
            {{scope.row.remark}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.operation')" width="100">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="editDialogFormVisible"  width="30%">
      <el-form :rules="rules" ref="editDataForm" :model="model" label-position="left" label-width="70px" style='width: 900px; margin-left:50px;'>
        <el-form-item :rules="rules" :label="$t('systemPriValue.Name')" prop="name">
          <el-input v-model="model.name" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemPriValue.Position')" prop="position">
          <el-input  v-model="model.position" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemPriValue.OrderNo')"  >
          <el-input  v-model="model.orderNo" type="number" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemPriValue.Remark')"  >
          <el-input  v-model="model.remark"  style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">Cancle</el-button>
        <el-button type="primary"  v-if="dialogStatus=='create'"  @click="saveSysPriValue">Save</el-button>
        <el-button type="primary"  v-else   @click="updateSysPriValue">Update</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { Tree } from '@/views/systemprivalue/index'
import { getsystems } from '@/api/moduleManager'
import { ajaxlist, insert, update, checkExsits, dodelete } from '@/api/systemPriValue.js'
export default {
  name: 'SystemPriValue',
  components: {
    Tree
  },
  data() {
    return {
      add: null,
      del: null,
      edit: null,
      treeData: null,
      systemId: null,
      listLoading: false,
      data: null,
      model: {
        id: null,
        systemId: null,
        position: null,
        name: null,
        orderNo: null,
        remark: null,
        moduleId: null
      },
      multipleSelection: null,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogStatus: null,
      editDialogFormVisible: false,
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        position: [{ required: true, message: 'code is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.add = this.accessAcl('privilege', 'pval', 0)
    this.edit = this.accessAcl('privilege', 'pval', 2)
    this.del = this.accessAcl('privilege', 'pval', 3)
    this.getSystems()
  },
  methods: {
    getSystems() {
      getsystems().then((res) => {
        this.treeData = res
        if (this.treeData.length > 0) {
          this.systemId = this.treeData[0].id
          this.$nextTick(() => {
            this.fetchData()
          })
        }
      })
    },
    handlePrivSystemsClick(payload) {
      this.systemId = payload.node.id
      this.$nextTick(() => {
        this.fetchData()
      })
      //  console.log(payload.node)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.listLoading = true
      this.model.systemId = this.systemId
      ajaxlist(this.model).then((res) => {
        this.data = res
        this.listLoading = false
      })
    },
    resetModel() {
      this.model = {
        id: null,
        systemId: this.systemId,
        position: null,
        name: null,
        orderNo: null,
        remark: null,
        moduleId: null
      }
    },
    handleCreate() {
      this.resetModel()
      this.dialogStatus = 'create'
      this.editDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['editDataForm'].clearValidate()
      })
    },
    saveSysPriValue() {
      this.$refs['editDataForm'].validate((valid) => {
        if (valid) {
          checkExsits(this.model).then((response) => {
            console.log(response)
            console.log(response === 0)
            if (response === 0) {
              insert(this.model).then((res) => {
                if (res && res.status === '100') {
                  this.resetModel()
                  this.fetchData()
                  this.editDialogFormVisible = false
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
            } else {
              this.$notify({
                title: '失败',
                message: '权限制重复！',
                type: 'fail',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.model = Object.assign({}, row) // copy obj
      this.model.systemId = this.systemId
      this.dialogStatus = 'update'
      this.editDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['editDataForm'].clearValidate()
      })
    },
    updateSysPriValue() {
      this.$refs['editDataForm'].validate((valid) => {
        if (valid) {
          checkExsits(this.model).then((response) => {
            if (response === 0) {
              update(this.model).then((res) => {
                if (res && res.status === '100') {
                  this.resetModel()
                  this.fetchData()
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
            } else {
              this.$notify({
                title: '失败',
                message: '权限制重复！',
                type: 'fail',
                duration: 2000
              })
            }
          })
        }
      })
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
          if (res && res.status === '100') {
            this.resetModel()
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
