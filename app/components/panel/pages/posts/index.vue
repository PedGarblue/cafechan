<template>
  <Page title="Recent Posts">
    <div class="table-options">
      <Button @click="updatePosts">Actualizar</Button>
    </div>
    <div v-if="isLoading">
      <Loading />
    </div>
    <div v-else-if="hasError">Error: {{ errorMsg }}</div>
    <Table v-else>
      <template #body>
        <tr v-for="post in posts" :key="`${post.id}`">
          <Post :data="post" @delete-post="removePost(post)" @ban-poster="banPoster(post)"></Post>
        </tr>
      </template>
    </Table>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';

import { getPosts, removePost } from '@/app/requests/post';
import Loading from '@/app/components/lib/loading';
import Button from '@/app/components/lib/button';
import Table from '../../lib/table';
import Page from '../../lib/page';
import Post from '../../lib/post';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  components: {
    Page,
    Table,
    Button,
    Loading,
    Post,
  },
  data() {
    return {
      posts: [],
      status: '',
      errorMsg: '',
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
    async updatePosts() {
      this.status = LOADING;
      return getPosts(this.accessToken.token)
        .then(resp => {
          this.posts = resp;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
    async removePost(post) {
      return removePost(this.accessToken.token, post)
        .then(() => {
          this.updatePosts();
        })
        .catch(err => {
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
    banPoster(data) {
      this.$router.push({ name: 'ban-add', query: { post: data.id } });
    },
  },
};
</script>

<style scoped>
.table-options {
  margin-bottom: 0.5em;
}
</style>
