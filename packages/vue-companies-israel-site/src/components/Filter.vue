<template>
  <!-- https://iconmonstr.com/filter-6-svg/ -->
  <svg :style="style" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.906 2.841c1.104-2.412-7.833-2.841-10.907-2.841-2.934 0-12.01.429-10.906 2.841.508 1.11 8.907 12.916 8.907 12.916v5.246l4 2.997v-8.243s8.398-11.806 8.906-12.916zm-10.901-.902c4.243 0 8.144.575 8.144 1.226s-3.9 1.18-8.144 1.18-8.042-.528-8.042-1.18 3.799-1.226 8.042-1.226z"
    />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const style = computed(() => ({ fill: "currentColor", width: "12rem" }));
</script>
