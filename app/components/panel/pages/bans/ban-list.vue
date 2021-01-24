<template>
  <div class="table">
    <div class="table-options">
      <Button id="update-button" @click="getBans">Update</Button>
      <router-link to="/ban/add">
        <Button>Add Ban</Button>
      </router-link>
    </div>
    <div v-if="isLoading"><Loading /></div>
    <div v-else-if="hasError">Error: {{ errorMsg }}</div>
    <Table v-else>
      <template #head>
        <th>ID</th>
        <th>Reason</th>
        <th>Expiration</th>
        <th>IP</th>
        <th></th>
      </template>

      <template #body>
        <tr v-for="ban in bansList" :key="ban._id" class="table-item">
          <td class="ban-id">{{ ban._id }}</td>
          <td class="ban-reason">{{ ban.reason }}</td>
          <td class="ban-until">{{ ban.until }}</td>
          <td class="ban-ip">{{ ban.ip }}</td>
          <td class="buttons">
            <span class="delete">
              <Button @click="deleteBan(ban)">X</Button>
            </span>
          </td>
        </tr>
      </template>
    </Table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

import { getBans, deleteBan } from '@/app/requests/ban';
import Button from '@/app/components/lib/button';
import Loading from '@/app/components/lib/loading';
import Table from '../../lib/table';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  components: {
    Table,
    Button,
    Loading,
  },
  data() {
    return {
      bans: [],
      status: '',
      errorMsg: '',
    };
  },
  computed: {
    bansList() {
      const banlist = [].concat(this.bans);
      return banlist.map(ban => {
        const modifiedBan = ban;
        const banExpiration = new Date(ban.until);
        modifiedBan.until = moment(banExpiration).format('hh:mm DD/MM/YYYY');
        return modifiedBan;
      });
    },
    isLoading() {
      return this.status === REQUEST;
    },
    hasError() {
      return this.status === ERROR;
    },
    ...mapGetters(['accessToken']),
  },
  mounted() {
    this.getBans();
  },
  methods: {
    getBans() {
      this.$emit('table-update-request');
      this.status = REQUEST;
      return getBans(this.accessToken.token)
        .then(bans => {
          this.bans = bans;
          this.$emit('table-update-success');
          this.status = SUCCESS;
        })
        .catch(err => {
          this.$emit('table-update-failed', err.message);
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
    deleteBan(ban) {
      const data = {
        id: ban.id,
      };
      return deleteBan(this.accessToken.token, data).then(() => this.getBans());
    },
  },
};
</script>

<style scoped>
.table-options {
  margin-bottom: 0.5em;
}
.buttons {
  text-align: center;
}
</style>
