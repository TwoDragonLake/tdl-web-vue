<template>
  <div class="app-container" style="white-space: nowrap;">
      <div class="treetable-left">
        <Tree :datas="treeData" @node-click="handleTreeClick"></Tree>
      </div>
      <div class="treetable-right">
        <div>
          <el-button type="primary" v-if="add" @click="handleCreate" icon="el-icon-plus"></el-button>
          <el-button type="primary" v-if="del" @click="handleDelete"  icon="el-icon-delete"></el-button>
          <el-button type="primary" v-if="edit" @click="getAllPriVal" icon="el-icon-setting">添加操作权限</el-button>
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
          <el-table-column label="Url" width="150">
            <template slot-scope="scope">
              {{scope.row.url}}
            </template>
          </el-table-column>
          <el-table-column label="State" width="300" align="center">
            <template  slot-scope="scope">
              <el-tag v-if="edit" v-for="pv in scope.row.pvs"  closable  :disable-transitions="false" @close="handleDeletePvs(pv)">
                {{pv.name}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Sn" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.sn}}
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="OrderNo" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.orderNo}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" v-if="edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
              <el-button type="primary" size="mini" v-if="edit"  icon="el-icon-plus" @click="handleCreate(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </tree-table>

        <!--<div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageIndex"
                         :page-sizes="[10,20,30, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>-->
      </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"  width="40%">
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
          <el-input value="number" v-model="temp.orderNo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancle</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">confirm</el-button>
        <el-button v-else type="primary" @click="updateData">confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[privDialogStatus]" :visible.sync="privDialogFormVisible"  width="40%">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"  @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="privCheckList" @change="handleCheckedPriChange">
        <el-checkbox v-for="priv in privList"   :label="priv.position">{{priv.name}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="privDialogFormVisible = false">Cancle</el-button>
        <el-button  type="primary" @click="insertPriVal">Confirm</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import treeTable from '@/components/TreeTable'
  import treeToArray from './customEval'
  import { Tree } from '@/views/modulemanager/index'
  import { getsystems, getmodules, insert, update, dodelete, deletePriVal, getAllPriVal, insertPriVal } from '@/api/moduleManager'
  export default {
    name: 'customTreeTableDemo',
    components: { Tree, treeTable },
    data() {
      return {
        func: treeToArray,
        add: null,
        del: null,
        edit: null,
        expandAll: false,
        treeData: [],
        total: null,
        query: {
          pageIndex: 1,
          pageSize: 20
        },
        model: {
          systemId: null
        },
        data:
          { },
        args: [null, null],
        textMap: {
          update: 'Edit',
          create: 'Create',
          priv: 'Add-Privilege'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        privDialogFormVisible: false,
        privDialogStatus: '',
        privCheckList: [],
        checkAll: false,
        privList: [],
        temp: {
          id: undefined,
          name: null,
          sn: '',
          url: '',
          orderNo: '',
          systemId: null,
          pid: null
        },
        rules: {
          name: [{ required: true, message: 'name is required', trigger: 'blur' }],
          sn: [{ required: true, message: 'sn is required', trigger: 'blur' }],
          url: [{ required: true, message: 'url is required', trigger: 'blur' }],
          orderNo: [{ required: true, message: 'orderNo is required & number type', trigger: 'blur' }]
        },
        multipleSelection: [],
        isIndeterminate: true
      }
    },
    created() {
      this.systems()
      this.add = this.accessAcl('privilege', 'module', 0)
      this.edit = this.accessAcl('privilege', 'module', 2)
      this.del = this.accessAcl('privilege', 'module', 3)
    },
    methods: {
      handleCheckAllChange(val) {
        const tempArrIds = []
        if (this.privList.length > 0) {
          for (let i = 0; i < this.privList.length; i++) {
            tempArrIds[i] = this.privList[i].position
          }
        }
        this.privCheckList = val ? tempArrIds : []
        this.isIndeterminate = false
        console.log(this.privCheckList)
      },
      handleCheckedPriChange(value) {
        const checkedCount = value.length
        this.checkAll = checkedCount === this.privList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.privList.length
        console.log(this.privCheckList)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val.val
      },
      message(row) {
        this.$message.info(row.event)
      },
      systems() {
        getsystems().then(response => {
          this.treeData = response
        })
      },
      handleTreeClick(payload) {
        this.model.systemId = payload.node.id
        this.$nextTick(() => {
          this.getmodules()
        })
        //  console.log(payload.node)
      },
      handleCurrentChange(val) {
        this.query.pageIndex = val
        this.$nextTick(() => {
          this.getmodules()
        })
      },
      handleSizeChange(val) {
        this.query.pageSize = val
        this.$nextTick(() => {
          this.getmodules()
        })
      },
      handleDeletePvs(pv) {
        this.$confirm('永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          deletePriVal(pv.id, pv.moduleId).then((res) => {
            if (res && res.responseCode === 100) {
              this.getmodules()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '删除成功',
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      getmodules() {
        getmodules(this.query, this.model).then((res) => {
          this.data = res
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name: null,
          sn: '',
          url: '',
          orderNo: null,
          systemId: this.model.systemId,
          pid: null
        }
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
                this.getmodules()
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
                this.getmodules()
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
              this.getmodules()
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
      },
      getAllPriVal() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'success',
            message: '请选择一条数据!'
          })
          return
        }
        getAllPriVal(this.multipleSelection[0].id, this.model.systemId).then((res) => {
          this.privList = res
          this.privCheckList = []
          this.privDialogStatus = 'priv'
          this.privDialogFormVisible = true
        })
      },
      insertPriVal() {
        if (this.privCheckList.length === 0) {
          return
        }
        insertPriVal(this.privCheckList.join(','), this.multipleSelection[0].id).then((res) => {
          if (res && res.responseCode === 100) {
            this.getmodules()
            this.$message({
              type: 'success',
              message: '设置成功!'
            })
            this.privDialogFormVisible = false
          } else {
            this.$notify({
              title: '设置失败',
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
