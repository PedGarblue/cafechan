<template>
  <div class="reply-container">
    <div class="reply">
      <span class="replyinfo">
        <input type="checkbox" />
        <span class="postername">
          {{ data.name }}
        </span>
        <span class="timer">
          {{ data.timestamp }}
        </span>
        <span>
          <a href="#" @click.prevent="deletePost(data)">[X]</a>
        </span>
        <span>
          <a href="#" @click.prevent="banPoster(data)">[B]</a>
        </span>
      </span>
      <blockquote class="message" v-html="data.message"></blockquote>
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
          ip: '',
        };
      },
    },
  },
  methods: {
    deletePost(data) {
      this.$emit('delete-post', data);
    },
    banPoster(data) {
      this.$emit('ban-poster', data);
    },
  },
};
</script>

<style scoped>
.message {
  white-space: pre-line;
  word-wrap: break-word;
}
</style>
