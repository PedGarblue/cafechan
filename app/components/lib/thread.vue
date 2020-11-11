<template>
  <div class="reply-container">
    <div class="reply">
      <span class="replyinfo">
        <input type="checkbox" />
        <span>
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
      </span>
      <blockquote class="message">
        {{ data.message }}
      </blockquote>
    </div>
  </div>
</template>

<script>
import { removePost } from '@/requests/post';

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
    removePostFunction: {
      type: Function,
      default: removePost,
    },
  },
  methods: {
    removePost(data) {
      this.removePostFunction(data);
    },
  },
};
</script>

<style scoped></style>
