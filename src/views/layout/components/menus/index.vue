<template>
<el-dropdown @command="handleNewPage">
  <el-button type="primary">
    系统<i class="el-icon-arrow-down el-icon--right"></i>
  </el-button>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item v-for="item in systems" :key="item.id" v-bind:command="item.url">
      {{ item.name }}</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Menus',
    methods: {
      handleNewPage(url) {
        window.open(url)
      }
    },
    // import user from '@/store/modules/user'
    computed: {
      ...mapGetters([
        'systems'
      ])
    }
  }
</script>
