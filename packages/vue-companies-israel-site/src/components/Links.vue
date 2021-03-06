<template>
  <div class="links-container">
    <ul class="links">
      <li>
        <a
          href="https://github.com/JonathanDn/vue-companies-israel/graphs/contributors"
          >Contributors</a
        >
      </li>
      <li>
        <a href="https://github.com/JonathanDn/vue-companies-israel">GitHub</a>
      </li>
      <li>
        <GitHubStars :packageJson="packageJson" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import packageJson from "../../package.json";
</script>

<style lang="scss" scoped>
.links-container {
  display: flex;
  flex-direction: column;

  @media (max-width: 575.98px) {
    border-top: 1px solid rgba($color-body, 0.15);
  }
}

.links {
  margin: 0;
  padding: 0;
  display: flex;

  @media (max-width: 575.98px) {
    flex-direction: column;

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

a {
  color: var(--color-body);
  transition: border-color 0.25s;
  border-bottom: 2.4rem solid transparent;

  &:hover {
    border-bottom-color: var(--color-body);
  }
}
</style>
