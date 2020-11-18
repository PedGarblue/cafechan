<template>
  <div class="form-block">
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
  },
};
</script>

<style scoped></style>
