<template>
  <div :class="['container', { 'has-content': content }]">
    <slot />
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  content: Boolean,
});
</script>

<style lang="scss" scoped>
.container {
  margin-left: auto;
  margin-right: auto;
  width: var(--container-width);

  @media (max-width: 767.98px) {
    --container-width: auto; // make variable reusable outside global `.container`
    margin-left: 32rem;
    margin-right: 32rem;
  }

  &.has-content {
    $margin-top: 64rem;
    margin-top: $margin-top;
    scroll-margin-top: $margin-top; // https://stackoverflow.com/a/59611245/4106263
  }
}
</style>
