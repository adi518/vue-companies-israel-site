<template>
  <div class="button-group" :style="style">
    <slot />
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  setup(props, context) {
    // https://css-tricks.com/equal-width-columns-in-css-grid-are-kinda-weird/
    const style = computed(() => ({
      "grid-template-columns": `repeat(${
        context.slots.default().length
      }, minmax(0, 1fr))`,
    }));

    return { style };
  },
};
</script>

<style lang="scss" scoped>
.button-group {
  display: grid;
  grid-gap: 16rem;
  margin-top: 16rem;
  grid-auto-flow: column;

  :deep(a) {
    button {
      width: 100%;
    }
  }
}
</style>
