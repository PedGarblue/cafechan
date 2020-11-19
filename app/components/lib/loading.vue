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
  font-family: 'icomoon';
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  font-size: 2em;
  animation: rotation 2s infinite linear;
}
.loading-icon:before {
  content: '\e97c';
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
