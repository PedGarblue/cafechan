<template>
  <Form return-route="/staff/" title="Edit Staff" @form-submit="editUser">
    <FormBlock name="#email" title="Email">
      <input id="email" v-model="email" class="form-input" type="email" disabled placeholder="Email" />
    </FormBlock>

    <FormBlock name="#username" title="Username">
      <input id="username" v-model="username" class="form-input" type="text" disabled placeholder="Username" />
    </FormBlock>

    <FormBlock name="#role" title="Role">
      <select id="role" v-model="role" class="form-input">
        <option v-for="(roleval, rolekey) in Roles" :key="rolekey" :value="roleval">
          {{ rolekey }}
        </option>
      </select>
    </FormBlock>

    <template #footer>
      <div v-if="isLoading"><Loading /></div>
      <div v-else-if="userEditSuccess" class="form-success">User edited!</div>
      <div v-else-if="hasError" class="form-error">ERROR: {{ error_msg }}</div>
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
      userId: this.$route.params.userId,
      email: '',
      username: '',
      role: '',
      hasEditedUser: false,
      error_msg: '',
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
      return this.status === SUCCESS && this.hasEditedUser;
    },
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.status = LOADING;
      const user = {
        id: this.userId,
        name: this.username,
        email: this.email,
        role: this.role,
      };
      getStaff(this.accessToken.token, user)
        .then(resp => {
          const { name, email, role } = resp;

          this.username = name;
          this.email = email;
          this.role = role;

          this.status = SUCCESS;
        })
        .catch(err => {
          this.error_msg = err.message;
          this.status = ERROR;
        });
    },
    editUser() {
      this.status = LOADING;
      const data = {
        id: this.userId,
        role: this.role,
      };
      editStaff(this.accessToken.token, data)
        .then(() => {
          this.hasEditedUser = true;
          this.status = SUCCESS;
        })
        .catch(err => {
          this.error_msg = err.message;
          this.status = ERROR;
        });
    },
  },
};
</script>
