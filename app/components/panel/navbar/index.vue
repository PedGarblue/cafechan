<template>
  <div class="navbar">
    <div class="navbar-logo">
      <div class="cafe-icon" />
      <span class="navbar-title">{{ title }} Panel</span>
    </div>

    <div v-if="isAuthenticated" class="navbar-user">
      <div v-if="isProfileLoaded" class="navbar-user">
        <div class="nav-link">
          <router-link to="/">
            Inicio
          </router-link>
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
import { siteName } from '@/config/config';
import Loading from '@/components/lib/loading';
import UserMenu from './user-menu';

export default {
  components: {
    UserMenu,
    Loading,
  },
  props: {
    title: {
      type: String,
      default() {
        return siteName;
      },
    },
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
.navbar {
  background: var(--primary-color);
  color: var(--text-color);
  display: flex;
}

.navbar-logo {
  display: flex;
  padding: 1em;
}
.navbar-logo .cafe-icon {
  font-size: 2em;
}

.navbar-title {
  font-weight: bold;
  padding: 0.4em 0.7em;
}

.navbar-user {
  display: flex;
  margin-left: auto;
}

.navbar-username {
  align-self: center;
  padding: 0.4em 0.8em;
}

.navbar-settings {
  display: flex;
  position: relative;
}

.nav-link {
  margin-left: auto;
  padding: 1.3em 1em;
  cursor: pointer;
}

.nav-link:hover {
  background-color: var(--primary-light-color);
}

.navbar a {
  color: inherit;
  padding-top: 0.4em;
  text-decoration: none;
  font-weight: bold;
}

.loading-msg {
  padding: 1em;
  margin-right: 0.5em;
}
</style>
