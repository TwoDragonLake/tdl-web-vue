<template>
  <div class="app-container" style="white-space: nowrap;">
    <div class="treetable-left">
      <Tree></Tree>
    </div>
    <div class="treetable-right">
      <DataDictTable></DataDictTable>
    </div>
  </div>
</template>

<script>
import { DataDictTable, Tree } from '@/views/datadict/index'

export default {
  name: 'DataDict',
  components: {
    DataDictTable,
    Tree
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
