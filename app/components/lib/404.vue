<template>
  <div style="text-align:center; width: 100%;">
    <h1>Error! ;_;</h1>
    <h2>{{ message }}</h2>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
