<template>
  <div class="community">
    <a href="https://www.facebook.com/groups/1062801280495598">
      <Facebook color="white" />
    </a>
    <a href="https://twitter.com/vuejsisrael">
      <Twitter />
    </a>
    <a href="https://discord.gg/vue">
      <Discord />
    </a>
  </div>
</template>

<script setup>
import Twitter from "./Twitter.vue";
import Discord from "./Discord.vue";
import Facebook from "./Facebook.vue";
</script>

<style lang="scss" scoped>
.community {
  grid-gap: 16rem;
  margin-bottom: 0;
  display: inline-grid;
  grid-auto-flow: column;

  li {
    display: block;
    list-style-type: none;

    a {
      display: block;
    }
  }
}
</style>
