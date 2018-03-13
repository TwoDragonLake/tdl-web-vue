<template>
  <div class="app-container" style="white-space: nowrap;">
    <div class="treetable-left">
      <Tree></Tree>
    </div>
    <div class="treetable-right">
      <GTable></GTable>
    </div>
  </div>
</template>

<script>
import { GTable, Tree } from '@/views/treetable/index'

export default {
  name: 'TreeTable',
  components: {
    GTable,
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
