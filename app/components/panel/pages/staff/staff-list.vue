<template>
  <div>
    <div class="table-options">
      <router-link to="/staff/add">
        <Button>Add Staff</Button>
      </router-link>
    </div>
    <div v-if="isLoading"><Loading /></div>
    <div v-else-if="hasError">Error: {{ errorMsg }}</div>
    <Table v-else>
      <template #head>
        <th>Username</th>
        <th>Role</th>
        <th></th>
      </template>
      <template #body>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td class="buttons">
            <router-link :to="`/staff/edit/${user.id}`">
              <Button>Edit</Button>
            </router-link>
            <Button @click="deleteUser(user)">X</Button>
          </td>
        </tr>
      </template>
    </Table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { getStaffList, deleteStaff } from '@/app/requests/staff';
import Loading from '@/app/components/lib/loading';
import Button from '@/app/components/lib/button';
import Table from '../../lib/table';

const LOADING = 'ERROR';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  components: {
    Table,
    Button,
    Loading,
  },
  data() {
    return {
      users: [],
      errorMsg: '',
      status: '',
    };
  },
  computed: {
    ...mapGetters(['accessToken']),
    isLoading() {
      return this.status === LOADING;
    },
    hasLoaded() {
      return this.status === SUCCESS;
    },
    hasError() {
      return this.status === ERROR;
    },
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      this.state = LOADING;
      return getStaffList(this.accessToken.token)
        .then(response => {
          this.status = SUCCESS;
          this.users = response;
        })
        .catch(err => {
          this.status = ERROR;
          this.errorMsg = err.message || err;
        });
    },
    async deleteUser(user) {
      this.state = LOADING;
      return deleteStaff(this.accessToken.token, user)
        .then(() => {
          this.status = SUCCESS;
          this.getUsers();
        })
        .catch(err => {
          this.status = ERROR;
          this.errorMsg = err.message || err;
        });
    },
  },
};
</script>

<style scoped>
.table-options {
  margin-bottom: 0.5em;
}
.buttons {
  width: 5em;
  text-align: center;
}
</style>
