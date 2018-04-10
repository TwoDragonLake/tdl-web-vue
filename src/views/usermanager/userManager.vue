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
        <el-button type="primary" v-if="acl" icon="el-icon-setting">操作授权</el-button>
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
      <el-table :data="data" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column
          type="selection"
          width="55">
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
        <el-table-column label="操作" width="200">
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

      <!--  人员添加/修改 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="editDialogFormVisible"  width="70%">
        <el-form :rules="rules" ref="editDataForm" :model="editModel" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.username')" prop="username">
                <el-input v-model="editModel.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('userManager.realname')" prop="realName">
                <el-input v-model="editModel.realName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>



          <el-form-item :label="$t('userManager.mobile')" >
            <el-input v-model="editModel.mobile"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userManager.phone')" >
            <el-input v-model="editModel.phone"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userManager.email')" prop="email">
            <el-input v-model="editModel.email"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userManager.address')" >
            <el-input v-model="editModel.address"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userManager.systems')" prop="systemIds">
            <el-select
              v-model="editModel.systemIds"
              multiple
              filterable
              allow-create
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

          <el-form-item :label="$t('userManager.sex')" prop="sex">
            <el-input v-model="editModel.sex"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userManager.phone')" >
            <el-input v-model="editModel.phone"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userManager.fax')" >
            <el-input v-model="editModel.fax"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userManager.department')" prop="departmentId">
            <el-select
              v-model="editModel.departmentId"
              multiple
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">Cancle</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">confirm</el-button>
          <el-button v-else type="primary" @click="updateData">confirm</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import { Tree } from '@/views/usermanager/index'
  import { getDeptTree, getDeptList } from '@/api/departmentManager'
  import { getsystems } from '@/api/moduleManager'
  import { fetchData, insert, update, dodelete, checkUserNameExsits/*, getRoles, saveUserRole, getAllPriValBySystemSn, setAcl, setAclByModule, setAllAcl, updatePassowrd*/ } from '@/api/userMananger'
  export default {
    name: 'UserManager',
    components: {
      Tree
    },
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else {
          checkUserNameExsits(this.editModel).then((res) => {
            this.isExit = res
          })
          this.$nextTick(() => {
            if (this.isExit === 1) {
              callback(new Error('用户名已存在'))
            }
            callback()
          })
        }
      }
      return {
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
          pageSize: 20
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
        editModel: {
          id: null,
          username: null,
          realName: null,
          mobile: null,
          tel: null,
          email: null,
          address: null,
          systemIds: null,
          sex: null,
          phone: null,
          fax: null,
          departmentId: null,
          password: null,
          confirmPassword: null
        },
        systems: null,
        deptList: null,
        isExit: null,
        rules: {
          username: [{ validator: validatePass, trigger: 'blur' }],
          realName: [{ required: true, message: 'realName is required', trigger: 'blur' }],
          email: [{ required: true, message: 'email is required ', trigger: 'blur' }],
          systemIds: [{ required: true, message: 'systems is required ', trigger: 'blur' }],
          sex: [{ required: true, message: 'sex is required', trigger: 'blur' }],
          departmentId: [{ required: true, message: 'department is required', trigger: 'blur' }]
        },
        privModel: {
          systems: null,
          privs: null,
          selectedPrivs: []
        },
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
      getDeptList() {
        getDeptList().then((res) => {
          this.deptList = res
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
      handleTreeClick(payload) {
        this.queryModel.departmentId = payload.node.id
        this.$nextTick(() => {
          this.fetchData()
        })
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
          systemIds: null,
          sex: null,
          phone: null,
          fax: null,
          departmentId: null,
          password: null,
          confirmPassword: null
        }
        this.editModel.departmentId = this.queryModel.departmentId
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
        this.getsystems()
        this.getDeptList()
        this.editModel = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.editDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['editDataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['editDataForm'].validate((valid) => {
          if (valid) {
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
          }
        })
      },
      updateData() {
        this.$refs['editDataForm'].validate((valid) => {
          if (valid) {
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
