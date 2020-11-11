<template>
  <div>
    <div class="table-options">
      <router-link to="/board/add">
        <button class="update-table">[Agregar tablón]</button>
      </router-link>
    </div>
    <table>
      <thead>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>-</th>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td>[...]</td>
        </tr>
        <tr v-for="board in boards" v-else-if="isLoaded" :key="board._id">
          <td>{{ board.name }}</td>
          <td>{{ board.desc }}</td>
          <td>
            <router-link :to="`/board/edit/${board._id}`">[Edit]</router-link>
            <a href="#" @click.prevent="deleteBoard(board)">[X]</a>
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
import { getBoards, deleteBoard } from '@/requests/board';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
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

<style scoped></style>
