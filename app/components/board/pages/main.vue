<template>
  <div>
    <PostBox
      :type="posting.type"
      :board="getBoard"
      :thread="posting.thread"
      @close-quick-reply="unsetQuickReply"
      @posted="updateThreads"
    />
    <div class="threads">
      <Thread v-for="thread in getThreads" :key="thread.id" :data="thread" @set-reply="setQuickReply" />
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
  data() {
    return {
      posting: {
        type: 'Thread',
        thread: {},
      },
    };
  },
  computed: {
    ...mapGetters(['getBoard', 'getThreads', 'getPagination']),
  },
  methods: {
    ...mapActions([BOARD_REQUEST]),
    updateThreads() {
      this[BOARD_REQUEST]({ boardname: this.getBoard.name, page: this.getPagination.actual });
    },
    setQuickReply(thread) {
      this.posting.type = 'QuickReply';
      this.posting.thread = thread;
    },
    unsetQuickReply() {
      this.posting.type = 'Thread';
      this.posting.thread = {};
    },
  },
};
</script>

<style scoped></style>
