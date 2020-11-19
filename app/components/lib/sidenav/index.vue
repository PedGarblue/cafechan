<template>
  <div class="menu">
    <div class="menu-header">
      MENU
    </div>
    <ul v-if="isProfileLoaded" class="menu-sections">
      <li class="page">
        <router-link to="/">
          Inicio
        </router-link>
      </li>
      <li v-for="section in sections" :key="section.name" class="menu-section">
        <span>{{ section.name.toLocaleUpperCase() }}</span>
        <ul class="sub-section">
          <li v-for="page in section.pages" :key="page.name" class="page">
            <router-link :to="{ name: page.name }">
              {{ page.title }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
    <div v-else>
      <Loading />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import config from './config';
import Loading from '../loading';

const EMPTY = 0;

export default {
  components: {
    Loading,
  },
  computed: {
    ...mapGetters({ profile: 'getProfile', isProfileLoaded: 'isProfileLoaded' }),
    sections() {
      const sections = config.sections();
      return sections
        .map(section => {
          const filteredSection = section;
          filteredSection.pages = section.pages.filter(page => page.authorize.includes(this.profile.role));
          return filteredSection;
        })
        .filter(section => {
          return section.pages.length > EMPTY;
        });
    },
  },
};
</script>

<style scoped>
.loading-msg {
  margin-top: 1em;
}
</style>
