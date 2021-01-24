<template>
  <div>
    <Navbar :sections="getSections" />
    <NavbarMobile :sections="getSections" />
    <div v-if="isBoardLoaded" ref="page-body" class="page-body">
      <div class="board-header">
        <h1>{{ boardTitle }}</h1>
      </div>
      <router-view />
    </div>
    <div v-else-if="hasBoardError" class="full-center">
      <Error :message="errorMsg" />
    </div>
    <div v-else ref="page-body" class="full-center">
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
import Error from '@/app/components/lib/404';
import Navbar from './lib/navbar';
import NavbarMobile from './lib/navbar-mobile';
import Footer from './lib/footer';

export default {
  components: {
    Navbar,
    NavbarMobile,
    Footer,
    Loading,
    Error,
  },
  data() {
    return {
      boardname: this.$route.params.boardname,
      page: this.$route.params.page,
      errorMsg: '',
    };
  },
  computed: {
    ...mapGetters(['isBoardLoaded', 'hasBoardError', 'getBoard', 'getSections']),
    boardTitle() {
      return `/${this.boardname}/ - ${this.getBoard.desc}`;
    },
  },
  watch: {
    $route(to) {
      this.boardname = to.params.boardname;
      this.page = to.params.page;
      this.getBoardpage();
    },
  },
  mounted() {
    this.getBoardpage();
  },
  methods: {
    ...mapActions([BOARD_REQUEST]),
    getBoardpage() {
      this[BOARD_REQUEST]({ boardname: this.boardname, page: this.page }).catch(err => {
        this.errorMsg = err.message;
      });
    },
  },
};
</script>

<style scoped>
.page-body {
  padding: 0 0.6rem;
}
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
