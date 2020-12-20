<template>
  <div class="login">
    <div class="login-header">
      <h3 class="title">
        Iniciar Sesión
      </h3>
    </div>
    <div class="login-body">
      <form action class="form" @submit.prevent="login">
        <div class="form-block">
          <label class="form-label" for="#username">Usuario</label>
          <input id="username" v-model="email" class="form-input" type="text" required placeholder="Email" />
        </div>
        <div class="form-block">
          <label class="form-label" for="#password">Contraseña</label>
          <input id="password" v-model="password" class="form-input" type="password" placeholder="Password" />
        </div>
        <input class="form-submit" type="submit" value="Entrar" />
      </form>
    </div>
    <div class="login-footer">
      <div v-if="authStatus === 'error'" class="login-error">ERROR: {{ errorMsg }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { AUTH_REQUEST } from '@/store/actions/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMsg: '',
    };
  },
  computed: {
    ...mapGetters(['authStatus']),
  },
  methods: {
    login() {
      const user = {
        email: this.email,
        password: this.password,
      };
      this.$store
        .dispatch(AUTH_REQUEST, user)
        .then(() => {
          if (this.$route.params.nextUrl != null) {
            this.$router.push(this.$route.params.nextUrl);
          } else {
            this.$router.push('/');
          }
        })
        .catch(err => {
          this.errorMsg = err.message;
        });
    },
  },
};
</script>

<style scoped></style>
