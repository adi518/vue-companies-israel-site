<template>
  <footer class="footer">
    <Container class="container">
      <div class="d-flex flex-direction">
        <div>
          Made with 💜 by
          <a href="https://www.facebook.com/groups/1062801280495598">
            Vue.js Israel
          </a>
        </div>
        <Contributors owner="JonathanDn" repository="vue-companies-israel" />
      </div>
      <ul class="links">
        <li>
          <a
            href="https://github.com/JonathanDn/vue-companies-israel/graphs/contributors"
          >
            Contributors
          </a>
        </li>
        <li>
          <a href="https://github.com/JonathanDn/vue-companies-israel">
            GitHub
          </a>
        </li>
        <li>
          <a href="https://github.com/adi518/vue-companies-israel-site">
            GitHub (Site)
          </a>
        </li>
        <li>
          <GitHubStars :packageJson="packageJson" />
        </li>
      </ul>
      <Small class="version">{{ packageJson.version }}</Small>
    </Container>
  </footer>
</template>

<script setup>
import Small from "./Small.vue";
import Container from "./Container.vue";
import GitHubStars from "./GitHubStars.vue";
import Contributors from "./Contributors.vue";

import packageJson from "../../package.json";
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  position: relative;
  flex-direction: column;
  background-image: linear-gradient(180deg, transparent, #1a2547);
  min-height: 320rem;
  margin-top: 128rem;

  @media (max-width: 991.98px) {
    margin-top: 64rem;
    min-height: 225rem;
    padding-bottom: 100rem;
  }
}

.container {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;

  @media (max-width: 991.98px) {
    align-items: center;
    flex-direction: column;
  }
}

a {
  color: var(--color-body);
  transition: border-color 0.25s;
  border-bottom: 2.4rem solid transparent;

  &:hover {
    border-bottom-color: var(--color-body);
  }
}

.links {
  margin: 0;
  padding: 0;
  flex-grow: 0;
  display: flex;

  @media (max-width: 991.98px) {
    margin-top: 64rem;
  }

  @media (max-width: 575.98px) {
    width: 100%;
    margin-top: 54rem;
    margin-right: auto;
    flex-direction: column;
    border-top: 1px solid rgba($color-body, 0.15);

    li {
      margin-top: 12rem;

      &:before {
        content: none;
      }
    }
  }
}

li {
  list-style-type: none;

  // android (mobile) workaround
  &:before {
    content: "•";
    margin: 10rem;
  }

  > * {
    vertical-align: middle;
  }

  &:first-child {
    margin-left: 0;
    list-style-type: none;

    &:before {
      display: none;
    }
  }

  &:last-child {
    margin-right: 0;
  }
}

.version {
  left: 16rem;
  bottom: 16rem;
  position: absolute;
}
</style>
