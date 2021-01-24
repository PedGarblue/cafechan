<template>
  <Page title="Welcome">
    <p>Hi, welcome to Cafechan, the simple <del>and shitty</del> imageboard.</p>
    <div v-if="getProfile.role === 'admin' || getProfile.role === 'modplus'" id="mod-pages">
      <router-link to="/posts"><Button>View Bans and Recent Post</Button></router-link>
      <router-link to="/staff"><Button>Create and edit Staff users</Button></router-link>
      <router-link to="/ban"><Button>View and Create Bans</Button></router-link>
    </div>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';

import Button from '@/app/components/lib/button';
import Page from '../lib/page';

export default {
  components: {
    Page,
    Button,
  },
  computed: {
    ...mapGetters(['getProfile']),
  },
};
</script>

<style scoped></style>
