<template>
  <div class="app-container" style="white-space: nowrap;">
    <div class="treetable-left">
      <Tree :datas="treeData" @node-click="handleTreeClick"></Tree>
    </div>
    <div class="treetable-right">
      <div>
        <el-button type="primary" v-if="add" @click="handleCreate" icon="el-icon-plus"></el-button>
        <el-button type="primary" v-if="del" @click="handleDelete" icon="el-icon-delete"></el-button>
        <el-button type="primary" v-if="read" icon="el-icon-info">查看详情</el-button>
        <el-button type="primary" v-if="edit" @click="handleSetRole" icon="el-icon-setting">分配角色</el-button>
        <el-button type="primary" v-if="acl" @click="handleAccessAcl"  icon="el-icon-setting">操作授权</el-button>
        <el-button type="primary" v-if="edit" @click="handleUserPassword" icon="el-icon-view">修改密码</el-button>
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
      <el-table :data="data" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
            <el-button type="primary" size="mini" v-if="edit" @click="handleView(scope.row)">{{$t('table.view')}}</el-button>
          </template>
        </el-table-column>
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

      <!--  人员添加/修改 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="editDialogFormVisible"  width="70%">
        <el-form :disabled="disabled" :rules="rules" ref="editDataForm" :model="editModel" label-position="left" label-width="70px" style='width: 900px; margin-left:50px;'>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.username')" prop="username">
                <el-input v-model="editModel.username" style="width: 350px;margin-left: 3%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.realname')" prop="realName">
                <el-input v-model="editModel.realName" style="width: 350px;margin-left: 3%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userManager.mobile')" >
              <el-input v-model="editModel.mobile" style="width: 350px;margin-left: 3%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userManager.tel')" >
              <el-input v-model="editModel.tel" style="width: 350px;margin-left: 3%"></el-input>
            </el-form-item>
          </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.email')" prop="email">
                <el-input v-model="editModel.email" style="width: 350px;margin-left: 3%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.address')" >
                <el-input v-model="editModel.address" style="width: 350px;margin-left: 3%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.systems')" prop="systemIds">
                <el-select style="width: 350px;margin-left: 3%" value-key="id"
                  v-model="editModel.systemIds"
                  multiple
                  filterable
                  default-first-option
                  placeholder="请选择">
                  <el-option
                    v-for="item in systems"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item >
                <el-radio-group v-model="editModel.sex" :label="$t('userManager.sex')" prop="sex">
                  <el-radio :label="1">女</el-radio>
                  <el-radio :label="0">男</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.phone')" >
                <el-input v-model="editModel.phone" style="width: 350px;margin-left: 3%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.fax')" >
                <el-input  v-model="editModel.fax" style="width: 350px;margin-left: 3%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.department')" prop="departmentId">
                <el-select style="width: 350px;margin-left: 3%" value-key="id"
                  v-model="editModel.departmentId"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择">
                  <el-option
                    v-for="item in deptList"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">

            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">Cancle</el-button>
          <el-button :disabled="disabled" v-if="dialogStatus=='create'" type="primary" @click="createData">confirm</el-button>
          <el-button :disabled="disabled" v-else type="primary" @click="updateData">confirm</el-button>
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

      <el-dialog :title="textMap[privDialogStatus]" :visible.sync="roleEditDialogFormVisible"  width="30%">
        <el-table :data="roleModel.roleList" ref="roleMultipleTable"  border fit highlight-current-row @selection-change="handleRoleListSelected">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column :label="$t('userManager.roleName')" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>

          <el-table-column :label="$t('userManager.roleName')" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.sn}}
            </template>
          </el-table-column>

          <el-table-column :label="$t('userManager.RoleReamrk')" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.note}}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleRoleSizeChange" @current-change="handleRoleCurrentChange" :current-page="roleModel.query.pageIndex"
                         :page-sizes="[20,30, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleEditDialogFormVisible = false">Cancle</el-button>
          <el-button type="primary"   @click="saveUserRole">Save</el-button>
        </div>
      </el-dialog>


      <el-dialog :title="textMap[privDialogStatus]"  :visible.sync="passwdEditDialogFormVisible"  width="30%">
        <el-form :rules="rules" ref="roleEditDataForm" :model="passwordModel" label-position="left" label-width="70px" style='width: 900px; margin-left:50px;'>
          <el-form-item :rules="rules" :label="$t('userManager.username')" prop="username">
            <el-input v-model="passwordModel.username" style="width: 200px;margin-left: 3%"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userManager.password')" prop="password">
            <el-input type="password"  v-model="passwordModel.password" style="width: 200px;margin-left: 3%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="passwdEditDialogFormVisible = false">Cancle</el-button>
          <el-button type="primary"   @click="saveUserPassword">Save</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import { Tree } from '@/views/usermanager/index'
  import treeTable from '@/components/TreeTable'
  import treeToArray from './customEval'
  import { getDeptTree, getDeptList } from '@/api/departmentManager'
  import { getsystems, getmodules } from '@/api/moduleManager'
  import { fetchData, insert, update, dodelete, checkUserNameExsits, setAcl, setAclByModule, setAllAcl, getAllPriValBySystemSn, getRoles, saveUserRole, updatePassowrd } from '@/api/userMananger'
  export default {
    name: 'UserManager',
    components: {
      Tree, treeTable
    },
    data() {
      return {
        func: treeToArray,
        add: null,
        read: null,
        del: null,
        edit: null,
        acl: null,
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
          pageSize: 10
        },
        multipleSelection: [],
        data: null,
        total: null,
        textMap: {
          update: 'Edit',
          create: 'Create',
          acl: 'Set-Acl',
          role: 'Set-Role',
          password: 'Set-Password'
        },
        dialogStatus: null,
        editDialogFormVisible: false,
        privDialogStatus: null,
        privEditDialogFormVisible: false,
        roleEditDialogFormVisible: false,
        passwdEditDialogFormVisible: false,
        editModel: {
          id: null,
          username: null,
          realName: null,
          mobile: null,
          tel: null,
          email: null,
          address: null,
          systemIds: [],
          sex: null,
          phone: null,
          fax: null,
          departmentId: null,
          password: null,
          confirmPassword: null
        },
        disabled: false,
        systems: null,
        deptList: null,
        isExis: null,
        rules: {
          username: [{ required: true, message: 'username is required', trigger: 'blur' }],
          realName: [{ required: true, message: 'realName is required', trigger: 'blur' }],
          email: [{ required: true, message: 'email is required ', trigger: 'blur' }],
          systemIds: [{ required: true, message: 'systems is required ', trigger: 'blur' }],
          sex: [{ required: true, message: 'sex is required', trigger: 'blur' }],
          departmentId: [{ required: true, message: 'department is required', trigger: 'blur' }],
          password: [{ required: true, message: 'password is required', trigger: 'blur' }]
        },
        privModel: {
          selectedSystemId: null,
          selectedSystemSn: null,
          privSystems: null,
          selectedAllModule: false,
          modules: []
        },
        args: [null, null],
        expandAll: false,
        roleModel: {
          user: {
            name: null,
            sn: null,
            userId: null
          },
          query: {
            pageIndex: 1,
            pageSize: 20
          },
          roleList: null,
          selectedRoles: []
        },
        passwordModel: {
          username: null,
          password: null
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
      this.add = this.accessAcl('privilege', 'user', 0)
      this.read = this.accessAcl('privilege', 'user', 1)
      this.edit = this.accessAcl('privilege', 'user', 2)
      this.del = this.accessAcl('privilege', 'user', 3)
      this.acl = this.accessAcl('privilege', 'user', 6)
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
      getsystems() {
        getsystems().then(response => {
          this.systems = response
        })
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
      getDeptList() {
        getDeptList().then((res) => {
          this.deptList = res
        })
        // this.editModel.departmentId = []
      },
      handleTreeClick(payload) {
        this.queryModel.departmentId = payload.node.id
        this.$nextTick(() => {
          this.fetchData()
        })
      },
      handleUserPassword() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'success',
            message: '请选择一条数据!'
          })
          return
        }
        this.privDialogStatus = 'password'
        this.passwdEditDialogFormVisible = true
        this.passwordModel.username = this.multipleSelection[0].username
      },
      saveUserPassword() {
        this.$refs['roleEditDataForm'].validate((valid) => {
          if (valid) {
            updatePassowrd(this.passwordModel).then((res) => {
              if (res && res.responseCode === 100) {
                // this.fetchData()
                this.passwdEditDialogFormVisible = false
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
      // set role dialog
      handleSetRole() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'success',
            message: '请选择一条数据!'
          })
          return
        }
        this.privDialogStatus = 'role'
        this.roleEditDialogFormVisible = true
        this.doGetRoles(this.multipleSelection[0].id)
      },
      doGetRoles(userid) {
        this.roleModel.roleList = []
        // this.roleModel.selectedRoles = []
        console.log(this.roleModel.user)
        console.log(this.roleModel.query)
        getRoles(userid, this.roleModel.user, this.roleModel.query).then((res) => {
          this.$nextTick(() => {
            this.roleModel.roleList = res.datas
            this.$nextTick(() => {
              if (this.roleModel.roleList.length > 0) {
                for (let i = 0; i < this.roleModel.roleList.length; i++) {
                  if (this.roleModel.roleList[i].checked) {
                    this.$refs.roleMultipleTable.toggleRowSelection(this.roleModel.roleList[i], true)
                  }
                }
              }
            })
          })
        })
      },
      saveUserRole() {
        let roleIds = ''
        if (this.roleModel.selectedRoles.length > 0) {
          for (let i = 0; i < this.roleModel.selectedRoles.length; i++) {
            if (i === 0) {
              roleIds += roleIds + this.roleModel.selectedRoles[i].id
            } else {
              roleIds += ',' + this.roleModel.selectedRoles[i].id
            }
          }
        }
        saveUserRole(this.multipleSelection[0].id, roleIds).then((res) => {
          if (res && res.responseCode === 100) {
            this.fetchData()
            this.roleEditDialogFormVisible = false
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
      },
      handleRoleListSelected(val) {
        this.roleModel.selectedRoles = val
      },
      // action click system, then load system`s module list
      handlePrivSystemsClick(payload) {
        this.privModel.selectedSystemId = payload.node.id
        this.privModel.selectedSystemSn = payload.node.sn
        this.$nextTick(() => {
          this.getAllPriValBySystemSn(this.privModel.selectedSystemSn, 'user', this.multipleSelection[0].id)
        })
      },

      // load system`s modules
      getModules(systemId) {
        getmodules({ pageIndex: 1, pageSize: 20000 }, { systemId: systemId }).then((res) => {
          this.privModel.modules = res
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
      setAcl(moduleId, moduleSn, position, event) {
        const acl = {
          systemSn: this.privModel.selectedSystemSn,
          moduleId: moduleId,
          moduleSn: moduleSn,
          releaseId: this.multipleSelection[0].id,
          releaseSn: 'user'
        }
        setAcl(acl, position, event).then(() => {
          this.privModel.modules = []
          this.$nextTick(() => {
            this.getAllPriValBySystemSn(this.privModel.selectedSystemSn, 'user', this.multipleSelection[0].id)
          })
        })
      },
      setAclByModule(moduleId, event) {
        const acl = {
          systemSn: this.privModel.selectedSystemSn,
          moduleId: moduleId,
          releaseId: this.multipleSelection[0].id,
          releaseSn: 'user'
        }
        setAclByModule(acl, event).then(() => {
          this.privModel.modules = []
          this.$nextTick(() => {
            this.getAllPriValBySystemSn(this.privModel.selectedSystemSn, 'user', this.multipleSelection[0].id)
          })
        })
      },
      setAllAcl(event) {
        const acl = {
          systemSn: this.privModel.selectedSystemSn,
          releaseId: this.multipleSelection[0].id,
          releaseSn: 'user'
        }
        setAllAcl(acl, event).then(() => {
          this.privModel.modules = []
          this.$nextTick(() => {
            this.getAllPriValBySystemSn(this.privModel.selectedSystemSn, 'user', this.multipleSelection[0].id)
          })
        })
      },
      handleCurrentChange(val) {
        this.query.pageIndex = val
        this.$nextTick(() => {
          this.fetchData()
        })
      },
      handleSizeChange(val) {
        this.roleModel.query.pageSize = val
        this.$nextTick(() => {
          this.fetchData()
        })
      },
      // set role dialog pagenination
      handleRoleCurrentChange(val) {
        this.roleModel.query.pageIndex = val
        this.$nextTick(() => {
          this.getRoles(this.multipleSelection[0].id)
        })
      },
      handleRoleSizeChange(val) {
        this.roleModel.query.pageSize = val
        this.$nextTick(() => {
          this.getRoles(this.multipleSelection[0].id)
        })
      },
      resetEditModel() {
        this.editModel = {
          id: null,
          username: null,
          realName: null,
          mobile: null,
          tel: null,
          email: null,
          address: null,
          systemIds: [],
          sex: null,
          phone: null,
          fax: null,
          departmentId: null,
          password: null,
          confirmPassword: null
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleCreate() {
        this.resetEditModel()
        this.getsystems()
        this.getDeptList()
        this.dialogStatus = 'create'
        this.editDialogFormVisible = true
        this.disabled = false
        this.$nextTick(() => {
          this.$refs['editDataForm'].clearValidate()
        })
      },
      handleView(row) {
        this.disabled = true
        this.editModel.id = row.id
        this.editModel.username = row.username
        this.editModel.realName = row.realName
        this.editModel.mobile = row.mobile
        this.editModel.tel = row.tel
        this.editModel.email = row.email
        this.editModel.address = row.address
        this.editModel.systemIds = row.systemIdArr
        this.editModel.sex = row.sex
        this.editModel.phone = row.phone
        this.editModel.fax = row.fax
        this.editModel.departmentId = row.departmentId
        this.getsystems()
        this.getDeptList()
        this.dialogStatus = 'update'
        this.editDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['editDataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.disabled = false
        this.editModel.id = row.id
        this.editModel.username = row.username
        this.editModel.realName = row.realName
        this.editModel.mobile = row.mobile
        this.editModel.tel = row.tel
        this.editModel.email = row.email
        this.editModel.address = row.address
        this.editModel.systemIds = row.systemIdArr
        this.editModel.sex = row.sex
        this.editModel.phone = row.phone
        this.editModel.fax = row.fax
        this.editModel.departmentId = row.departmentId
        this.getsystems()
        this.getDeptList()
        this.dialogStatus = 'update'
        this.editDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['editDataForm'].clearValidate()
        })
      },
      createData() {
        console.log(this.editModel.systemIds)
        this.$refs['editDataForm'].validate((valid) => {
          if (valid) {
            checkUserNameExsits(this.editModel).then((res) => {
              if (res === 0) {
                this.editModel.systemIds = this.editModel.systemIds.join(',')
                insert(this.editModel).then((res) => {
                  if (res && res.responseCode === 100) {
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
                  message: '用户名冲突！',
                  type: 'fail',
                  duration: 2000
                })
              }
            })
          }
        })
      },
      updateData() {
        this.$refs['editDataForm'].validate((valid) => {
          if (valid) {
            console.log(this.editModel.systemIds)
            this.editModel.systemIds = this.editModel.systemIds.join(',')
            update(this.editModel).then((res) => {
              if (res && res.responseCode === 100) {
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
