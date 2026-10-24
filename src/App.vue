<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;

  > > > .nonesss {
    display: none !important;
  }

  > > > .el-pagination {
    padding: 15px 0;
  }
}
</style>
