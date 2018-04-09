<template>
  <div class="app-container">
    <div>
      <el-button type="primary" v-if="add" @click="handleCreate"  icon="el-icon-plus"></el-button>
      <el-button type="primary" v-if="del" @click="handleDelete" icon="el-icon-delete"></el-button>
      <el-button type="primary" @click="toggleexpand(false)"  icon="el-icon-d-caret">合并</el-button>
      <el-button type="primary" @click="toggleexpand(true)"  icon="el-icon-d-caret">展开</el-button>
    </div>
    <hr>
    <tree-table :data="data" :evalFunc="func" :evalArgs="args" :expandAll="expandAll"  @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label='Name' width="100">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="Note" width="150">
        <template slot-scope="scope">
          {{scope.row.note}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" size="mini" v-if="edit"  icon="el-icon-plus" @click="handleCreate(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('departmentManager.name')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>

        <el-form-item :label="$t('departmentManager.note')" prop="note">
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
  import treeTable from '@/components/TreeTable'
  import treeToArray from './customEval'
  import { ajaxlist, insert, update, dodelete } from '@/api/departmentManager'
  export default {
    name: 'DepartmentManager',
    components: { treeTable },
    data() {
      return {
        add: null,
        del: null,
        edit: null,
        func: treeToArray,
        data: [],
        temp: {
          id: undefined,
          name: null,
          note: null,
          pid: null,
          leader: null
        },
        args: [null, null],
        expandAll: false,
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        multipleSelection: [],
        rules: {
          name: [{ required: true, message: 'name is required', trigger: 'blur' }],
          note: [{ required: true, message: 'note is required', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.ajaxlist()
      this.add = this.accessAcl('privilege', 'dept', 0)
      this.edit = this.accessAcl('privilege', 'dept', 2)
      this.del = this.accessAcl('privilege', 'dept', 3)
    },
    watch: {},

    methods: {
      toggleexpand(flag) {
        if (flag) {
          this.expandAll = true
        } else {
          this.expandAll = false
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val.val
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name: null,
          note: '',
          leader: '',
          pid: null
        }
      },
      ajaxlist() {
        ajaxlist().then((res) => {
          this.data = res
        })
      },
      handleCreate(pid) {
        this.resetTemp()
        if (pid) {
          this.temp.pid = pid
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.parent = null
        this.dialogStatus = 'update'
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
                this.ajaxlist()
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
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            update(this.temp).then((res) => {
              if (res && res.responseCode === 100) {
                this.ajaxlist()
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
              this.ajaxlist()
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

