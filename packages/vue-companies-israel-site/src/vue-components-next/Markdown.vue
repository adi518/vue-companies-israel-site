<template>
  <div class="markdown" v-html="markdown"></div>
</template>

<script setup>
import Prism from "prismjs";
import { defineProps, onMounted } from "vue";

defineProps({ markdown: { type: String } });

onMounted(() => {
  setTimeout(Prism.highlightAll);
});
</script>
