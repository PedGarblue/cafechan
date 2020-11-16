<template>
  <Form return-route="/staff" title="Create Staff" @form-submit="createUser">
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
  </Form>
</template>

<script>
/* eslint-disable no-alert */
import roles from '@/config/roles';
import { createStaff } from '@/requests/staff';
import Form from '@/components/lib/form';

export default {
  components: {
    Form,
  },
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
