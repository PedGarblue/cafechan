<template>
  <div class="login">
    <div>
      <router-link to="/staff">
        Regresar
      </router-link>
    </div>

    <div class="login-header">
      <h3 class="title">Editar Usuario: {{ isLoaded ? username : '[...]' }}</h3>
    </div>

    <div class="login-body">
      <form v-if="isLoaded" action class="form" @submit.prevent="editUser">
        <div class="form-block">
          <label class="form-label" for="#email">Correo</label>
          <input id="email" v-model="email" class="form-input" type="email" disabled placeholder="Email" />
        </div>

        <div class="form-block">
          <label class="form-label" for="#username">Usuario</label>
          <input id="username" v-model="username" class="form-input" type="text" disabled placeholder="Username" />
        </div>

        <div class="form-block">
          <label class="form-label" for="#role">Rol</label>
          <select id="role" v-model="role" class="form-input">
            <option v-for="(roleval, rolekey) in Roles" :key="rolekey" :value="roleval">
              {{ rolekey }}
            </option>
          </select>
        </div>

        <input class="form-submit" type="submit" value="Modificar" />
      </form>
    </div>
    <div class="login-footer">
      <div v-if="isLoading">
        [...]
      </div>
      <div v-else-if="userEditSuccess">
        ¡USUARIO EDITADO CORRECTAMENTE!
      </div>
      <div v-else-if="hasError">ERROR: {{ error_msg }}</div>
    </div>
  </div>
</template>

<script>
import roles from '@/config/roles';
import { editStaff, getStaff } from '@/requests/staff';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  data() {
    return {
      userId: this.$route.params.userId,
      email: '',
      username: '',
      role: '',
      hasEditedUser: false,
      error_msg: '',
      status: '',
    };
  },
  computed: {
    Roles() {
      return roles;
    },
    isLoading() {
      return this.status === LOADING;
    },
    isLoaded() {
      return this.status === SUCCESS;
    },
    hasError() {
      return this.status === ERROR;
    },
    userEditSuccess() {
      return this.status === 'success' && this.hasEditedUser;
    },
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.status = LOADING;
      const user = {
        id: this.userId,
        name: this.username,
        email: this.email,
        role: this.role,
      };
      getStaff(user)
        .then(resp => {
          const { name, email, role } = resp;

          this.username = name;
          this.email = email;
          this.role = role;

          this.status = SUCCESS;
        })
        .catch(err => {
          this.error_msg = err.message;
          this.status = ERROR;
        });
    },
    editUser() {
      this.status = LOADING;
      const data = {
        id: this.userId,
        role: this.role,
      };
      editStaff(data)
        .then(() => {
          this.hasEditedUser = true;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.error_msg = err.message;
          this.status = ERROR;
        });
    },
  },
};
</script>
