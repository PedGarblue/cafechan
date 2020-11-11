<template>
  <Page>
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">Tablones</h2>
      </div>
      <div class="page-contents">
        <div class="staff-container">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '../page';

export default {
  components: {
    Page,
  },
};
</script>

<style scoped></style>
