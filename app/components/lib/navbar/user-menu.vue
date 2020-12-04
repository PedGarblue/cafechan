<template>
  <div class="user-menu">
    <div class="settings-icon" @click="openMenu" />
    <ul v-if="displayMenu" class="user-menu-list">
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
import { AUTH_LOGOUT } from '../../../store/actions/auth';

export default {
  data() {
    return {
      displayMenu: false,
    };
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
  background-color: #b3282a;
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
  background-color: #38393e;
  height: 100vh;
  padding: 0;
  box-shadow: -0.1em 0em 0.7em #373737;
}

.user-menu-item {
  list-style: none;
  padding: 0.8em 0.8em;
  cursor: pointer;
}

.user-menu-item:hover {
  background-color: #5e5e5e;
}

.user-menu-list span {
  padding-top: 0;
}
</style>
