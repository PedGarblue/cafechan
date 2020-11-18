<template>
  <div>
    <div class="table-options">
      <router-link to="/board/add">
        <Button>Add Board</Button>
      </router-link>
    </div>
    <Table>
      <template #head>
        <th>Name</th>
        <th>Description</th>
        <th></th>
      </template>
      <template #body>
        <tr v-for="board in boards" :key="board._id">
          <td>{{ board.name }}</td>
          <td>{{ board.desc }}</td>
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
import { getBoards, deleteBoard } from '@/requests/board';
import Table from '../lib/table';
import Button from '../lib/button';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  components: {
    Table,
    Button,
  },
  data() {
    return {
      boards: [],
      errorMsg: '',
      status: '',
    };
  },
  computed: {
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
    getBoards() {
      this.status = LOADING;
      getBoards()
        .then(resp => {
          this.boards = resp;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.data.message || err;
          this.status = ERROR;
        });
    },
    deleteBoard(board) {
      this.status = LOADING;
      deleteBoard({ id: board._id })
        .then(() => {
          this.status = SUCCESS;
          this.getBoards();
        })
        .catch(err => {
          this.errorMsg = err.data.message || err;
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
</style>
