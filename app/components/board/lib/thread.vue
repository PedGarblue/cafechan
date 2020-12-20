<template>
  <div class="thread">
    <div class="thread-body" :class="{ 'open-file': openFile }">
      <a v-if="data.file" @click="toggleFile">
        <span v-if="!openFile">
          <img :src="data.file.thumbnailUrl" />
        </span>
        <span v-else>
          <img :src="data.file.url" />
        </span>
      </a>
      <span class="thread-contents">
        <span class="thread-info">
          <input type="checkbox" :value="data.id" />
          <span class="title">
            {{ data.title }}
          </span>
          <span class="postername">
            {{ data.name ? data.name : 'Anonymous' }}
          </span>
          <span class="timestamp">
            {{ data.timestamp }}
          </span>
          <span class="reflink">
            <a>#{{ data.seq_id }}</a>
          </span>
          <span class="response-btn">
            <router-link :to="`/${getBoard.name}/thread/${data.seq_id}/`">Responder</router-link>
          </span>
        </span>
        <blockquote class="post-message" v-html="data.message"></blockquote>
      </span>
    </div>
    <div v-if="hasReplies" class="replies">
      <Reply v-for="reply in data.replies" :key="reply.id" :data="reply" />
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

.reflink * {
  margin: 0 0.3em 0 0;
}

.thread-body {
  display: flex;
}

.thread-body.open-file {
  flex-direction: column;
}

blockquote {
  word-wrap: break-word;
  white-space: pre-line;
}

.replies {
  margin-top: 2rem;
}
</style>
