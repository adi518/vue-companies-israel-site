<template>
  <div class="search">
    <!-- 🕵️ -->
    <input
      type="text"
      v-model="value"
      placeholder="Search... 🔎"
      @input="$emit('change', value)"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const value = ref("");
</script>

<style lang="scss" scoped>
$background-color: darken($color-secondary, 3.75%);

.search {
  width: 100%;

  input {
    width: inherit;
    font-family: inherit;
    border-style: solid;
    padding-top: 12rem;
    padding-left: 32rem;
    padding-right: 16rem;
    padding-bottom: 12rem;
    border-radius: 16rem 16rem 0 0;
    color: rgba($color-body, 0.5);
    border-color: $background-color;
    background-color: $background-color;
    transition: color var(--transition-duration);
    box-shadow: 0 0 16rem rgb(255 255 255 / 10%);

    &:hover {
      color: var(--color-body);

      &::placeholder {
        color: var(--color-body);
      }
    }

    &:disabled {
      color: rgba($color-body, 0.5);

      &::placeholder {
        color: rgba($color-body, 0.5);
      }
    }

    &::placeholder {
      font-weight: 700;
      font-family: inherit;
      color: rgba($color-body, 0.5);
      transition: color var(--transition-duration);
    }
  }
}
</style>
