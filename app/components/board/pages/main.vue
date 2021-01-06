<template>
  <div>
    <PostBox
      type="Thread"
      :boardid="getBoard.id"
      :maxfilesize="getBoard.max_file_size"
      :allowedfiletypes="getBoard.allowed_filetypes"
      @posted="updateThreads"
    />
    <div class="threads">
      <Thread v-for="thread in getThreads" :key="thread.id" :data="thread" />
    </div>
    <Pagination :actual-page="getPagination.actual" :total-pages="getPagination.totalpages" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { BOARD_REQUEST } from '@/app/store/actions/board';
import Thread from '../lib/thread';
import Pagination from '../lib/pagination';
import PostBox from '../lib/postbox';

export default {
  components: {
    PostBox,
    Thread,
    Pagination,
  },
  computed: {
    ...mapGetters(['getBoard', 'getThreads', 'getPagination']),
  },
  methods: {
    ...mapActions([BOARD_REQUEST]),
    updateThreads() {
      this[BOARD_REQUEST]({ boardname: this.getBoard.name, page: this.getPagination.actual });
    },
  },
};
</script>

<style scoped></style>
