<template>
  <Form return-route="/staff" title="Create Staff" @form-submit="createUser">
    <FormBlock name="#email" title="Email">
      <input id="email" v-model="user.email" class="form-input" type="email" required placeholder="Email" />
    </FormBlock>

    <FormBlock name="#username" title="Username">
      <input id="username" v-model="user.name" class="form-input" type="text" required placeholder="Username" />
    </FormBlock>

    <FormBlock name="#role" title="Role">
      <select id="role" v-model="user.role" class="form-input">
        <option v-for="(roleval, rolekey) in Roles" :key="rolekey" :value="roleval">
          {{ rolekey }}
        </option>
      </select>
    </FormBlock>

    <FormBlock name="#password" title="Password">
      <input id="password" v-model="user.password" class="form-input" type="password" placeholder="Password" />
    </FormBlock>

    <template #footer>
      <div v-if="successRequest" class="form-success">Staff Created!</div>
      <div v-else-if="isLoading"><Loading /></div>
      <div v-else-if="hasError" class="form-error">Error: {{ errorMsg }}</div>
    </template>
  </Form>
</template>

<script>
import { mapGetters } from 'vuex';

/* eslint-disable no-alert */
import roles from '@/app/config/roles';
import { createStaff } from '@/app/requests/staff';
import Loading from '@/app/components/lib/loading';
import Form from '../../lib/form';
import FormBlock from '../../lib/form-block';

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
      user: {
        email: '',
        name: '',
        role: '',
        password: '',
      },
      status: '',
      errorMsg: '',
    };
  },
  computed: {
    ...mapGetters(['accessToken']),
    successRequest() {
      return this.status === SUCCESS;
    },
    isLoading() {
      return this.status === REQUEST;
    },
    hasError() {
      return this.status === ERROR;
    },
    Roles() {
      return roles;
    },
  },
  methods: {
    async createUser() {
      this.status = REQUEST;
      return createStaff(this.accessToken.token, this.user)
        .then(() => {
          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
  },
};
</script>
