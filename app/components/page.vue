<template>
  <div v-if="isAuthenticated" class="panel-contents">
    <SideBar />
    <slot v-if="isProfileLoaded" />
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
  computed: {
    ...mapGetters(['isAuthenticated', 'isProfileLoaded']),
  },
};
</script>

<style scoped></style>
