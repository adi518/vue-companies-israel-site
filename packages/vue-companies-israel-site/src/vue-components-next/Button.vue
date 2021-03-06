<template>
  <button class="button">
    <span class="icon">
      {{ icon }}
    </span>
    <slot />
  </button>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({ icon: String });
</script>

<style lang="scss" scoped>
.button {
  border: none;
  font-size: 16rem;
  font-family: inherit;
  border-radius: 32rem;
  padding-left: 20rem;
  padding-right: 20rem;
  padding-top: 10.4rem;
  padding-bottom: 12rem;
  color: var(--color-body);
  background-color: var(--color-secondary);
  transition: background-color var(--transition-duration);

  &:hover {
    background-color: var(--color-primary2);
  }
}

.icon {
  margin-right: 0.5ch;
}
</style>
