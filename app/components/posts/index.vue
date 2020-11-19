<template>
  <Page title="Recent Posts">
    <div class="table-options">
      <Button @click="updatePosts">Actualizar</Button>
    </div>
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else-if="hasError">Error: {{ errMsg }}</div>
    <Table>
      <template #body>
        <tr v-for="post in posts" :key="`${post.id}`">
          <Reply v-if="post.kind === 'Reply'" :data="post" :remove-post-function="removePost"></Reply>
          <Thread v-else :data="post" :remove-post-function="removePost"></Thread>
        </tr>
      </template>
    </Table>
  </Page>
</template>

<script>
import { getPosts, removePost } from '@/requests/post';
import { mapGetters } from 'vuex';
import Button from '../lib/button';
import Table from '../lib/table';
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
    Table,
    Button,
  },
  data() {
    return {
      posts: [],
      status: '',
      errMsg: '',
    };
  },
  computed: {
    isLoading() {
      return this.status === LOADING;
    },
    loaded() {
      return this.status === SUCCESS;
    },
    hasError() {
      return this.status === ERROR;
    },
    ...mapGetters(['accessToken']),
  },
  mounted() {
    this.updatePosts();
  },
  methods: {
    updatePosts() {
      this.status = LOADING;
      getPosts(this.accessToken.token)
        .then(resp => {
          this.posts = resp;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errMsg = err.message;
          this.status = ERROR;
        });
    },
    removePost(post) {
      removePost(this.accessToken.token, post)
        .then(() => {
          this.updatePosts();
        })
        .catch(err => {
          this.errMsg = err.message;
          this.status = ERROR;
        });
    },
  },
};
</script>

<style scoped>
.table-options {
  margin-bottom: 0.5em;
}
</style>
