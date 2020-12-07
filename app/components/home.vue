<template>
  <Page title="Welcome">
    <p>Hi, welcome to Cafechan, the simple <del>and shitty</del> imageboard.</p>
    <p><router-link to="/posts">View Bans and Recent Post</router-link></p>
    <p><router-link to="/staff">Create and edit Staff users</router-link></p>
    <p><router-link to="/ban">Create and edit Boards</router-link></p>
  </Page>
</template>

<script>
import Page from './lib/page';

export default {
  components: {
    Page,
  },
};
</script>

<style scoped></style>
