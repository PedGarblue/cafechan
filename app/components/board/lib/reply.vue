<template>
  <div class="reply-container">
    <div class="doubledash">&gt;&gt;</div>
    <div class="reply">
      <span class="reply-info">
        <input type="checkbox" :value="data.seq_id" />
        <span class="postername">
          {{ data.name }}
        </span>
        <span class="timestamp">
          {{ data.timestamp }}
        </span>
        <span class="reflink">
          <a> #{{ data.seq_id }} </a>
        </span>
      </span>
      <div class="post-contents" :class="{ 'open-file': openfile }">
        <a v-if="data.file" class="post-file" @click="toggleFile">
          <span v-if="!openfile" class="thumb">
            <img :src="data.file.thumbnailUrl" />
          </span>
          <span v-else>
            <img :src="data.file.url" />
          </span>
        </a>
        <blockquote class="post-message" v-html="data.message"></blockquote>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      openfile: false,
    };
  },
  methods: {
    toggleFile() {
      this.openfile = !this.openfile;
    },
  },
};
</script>

<style scoped>
.post-contents {
  display: flex;
}
.post-contents.open-file {
  flex-direction: column;
}
.reply-info {
  display: flex;
}
.reply-info * {
  margin: 0 0.2em;
}
</style>
