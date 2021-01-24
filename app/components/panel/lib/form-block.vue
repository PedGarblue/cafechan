<template>
  <div class="form-block" :class="{ 'flex-inline': inline }">
    <label class="form-label" :for="name">{{ title }}</label>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    inline: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
};
</script>

<style scoped>
.flex-inline {
  display: flex;
  flex-direction: row;
}
.flex-inline input {
  width: 0;
  margin: 0 0.5em;
}
</style>
