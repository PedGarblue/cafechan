<template>
  <div class="pagination">
    <span v-if="actualPage > 1">
      <router-link class="pag-item" :to="`/${getBoard.name}/${actualPage - 1}`">&lt;&lt;</router-link>
    </span>
    <span v-else>
      <a class="pag-item disabled"> &lt;&lt; </a>
    </span>
    <span v-for="n in totalPages" :key="n">
      <router-link v-if="n !== actualPage" class="pag-item" :to="`/${getBoard.name}/${n}/`"> {{ n }} </router-link>
      <a v-else class="pag-item disabled"> {{ n }} </a>
    </span>
    <span v-if="actualPage < totalPages">
      <router-link class="pag-item" :to="`/${getBoard.name}/${actualPage + 1}`">&gt;&gt;</router-link>
    </span>
    <span v-else>
      <span class="pag-item disabled"> &gt;&gt; </span>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    actualPage: {
      type: Number,
      default() {
        return 1;
      },
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['getBoard']),
  },
};
</script>

<style scoped>
.pagination {
  margin: 1.5rem 0;
}

.pag-item {
  padding: 0.5em;
  background-color: var(--primary-light-color);
}

.pag-item:not(.disabled):hover {
  background-color: var(--primary-lighter-color);
}

.disabled {
  background-color: var(--secondary-light-color);
}

a {
  color: var(--text-color);
}
</style>
