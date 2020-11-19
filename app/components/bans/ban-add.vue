<template>
  <Form return-route="/ban" title="Add Ban" @form-submit="sendBan">
    <FormBlock name="#ip" title="Poster IP">
      <input id="#ip" v-model="ip" class="form-input" type="text" required />
    </FormBlock>

    <FormBlock name="#reasons" title="Ban Reason">
      <select id="reasons" v-model="reason" class="form-input">
        <option v-for="(reasonval, reasonkey) in banReasons" :key="reasonkey" :value="reasonval">
          {{ reasonval }}
        </option>
      </select>
    </FormBlock>

    <FormBlock name="#until" title="Ban time">
      <input id="until" v-model="until" type="date" required />
    </FormBlock>

    <template #footer>
      <div v-if="successRequest" class="form-success">Ban Created!</div>
      <div v-else-if="isLoading"><Loading /></div>
      <div v-else-if="hasError" class="form-error">Error: {{ errorMsg }}</div>
    </template>
  </Form>
</template>

<script>
import { mapGetters } from 'vuex';
import Form from '@/components/lib/form';
import FormBlock from '@/components/lib/form-block';
import banReasons from '@/config/banReasons';
import { sendBan } from '@/requests/ban';
import Loading from '@/components/lib/loading';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

export default {
  components: {
    Form,
    FormBlock,
    Loading,
  },
  data() {
    return {
      ip: '',
      reason: '',
      until: '',
      status: '',
      errorMsg: '',
    };
  },
  computed: {
    isLoading() {
      return this.status === REQUEST;
    },
    successRequest() {
      return this.status === SUCCESS;
    },
    hasError() {
      return this.status === ERROR;
    },
    banReasons() {
      return banReasons;
    },
    ...mapGetters(['accessToken']),
  },
  methods: {
    sendBan() {
      const data = {
        ip: this.ip,
        reason: this.reason,
        until: new Date(this.until).getTime(),
      };
      this.$emit('form-submit-request');
      this.status = REQUEST;
      return sendBan(this.accessToken.token, data)
        .then(() => {
          this.status = SUCCESS;
          this.$emit('form-submit-success', 'Ban added correctly');
        })
        .catch(err => {
          this.$emit('form-submit-failed', `Ban request failed: ${err.message}`);
          this.status = ERROR;
          this.errorMsg = err.message;
        });
    },
  },
};
</script>

<style scoped></style>
