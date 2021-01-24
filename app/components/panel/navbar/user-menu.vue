<template>
  <div class="user-menu">
    <div class="settings-icon" @click="openMenu" />
    <ul v-if="displayMenu" class="user-menu-list">
      <div class="user-desc">
        <span class="username"> {{ profile.name }}, </span>
        <span class="userrole">
          {{ profile.role }}
        </span>
      </div>
      <li class="user-menu-item" @click="logout">
        <span>Desconectar</span>
      </li>
      <li class="user-menu-item" @click="closeMenu">
        <span>Cerrar</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { AUTH_LOGOUT } from '@/app/store/actions/auth';

export default {
  data() {
    return {
      displayMenu: false,
    };
  },
  computed: {
    ...mapState({
      profile: state => state.user.profile,
    }),
  },
  methods: {
    logout() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'));
    },
    openMenu() {
      this.displayMenu = true;
    },
    closeMenu() {
      this.displayMenu = false;
    },
  },
};
</script>

<style scoped>
.settings-icon {
  padding: 0.32em 0.45em;
  font-size: 2.3em;
  cursor: pointer;
}

.settings-icon:hover {
  background-color: var(--primary-light-color);
}

.user-menu {
  display: flex;
  position: relative;
}

.user-menu-list {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: -1em;
  left: 81.2vw;
  width: 16.1em;
  background-color: var(--secondary-color);
  height: 100vh;
  padding: 0;
  box-shadow: -0.1em 0em 0.7em var(--secondary-color);
}

.user-menu-item {
  list-style: none;
  padding: 0.8em 0.8em;
  cursor: pointer;
}

.user-menu-item:hover {
  background-color: var(--secondary-light-color);
}

.user-menu-list span {
  padding-top: 0;
}

.user-desc {
  padding: 1em;
  font-weight: bold;
}
</style>
