<template>
  <div class="app-container">
    <el-input placeholder="Filter keyword" v-model="filterText" style="margin-bottom:30px;"></el-input>

    <el-tree class="filter-tree" :data="datas"  @node-click="handleNodeClick"  ref="tree"
             :props="defaultProps" default-expand-all :filter-node-method="filterNode" ></el-tree>

  </div>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    datas: {
      type: Array
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick() {
      this.$emit('node-click', { node: this.$refs.tree.getCurrentNode() })
    }
  },

  data() {
    return {
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  }
}
</script>

