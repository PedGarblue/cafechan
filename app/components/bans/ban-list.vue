<template>
  <div class="table">
    <div class="table-options">
      <PanelBtn @click="getBans">Update</PanelBtn>
      <router-link to="/ban/add">
        <PanelBtn>Add Ban</PanelBtn>
      </router-link>
    </div>
    <div v-if="isLoading">Loading...</div>
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
              [X]
            </span>
          </td>
        </tr>
      </template>
    </Table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getBans } from '../../requests/ban';
import Table from '../lib/table';
import PanelBtn from '../lib/button';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  components: {
    PanelBtn,
    Table,
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
        modifiedBan.until = `${banExpiration.getHours()}:${banExpiration.getMinutes()} ${banExpiration.getDate()}/${banExpiration.getMonth()}/${banExpiration.getFullYear()}`;
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
