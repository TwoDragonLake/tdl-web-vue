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
        <el-button type="primary" v-if="edit" icon="el-icon-setting">分配角色</el-button>
        <el-button type="primary" v-if="acl" @click="handleAccessAcl"  icon="el-icon-setting">操作授权</el-button>
        <el-button type="primary" v-if="edit" icon="el-icon-view">修改密码</el-button>
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
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
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
        <el-form :rules="rules" ref="editDataForm" :model="editModel" label-position="left" label-width="70px" style='width: 900px; margin-left:50px;'>
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
                <el-input v-model="editModel.fax" style="width: 350px;margin-left: 3%"></el-input>
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
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">confirm</el-button>
          <el-button v-else type="primary" @click="updateData">confirm</el-button>
        </div>
      </el-dialog>

      <!-- 授权 -->
      <el-dialog :title="textMap[privDialogStatus]" :visible.sync="privEditDialogFormVisible"  width="70%">
        <el-row>
          <el-col :span="5">
            <Tree :datas="privModel.privSystems" @node-click="handlePrivSystemsClick"></Tree>
          </el-col>
          <el-col :span="18">
            <tree-table :data="privModel.modules" :evalFunc="func" :evalArgs="args" :expandAll="expandAll">
              <el-table-column align="center" label='名称' width="100">
                <template slot-scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>
              <el-table-column align="center" label='权限值' width="450">
                <template slot-scope="scope">
                  <el-checkbox-group v-model="scope.row.checkedPvs">
                    <el-checkbox  v-for="item in scope.row.pvs"  :checked="item.flag" :key="item.id"   :label="item.id"  @change="singleAclChange(item.position)">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-table-column>
            </tree-table>
          </el-col>
        </el-row>
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
  import { fetchData, insert, update, dodelete, checkUserNameExsits/*, getRoles, saveUserRole, getAllPriValBySystemSn, setAcl, setAclByModule, setAllAcl, updatePassowrd*/ } from '@/api/userMananger'
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
        systems: null,
        deptList: null,
        isExis: null,
        rules: {
          username: [{ required: true, message: 'username is required', trigger: 'blur' }],
          realName: [{ required: true, message: 'realName is required', trigger: 'blur' }],
          email: [{ required: true, message: 'email is required ', trigger: 'blur' }],
          systemIds: [{ required: true, message: 'systems is required ', trigger: 'blur' }],
          sex: [{ required: true, message: 'sex is required', trigger: 'blur' }],
          departmentId: [{ required: true, message: 'department is required', trigger: 'blur' }]
        },
        privModel: {
          selectedSystemId: null,
          privSystems: null,
          modules: []
        },
        args: [null, null],
        expandAll: false,
        roleModel: {
          query: {
            name: null,
            sn: null,
            userId: null
          },
          roleList: null,
          selectedRoles: []
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
      // action accessacl dialog
      handleAccessAcl() {
        console.log(this.multipleSelection)
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'success',
            message: '请选择一条数据!'
          })
          return
        }
        this.privDialogStatus = 'acl'
        this.privEditDialogFormVisible = true
        // load priDialog left system list
        this.getprivSystems()
      },
      // action click system, then load system`s module list
      handlePrivSystemsClick(payload) {
        this.privModel.selectedSystemId = payload.node.id
        this.$nextTick(() => {
          this.getModules(this.privModel.selectedSystemId)
        })
      },
      // load system`s modules
      getModules(systemId) {
        getmodules({ pageIndex: 1, pageSize: 20000 }, { systemId: systemId }).then((res) => {
          this.privModel.modules = res
        })
      },
      singleAclChange(afterValue) {
        console.log(afterValue)
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
        // this.editModel.departmentId = this.queryModel.departmentId
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
        this.$nextTick(() => {
          this.$refs['editDataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
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
        // this.editModel = Object.assign({}, row) // copy obj
        // this.editModel = JSON.parse(JSON.stringify(row))
        // this.editModel.systemIds = JSON.parse(JSON.stringify(this.editModel.systemIdArr))
        // console.log(Object.assign({}, row))
        this.getsystems()
        this.getDeptList()
        this.dialogStatus = 'update'
        this.editDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['editDataForm'].clearValidate()
        })
        // console.log(this.editModel)
      },
      createData() {
        console.log(this.editModel.systemIds)
        this.$refs['editDataForm'].validate((valid) => {
          if (valid) {
            checkUserNameExsits(this.editModel).then((res) => {
              if (res === 0) {
                /* let idsstr = ''
                console.log(this.editModel.systemIds)
                for (let i = 0; i < this.editModel.systemIds.length; i++) {
                  if (i === 0) {
                    idsstr += idsstr + this.editModel.systemIds[i]
                  } else {
                    idsstr += ',' + this.editModel.systemIds[i]
                  }
                }*/
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
            /* let idsstr = ''
            for (let i = 0; i < this.editModel.systemIds.length; i++) {
              if (i === 0) {
                idsstr += idsstr + this.editModel.systemIds[i]
              } else {
                idsstr += ',' + this.editModel.systemIds[i]
              }
            }*/
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
