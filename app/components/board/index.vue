<template>
  <div>
    <Navbar :sections="getSections" />
    <div v-if="isBoardLoaded">
      <div class="board-header">
        <h1>{{ boardTitle }}</h1>
      </div>
      <router-view />
    </div>
    <div v-else class="full-center">
      <Loading />
    </div>
    <Navbar :sections="getSections" />
    <Footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { BOARD_REQUEST } from '@/app/store/actions/board';
import Loading from '@/app/components/lib/loading';
import Navbar from './lib/navbar';
import Footer from './lib/footer';

export default {
  components: {
    Navbar,
    Footer,
    Loading,
  },
  data() {
    return {
      boardname: this.$route.params.boardname,
      page: this.$route.params.page,
    };
  },
  computed: {
    ...mapGetters(['isBoardLoaded', 'getBoard', 'getSections']),
    boardTitle() {
      return `/${this.boardname}/ - ${this.getBoard.desc}`;
    },
  },
  watch: {
    $route(to) {
      this.boardname = to.params.boardname;
      this.page = to.params.page;
      this[BOARD_REQUEST]({ boardname: this.boardname, page: this.page });
    },
  },
  mounted() {
    this[BOARD_REQUEST]({ boardname: this.boardname, page: this.page });
  },
  methods: {
    ...mapActions([BOARD_REQUEST]),
  },
};
</script>

<style scoped>
.board-header {
  text-align: center;
  margin: 3rem 0;
}
.full-center {
  min-height: 75vh;
  display: flex;
  align-items: center;
}
</style>
