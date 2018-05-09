<template>
  <div class="app-container" style="white-space: nowrap;">
    <div class="treetable-left">
      <Tree :datas="treeData" @node-click="handlePrivSystemsClick"></Tree>
    </div>
    <div class="treetable-right">
      <div>
        <el-button type="primary" v-if="add" @click="handleCreate" icon="el-icon-plus"></el-button>
        <el-button type="primary" v-if="del" @click="handleDelete" icon="el-icon-delete"></el-button>
      </div>
      <hr>
      <!--<el-table :data="listData" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">-->
        <tree-table :data="listData" :evalFunc="func" :evalArgs="args" :expandAll="expandAll"  @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" label='Name' width="95">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='code' width="95">
          <template slot-scope="scope">
            {{scope.row.code}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='orderNo' width="95">
          <template slot-scope="scope">
            {{scope.row.orderNo}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
            <el-button type="primary"  icon="el-icon-plus" size="mini" v-if="edit" @click="handleCreateChild(scope.row)"></el-button>
          </template>
        </el-table-column>

      </tree-table>
    </div>

    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="editDialogFormVisible"  width="30%">
      <el-form :rules="rules" ref="editDataForm" :model="model" label-position="left" label-width="70px" style='width: 900px; margin-left:50px;'>
        <el-form-item :rules="rules" :label="$t('dictManager.name')" prop="name">
          <el-input v-model="model.name" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('dictManager.code')" prop="code">
          <el-input  v-model="model.code" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('dictManager.orderNo')"  >
          <el-input  v-model="model.orderNo" type="number" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">Cancle</el-button>
        <el-button type="primary"  v-if="dialogStatus=='create'"  @click="saveDict">Save</el-button>
        <el-button type="primary"  v-else   @click="updateDict">Update</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { Tree } from '@/views/datadict/index'
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import { getsystems } from '@/api/moduleManager'
import { getAll, update, insert, dodelete } from '@/api/dictManager'
export default {
  name: 'DataDict',
  components: {
    Tree, treeTable
  },
  data() {
    return {
      func: treeToArray,
      args: [null, null],
      expandAll: false,
      add: null,
      del: null,
      edit: null,
      treeData: null,
      model: {
        id: null,
        pcode: null,
        sn: null,
        orderNo: null,
        systemSn: null,
        code: null,
        name: null
      },
      listData: [],
      listLoading: false,
      multipleSelection: [],
      query: {
        pageIndex: 1,
        pageSize: 20
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogStatus: null,
      editDialogFormVisible: false,
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        code: [{ required: true, message: 'code is required', trigger: 'blur' }],
        orderNo: [{ type: 'number', message: 'orderNo required number', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.systems()
    this.add = this.accessAcl('privilege', 'dictionary', 0)
    this.edit = this.accessAcl('privilege', 'dictionary', 2)
    this.del = this.accessAcl('privilege', 'dictionary', 3)
  },
  methods: {
    handlePrivSystemsClick(payload) {
      this.model.systemSn = payload.node.sn
      this.$nextTick(() => {
        this.resetModel()
        this.getDicts()
      })
      //  console.log(payload.node)
    },
    systems() {
      getsystems().then(response => {
        this.treeData = response
      })
    },
    getDicts() {
      getAll(this.model, this.query).then((res) => {
        this.listData = res
      })
    },
    resetModel() {
      this.model = {
        id: null,
        code: null,
        pcode: null,
        sn: null,
        orderNo: null,
        systemSn: this.model.systemSn,
        name: null
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
    handleCreateChild(row) {
      this.handleCreate()
      this.model.pcode = row.code
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleUpdate(row) {
      this.model.id = row.id
      this.model.name = row.name
      this.model.code = row.code
      this.model.pcode = row.pcode
      this.model.orderNo = row.orderNo
      this.model.systemSn = row.systemSn
      this.model.sn = row.sn
      this.dialogStatus = 'update'
      this.editDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['editDataForm'].clearValidate()
      })
    },
    saveDict() {
      this.$refs['editDataForm'].validate((valid) => {
        if (valid) {
          insert(this.model).then((res) => {
            if (res && res.responseCode === 100) {
              this.resetModel()
              this.getDicts()
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
    updateDict() {
      this.$refs['editDataForm'].validate((valid) => {
        if (valid) {
          update(this.model).then((res) => {
            if (res && res.responseCode === 100) {
              this.resetModel()
              this.getDicts()
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
            this.resetModel()
            this.getDicts()
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
