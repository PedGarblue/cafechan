<template>
  <div class="login">
    <div>
      <router-link to="/staff">
        Regresar
      </router-link>
    </div>
    <div class="login-header">
      <h3 class="title">Crear Usuario</h3>
    </div>
    <div class="login-body">
      <form action class="form" @submit.prevent="createUser">
        <div class="form-block">
          <label class="form-label" for="#email">Correo</label>
          <input id="email" v-model="email" class="form-input" type="email" required placeholder="Email" />
        </div>
        <div class="form-block">
          <label class="form-label" for="#username">Usuario</label>
          <input id="username" v-model="username" class="form-input" type="text" required placeholder="Username" />
        </div>
        <div class="form-block">
          <label class="form-label" for="#role">Rol</label>
          <select id="role" v-model="role" class="form-input">
            <option v-for="(roleval, rolekey) in Roles" :key="rolekey" :value="roleval">
              {{ rolekey }}
            </option>
          </select>
        </div>
        <div class="form-block">
          <label class="form-label" for="#password">Contraseña</label>
          <input id="password" v-model="password" class="form-input" type="password" placeholder="Password" />
        </div>
        <input class="form-submit" type="submit" value="Crear" />
      </form>
    </div>
    <div class="login-footer"></div>
  </div>
</template>

<script>
/* eslint-disable no-alert */
import roles from '@/config/roles';
import { createStaff } from '@/requests/staff';

export default {
  data() {
    return {
      email: '',
      username: '',
      role: '',
      password: '',
      state: '',
    };
  },
  computed: {
    Roles() {
      return roles;
    },
  },
  methods: {
    createUser() {
      const data = {
        email: this.email,
        name: this.username,
        role: this.role,
        password: this.password,
      };
      createStaff(data)
        .then(() => {
          alert(`USUARIO CREADO!`);
        })
        .catch(err => {
          alert(`Error! ${err.data.message}`);
        });
    },
  },
};
</script>
