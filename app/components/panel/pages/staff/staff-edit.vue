<template>
  <Form return-route="/staff/" title="Edit Staff" @form-submit="editUser">
    <FormBlock name="#email" title="Email">
      <input id="email" v-model="user.email" class="form-input" type="email" disabled placeholder="Email" />
    </FormBlock>

    <FormBlock name="#username" title="Username">
      <input id="username" v-model="user.name" class="form-input" type="text" disabled placeholder="Username" />
    </FormBlock>

    <FormBlock name="#role" title="Role">
      <select id="role" v-model="user.role" class="form-input">
        <option v-for="(roleval, rolekey) in Roles" :key="rolekey" :value="roleval">
          {{ rolekey }}
        </option>
      </select>
    </FormBlock>

    <template #footer>
      <div v-if="isLoading"><Loading /></div>
      <div v-else-if="userEditSuccess" class="form-success">User edited!</div>
      <div v-else-if="hasError" class="form-error">ERROR: {{ errorMsg }}</div>
    </template>
  </Form>
</template>

<script>
import { mapGetters } from 'vuex';

import roles from '@/app/config/roles';
import { editStaff, getStaff } from '@/app/requests/staff';
import Loading from '@/app/components/lib/loading';
import Form from '../../lib/form';
import FormBlock from '../../lib/form-block';

const LOADING = 'LOADING';
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
        id: this.$route.params.userId,
        email: '',
        name: '',
        role: '',
      },
      successEdit: false,
      errorMsg: '',
      status: '',
    };
  },
  computed: {
    ...mapGetters(['accessToken']),
    Roles() {
      return roles;
    },
    isLoading() {
      return this.status === LOADING;
    },
    isLoaded() {
      return this.status === SUCCESS;
    },
    hasError() {
      return this.status === ERROR;
    },
    userEditSuccess() {
      return this.status === SUCCESS && this.successEdit;
    },
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      this.status = LOADING;
      const data = this.user;
      return getStaff(this.accessToken.token, data)
        .then(resp => {
          const { name, email, role } = resp;

          this.user.name = name;
          this.user.email = email;
          this.user.role = role;

          this.status = SUCCESS;
        })
        .catch(err => {
          this.errorMsg = err.message;
          this.status = ERROR;
        });
    },
    async editUser() {
      this.status = LOADING;
      const data = {
        id: this.user.id,
        role: this.user.role,
      };
      return editStaff(this.accessToken.token, data)
        .then(() => {
          this.successEdit = true;
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
