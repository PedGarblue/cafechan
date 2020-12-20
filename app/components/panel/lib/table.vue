<template>
  <table cellspacing="0">
    <thead>
      <slot name="head" />
    </thead>
    <tbody>
      <slot name="body" />
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
}
th {
  padding: 0.5em 0;
  background-color: #38393e;
  color: #ffe;
}
td {
  padding: 0.7em 0.5em;
  background-color: #eaece7;
  border-right: 1px solid #800000;
  border-bottom: 1px solid #800000;
}
td:first-child {
  border-left: 1px solid #800000;
}
</style>
