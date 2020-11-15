<template>
  <Page title="Boards Management">
    <div class="staff-container">
      <router-view></router-view>
    </div>
  </Page>
</template>

<script>
import Page from '../lib/page';

export default {
  components: {
    Page,
  },
};
</script>

<style scoped></style>
