<template>
  <GitHubButton
    class="github-stars"
    data-show-count="true"
    data-icon="octicon-star"
    :href="packageJson.repository?.url"
    :aria-label="`Star ${packageJson.author}/${packageJson.name} on GitHub`"
    >Star
  </GitHubButton>
</template>

<script setup>
// https://ghbtns.com/
// https://buttons.github.io/
import { defineProps } from "vue";
import GitHubButton from "vue-github-button";

defineProps({
  packageJson: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.github-stars {
  font-size: 0;
}
</style>
