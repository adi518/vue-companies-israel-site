<template>
  <ScrollToTopScope v-slot="scope">
    <div
      class="scroll-to-top"
      @click="scope.scrollToTop"
      :class="{ 'is-visible': scope.isScrollEnd }"
    >
      ↑
    </div>
  </ScrollToTopScope>
</template>

<script setup>
import ScrollToTopScope from "./ScrollToTopScope";
</script>

<style lang="scss" scoped>
.scroll-to-top {
  opacity: 0;
  z-index: 1;
  right: 16rem;
  bottom: 16rem;
  position: fixed;
  line-height: normal;
  border-radius: 50%;
  cursor: default;
  font-size: 20rem;
  padding: 8rem 11rem;
  color: var(--color-body);
  transform: translateY(16rem);
  background-color: var(--color-secondary2);
  transition: background-color var(--transition-duration) ease-out,
    opacity var(--transition-duration) ease-out,
    transform var(--transition-duration) ease-out;

  &:hover {
    background-color: var(--color-primary2);
  }

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
