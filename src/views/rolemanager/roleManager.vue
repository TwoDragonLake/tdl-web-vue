<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="handleCreate" v-if="add" icon="el-icon-plus">添加</el-button>
      <el-button type="primary" v-if="del" @click="handleDelete"  icon="el-icon-delete">删除</el-button>
      <el-button type="primary" @click="handleAccessAcl"  v-if="acl"  icon="el-icon-setting">操作授权</el-button>
    </div>
    <hr>
    <div >
      <el-row :gutter="20">
        <el-col :span="2" class="mycenter"  >角色名称:</el-col>
        <el-col :span="6"><el-input v-model="roleQueryModel.name"   placeholder="请输入内容"></el-input></el-col>
        <el-col :span="2" class="mycenter" >角色标示:</el-col>
        <el-col :span="6"><el-input v-model="roleQueryModel.sn"  placeholder="请输入内容"></el-input></el-col>
        <el-col :span="4"> <el-button @click="fetchData" type="primary" icon="el-icon-search"></el-button></el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
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
        <el-button @click="editDialogFormVisible = false">Cancle</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">confirm</el-button>
        <el-button type="primary" v-else  @click="saveUpdate">Save</el-button>
      </div>
    </el-dialog>


    <!-- 授权 -->
    <el-dialog :title="textMap[privDialogStatus]" :visible.sync="privEditDialogFormVisible"  width="70%">
      <el-row>
        <el-col :span="5">
          <Tree :datas="privModel.privSystems" @node-click="handlePrivSystemsClick"></Tree>
        </el-col>
        <el-col :span="18">
          <el-checkbox label="全选" :checked="privModel.selectedAllModule" @change="setAllAcl($event)"></el-checkbox>
          <tree-table :data="privModel.modules" :evalFunc="func" :evalArgs="args" :expandAll="expandAll">
            <el-table-column align="center" label='名称' width="100">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column align="center" label='权限值' width="450">
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.selectedPvs"  >
                  <el-checkbox label="全选"   :checked="scope.row.hasAllPvs"  @change="setAclByModule(scope.row.id, $event)"></el-checkbox>
                  <el-checkbox  v-for="item in scope.row.pvs"  :checked="item.flag" :key="item.id"
                                :label="item.id"    @change="setAcl(scope.row.id, scope.row.sn, item.position,$event)">
                    {{item.name}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </tree-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="privEditDialogFormVisible = false">Close</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { Tree } from '@/views/usermanager/index'
import treeTable from '@/components/TreeTable'
import { fetchData, insert, update, dodelete, checkSnExsits } from '@/api/roleManager'
import { getsystems, getmodules } from '@/api/moduleManager'
import { getAllPriValBySystemSn, setAllAcl, setAclByModule, setAcl } from '@/api/userMananger'
import treeToArray from './customEval'
export default {
  name: 'RoleManager',
  components: {
    Tree, treeTable
  },
  data() {
    return {
      func: treeToArray,
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
        note: null
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
        acl: 'Set-Acl'
      },
      dialogStatus: null,
      editDialogFormVisible: false,
      privDialogStatus: null,
      privEditDialogFormVisible: false,
      systems: null,
      privModel: {
        selectedSystemId: null,
        selectedSystemSn: null,
        privSystems: null,
        selectedAllModule: false,
        modules: []
      },
      expandAll: false,
      args: [null, null]
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
    this.add = this.accessAcl('privilege', 'role', 0)
    this.edit = this.accessAcl('privilege', 'role', 2)
    this.del = this.accessAcl('privilege', 'role', 3)
    this.acl = this.accessAcl('privilege', 'role', 6)
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchData(this.roleQueryModel, this.query).then(response => {
        this.list = response.data
        this.total = response.total
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
    resetRoleModel() {
      this.roleModel = {
        id: null,
        name: null,
        sn: null,
        note:null
      }
    },
    handleCreate() {
      this.resetRoleModel()
      this.editDialogFormVisible = true
      this.dialogStatus = 'create'
    },
    handleUpdate(row) {
      this.roleModel.id = row.id
      this.roleModel.name = row.name
      this.roleModel.note = row.note
      this.roleModel.sn = row.sn
      this.editDialogFormVisible = true
      this.dialogStatus = 'update'
    },
    createData() {
      this.$refs['roleEditDataForm'].validate((valid) => {
        if (valid) {
          checkSnExsits(this.roleModel).then((response) => {
            if (response === 0) {
              insert(this.roleModel).then((res) => {
                if (res && res.responseCode === 100) {
                  // this.fetchData()
                  this.editDialogFormVisible = false
                  this.fetchData()
                  this.$notify({
                    title: '成功',
                    message: '保存成功',
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
                message: '标识重复！',
                type: 'fail',
                duration: 2000
              })
            }
          })
        }
      })
    },
    saveUpdate() {
      this.$refs['roleEditDataForm'].validate((valid) => {
        if (valid) {
          checkSnExsits(this.roleModel).then((response) => {
            if (response === 0) {
              update(this.roleModel).then((res) => {
                if (res && res.responseCode === 100) {
                  // this.fetchData()
                  this.editDialogFormVisible = false
                  this.fetchData()
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
                message: '标识重复！',
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
    },
    // action accessacl dialog
    handleAccessAcl() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'success',
          message: '请选择一条数据!'
        })
        return
      }
      this.privDialogStatus = 'acl'
      this.privEditDialogFormVisible = true
      this.getprivSystems()
    },
    getprivSystems() {
      getsystems().then(response => {
        this.privModel.privSystems = response
        if (this.privModel.privSystems && this.privModel.privSystems.length > 0) {
          this.$nextTick(() => {
            this.getModules(this.privModel.privSystems[0].id)
          })
        }
      })
    },
    // load system`s modules
    getModules(systemId) {
      getmodules({ pageIndex: 1, pageSize: 20000 }, { systemId: systemId }).then((res) => {
        this.privModel.modules = res
      })
    },
    // action click system, then load system`s module list
    handlePrivSystemsClick(payload) {
      this.privModel.selectedSystemId = payload.node.id
      this.privModel.selectedSystemSn = payload.node.sn
      this.$nextTick(() => {
        this.getAllPriValBySystemSn(this.privModel.selectedSystemSn, 'role', this.multipleSelection[0].id)
      })
    },
    getAllPriValBySystemSn(systemSn, type, releaseId) {
      this.privModel.modules = []
      getAllPriValBySystemSn(systemSn, type, releaseId).then((res) => {
        this.privModel.modules = res
        if (this.privModel.modules && this.privModel.modules.length > 0) {
          let allModule = true
          for (let i = 0; i < this.privModel.modules.length; i++) {
            let module = this.privModel.modules[i]
            if (!module.hasAllPvs) {
              allModule = false
            }
          }
          this.privModel.selectedAllModule = allModule
        }
      })
    },
    setAllAcl(event) {
      const acl = {
        systemSn: this.privModel.selectedSystemSn,
        releaseId: this.multipleSelection[0].id,
        releaseSn: 'role'
      }
      setAllAcl(acl, event).then(() => {
        this.privModel.modules = []
        this.$nextTick(() => {
          this.getAllPriValBySystemSn(this.privModel.selectedSystemSn, 'role', this.multipleSelection[0].id)
        })
      })
    },
    setAclByModule(moduleId, event) {
      const acl = {
        systemSn: this.privModel.selectedSystemSn,
        moduleId: moduleId,
        releaseId: this.multipleSelection[0].id,
        releaseSn: 'role'
      }
      setAclByModule(acl, event).then(() => {
        this.privModel.modules = []
        this.$nextTick(() => {
          this.getAllPriValBySystemSn(this.privModel.selectedSystemSn, 'role', this.multipleSelection[0].id)
        })
      })
    },
    setAcl(moduleId, moduleSn, position, event) {
      const acl = {
        systemSn: this.privModel.selectedSystemSn,
        moduleId: moduleId,
        moduleSn: moduleSn,
        releaseId: this.multipleSelection[0].id,
        releaseSn: 'role'
      }
      setAcl(acl, position, event).then(() => {
        this.privModel.modules = []
        this.$nextTick(() => {
          this.getAllPriValBySystemSn(this.privModel.selectedSystemSn, 'role', this.multipleSelection[0].id)
        })
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
