<template>
  <div class="loading-msg">
    <div class="loading-icon"></div>
  </div>
</template>

<style>
.loading-msg {
  width: 100%;
  text-align: center;
}
.loading-icon {
  display: inline-block;
  font-size: 2em;
  animation: rotation 1s infinite linear;
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
