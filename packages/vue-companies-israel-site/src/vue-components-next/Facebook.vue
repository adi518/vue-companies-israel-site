<template>
  <!-- https://iconmonstr.com/facebook-3-svg/ -->
  <svg :style="style" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      :fill="color"
      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.238 3h-2.762v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z"
    />
  </svg>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    default: "#4267b2",
  },
  size: {
    type: Number,
    default: 32,
  },
  unit: {
    type: String,
    default: "rem",
  },
});

const style = computed(() => ({
  width: props.size + props.unit,
  height: props.size + props.unit,
}));
</script>
