<template>
  <div v-if="isThreadLoaded">
    <div class="buttons">
      <router-link :to="`/${getBoard.name}/`" class="button">Volver</router-link>
    </div>
    <div class="thread-replyto">
      {{ replyingToThreadTitle }}
    </div>
    <PostBox
      :type="posting.type"
      :board="getBoard"
      :thread="thread"
      @posted="getThread"
      @close-quick-reply="unsetQuickReply"
    />
    <div class="threads">
      <Thread :data="thread" @set-reply="setQuickReply" />
    </div>
    <div class="buttons">
      <button v-if="isLoaded" class="button update-button" @click="getThread">Actualizar</button>
      <button v-else-if="isLoading" class="button update-button">...</button>
      <button v-else-if="error" class="button update-button">Error!</button>
    </div>
  </div>
  <div v-else-if="isThreadLoading">
    <div class="full-center">
      <Loading />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { getThread } from '@/app/requests/post';
import Loading from '@/app/components/lib/loading';
import Thread from '../lib/thread';
import PostBox from '../lib/postbox';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  components: {
    PostBox,
    Thread,
    Loading,
  },
  data() {
    return {
      thread: {
        seq_id: this.$route.params.threadid,
      },
      posting: {
        type: 'Reply',
      },
      status: '',
      errorMsg: '',
    };
  },
  computed: {
    ...mapGetters(['getBoard']),
    isThreadLoaded() {
      return !!this.thread.id;
    },
    isThreadLoading() {
      return !this.thread.id && this.status === REQUEST;
    },
    replyingToThreadTitle() {
      return `Estas en el hilo ${this.thread.seq_id} de /${this.getBoard.name}/`;
    },
    isLoaded() {
      return this.status === SUCCESS;
    },
    isLoading() {
      return this.status === REQUEST;
    },
    error() {
      return this.status === ERROR;
    },
  },
  mounted() {
    this.getThread();
  },
  methods: {
    async getThread() {
      this.status = REQUEST;
      return getThread(this.getBoard.name, this.thread.seq_id)
        .then(thread => {
          this.thread = thread;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
    setQuickReply() {
      this.posting.type = 'QuickReply';
    },
    unsetQuickReply() {
      this.posting.type = 'Reply';
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
.full-center {
  min-height: 75vh;
  display: flex;
  align-items: center;
}
</style>
