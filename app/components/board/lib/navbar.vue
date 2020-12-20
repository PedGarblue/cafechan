<template>
  <div class="navbar">
    <div class="section">
      <a href="/">Inicio</a>
    </div>
    <div v-for="section in sections" :key="section.name" class="section">
      <router-link
        v-for="board in section.boards"
        :key="board.name"
        :to="`/${board.name}/`"
        class="board"
        :title="board.desc"
      >
        {{ board.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sections: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  font-size: 105%;
  line-height: 140%;
  border: 1px solid var(--primary-color);
  background-color: var(--primary-light-color);
  color: var(--secondary-color);
}
.section {
  display: flex;
  border-right: 2px solid var(--primary-color);
}
.section a {
  padding: 0.7rem 1rem;
}
.section a:hover {
  color: var(--text-color);
  background-color: var(--primary-lighter-color);
}
</style>
