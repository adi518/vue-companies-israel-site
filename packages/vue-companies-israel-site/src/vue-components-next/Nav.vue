<template>
  <nav class="nav" :class="{ 'is-sticky': isSticky, static: !isSticky }">
    <slot v-bind="{ isSticky }"></slot>
  </nav>
</template>

<script>
import { inject, provide, computed } from "vue";
import { useWindowScrollPosition } from "vue-use-web";

export const NavSymbol = Symbol();

export const getNavHeight = () =>
  document
    .getElementsByTagName("nav")[0]
    .getBoundingClientRect()
    .height.toFixed(2);

export const NavProvider = {
  setup() {
    const context = inject(NavSymbol);
    return { context };
  },
  render() {
    return this.$slots.default?.(this.context);
  },
};

export default {
  setup() {
    const { y: scrollYPosition } = useWindowScrollPosition();
    const isSticky = computed(() => scrollYPosition.value > 0);
    provide(NavSymbol, { isSticky });
    return { isSticky };
  },
};
</script>

<style lang="scss" scoped>
// https://www.gradient-animator.com/
// https://stackoverflow.com/questions/6542212/use-css3-transitions-with-gradient-backgrounds

.nav {
  width: 100%;
  z-index: 2; // ensure always on top
  display: flex;
  padding: 16rem;
  position: fixed; // ensure always on top
  align-items: center;
  background-size: 200% 200%;
  background-color: transparent;
  transition: background-color var(--transition-duration);

  &.is-sticky {
    background-color: var(--color-primary);
  }
}
</style>
