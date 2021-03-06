<template>
  <footer class="footer">
    <!-- <Container class="container"></Container> -->
    <div class="fixed">
      <Small>{{ packageJson.version }}</Small>
      <Small>
        <a href="https://github.com/adi518/vue-companies-israel-site">
          GitHub
        </a>
      </Small>
    </div>
  </footer>
</template>

<script setup>
import Small from "./Small.vue";
import Container from "./Container.vue";
import packageJson from "../../package.json";
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  margin-top: 64rem;
  min-height: 128rem;
  position: relative;
  flex-direction: column;
  background-image: linear-gradient(180deg, transparent, #1a2547);

  @media (max-width: 991.98px) {
    margin-top: 32rem;
    padding-bottom: 64rem;
  }
}

.fixed {
  left: 16rem;
  bottom: 16rem;
  position: absolute;
}
</style>
