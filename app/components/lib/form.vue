<template>
  <div class="login">
    <div :v-if="returnRoute.length > 0">
      <router-link :to="returnRoute">
        Regresar
      </router-link>
    </div>

    <div class="login-header">
      <h3 class="title">{{ title }}</h3>
    </div>

    <div class="login-body">
      <form class="form" @submit.prevent="formSubmit">
        <slot />
        <input class="form-submit" type="submit" value="Send" />
      </form>
    </div>

    <div class="login-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Form',
  props: {
    returnRoute: {
      type: String,
      default() {
        return '';
      },
    },
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    formSubmit() {
      this.$emit('form-submit');
    },
  },
};
</script>

<style scoped>
.form-submit {
  background-color: #1d1f21;
}
.form-success {
  background-color: #3b8a65;
  color: aliceblue;
  text-align: center;
  margin: 0.5em 0;
  padding: 1em 0;
  border-radius: 3px;
}
.form-error {
  background-color: #e30303;
  color: whitesmoke;
  margin: 0.5em 0;
  padding: 0.5em;
  text-align: center;
  border-radius: 3px;
}
</style>
