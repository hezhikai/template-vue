<template>
  <div id="app">
    <layout></layout>
  </div>
</template>
<script>
  import layout from './components/layout';

  export default {
    name: 'App',
    components: {
      layout
    }
  };
</script>
<style lang="less">
  #app {
    position: relative;
    height: 100%;
    color: #2c3e50;
  }
</style>
