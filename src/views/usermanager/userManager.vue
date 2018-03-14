<template>
  <div class="app-container" style="white-space: nowrap;">
    <div class="treetable-left">
      <Tree></Tree>
    </div>
    <div class="treetable-right">
      <UserManagerTable></UserManagerTable>
    </div>
  </div>
</template>

<script>
import { UserManagerTable, Tree } from '@/views/usermanager/index'

export default {
  name: 'UserManager',
  components: {
    UserManagerTable,
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
