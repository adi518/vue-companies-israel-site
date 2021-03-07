<template>
  <div class="slide" :style="style">
    <slot />
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  src: { type: String },
  size: { type: String },
  color: { type: String },
  cover: { type: Boolean },
});

const style = computed(() => ({
  backgroundColor: props.color,
  padding: props.cover ? "0" : "16rem",
  backgroundImage: `url(${props.src})`,
  backgroundSize: props.size ? props.size : props.cover ? "cover" : "86%",
}));
</script>

<style lang="scss" scoped>
.slide {
  min-height: 128rem;
  border-radius: 16rem;
  box-sizing: border-box;
  background-position: center;
  background-repeat: no-repeat;
  background-color: var(--color-secondary2);

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  :deep(img) {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: inherit;
  }
}
</style>

<style lang="scss">
.swiper-slide {
  &:nth-of-type(even) {
    .slide {
      background-color: white;
    }
  }
}
</style>
