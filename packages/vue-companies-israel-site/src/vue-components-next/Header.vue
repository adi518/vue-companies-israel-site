<template>
  <header class="header animate__animated animate__fadeIn">
    <div class="stars"></div>
    <!-- <div class="twinkle"></div> -->
    <Container class="container">
      <VueLogo />
      <Heading level="1" :style="{ color: 'var(--color-body)' }">
        A curated list of {{ $attrs.companies }} companies who hire Israelis -
        that work with <a href="https://vuejs.org/">Vue.js</a>
      </Heading>
      <ButtonGroup>
        <a href="#get-started">
          <Button icon="🙋🏻‍♀️" @click="$emit('get-started')">Get Started</Button>
        </a>
        <a href="https://github.com/JonathanDn/vue-companies-israel/pulls">
          <Button icon="👨🏻‍🌾">Add Company</Button>
        </a>
      </ButtonGroup>
    </Container>
  </header>
</template>

<script setup>
import Button from "./Button.vue";
import VueLogo from "./VueLogo.vue";
import Heading from "./Heading.vue";
import Container from "./Container.vue";
import ButtonGroup from "./ButtonGroup.vue";
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  box-shadow: 0 0 32rem rgb(255, 255, 255, 0.5);
  // https://www.heropatterns.com/
  // https://codepen.io/stealy/pen/zYxXpza
  // https://dev.to/andrzejchmura/comment/98dj
  // https://stackoverflow.com/a/2547064/4106263
  background-image: linear-gradient(
    180deg,
    var(--color-secondary) 50%,
    var(--color-primary) 75%,
    var(--color-secondary) 100%
  );
  // background-color: black;
  // background-image: url("/src/assets/stars.png");
}

.container {
  z-index: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.stars,
.twinkle {
  width: inherit;
  height: inherit;
  position: absolute;
}

.stars {
  background-image: url("/src/assets/stars.png");
}

.twinkle {
  animation: twinkle 1000s linear infinite;
  background-image: url("/src/assets/twinkle.png");
}

h1 {
  text-align: center;
  font-size: 20rem;
  margin-top: 32rem;
}
</style>

<style lang="scss">
// doesn't work when scoped (bug?)
// https://stackoverflow.com/questions/47283989/why-are-css-keyframe-animations-broken-in-vue-components-with-scoped-styling
@keyframes twinkle {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -10000px 5000px;
  }
}
</style>
