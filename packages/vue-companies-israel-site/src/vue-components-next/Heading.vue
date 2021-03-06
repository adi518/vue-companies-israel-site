<template>
  <component class="heading" :is="`h${level}`">
    <a class="anchor" v-if="href" :href="href" aria-hidden="true">#</a>
    <slot />
  </component>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  level: { type: String, required: true },
  href: { type: String },
});
</script>

<style lang="scss" scoped>
.heading {
  font-weight: 400;
  margin-top: 48rem;
  color: var(--color-grey);

  &:hover {
    a {
      opacity: 1;
    }
  }
}

.anchor {
  opacity: 0;
  margin-right: 8rem;
  margin-left: -20rem;
  transition: opacity var(--transition-duration);
}
</style>
