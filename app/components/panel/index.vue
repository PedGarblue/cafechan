<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { AUTH_REFRESH_TOKENS } from '@/app/store/actions/auth';
import { USER_REQUEST } from '@/app/store/actions/user';
import Navbar from './navbar';

export default {
  components: {
    Navbar,
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  async mounted() {
    if (this.isAuthenticated) {
      await this[AUTH_REFRESH_TOKENS]();
      await this[USER_REQUEST]();
    }
  },
  methods: {
    ...mapActions([AUTH_REFRESH_TOKENS, USER_REQUEST]),
  },
};
</script>

<style scoped></style>
