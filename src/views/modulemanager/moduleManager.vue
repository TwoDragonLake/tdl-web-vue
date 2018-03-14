<template>
  <div class="app-container" style="white-space: nowrap;">
    <div class="treetable-left">
      <Tree></Tree>
    </div>
    <div class="treetable-right">
      <ModuleManagerTable></ModuleManagerTable>
    </div>
  </div>
</template>

<script>
import { ModuleManagerTable, Tree } from '@/views/modulemanager/index'

export default {
  name: 'ModuleManager',
  components: {
    ModuleManagerTable,
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
