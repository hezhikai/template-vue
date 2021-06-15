<template>
  <div>
    <div>导航栏区域</div>
    <div>
      路由区域
      <keep-alive :include="cachedViews">
        <router-view :key="$route.path" id="router" v-if="isShow"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  // import { mapGetters } from 'vuex';

  export default {
    name: 'layout',
    data() {
      return {
        isShow: true
      };
    },
    computed: {
      // ...mapGetters(['cachedViews'])
      cachedViews() {
        return [];
      }
    },
    methods: {
      refresh() {
        this.isShow = false;
        this.$nextTick(() => {
          this.isShow = true;
        });
      }
      // switchMenu(menu) {
      //   this.$router.push(menu.path);
      // }
    }
    // destroyed() {
    //   window.subject.remove('refresh');
    // },
    // mounted() {
    //   window.subject.listen('refresh', this.refresh);
    // }
  };
</script>
