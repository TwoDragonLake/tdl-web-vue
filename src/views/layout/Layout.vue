<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div :class="{leftside:sidebar.opened, rightside:!sidebar.opened}">
      <Menus></Menus>
    </div>
    <sidebar class="sidebar-container" ></sidebar>
    <div class="main-container">
        <navbar></navbar>
        <app-main></app-main>
      </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, Menus } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Menus
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
