<template>
  <div>
    <div class="table-options">
      <router-link to="/board/add">
        <Button>Add Board</Button>
      </router-link>
    </div>
    <div v-if="isLoading"><Loading /></div>
    <div v-else-if="hasError">Error {{ errMsg }}</div>
    <Table v-else>
      <template #head>
        <th>Name</th>
        <th>Description</th>
        <th>Section</th>
        <th>State</th>
        <th></th>
      </template>
      <template #body>
        <tr v-for="board in boards" :key="board._id">
          <td>{{ board.name }}</td>
          <td>{{ board.desc }}</td>
          <td>{{ board.section }}</td>
          <td :class="{ green: !board.locked, red: board.locked }">{{ board.locked ? 'Closed' : 'Open' }}</td>
          <td class="buttons">
            <router-link :to="`/board/edit/${board._id}`">
              <Button>Edit</Button>
            </router-link>
            <Button @click="deleteBoard(board)">X</Button>
          </td>
        </tr>
      </template>
    </Table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { getBoards, deleteBoard } from '@/app/requests/board';
import Button from '@/app/components/lib/button';
import Loading from '@/app/components/lib/loading';
import Table from '../../lib/table';

const LOADING = 'LOADING';
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
      boards: [],
      errMsg: '',
      status: '',
    };
  },
  computed: {
    ...mapGetters(['accessToken']),
    isLoading() {
      return this.status === LOADING;
    },
    isLoaded() {
      return this.status === SUCCESS;
    },
    hasError() {
      return this.status === ERROR;
    },
  },
  mounted() {
    this.getBoards();
  },
  methods: {
    async getBoards() {
      this.status = LOADING;
      return getBoards(this.accessToken.token)
        .then(resp => {
          this.boards = resp;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
    async deleteBoard(board) {
      this.status = LOADING;
      return deleteBoard(this.accessToken.token, { id: board._id })
        .then(() => {
          this.status = SUCCESS;
          this.getBoards();
        })
        .catch(err => {
          this.errorMsg = err.message;
          this.status = ERROR;
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
.red {
  color: red;
  font-weight: bold;
}
.green {
  color: green;
  font-weight: bold;
}
</style>
