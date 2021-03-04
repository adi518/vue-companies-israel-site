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
  cursor: default;
  position: fixed;
  color: currentColor;
  line-height: normal;
  font-size: 20rem;
  border-radius: 50%;
  padding: 8rem 11rem;
  background-color: var(--color-secondary);
  transition: background-color var(--transition-duration),
    opacity var(--transition-duration);

  &:hover {
    background-color: var(--color-primary2);
  }

  &.is-visible {
    opacity: 1;
  }
}
</style>
