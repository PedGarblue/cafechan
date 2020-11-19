<template>
  <div class="navbar">
    <div class="navbar-logo">
      <div class="navbar-icon" />
      <span class="navbar-title">Caféchan Panel</span>
    </div>

    <div v-if="isAuthenticated" class="navbar-user">
      <div v-if="isProfileLoaded" class="navbar-user">
        <div class="nav-link">
          <router-link to="/">
            Inicio
          </router-link>
        </div>
        <div class="navbar-username">
          <span class="username"> {{ profile.name }}, </span>
          <span class="userrole">
            {{ profile.role }}
          </span>
        </div>
        <UserMenu />
      </div>
      <div v-else class="navbar-user">
        <Loading />
      </div>
    </div>
    <div v-else class="nav-link">
      <router-link to="/login">
        Ingresar
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import UserMenu from './user-menu';
import Loading from '../loading';

export default {
  components: {
    UserMenu,
    Loading,
  },
  computed: {
    ...mapState({
      profile: state => state.user.profile,
    }),
    ...mapGetters(['isAuthenticated', 'isProfileLoaded']),
  },
};
</script>

<style scoped>
.loading-msg {
  padding: 1em;
  margin-right: 0.5em;
}
</style>
