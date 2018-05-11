<template>
  <div class="app-container">
    <div>
      <el-button type="primary" v-if="add" @click="handleCreate" icon="el-icon-plus"></el-button>
      <el-button type="primary" v-if="del" @click="deleteConfig" icon="el-icon-delete"></el-button>
      <el-button type="primary" v-if="read" @click="fetchData" icon="el-icon-refresh"></el-button>
    </div>
    <hr>
    <div >
      <el-row :gutter="20">
        <el-col :span="2" class="mycenter" >配置名称:</el-col>
        <el-col :span="6"><el-input v-model="queryModle.configName"   placeholder="请输入内容"></el-input></el-col>
        <el-col :span="2" class="mycenter" >配置标识:</el-col>
        <el-col :span="6"><el-input v-model="queryModle.configSn"  placeholder="请输入内容"></el-input></el-col>
        <el-col :span="4"> <el-button type="primary" @click="fetchData" icon="el-icon-search"></el-button></el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column align="center" :label="$t('systemConfig.configName')" width="150">
        <template slot-scope="scope">
          {{scope.row.configName}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('systemConfig.configSn')" width="150">
        <template slot-scope="scope">
          {{scope.row.configSn}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('systemConfig.configKey')" width="150">
        <template slot-scope="scope">
          {{scope.row.configKey}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('systemConfig.configValue')" width="250">
        <template slot-scope="scope">
          {{scope.row.configValue}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('systemConfig.configOrder')" width="150">
        <template slot-scope="scope">
          {{scope.row.configOrder}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('systemConfig.remark')" width="200">
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('systemConfig.remark')" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
        </template>
      </el-table-column>

    </el-table>


    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageIndex"
                     :page-sizes="[20,30, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="editDialogFormVisible"  width="35%">
      <el-form :rules="rules" ref="editDataForm" :model="model" label-position="left" label-width="120px" style='width: 900px; margin-left:50px;'>
        <el-form-item :rules="rules" :label="$t('systemConfig.configName')" prop="configName">
          <el-input v-model="model.configName" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemConfig.configSn')" prop="configSn">
          <el-input  v-model="model.configSn" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemConfig.configKey')"  prop="configKey">
          <el-input  v-model="model.configKey" style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemConfig.configValue')"  prop="configValue">
          <el-input  v-model="model.configValue"  style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemConfig.configOrder')" >
        <el-input  v-model="model.configOrder"  style="width: 200px;margin-left: 3%"></el-input>
      </el-form-item>
        <el-form-item :label="$t('systemConfig.remark')" >
          <el-input  v-model="model.remark"  style="width: 200px;margin-left: 3%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">Cancle</el-button>
        <el-button type="primary"  v-if="dialogStatus=='create'"  @click="doCreate">Save</el-button>
        <el-button type="primary"  v-else   @click="doUpdate">Update</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { ajaxList, add, update, dodelete, checkSnExsits, checkKeyExsits } from '@/api/systemConfig'

export default {
  name: 'SystemConfig',
  created() {
    this.add = this.accessAcl('privilege', 'config', 0)
    this.edit = this.accessAcl('privilege', 'config', 2)
    this.del = this.accessAcl('privilege', 'config', 3)
    this.read = this.accessAcl('privilege', 'config', 0)
    this.fetchData()
  },
  data() {
    return {
      listLoading: false,
      queryModle: {
        configName: null,
        configSn: null
      },
      model: {
        id: null,
        configName: null,
        configKey: null,
        configValue: null,
        configSn: null,
        configOrder: null,
        remark: null
      },
      list: null,
      multipleSelection: null,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogStatus: null,
      editDialogFormVisible: false,
      total: null,
      query: {
        pageIndex: 1,
        pageSize: 10
      },
      rules: {
        configName: [{ required: true, message: 'configName is required', trigger: 'blur' }],
        configKey: [{ required: true, message: 'configKey is required', trigger: 'blur' }],
        configSn: [{ required: true, message: 'configSn is required', trigger: 'blur' }],
        configValue: [{ required: true, message: 'configValue is required', trigger: 'blur' }]
      }
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.listLoading = true
      ajaxList(this.queryModle, this.query).then(response => {
        this.list = response.data
        this.listLoading = false
        this.total = response.total
      })
    },
    resetModel() {
      this.model = {
        id: null,
        configName: null,
        configKey: null,
        configValue: null,
        configSn: null,
        configOrder: null,
        remark: null
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
    doCreate() {
      this.$refs['editDataForm'].validate((valid) => {
        if (valid) {
          checkSnExsits(this.model).then((res1) => {
            if (res1 === 0) {
              checkKeyExsits(this.model).then((res2) => {
                if (res2 === 0) {
                  add(this.model).then((res) => {
                    if (res && res.responseCode === 100) {
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
                    message: 'key重复！',
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
    handleUpdate(row) {
      this.model = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.editDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['editDataForm'].clearValidate()
      })
    },
    doUpdate(row) {
      this.$refs['editDataForm'].validate((valid) => {
        if (valid) {
          checkSnExsits(this.model).then((res1) => {
            if (res1 === 0) {
              checkKeyExsits(this.model).then((res2) => {
                if (res2 === 0) {
                  update(this.model).then((res) => {
                    if (res && res.responseCode === 100) {
                      this.resetModel()
                      this.fetchData()
                      this.editDialogFormVisible = false
                      this.$notify({
                        title: '成功',
                        message: '更新成功',
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
                    message: 'key重复！',
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
    handleCurrentChange(val) {
      this.query.pageIndex = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.query.pageSize = val
      this.fetchData()
    },
    deleteConfig() {
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
  .mycenter{
    margin-top: 1%;
    margin-left: 5%;
  }
</style>
