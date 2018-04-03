<template>
  <div class="app-container" style="white-space: nowrap;">
      <div class="treetable-left">
        <Tree :datas="treeData" @node-click="handleTreeClick"></Tree>
      </div>
      <div class="treetable-right">
        <div>
          <el-button type="primary" icon="el-icon-plus"></el-button>
          <el-button type="primary" icon="el-icon-edit"></el-button>
          <el-button type="primary" icon="el-icon-delete"></el-button>
          <el-button type="primary" icon="el-icon-setting">添加操作权限</el-button>
        </div>
        <hr>
        <tree-table :data="data" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border>
<!--          <el-table-column label="事件">
            <template slot-scope="scope">
              <span style="color:sandybrown">{{scope.row.event}}</span>
              <el-tag>{{scope.row.timeLine+'ms'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="时间线">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.timeLine+'ms'" placement="left">
                <div class="processContainer">
                  <div class="process" :style="{ width:scope.row._width * 500+'px',
              background:scope.row._width>0.5?'rgba(233,0,0,.5)':'rgba(0,0,233,0.5)',
              marginLeft:scope.row._marginLeft * 500+'px' }">
                    <span style="display:inline-block"></span>
                  </div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>-->
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
            <template slot-scope="scope">
              <span>{{scope.row.state}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Sn" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.sn}}
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="OrderNo" width="500" align="center">
            <template slot-scope="scope">
              {{scope.row.orderNo}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="message(scope.row)">点击</el-button>
            </template>
          </el-table-column>
        </tree-table>

        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageIndex"
                         :page-sizes="[10,20,30, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>

      </div>
  </div>
</template>

<script>
  import treeTable from '@/components/TreeTable'
  import treeToArray from './customEval'
  import { Tree } from '@/views/modulemanager/index'
  import { getsystems, getmodules } from '@/api/moduleManager'
  export default {
    name: 'customTreeTableDemo',
    components: { Tree, treeTable },
    data() {
      return {
        func: treeToArray,
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
        args: [null, null]
      }
    },
    created() {
      this.systems()
    },
    methods: {
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
      getmodules() {
        getmodules(this.query, this.model).then((res) => {
          this.data = res.data
        })
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
