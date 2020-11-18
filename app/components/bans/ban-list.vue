<template>
  <div class="table">
    <div class="table-options">
      <button @click="getBans">Update</button>
      <router-link to="/ban/add">
        <button>Add Ban</button>
      </router-link>
    </div>
    <div class="table-item">
      <div>ID</div>
      <div>Reason</div>
      <div>Expiration</div>
      <div>IP</div>
    </div>
    <div v-if="isLoading">
      [...]
    </div>
    <div v-else-if="hasError">
      {{ errorMsg }}
    </div>
    <div v-for="ban in bansList" v-else :key="ban._id" class="table-item">
      <div class="ban-id">{{ ban._id }}</div>
      <div class="ban-reason">{{ ban.reason }}</div>
      <div class="ban-until">{{ ban.until }}</div>
      <div class="ban-ip">{{ ban.ip }}</div>
      <div class="buttons">
        <span class="delete">
          [X]
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getBans } from '../../requests/ban';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
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
.table {
  display: block;
}
.table-item {
  display: grid;
  grid-template-columns: auto auto auto auto 3em;
  padding: 0.5em;
}
</style>
