<template>
  <div class="app-container" style="white-space: nowrap;">
    <div class="treetable-left">
      <Tree></Tree>
    </div>
    <div class="treetable-right">
      <SystemPriValueTable></SystemPriValueTable>
    </div>
  </div>
</template>

<script>
import { SystemPriValueTable, Tree } from '@/views/systemprivalue/index'

export default {
  name: 'SystemPriValue',
  components: {
    SystemPriValueTable,
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
