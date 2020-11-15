<template>
  <Page title="Recent Posts">
    <div class="table-options">
      <button class="update-table" @click="updatePosts">[Actualizar]</button>
    </div>
    <div class="posts-container">
      <div v-for="post in posts" :key="`${post.id}`">
        <Reply v-if="post.kind === 'Reply'" :data="post" :remove-post-function="removePost"></Reply>
        <Thread v-else :data="post" :remove-post-function="removePost"></Thread>
      </div>
    </div>
  </Page>
</template>

<script>
import { getPosts, removePost } from '@/requests/post';
import { mapGetters } from 'vuex';
import Page from '../lib/page';
import Reply from '../lib/reply';
import Thread from '../lib/thread';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  components: {
    Page,
    Reply,
    Thread,
  },
  data() {
    return {
      posts: [],
      status: '',
      errMsg: '',
    };
  },
  computed: {
    ...mapGetters(['tokens']),
  },
  mounted() {
    this.updatePosts();
  },
  methods: {
    updatePosts() {
      this.status = LOADING;
      getPosts(this.tokens.accessTokens)
        .then(resp => {
          this.posts = resp;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errMsg = err.message || err;
          this.status = ERROR;
        });
    },
    removePost(post) {
      removePost(this.tokens.accessTokens, post)
        .then(() => {
          this.updatePosts();
        })
        .catch(err => {
          this.errMsg = err.message || err;
          this.status = ERROR;
        });
    },
  },
};
</script>

<style scoped></style>
