<template>
  <div>
    <div class="buttons">
      <router-link :to="`/${getBoard.name}/`" class="button">Volver</router-link>
    </div>
    <div class="thread-replyto">
      {{ replyingToThreadTitle }}
    </div>
    <PostBox
      type="Reply"
      :boardid="getBoard.id"
      :threadid="thread.id"
      :maxfilesize="getBoard.max_file_size"
      :allowedfiletypes="getBoard.allowed_filetypes"
      @posted="getThread"
    />
    <div class="threads">
      <Thread :data="thread" />
    </div>
    <div class="buttons">
      <button v-if="isLoaded" class="button" @click="getThread">Actualizar</button>
      <button v-else-if="isLoading" class="button">...</button>
      <button v-else-if="error" class="button">Error!</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { getThread } from '@/app/requests/post';
import Thread from '../lib/thread';
import PostBox from '../lib/postbox';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  components: {
    PostBox,
    Thread,
  },
  data() {
    return {
      thread: {
        seq_id: this.$route.params.threadid,
      },
      updateStatus: '',
      status: '',
      error: '',
    };
  },
  computed: {
    ...mapGetters(['getBoard']),
    replyingToThreadTitle() {
      return `Estas en el hilo ${this.thread.seq_id} de /${this.getBoard.name}/`;
    },
    isLoaded() {
      return this.status === SUCCESS;
    },
    isLoading() {
      return this.status === REQUEST;
    },
  },
  mounted() {
    this.getThread();
  },
  methods: {
    getThread() {
      this.status = REQUEST;
      getThread(this.getBoard.name, this.thread.seq_id)
        .then(thread => {
          this.thread = thread;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.error = err;
          this.status = ERROR;
        });
    },
  },
};
</script>

<style scoped>
.thread-replyto {
  background-color: var(--primary-light-color);
  text-align: center;
  font-weight: bold;
  padding: 1rem 0;
  margin-bottom: 2rem;
}
.buttons {
  margin: 1rem 0.1rem;
}
.button {
  padding: 0.4rem;
  background-color: var(--primary-light-color);
  color: var(--text-color);
  border: none;
}
.button:hover {
  background-color: var(--primary-lighter-color);
}
</style>