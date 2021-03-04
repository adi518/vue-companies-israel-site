<template>
  <div class="error">
    <small>
      <slot />
    </small>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.error {
  flex-grow: 1;
  text-align: center;
  padding: 8rem 16rem;
  border: 2rem solid;
  border-radius: 16rem;
  color: var(--color-error);
}
</style>
