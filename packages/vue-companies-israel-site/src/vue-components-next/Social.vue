<template>
  <div class="social">
    <slot />
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.social {
  z-index: 1;
  display: grid;
  grid-gap: 16rem;
  margin-left: auto;
  align-items: center;
  grid-auto-flow: column;
  // https://stackoverflow.com/a/20541859/4106263
  _:-ms-lang(x),
  > * {
    margin-left: 16rem;
  }
}
</style>
