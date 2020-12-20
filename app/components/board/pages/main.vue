<template>
  <div>
    <PostBox
      type="Thread"
      :boardid="getBoard.id"
      :maxfilesize="getBoard.max_file_size"
      :allowedfiletypes="getBoard.allowed_filetypes"
    />
    <div class="threads">
      <Thread v-for="thread in getThreads" :key="thread.id" :data="thread" />
    </div>
    <Pagination :actual-page="getPagination.actual" :total-pages="getPagination.totalpages" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
};
</script>

<style scoped></style>
