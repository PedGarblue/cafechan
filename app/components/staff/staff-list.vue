<template>
  <div>
    <div class="table-options">
      <router-link to="/staff/add">
        <button class="update-table">[Agregar Staff]</button>
      </router-link>
    </div>
    <table>
      <thead>
        <th>Usuario</th>
        <th>Rol</th>
        <th>-</th>
      </thead>
      <tbody>
        <tr v-if="isloading">
          <td>[...]</td>
          <td>[...]</td>
          <td>[...]</td>
        </tr>
        <tr v-for="user in users" v-else-if="hasloaded" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td>
            <router-link :to="`/staff/edit/${user.id}`">[Edit]</router-link>
            <a href="#" @click.prevent="deleteUser(user)">[X]</a>
          </td>
        </tr>
        <tr v-else>
          <td colspan="3">
            {{ errorMsg }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getStaffList, deleteStaff } from '@/requests/staff';

const LOADING = 'ERROR';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  data() {
    return {
      users: [],
      errorMsg: '',
      state: '',
    };
  },
  computed: {
    isloading() {
      return this.state === LOADING;
    },
    hasloaded() {
      return this.state === SUCCESS;
    },
    haserror() {
      return this.state === ERROR;
    },
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.state = LOADING;
      getStaffList()
        .then(response => {
          this.state = SUCCESS;
          this.users = response;
        })
        .catch(error => {
          this.state = ERROR;
          this.errorMsg = error.message || error;
        });
    },
    deleteUser(user) {
      this.state = LOADING;
      deleteStaff(user)
        .then(() => {
          this.state = SUCCESS;
          this.getUsers();
        })
        .catch(err => {
          this.state = ERROR;
          this.errorMsg = err.message || err;
        });
    },
  },
};
</script>
