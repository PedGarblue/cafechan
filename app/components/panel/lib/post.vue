<template>
  <div class="reply-container">
    <div class="reply">
      <span class="replyinfo">
        <input type="checkbox" />
        <span v-if="data.kind === 'Thread'">
          <b>(Hilo)</b>
        </span>
        <span class="postername">
          {{ data.name }}
        </span>
        <span class="timer">
          {{ data.timestamp }}
        </span>
        <span>
          <a href="#" @click.prevent="removePost(data)">[X]</a>
        </span>
        <span>
          <a href="#" @click.prevent="banPoster(data)">[B]</a>
        </span>
      </span>
      <div class="post-contents" :class="{ 'flex-column': fileState }">
        <div v-if="data.file" class="post-file">
          <div v-if="!fileState" class="file-thumbnail">
            <img :src="data.file.thumbnailUrl" @click="toggleFile" />
          </div>
          <div v-else class="image-complete">
            <img :src="data.file.url" @click="toggleFile" />
          </div>
        </div>
        <blockquote class="message" v-html="data.message"></blockquote>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {
          id: '',
          name: '',
          timestamp: '',
          message: '',
        };
      },
    },
  },
  data() {
    return {
      fileState: false,
    };
  },
  methods: {
    removePost(data) {
      this.$emit('delete-post', data);
    },
    banPoster(data) {
      this.$emit('ban-poster', data);
    },
    toggleFile() {
      this.fileState = !this.fileState;
    },
  },
};
</script>

<style scoped>
.flex-column {
  flex-direction: column;
}

.message {
  white-space: pre-line;
  word-wrap: break-word;
}

.post-contents {
  display: flex;
}

.file-thumbnail {
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  margin: 0.4em 0 0.3em 0.5em;
}

.image-complete {
  margin: 0.5em 0.5em 0 0.5em;
}
</style>
