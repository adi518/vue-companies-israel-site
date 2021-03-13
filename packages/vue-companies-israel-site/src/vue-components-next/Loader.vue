<template>
  <!-- https://loading.io/css/ -->
  <div class="loader" :style="style"></div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  size: { type: String, default: "32rem" },
});

const style = computed(() => ({ width: props.size, height: props.size }));
</script>

<style lang="scss" scoped>
.loader {
  display: inline-block;

  &:after {
    content: "";
    width: inherit;
    height: inherit;
    display: block;
    border-radius: 50%;
    border: 2rem solid;
    border-color: var(--color-primary) transparent var(--color-primary)
      transparent;
    animation: rotate 1.2s linear infinite;
  }
}
</style>

<style lang="scss">
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
