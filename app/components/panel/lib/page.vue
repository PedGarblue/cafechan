<template>
  <div v-if="isAuthenticated" class="panel-contents">
    <SideBar />
    <div class="panel-container">
      <div class="page-header">
        <h2 class="page-title">{{ title }}</h2>
      </div>
      <div v-if="isProfileLoaded" class="page-contents">
        <slot />
      </div>
      <div v-else>
        <Loading />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Loading from '@/components/lib/loading';
import SideBar from '../sidenav';

export default {
  components: {
    Loading,
    SideBar,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'isProfileLoaded']),
  },
};
</script>

<style scoped>
.panel-container {
  width: 80%;
}
</style>
