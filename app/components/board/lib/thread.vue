<template>
  <div class="thread">
    <div class="thread-body">
      <span class="thread-contents">
        <a v-if="data.file" class="post-file" :class="{ 'open-file': openFile }" @click="toggleFile">
          <span v-if="!openFile"> <img :src="data.file.thumbnailUrl" /> </span>
          <span v-else> <img :src="data.file.url" /> </span>
        </a>
        <span class="thread-info">
          <span class="postername"> {{ data.name }} </span>
          <span class="timestamp"> {{ data.timestamp }} </span>
          <span class="reflink">
            <a @click.prevent="setReply">#{{ data.seq_id }}</a>
          </span>
          <span class="response-btn">
            <router-link :to="`/${getBoard.name}/thread/${data.seq_id}/`">Ir al Hilo</router-link>
          </span>
        </span>
        <span class="title"> {{ data.title }} </span>
        <blockquote class="post-message" v-html="data.message"></blockquote>
      </span>
    </div>
    <div v-if="hasReplies" class="replies">
      <Reply v-for="reply in data.replies" :key="reply.id" :data="reply" @set-reply="setReply" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Reply from './reply';

export default {
  components: {
    Reply,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      openFile: false,
    };
  },
  computed: {
    ...mapGetters(['getBoard']),
    hasReplies() {
      return this.data.replies !== undefined && this.data.replies.length > 0;
    },
  },
  methods: {
    toggleFile() {
      this.openFile = !this.openFile;
    },
    setReply() {
      this.$emit('set-reply', this.data);
    },
  },
};
</script>

<style scoped>
.thread {
  border-bottom: 1px solid var(--primary-light-color);
  padding: 0.5rem 0 1rem 0;
}

.thread:first-child {
  border-top: 1px solid var(--primary-light-color);
}

.thread-contents {
  padding-left: 0.5em;
}

.thread-info {
  display: flex;
}

.thread-info * {
  margin: 0 0.2em;
}

.thread-info *:first-child {
  margin-left: 0;
}

.reflink * {
  margin: 0 0.3em 0 0;
}

.reflink a {
  cursor: pointer;
}

.thread-body {
  display: flex;
  flex-direction: column;
}
.post-file {
  padding: 0 1rem 0 0.2rem;
  float: left;
}
.open-file {
  float: none;
}

.post-message {
  word-wrap: anywhere;
  white-space: pre-line;
}

.replies {
  margin-top: 2rem;
}

@media screen and (max-width: 720px) {
  .post-file {
    float: none;
  }
}
</style>
