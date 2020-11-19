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
    <template #footer>
      <div v-if="successRequest">Staff Created!</div>
      <div v-else-if="isLoading"><Loading /></div>
      <div v-else-if="hasError">Error: {{ errorMsg }}</div>
    </template>
  </Form>
</template>

<script>
/* eslint-disable no-alert */
import roles from '@/config/roles';
import { createStaff } from '@/requests/staff';
import Form from '@/components/lib/form';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

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
      status: '',
      errMsg: '',
    };
  },
  computed: {
    successRequest() {
      return this.status === SUCCESS;
    },
    isLoading() {
      return this.status === REQUEST;
    },
    hasError() {
      return this.status === ERROR;
    },
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
      this.status = REQUEST;
      createStaff(data)
        .then(() => {
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errMsg = err.message;
          this.status = ERROR;
        });
    },
  },
};
</script>
