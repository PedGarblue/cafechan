<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './lib/navbar';
import { AUTH_REFRESH_TOKENS } from '../store/actions/auth';
import { USER_REQUEST } from '../store/actions/user';

export default {
  components: {
    Navbar,
  },
  async mounted() {
    if (this.$store.getters.isAuthenticated) {
      await this.$store.dispatch(AUTH_REFRESH_TOKENS);
      await this.$store.dispatch(USER_REQUEST);
    }
  },
};
</script>

<style scoped></style>
