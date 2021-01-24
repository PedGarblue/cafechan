<template>
  <button @click="clicked">
    <slot />
  </button>
</template>

<script>
export default {
  methods: {
    clicked() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped>
button {
  background-color: #bd0003;
  color: white;
  padding: 0.3em 0.5em;
  border: 0;
  font-weight: lighter;
  cursor: pointer;
}
</style>
