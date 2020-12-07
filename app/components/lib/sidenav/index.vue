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

.menu {
  width: 20%;
  background-color: var(--dark);
  color: var(--text-color);
  display: inline-block;
}

.menu-header {
  text-align: center;
  padding: 1em;
  font-weight: bold;
  font-size: 1.05em;
  background-color: var(--secondary-color);
}

.menu a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: bold;
}

.menu-sections {
  margin: 0;
  list-style: none;
}

.menu-section {
  padding: 0.7em 0;
}

.sub-section {
  transition: all 0.1s;
  opacity: 0;
  display: none;
  visibility: hidden;
  list-style: none;
}
.menu-section:hover .sub-section {
  opacity: 1;
  display: block;
  visibility: visible;
  padding-top: 0.7em;
}
</style>
