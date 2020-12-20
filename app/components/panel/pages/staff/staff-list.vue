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
import { getStaffList, deleteStaff } from '@/requests/staff';
import Loading from '@/components/lib/loading';
import Button from '@/components/lib/button';
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
      state: '',
    };
  },
  computed: {
    isLoading() {
      return this.state === LOADING;
    },
    hasLoaded() {
      return this.state === SUCCESS;
    },
    hasError() {
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
        .catch(err => {
          this.state = ERROR;
          this.errorMsg = err.message || err;
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

<style scoped>
.table-options {
  margin-bottom: 0.5em;
}
.buttons {
  width: 5em;
  text-align: center;
}
</style>
