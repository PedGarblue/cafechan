<template>
  <div v-if="isAuthenticated" class="panel-contents">
    <SideBar />
    <div v-if="isProfileLoaded" class="panel-container">
      <div class="page-header">
        <h2 class="page-title">{{ title }}</h2>
      </div>
      <div class="page-contents">
        <slot />
      </div>
    </div>
    <div v-else>
      [...]
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SideBar from './sidenav';

export default {
  components: {
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

<style scoped></style>
