<template>
  <div class="navbar-settings">
    <div class="navbar-settings-icon" @click="openMenu" />
    <ul v-if="displayMenu" class="navbar-settings-list">
      <li class="navbar-settings-item" @click="logout">
        <span>Desconectar</span>
      </li>
      <li class="navbar-settings-item" @click="closeMenu">
        <span>Cerrar</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from '../../store/actions/auth';

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

<style scoped></style>
