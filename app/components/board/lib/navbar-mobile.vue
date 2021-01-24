<template>
  <div class="navbar-mobile">
    <span class="navbar-mobile-icon cafe-icon"></span>
    <div class="navbar-mobile-menu">
      <select v-model="selected" class="navbar-mobile-select-board" @change="changeLocation">
        <optgroup v-for="section in sections" :key="section.name" class="section" :label="section.name">
          <option
            v-for="board in section.boards"
            :key="board.name"
            class="board"
            :value="board.name"
            :selected="board.name === selected"
          >
            {{ board.desc }}
          </option>
        </optgroup>
      </select>
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
  data() {
    return {
      selected: this.$route.params.boardname,
    };
  },
  methods: {
    changeLocation() {
      this.$router.push(`/${this.selected}/`);
    },
  },
};
</script>

<style scoped>
.navbar-mobile {
  display: none;
}
@media screen and (max-width: 720px) {
  .navbar-mobile {
    display: flex;
    background-color: var(--primary-light-color);
  }
  .navbar-mobile-icon {
    font-size: 2.5em;
    padding: 0.4rem 0.4rem 0.4rem 0.7rem;
  }
  .navbar-mobile-menu {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0.4rem 0.5rem 0.4rem 0;
  }
  .navbar-mobile-select-board {
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: 1px solid var(--primary-lighter-color);
  }
}
</style>
